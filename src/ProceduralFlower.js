

if( ( pseudoRandom = true ) ){
		// change the behavior of the random function
		var _seed = 45678951585432565678;
		_seed = Math.floor( Math.random() * 10000000000 );


		//_seed = 8806672480     ;

		console.log( "seed = "+_seed );
		var _offset = _seed;
		Math.random = function(){
				
			var s = _seed;
			var square = s *s;
			
			var nseed = Math.floor( square / 1000 ) % 10000000000;
			
			if( nseed != _seed )
				_seed = nseed;
			else
				_seed = nseed + _offset;
			return ( _seed / 10000000000 );
		}
	}


var Flw = {};

Flw.LimitedFlower = function(){};
Flw.LimitedFlower.prototype = {
	
	_canvasHeight : 500,
	_canvasWidth : 500,
	
	_growSpeed : 0.18,
	
	_staticContext : null,
	_dynamicContext : null,
	
	
	_root : null,
	
	_age : 0,
	
	_timeLine : null,
	
	_endHatchin : 0,
	
	init : function( divElement ){
		
		this._canvasWidth = parseInt( (/^[0-9]*/).exec( divElement.style.width )[0] );
		this._canvasHeight = parseInt( (/^[0-9]*/).exec( divElement.style.height )[0] );
		
		var staticCanvas = document.createElement("canvas");
		this._staticContext =  staticCanvas.getContext( "2d" );
		staticCanvas.width = this._canvasWidth;
		staticCanvas.height = this._canvasHeight;
		staticCanvas.style.position = "absolute";
		staticCanvas.style.top = "0";
		
		var dynamicCanvas = document.createElement("canvas");
		this._dynamicContext =  dynamicCanvas.getContext( "2d" );
		dynamicCanvas.width = this._canvasWidth;
		dynamicCanvas.height = this._canvasHeight;
		dynamicCanvas.style.position = "absolute";
		dynamicCanvas.style.top = "0";
		
		divElement.appendChild( staticCanvas );
		divElement.appendChild( dynamicCanvas );
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		this._dynamicContext.translate( this._canvasWidth/2 , this._canvasHeight );
		this._staticContext.translate( this._canvasWidth/2 , this._canvasHeight );
		this._dynamicContext.scale( 1 , -1 );
		this._staticContext.scale( 1 , -1 );
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		
		Flw.Branch.prototype._maxDeepness = 3;
		Flw.MajorBranch.prototype._maxDeepness = 4;
		
		
		this._root = Flw.MajorBranch.createSimple( {x:0,y:0} , Math.PI/2 );	
		this._root.buildTotal();
		this._endHatchin = this._root.getHatchinTime();
		
		
		if( this._timeLine != null  )
			this._timeLine.stop();
		this._timeLine = new TimeLine( 30 );
		
		this._timeLine.addListener( "eachFrame" , this.cycle , this );
		this._timeLine.start();
		
	},
	
	cycle : function( dt ){
		
		// limit the speed
		if( dt > 100 )
			dt = 100;
		
		newAge = this._age + dt * this._growSpeed;
		
		// draw
		
		this._dynamicContext.clearRect( -this._canvasWidth/2 , 0 , this._canvasWidth , this._canvasHeight );
		

		this._dynamicContext.save();
		this._staticContext.save();
		
		this._root.visitFromTo( this._dynamicContext , this._staticContext , this._age - 1 , newAge );
		
		
		this._dynamicContext.restore();
		this._staticContext.restore();
		
		this._age = newAge;
		
		if( this._age > this._endHatchin ){
			this._timeLine.stop();
			//this._timeLine = null;
		}
	},

}
Flw.LimitedFlower.create = function( divElement ){
	var rf = new Flw.LimitedFlower();
	rf.init( divElement );
	return rf;
};

Flw.RampantFlower = function(){};
Flw.RampantFlower.prototype = {
	_canvasHeight : 2000,
	_canvasWidth : 700,
	
	_growSpeed : 0.18,
	_scrollCalculatorInterval : 50,
	_window : 500,
	
	
	_scrollSpeed : 0,
	_horizontalSpeed : 0,
	_targetHorizontalSpeed : 0,
	_center : { x : 0 , y : 0 },
	_scrollCalculatorTimer : 0,
	
	
	_staticContext : null,
	_dynamicContext : null,
	
	
	_staticCanvas : null,
	_dynamicCanvas : null,
	
	
	_root : null,
	
	_age : 0,
	_vBuffer : 0,
	_hBuffer : 0,
	_baseRoot : 0,
	_timeLine : null,
	init : function( divElement , window , width ){
		
		this._center.x = parseInt( (/^[0-9]*/).exec( divElement.style.width )[0] )/2;
		this._center.y = parseInt( (/^[0-9]*/).exec( divElement.style.height )[0] )/2;
		
		
		this._window = window || this._center.y * 2;
		this._canvasWidth = width || this._center.x * 2;
		
		
		this._age = 0;
		
		this._scrollCalculatorInterval = Math.max( 0 , 50 - this._growSpeed * 50 );
		
		this._canvasHeight = Math.max( this._canvasHeight , this._window * 2 );
		
		var staticCanvas = document.createElement("canvas");
		this._staticContext =  staticCanvas.getContext( "2d" );
		staticCanvas.width = this._canvasWidth;
		staticCanvas.height = this._canvasHeight;
		
		var dynamicCanvas = document.createElement("canvas");
		this._dynamicContext =  dynamicCanvas.getContext( "2d" );
		dynamicCanvas.width = this._canvasWidth;
		dynamicCanvas.height = this._canvasHeight;
		
		divElement.style.overflow = "hidden";
		divElement.appendChild( staticCanvas );
		divElement.appendChild( dynamicCanvas );
		
		
		
		staticCanvas.style.position = "absolute";
		staticCanvas.style.left = ( -this._canvasWidth/2 + this._center.x )+"px";
		dynamicCanvas.style.position = "absolute";
		dynamicCanvas.style.left = ( -this._canvasWidth/2 + this._center.x )+"px";

		this._staticCanvas = staticCanvas;
		this._dynamicCanvas = dynamicCanvas;
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		this._dynamicContext.translate( this._canvasWidth/2 , this._canvasHeight );
		this._staticContext.translate( this._canvasWidth/2 , this._canvasHeight );
		this._dynamicContext.scale( 1 , -1 );
		this._staticContext.scale( 1 , -1 );
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		this._dynamicContext.translate( 0 , this._baseRoot );
		this._staticContext.translate( 0 , this._baseRoot );
		
		
		this._root = Flw.MajorBranch.createSimple( {x:0,y:0} , Math.PI/2 );
		this._top = this._root;
		
		
		Flw.Branch.prototype._maxDeepness = 3;
		Flw.MajorBranch.prototype._maxDeepness = Infinity;
		
		
		
		
		if( this._timeLine != null  )
			this._timeLine.stop();
		this._timeLine = new TimeLine( 30 );
		
		this._timeLine.addListener( "eachFrame" , this.cycle , this );
		this._timeLine.start();
		
	},
	cycle : function( dt ){
		
		// limit the speed
		if( dt > 100 )
			dt = 100;
		
		newAge = this._age + dt * this._growSpeed;
		
		this._scrollCalculatorTimer -- ;
		
		if( this._scrollCalculatorTimer <= 0 ){
			
			// retreive the top of the flower ( the highest stem )
			var top = this._root;
			var ageAtTop = this._root.getLength();
			while( top._grown ){
				top = top.getMajor();
				ageAtTop += top.getLength();
			}
			
			// force the grow if needed
			while( ageAtTop < newAge ){
				top.grow();
				top = top.getMajor();
				ageAtTop += top.getLength();
			}
			
			// the last point that will be drawn
			var pointe = this._root.getMajorPointAt( newAge );
			
			var py = this._vBuffer + this._canvasHeight - this._center.y / 1.3;
			var cy = pointe.y + this._baseRoot;
			
			var nextCheckPoint = this._scrollCalculatorInterval * 1000 / this._timeLine.getAverageFps() //  ms
			
			//////////
			// Set the vertical speed
			
			// by the time of the next checkpoint, the current delay will be catched
			this._scrollSpeed = -( py - cy )/ nextCheckPoint;
			
			
			//////////
			// Set the horizontal speed
			
			this._horizontalSpeed = this._targetHorizontalSpeed;
			this._targetHorizontalSpeed = ( - this._hBuffer + this._center.x - pointe.x - this._canvasWidth/2  )/ nextCheckPoint / 2;
			
			
			//////////
			// change the direction if needed
			
			//retreive the top of the top
			var upperTop = top;
			while( upperTop.getMajor() != null )
				upperTop = upperTop.getMajor();
			
			upperTop.setDirection( Math.atan2( this._canvasWidth , -upperTop._B.x  ) ); 
			
			
			
			//////////
			// check for swapping the buffer
			if( this._canvasHeight - pointe.y - this._baseRoot  < 200 ){
				
				
				
				var down = this._canvasHeight - this._window  -100;
				
				
				var downStem = this._root;
				var ageAtDownStem = 0;
				while( downStem._B.y + this._baseRoot < down ){
					ageAtDownStem += downStem.getLength();
					downStem = downStem.getMajor();
				}
				
				
				this._root = downStem;
				this._age -= ageAtDownStem;
				newAge -= ageAtDownStem;
				
				// swap the canvas
				
				// redraw it
				this._dynamicContext.restore();
				this._staticContext.restore();
				
				this._staticContext.scale( 1 , -1 );
				
				// clean the buffer, expect the top window
				this._staticContext.clearRect( -this._canvasWidth/2   , -this._canvasHeight + this._window  , this._canvasWidth , this._canvasHeight - this._window );
				
				// copy the window from top to bot
				this._staticContext.drawImage( this._staticCanvas , 0 , 0 , this._canvasWidth , this._window , -this._canvasWidth/2  , -this._window , this._canvasWidth , this._window );
				
				// clean the top
				//this._staticContext.clearRect( -this._canvasWidth/2  , -this._canvasHeight , this._canvasWidth , this._window );
				this._staticContext.clearRect( -this._canvasWidth/2   , -this._canvasHeight , this._canvasWidth  , this._window );
				
				
				
				this._staticContext.scale( 1 , -1 );
			
				this._baseRoot -= this._canvasHeight - this._window;
				this._vBuffer -= this._canvasHeight - this._window;
			
				
				
				this._dynamicContext.save();
				this._staticContext.save();
				
				this._dynamicContext.translate( 0 , this._baseRoot );
				this._staticContext.translate( 0 , this._baseRoot );
				
			} else {
				
				/*
				var nroot = this._root.getLastActiveStem( newAge );
				
				
				var downStem = this._root;
				var ageAtDownStem = 0;
				while( downStem != nroot ){
					ageAtDownStem += downStem.getLength();
					downStem = downStem.getMajor();
				}
				console.log( ageAtDownStem );
				
				this._root = downStem;
				this._age -= ageAtDownStem;
				newAge -= ageAtDownStem;
				*/
			}
			
			this._scrollCalculatorTimer = this._scrollCalculatorInterval;
		}
		
		// progressly move to the target speed
		var t = this._scrollCalculatorTimer / this._scrollCalculatorInterval;
		
		this._vBuffer += this._scrollSpeed * dt;
		this._hBuffer += ( this._horizontalSpeed * (1-t) + this._targetHorizontalSpeed * t  ) * dt;
		
		// draw
		this._dynamicContext.clearRect( -this._canvasWidth/2 , -this._baseRoot -this._canvasHeight , this._canvasWidth , this._canvasHeight*2 );
		

		this._dynamicContext.save();
		this._staticContext.save();
		
		this._root.visitFromTo( this._dynamicContext , this._staticContext , this._age - 1 , newAge );
		
		this._dynamicContext.restore();
		this._staticContext.restore();
		
		
		
		
		
		this._staticCanvas.style.top = Math.round( this._vBuffer )+"px";
		this._dynamicCanvas.style.top = Math.round( this._vBuffer )+"px";
		
		/*
		this._staticCanvas.style.left = Math.round( this._hBuffer )+"px";
		this._dynamicCanvas.style.left = Math.round( this._hBuffer )+"px";
		*/
		this._age = newAge;
	},
	
}
Flw.RampantFlower.create = function( divElement ){
	var rf = new Flw.RampantFlower();
	rf.init( divElement );
	return rf;
};

Flw.ControledFlower = function(){};
Flw.ControledFlower.prototype = {
	
	_limitedFlower : null,
	
	init : function( divElement ){
		this._limitedFlower = Flw.LimitedFlower.create( divElement );
	},


};
Flw.ControledFlower.create = function( divElement ){
	var rf = new Flw.ControledFlower();
	rf.init( divElement );
	return rf;
};


Flw.Intervalle = function(){};
Flw.Intervalle.prototype = {
	_tab:null,
	initWithTab : function( t ){
		this._tab = t;
	},
	initWithBornes : function( a , b ){
		a = a % ( Math.PI * 2 );
		if( a < 0 )
			a += ( Math.PI * 2 );
			
		b = b % ( Math.PI * 2 );
		if( b <= 0 )
			b += ( Math.PI * 2 );
			
		if( a > b )
			this._tab = [ { a:0 , b:b } , { a:a , b:( Math.PI * 2 ) } ];
		else
			this._tab = [ { a:a , b:b } ];
	},
	getRandom : function( r ){
		r = r || Math.random();
		if( this.isEmpty() )
			return 0;
		var t = new Array( this._tab.length+1 ) , sum = 0;
		t[ 0 ] = 0;
		for( var i = 0 ; i < this._tab.length ; i ++ )
			t[ i+1 ] = ( sum += this._tab[i].b -  this._tab[i].a );
		
		r*=sum;
		
		for( var i = 1 ; i < this._tab.length && t[i] <= r ; i ++ );
			
		r = ( r - t[i-1] ) /  ( t[i] - t[i-1] );
		
		return this._tab[i-1].a *(1- r) + this._tab[i-1].b*r;	
	},
	isEmpty : function(){
		return this._tab.length == 0;
	},
	getSum : function(){
		var sum = 0;
		for( var i = 0 ; i < this._tab.length ; i ++ )
			sum += this._tab[i].b -  this._tab[i].a ;
		return sum;
	},
	complementaire : function( ){
		var te = [];
		for( var i = 0 ; i < this._tab.length ; i ++ ){
			if( i == 0 ){
				if( this._tab[ i ].a > 0 )
					te.push( { a : 0 , b : this._tab[ i ].a } );
			} else
				te.push( { a : this._tab[ i-1 ].b , b :this._tab[ i ].a } );
			
			if( i == this._tab.length-1 ){
				if( this._tab[ i ].b < Math.PI*2 )
					te.push( { a : this._tab[ i ].b , b : Math.PI*2 } );
			}
		}
		return Flw.Intervalle.createWithTab( te );
	},
	union : function( ia  , ib ){
		ib = ib || this;
		var ta = ia._tab;
		var tb = ib._tab;
		var te = [];
		var b=0,a=0;
		while( a < ta.length || b < tb.length ){
					if( a < ta.length && ( b >= tb.length || ta[a].a < tb[b].a ) ){
						if( te.length == 0 )
							te.push( { a : ta[a].a , b : ta[a].b } );
						else
							if( ta[a].a <=  te[ te.length -1 ].b )
								te[ te.length -1 ].b = ta[a].b;
							else
								te.push( { a : ta[a].a , b : ta[a].b } );
						a ++;
					} else {
						if( te.length == 0 )
							te.push( { a : tb[b].a , b : tb[b].b } );
						else
							if( tb[b].a <=  te[ te.length -1 ].b )
								te[ te.length -1 ].b = tb[b].b;
							else
								te.push( { a : tb[b].a , b : tb[b].b } );
						b ++;
					}
		}
		return Flw.Intervalle.createWithTab( te );
	},
	// a optimiser
	intersection : function( ia  , ib ){
		ib = ib || this;
		var ta = ia._tab;
		var tb = ib._tab;
		var te = [];
		var b=0,a=0;
		
		for( ; a < ta.length ; a ++ ){
			for( b=0; b < tb.length && tb[b].b < ta[a].a ; b ++ );
			for( ; b < tb.length && tb[b].a < ta[a].b ; b ++ )
				te.push( { a : Math.max( ta[a].a , tb[b].a ) , b : Math.min( ta[a].b , tb[b].b ) } );
		}
		return Flw.Intervalle.createWithTab( te );
	},
	draw : function( ctx , r ){
		var r = r || 50;
		var colorChart = [
			"blue",
			"yellow",
			"red",
			"green",
			"pink"
		];
		ctx.save();
		ctx.globalAlpha = 0.2;
		ctx.lineWidth = 1;
		ctx.strokeStyle = "black";
			
		for( var i = 0 ; i < this._tab.length ; i ++ ){
			
			if( this._tab[ i ].a == 0 && this._tab[ i ].b == Math.PI*2 );
				
			ctx.beginPath();
			ctx.moveTo( 0 , 0 );
			ctx.arc( 0 ,  0 ,  r , this._tab[ i ].a , this._tab[ i ].b , false );
			ctx.lineTo( 0 , 0 );
			ctx.fillStyle = colorChart[ i % colorChart.length ];
			ctx.fill();
			ctx.stroke();
			
		}
		ctx.restore();
	}
}
Flw.Intervalle.createWithTab = function( t ){
	var i = new Flw.Intervalle();
	i.initWithTab( t );
	return i;
}
Flw.Intervalle.createWithBornes = function( a , b ){
	if( typeof( a ) != "number" || typeof( b ) != "number" || isNaN( a ) || isNaN( b ) )
		throw "init with bornes which are not numbers";
	var i = new Flw.Intervalle();
	i.initWithBornes( a , b );
	return i;
}
Flw.Intervalle.create = function(  ){
	var i = new Flw.Intervalle();
	switch( arguments.length ){
		case 1 :
			if( arguments[0] instanceof Array )
				i.initWithTab( a , b );
		break;
		case 2 :
			if( typeof( arguments[0] ) == "number" && typeof( arguments[1] ) == "number" )
				i.initWithBornes( arguments[0] , arguments[1] );
		break;
	}
	return i;
}

/*
 * r g b 	float from 0 to 255.9
 * tint 	float from 0 to 360
 * s v		float from 0 to 1
 */
Flw.Color = function(){};
Flw.Color.prototype = {
	_r : null,	// red
	_b : null,	// blue
	_g : null,	// green 
	
	_t : null,  // tint 
	_s : null,  // saturation
	_v : null,	// value
	
	init : function( r , g , b , t , s , v ) {
		this._r = r;
		this._g = g;
		this._b = b;
		
		this._t = t;
		this._s = s;
		this._v = v;
	},
	
	clone : function( ){
		var c = new Flw.Color();
		c.init( this._r , this._g , this._b , this._t , this._s , this._v );
		return c;
	},
	toString : function(){
		if( this._r == null )
			this._calcRGB();
		var hex = ( ( Math.floor( this._r ) << 16 ) + ( Math.floor( this._g ) << 8 ) + Math.floor( this._b ) ).toString( 16 );
		while( hex.length < 6 )
			hex = "0"+hex;
		return "#"+hex;
	},
	_calcTSV : function(){
		var max = Math.max( this._r , this._b , this._g ),
			min = Math.min( this._r , this._b , this._g );
		
		if( max == min )
			this._t = 0;
		else
		if( max == this._r )
			this._t = ( 60 * ( this._g - this._b )/ ( max-min ) + 360 ) % 360;
		else
		if( max == this._g )
			this._t =   60 * ( this._b - this._r )/ ( max-min ) + 120;
		else
			this._t =   60 * ( this._r - this._g )/ ( max-min ) + 240;
	
		
		
		if( max == 0 )
			this._s = 0;
		else
			this._s = 1 - min / max;
		
		
		this._v = max/256;
	},
	_calcRGB : function(){
		
		
		var k = Math.floor( this._t / 60 ) % 6;
		var f = this._t / 60-k;
		switch( k ){
			case 0 :
				this._r = this._v ;
				this._g = this._v * ( 1 - ( 1 - f ) * this._s );
				this._b = this._v * ( 1 - this._s );
			break;
			case 1 :
				this._r = this._v * ( 1 -  f * this._s );
				this._g = this._v;
				this._b = this._v * ( 1 - this._s );
			break;
			case 2 :
				this._r = this._v * ( 1 - this._s );
				this._g = this._v;
				this._b = this._v * ( 1 - ( 1 - f ) * this._s );
			break;
			case 3 :
				this._r = this._v * ( 1 - this._s );
				this._g = this._v * ( 1 -  f * this._s );
				this._b = this._v;
			break;
			case 4 :
				this._r = this._v * ( 1 - ( 1 - f ) * this._s );
				this._g = this._v * ( 1 - this._s );
				this._b = this._v;
			break;
			case 5 :
				this._r = this._v;
				this._g = this._v * ( 1 - this._s );
				this._b =this._v * ( 1 -  f * this._s );
			break;
		}
		this._r = this._r * 256;
		this._g = this._g * 256;
		this._b = this._b * 256;
		
	},
	// getters
	getTint : function(){
		if( this._t == null )
			this._calcTSV();
		return this._t;
	},
	getValue : function(){
		if( this._v == null )
			this._calcTSV();
		return this._v;
	},
	getSaturation : function(){
		if( this._s == null )
			this._calcTSV();
		return this._s;
	},
	getR : function(){
		if( this._r == null )
			this._calcRGB();
		return this._r;
	},
	getB : function(){
		if( this._b == null )
			this._calcRGB();
		return this._b;
	},
	getG : function(){
		if( this._g == null )
			this._calcRGB();
		return this._g;
	},
	
	// setters
	setG : function( x ){
		if( this._g == null )
			this._calcRGB();
		this._g = x;
		
		this._s = null;
		this._t = null;
		this._v = null;
		
		return this;
	},
	setR : function( x ){
		if( this._r == null )
			this._calcRGB();
		this._r = x;
		
		this._s = null;
		this._t = null;
		this._v = null;
		
		return this;
	},
	setB : function( x ){
		if( this._b == null )
			this._calcRGB();
		this._b = x;
		
		this._s = null;
		this._t = null;
		this._v = null;
		
		return this;
	},
	setTint : function( x ){
		if( this._t == null )
			this._calcTSV();
		this._t = x;
		
		this._r = null;
		this._g = null;
		this._b = null;
		
		return this;
	},
	setSaturation : function( x ){
		if( this._s == null )
			this._calcTSV();
		this._s = x;
		
		this._r = null;
		this._g = null;
		this._b = null;
		
		return this;
	},
	setValue : function( x ){
		if( this._v == null )
			this._calcTSV();
		this._v = x;
		
		this._r = null;
		this._g = null;
		this._b = null;
		
		return this;
	},
}
Flw.Color.prototype.setSat = Flw.Color.prototype.setSaturation;
Flw.Color.prototype.getSat = Flw.Color.prototype.getSaturation;
Flw.Color.create = function( ){
	
	switch( arguments.length ){
		case 0 : 
			return Flw.Color.createWithRGB( 0 , 0 , 0 );
		break;
		case 1 : 
			if( typeof( arguments[0] ) )
				if( arguments[0].charAt( 0 ) == "#" )
					return Flw.Color.createWithHex( arguments[0] );
		break;
		case 3 : 
			return Flw.Color.createWithRGB( arguments[0] , arguments[1] , arguments[2] );
		break;
	}
}
Flw.Color.createWithRGB = function( r , g , b ){
	var c = new Flw.Color();
	c.init( r , g , b );
	return c;
}
Flw.Color.createWithHex = function( s ){
	
	var r, g , b;
	
	if( s.length == 4 ){
		r = parseInt( s.substr( 1 , 1 ) ,16);
		g = parseInt( s.substr( 2 , 1 ) ,16);
		b = parseInt( s.substr( 3 , 1 ) ,16);
	} else 
	if( s.length == 7 ){
		r = parseInt( s.substr( 1 , 2 ) ,16);
		g = parseInt( s.substr( 3 , 2 ) ,16);
		b = parseInt( s.substr( 5 , 2 ) ,16);
	}
	var c = new Flw.Color();
	c.init( r , g , b );
	return c;
}
Flw.Color.createWithTSV = function( t , s , v ){
	var c = new Flw.Color();
	if( s >= 1 )
		s = 0.9999;
	if( v >= 1 )
		v = 0.9999;
	c.init( null , null , null , t , s , v );
	return c;
}

/*
 * a flower is a string of element, 
 * each element must implement
 * visit( ctxDynamic , ctxStatic ) a function that draw the element and its children, entierly
 * visitFromTo( ctxDynamic , ctxStatic , t1 , t2 )  a function that draw the element and its children, and draw only the elements between the length t1 and t2
 *
 */
Flw.Branch = function(){}
Flw.Branch.prototype = {
	_direction : null,
	
	_A : null,
	_C : null,
	_B : null,
	
	_radius : 55,
	_radiusVar : 70,
	
	_maxDeepness : 3,
	
	_children : null,
	
	_deepness : null,
	
	_globalDirection : null,
	
	_parent : null,
	
	_grown : false,
	
	_major : false,
	
	getLastActiveStem : function( t ){
		var l = this.getLength();
		if( t < l || this.getMajor() == null )
			return this;
		else
			return this.getMajor().getLastActiveStem( t - l );
	},
	getHatchinTime : function(){
		var m = 0 , mm ;
		for( var i = 0 ; i < this._children.length ; i ++ )
			if( m < ( mm = this._children[i].getHatchinTime() ) )
				m = mm;
		return m + this.getLength();
	},
	getMajorPointAt : function( t ){
		
		var l = this.getLength();
		
		if( t <= l )
			return this._pointAt( t / l );
		
		return this.getMajor().getMajorPointAt( t - l );
	},
	getLength : function(){
		return this._length;
	},
	getMajor : function(){
		for( var i = 0 ; i < this._children.length ; i ++ )
			if(	this._children[ i ]._major )
				return this._children[ i ];
	},
	init : function( A , d , globalDirection ,  exA , exC , fork , deepness, parent ){
		
		this._children = [];
		
		this._A = A;
		this._direction = d;
		this._globalDirection = globalDirection;
		this._deepness = deepness || 0;
		this._parent = parent;
		
		this.pullCurve( exA , exC , fork );
		
		this._length = this._length();
	},
	pullCurve : function( exA , exC , fork ){
		
		var radius = this._radius + ( Math.random() - 0.5 ) * this._radiusVar;
		if( !this._major )
			radius *= 0.3 + 0.7*( 1 / ( 1.8+this._deepness/2 ) );
			
		this._B = {
			x : this._A.x + this._direction.x * radius,
			y : this._A.y + this._direction.y * radius
		}
		
		var c_radius = radius * ( 0.2 + Math.random()*0.5 );
		
		var dirC = {
			x : this._A.x  - exC.x,
			y : this._A.y  - exC.y,
		};
		var n = Math.sqrt( dirC.x * dirC.x + dirC.y * dirC.y );
		
		if( fork ){
			var deviance = 0.2 + Math.random() * 0.5;
			
			dirC.x = dirC.x / n * ( 1 - deviance  ) + this._direction.x * deviance;
			dirC.y = dirC.y / n * ( 1 - deviance  ) + this._direction.y * deviance;
			
			n = Math.sqrt( dirC.x * dirC.x + dirC.y * dirC.y );
			
			c_radius *= 1 + Math.random();
		}
		
		this._C = {
			x : this._A.x  + dirC.x / n * c_radius,
			y : this._A.y  + dirC.y / n * c_radius,
		}
	},
	
	// curve related
	_pointAt : function ( t , curv ){
		
		curv = curv || { a : this._A , b : this._B , c: this._C };
		
		return { 
			x : (1-t)*(1-t)*  curv.a.x  + 2*t*( 1-t )*  curv.c.x  + t*t*  curv.b.x,
			y : (1-t)*(1-t)*  curv.a.y  + 2*t*( 1-t )*  curv.c.y  + t*t*  curv.b.y
		}
	},
	_length : function( curv ){
		
		curv = curv || { a : this._A , b : this._B , c: this._C };
		
		var n1 = Math.sqrt( ( curv.a.x - curv.b.x) * ( curv.a.x - curv.b.x) +  ( curv.a.y - curv.b.y) * ( curv.a.y - curv.b.y ) );
		var n2 = Math.sqrt( ( curv.a.x - curv.c.x) * ( curv.a.x - curv.c.x) +  ( curv.a.y - curv.c.y) * ( curv.a.y - curv.c.y ) );
		var n3 = Math.sqrt( ( curv.b.x - curv.c.x) * ( curv.b.x - curv.c.x) +  ( curv.b.y - curv.c.y) * ( curv.b.y - curv.c.y ) );
		return ( n1 + n2 + n3 ) / 2;
	},
	// use the intersection with the tangentes
	_subCurve2 : function( t1 , t2 , curv ){
		// from 0 to t
		
		curv = curv || { a : this._A , b : this._B , c: this._C };
		
		
		var e1 , e2, v1 , v2 ;
		
		
		
		if( t1 > 0.001 ){
			e1 = this._pointAt( t1 , curv );
			v1 =	this._tangenteAt( t1 , curv );
		} else {
			e1 = curv.a;
			v1 = {
				x : curv.a.x - curv.c.x,
				y : curv.a.y - curv.c.y,
			};
		}
		if( t2 < 0.999 ){
			e2 = this._pointAt( t2 , curv );
			v2 = this._tangenteAt( t2 , curv );
		} else {
			e2 = curv.b;
			v2 = {
				x : curv.b.x - curv.c.x,
				y : curv.b.y - curv.c.y,
			};
		}
		
		
		if( Math.abs( t1 - t2 ) < 0.001 || v2.x * v1.y - v2.y * v1.x == 0 )
			return { a : e1 , b : e2 , c : { x : ( e2.x + e1.x ) / 2 , y : ( e2.y + e1.y ) / 2 } };
			
		
		
		var intersectionSegmentSegment = function( A1 , A2 , B1 , B2 ){
			var 
			VAx = A2.x - A1.x,
			VAy = A2.y - A1.y,
			VBx = B2.x - B1.x,
			VBy = B2.y - B1.y,
			PAx = A1.x,
			PAy = A1.y,
			PBx = B1.x,
			PBy = B1.y;

			if( VBy * VAx - VBx * VAy == 0 )		// colineaire
				return false;

			if( VBy == 0 ){
				var ta = ( PBy - PAy )/VAy;			// VAy != 0 sinon VA VB colineaires
				var tb = ((PAx-PBx)+VAx*ta)/VBx;	// VBx != 0 sinon B1 == B2
				return { ta:ta , tb:tb };
			}
			if( VAx == 0 ){
				var tb = ( PAx - PBx )/VBx;	
				var ta = ((PBy-PAy)+VBy*tb)/VAy;
				return { ta:ta , tb:tb };
			}
			var ta = (  (( PBx - PAx )  + VBx/VBy*(PAy-PBy) )/VAx )/( 1 - VBx * VAy / VAx / VBy );
			var tb = ((PAy-PBy)+VAy*ta)/VBy;
			return { ta:ta , tb:tb };
		}
	
		var re = intersectionSegmentSegment( e1 , { x: e1.x + v1.x * 100 , y: e1.y + v1.y * 100 } , e2 , { x: e2.x + v2.x * 100 , y: e2.y + v2.y * 100 } );
		
		if( re == false )
			return;
			
		return { a : e1 , b : e2 , c : { x : e2.x + v2.x * 100 * re.tb , y : e2.y + v2.y * 100 * re.tb } };
	},
	_subCurve : function( t1 , t2 , curv ){
		// from 0 to t
		
		curv = curv || { a : this._A , b : this._B , c: this._C };
		
		
		var a_ , b_ , c_ ;
		
		
		
		if( t1 > 0.001 ){
			a_ = this._pointAt( t1 , curv );
		} else {
			a_ = curv.a;
		}
		if( t2 < 0.999 ){
			b_ = this._pointAt( t2 , curv );
		} else {
			b_ = curv.b;
		}
		
		if( t2 - t1 < 0.001  )
			c_ = {
				x : ( a_.x + b_.x ) * 0.5, 
				y : ( a_.y + b_.y ) * 0.5, 
			};
		else
		if( t1 != 0 )
		c_ = {
				x : ( a_.x*t2*t2 + b_.x*t1*t1 - curv.a.x*( t1 - t2 )*( t1 - t2 ) )/( t1*t2 * 2 ),
				y : ( a_.y*t2*t2 + b_.y*t1*t1 - curv.a.y*( t1 - t2 )*( t1 - t2 ) )/( t1*t2 * 2 )
			};
		else{
			var t = (t1+t2)*0.5;
			c_ = {
				x : ( a_.x * ( t - t2 )*( t - t2 ) + b_.x * ( t - t1 )*( t - t1 ) - ( ( 1 - t )*( 1 - t )*curv.a.x + 2*( 1 - t )*t*curv.c.x + t*t*curv.b.x ) * ( t1 - t2 )*( t1 - t2 ) )/( ( t- t1 )*( t-t2 ) * 2 ),
				y : ( a_.y * ( t - t2 )*( t - t2 ) + b_.y * ( t - t1 )*( t - t1 ) - ( ( 1 - t )*( 1 - t )*curv.a.y + 2*( 1 - t )*t*curv.c.y + t*t*curv.b.y ) * ( t1 - t2 )*( t1 - t2 ) )/( ( t- t1 )*( t-t2 ) * 2 )
			};
		}
		
		return { a : a_ , b : b_ , c : c_ };
	},
	_tangenteAt : function( t , curv ){
		
		curv = curv || { a : this._A , b : this._B , c: this._C };
		
		var pas = 0.001;
		
		return { 
			x : ( (1-t-pas)*(1-t-pas) - (1-t+pas)*(1-t+pas) )*  curv.a.x  + 2*( (t+pas)*( 1-t-pas) - (t-pas)*( 1-t+pas) )*  curv.c.x  + ( (t+pas)*(t+pas) - (t-pas)*(t-pas) )*  curv.b.x,
			y : ( (1-t-pas)*(1-t-pas) - (1-t+pas)*(1-t+pas) )*  curv.a.y  + 2*( (t+pas)*( 1-t-pas) - (t-pas)*( 1-t+pas) )*  curv.c.y  + ( (t+pas)*(t+pas) - (t-pas)*(t-pas) )*  curv.b.y
		}
	},
	
	_widthStart : function(){
		if( this._major || this instanceof Flw.MajorBranch  )
			return 3;
		return 0.5 +2.5 / ( 1 + this._deepness*0.5 );
	},
	_widthEnd : function(){
		if( this._children.length == 0 && this._grown )
			return 0.05;
		if( this._major || this instanceof Flw.MajorBranch  )
			return 3;
		return 0.5 +2.5 / ( 1 + ( this._deepness + 1 )*0.5 );
	},
	_colorStart : function(){
		if( this._major || this instanceof Flw.MajorBranch  )
			return Flw.Color.createWithTSV( 90 , 0.7 , 0.6 );
		return Flw.Color.createWithTSV( 90 + this._deepness * 12 / ( 1 + ( this._deepness * 0.5 ) ) , 0.7 , 0.6 + this._deepness * 0.2 / ( 1 + ( this._deepness * 0.5 ) ) );
	},
	_colorEnd : function(){
		if( this._major || this instanceof Flw.MajorBranch  )
			return Flw.Color.createWithTSV( 90 , 0.7 , 0.6 );
		return Flw.Color.createWithTSV( 90 + (this._deepness+1) * 12 / ( 1 + ( (this._deepness +1 ) * 0.5 ) ) , 0.7 , 0.6 + (this._deepness+1) * 0.20 / ( 1 + ( (this._deepness +1 ) * 0.5 ) ) );
	},
	
	buildTotal : function (){
		if( this._maxDeepness > 999 )
			return;
		if( !this._grown ){
			this.grow();
			this._grown = true;
		}
		for( var i = 0 ; i < this._children.length ; i ++ )
			if( this._children[ i ] instanceof Flw.Branch || this._children[ i ] instanceof Flw.MajorBranch || this._children[ i ] instanceof Flw.TwistedBranch )
				this._children[ i ].buildTotal();
	},
	grow : function( ){
		
		
		if( this._deepness > this._maxDeepness || this._grown  )
			return;
		
		
		
		var angles = [],
		
			aToA = Math.atan2( this._A.y - this._B.y , this._A.x - this._B.x ),
		
			aToC = Math.atan2( this._C.y - this._B.y , this._C.x - this._B.x ),
		
			avaibleAngles = Flw.Intervalle.create( this._globalDirection + Math.PI + Math.PI/6 , this._globalDirection + Math.PI - Math.PI/6 );
		
		
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToA+Math.PI/4 , aToA-Math.PI/4 ) );
		
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToC+Math.PI/6 , aToC-Math.PI/6 ) );
		
		
		// push minor branches, eventualy twisted ones
		var w = this._major ? 1 : 0.8;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			
			var a = avaibleAngles.getRandom();
			angles.push( a );
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
				
			w -= 0.3;
		}
		
		for( var i = 0 ; i < angles.length ; i ++ ){
				if( i != 0 && Math.random() > 0.85 )
					this._children.push( Flw.TwistedBranch.create( 
					this._B , 
					{ x:Math.cos( angles[i] ) , y :Math.sin( angles[i] ) } , 
					this._globalDirection,
					this._A , 
					this._C , 
					i != 0,
					this._deepness + 1 , 
					this,
					0
				) );
			else
				this._children.push( Flw.Branch.create( 
					this._B , 
					{ x:Math.cos( angles[i] ) , y :Math.sin( angles[i] ) } , 
					this._globalDirection,
					this._A , 
					this._C , 
					i != 0,
					this._deepness + 1 , 
					this
				) );
		}
		
		// push leafs
		if(  Math.random() > 0.8 ){
			var lu = Flw.Intervalle.create( aToA - Math.PI/6 ,  aToA + Math.PI/6 );
			lu = lu.intersection( Flw.Intervalle.create( this._globalDirection + Math.PI - Math.PI/4 , this._globalDirection + Math.PI + Math.PI/4 ) );
			if( lu.getSum() > 0.1 ){
				var a = lu.getRandom();
				this._children.push( Flw.Leaf.create( 
						this._B , 
						a ,
						25 / ( this._deepness +1 )
				) );
			}
		}
		
		
		
		this._grown = true;
	},
	setDirection : function( d ){
		this._globalDirection = d;
	},
	draw : function( context ){
		
		
		context.beginPath();
		context.moveTo( this._A.x , this._A.y );
        context.quadraticCurveTo( this._C.x , this._C.y ,  this._B.x , this._B.y );
		context.lineWidth = 2 / ( 1 + this._deepness*0.5 );
		//context.lineWidth = this._major ? 0.5 : 0.4;
		
		context.strokeStyle = '#34AA00';
        context.stroke();
		
		if( (debug = true) ){
			
			context.lineWidth = 0.05;
			
			
			
			context.beginPath();
			context.moveTo( this._A.x , this._A.y );
			context.lineTo( this._C.x , this._C.y );
			context.lineTo( this._B.x , this._B.y );
			context.strokeStyle = 'red';
			context.stroke();
			
			context.beginPath();
			context.moveTo( this._A.x , this._A.y );
			context.lineTo( this._B.x , this._B.y );
			context.strokeStyle = 'blue';
			context.stroke();
		}
	},
	visit : function( contextDynamique , contextStatique ){
		this.draw( context );
		for( var i = 0 ; i < this._children.length ; i ++ )
			this._children[ i ].visit( context );
	},
	drawFromTo : function( context , t1 , t2 ){
		this.drawFromToCurve( context , t1 , t2 );
		
		if( !(debug = true) ){
			
			context.lineWidth = 0.5;
			
			
			
			context.beginPath();
			context.moveTo( this._A.x , this._A.y );
			context.lineTo( this._C.x , this._C.y );
			context.lineTo( this._B.x , this._B.y );
			context.strokeStyle = 'red';
			context.stroke();
			
			context.beginPath();
			context.moveTo( this._A.x , this._A.y );
			context.lineTo( this._B.x , this._B.y );
			context.strokeStyle = 'blue';
			context.stroke();
		}
	},
	drawFromToPoint : function( context , t1 , t2 ){
		
		var ws = this._widthStart(),
			we = this._widthEnd();
		
		var grd;
		
		var l = this.getLength() , e , r , x;
		for( var t= t1 ; t <= t2 ; t += this._pas ){
			x = t / l;
			e = this._pointAt( x );
			r = ws * ( 1- x )+ we * x;
			
			
			
			
			grd = context.createRadialGradient( e.x , e.y-r , 0 , e.x , e.y-r , r+1 );
			grd.addColorStop(0, '#AAFF00');
			grd.addColorStop(1, '#34AA00');
			 
			context.fillStyle = grd;
			 
			context.beginPath();
			context.arc( e.x , e.y , r , 0 , Math.PI*2 ,false );
			context.fill();
		}
	},
	drawFromToCurve : function( context , t1 , t2 ){
		
		if( t2 - t1 < 0.001 )
			return;
			
		
		var l = this.getLength();
		var t2_ = t2/l ;
		var	t1_ = t1/l ;
		
		var ws = this._widthStart(),
			we = this._widthEnd();
		
		var cs = this._colorStart(),
			ce = this._colorEnd(),
			tmpColor = Flw.Color.create();
		
		var wSegs = ws + ( we - ws ) * t1_, 
			wSege = ws + ( we - ws ) * t2_;
			
		cs.setTint(  cs.getTint() - ( cs.getTint() - ce.getTint() ) * t1_ );
		cs.setSat(  cs.getSat() - ( cs.getSat() - ce.getSat() ) * t1_ );
		cs.setValue(  cs.getValue() - ( cs.getValue() - ce.getValue() ) * t1_ );
		
		ce.setTint(  cs.getTint() - ( cs.getTint() - ce.getTint() ) * t2_ );
		ce.setSat(  cs.getSat() - ( cs.getSat() - ce.getSat() ) * t2_ );
		ce.setValue(  cs.getValue() - ( cs.getValue() - ce.getValue() ) * t2_ );
		
		
		
		var km = Math.floor( ( t2_ - t1_ ) * Math.abs( we- ws ) * 5 )+1;
		for( var k = 0 ; k < km ; k ++ ){
			
			
			var s1 = t1_ + ( k / km ) * ( t2_ - t1_ );
			var s2 = t1_ + ( (k+1) / km ) * ( t2_ - t1_ );
			
			var curv = this._subCurve( s1 , s2 );
			
			tmpColor.setTint( cs.getTint() * ( 1 - (k + 0.5) / km  ) + ce.getTint() * (k + 0.5) / km );
			tmpColor.setValue( cs.getValue() * ( 1 - (k + 0.5) / km  ) + ce.getValue() * (k + 0.5) / km );
			tmpColor.setSat( cs.getSat() * ( 1 - (k + 0.5) / km  ) + ce.getSat() * (k + 0.5) / km );
			
			/*
			context.beginPath();
			context.moveTo( curv.a.x , curv.a.y );
	        context.quadraticCurveTo(  curv.c.x , curv.c.y , curv.b.x , curv.b.y );
			context.lineWidth = ws * ( 1 - (k + 0.5) / km  ) + we * (k + 0.5) / km + 0.1;
			context.strokeStyle = 'black';
			context.stroke();
			*/
			
			if( curv == null ){
				console.log( this );
				console.log( s1 +"  "+s2 );
			}
			
			context.beginPath();
			context.moveTo( curv.a.x , curv.a.y );
	        context.quadraticCurveTo(  curv.c.x , curv.c.y , curv.b.x , curv.b.y );
			context.lineWidth = wSegs * ( 1 - (k + 0.5) / km  ) + wSege * (k + 0.5) / km ;
			context.strokeStyle = tmpColor.toString();
			context.stroke();
			
		}
	},
	/**
	 * draw itself and it children between the length t1 and t2 
	 * if its enoughtly drawn ( t2 > threeshold ), it calculate its children by calling grow
	 */
	visitFromTo : function( contextDynamique , contextStatique , t1 , t2 ){
		
		var l = this.getLength();
		
		var t1_ = Math.max( 0 , t1-l ),
			t2_ = t2-l;
			
		if( !this._grown ){
			this.grow();
			this._grown = true;
		}
		
		if( t1 <= l )
			this.drawFromTo( contextStatique , t1 , Math.min( t2 , l ) );
		
		if( t2_ > 0 )
			for( var i = 0 ; i < this._children.length ; i ++ )
				this._children[ i ].visitFromTo( contextDynamique , contextStatique , t1_ , t2_  );
	},
	getChildren : function(){
		return this._children;
	},
	getBranchWeight : function( ){
		var s = 1;
		for( var i = 0 ; i < this._children.length ; i ++ )
			s += this._children[ i ].getBranchWeight();
		return s;
	},
	getParent : function(){
		return this._parent;
	},
	getAncestorWeight : function( k ){
		
		var ances = this;
		for( ; k >= 0 ; k -- )
			ances = ances.getParent() || ances;
			
		return ances.getBranchWeight();
	},
}
Flw.Branch.create = function( ){
	var b = new Flw.Branch();
	b.init.apply( b , arguments );
	return b;
}
Flw.Branch.createSimple = function( A , d ){
	var b = new Flw.Branch();
	var v = { x : Math.cos( d ) , y : Math.sin( d ) }
	b.init( 
		A , 
		v ,
		d ,
		{ x : A.x - v.x * b._radius , y : A.y - v.y * b._radius },
		{ x : A.x - v.x * b._radius * 0.5 + v.y * b._radius * 0.3 , y : A.y - v.y * b._radius * 0.5 - v.x * b._radius * 0.3 },
		false
	)
	return b;
}


Flw.MajorBranch = function(){}
for( var i in Flw.Branch.prototype )
	Flw.MajorBranch.prototype[ i ] = Flw.Branch.prototype[ i ];
Flw.MajorBranch.prototype.grow = function(){
	
		// check the end of the stem
		// if so, add a head as children
		if( this._deepness > this._maxDeepness ){
			var aToC = Math.atan2( this._C.y - this._B.y , this._C.x - this._B.x );
				
			var lu = Flw.Intervalle.create( aToC + Math.PI - Math.PI/10 , aToC + Math.PI + Math.PI/10 );
				
			var a = lu.getRandom();
				
				
			this._children.push( Flw.Head.create( this._B , a , 50 ) );
				
			return;
		}
		
		// add branches, for estetic reason, branches can not superpose on each other
		// so the angle for the branch to grow is picked on a avaible angle circle
		var aToA = Math.atan2( this._A.y - this._B.y , this._A.x - this._B.x ),
		
			aToC = Math.atan2( this._C.y - this._B.y , this._C.x - this._B.x ),
		
			avaibleAngles = Flw.Intervalle.create( this._globalDirection + Math.PI + Math.PI/6 , this._globalDirection + Math.PI - Math.PI/6 );
		
		
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToA+Math.PI/4 , aToA-Math.PI/4 ) );
		
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToC+Math.PI/6 , aToC-Math.PI/6 ) );
		
		
		// push the new major branch
		var lu = avaibleAngles.intersection( Flw.Intervalle.create( this._globalDirection - Math.PI/5 , this._globalDirection + Math.PI/5 ) );
		lu = lu.intersection( Flw.Intervalle.create( this._globalDirection + Math.PI/8 , this._globalDirection - Math.PI/8 ) );
		var a = lu.getRandom();
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
		
		this._children.push( Flw.MajorBranch.create( 
					this._B , 
					{ x:Math.cos( a ) , y :Math.sin( a ) } , 
					this._globalDirection,
					this._A , 
					this._C , 
					false ,
					this._deepness + 1 , 
					this
				) );
				
		if( !this._major ){
			this._children[ this._children.length-1 ]._major = false;
			this._children[ this._children.length-1 ]._maxDeepness = this._maxDeepness;
			
		}
		// eventualy, push second major branch
		if(  Math.random() > 0.8 && avaibleAngles.getSum() > 0.1 && ( this._major || Math.random() > 0.8 ) ){
			
			var a = avaibleAngles.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
			
			var mjb = Flw.MajorBranch.create( 
					this._B , 
					{ x:Math.cos( a ) , y :Math.sin( a ) } , 
					this._globalDirection * 0.8 + 0.2 * a ,
					this._A , 
					this._C , 
					true ,
					0 , 
					this
				)
			mjb._maxDeepness = Math.floor( Math.random() * 3 ) +1;
			mjb._major = false;
			this._children.push( mjb );
		}
		
		
		// push minors branches, eventualy twisted ones
		var w = this._major ? 1 : 0.8;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			
			var a = avaibleAngles.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
				
			w -= 0.3;
			
			if( Math.random() > 0.75 )
				this._children.push( Flw.TwistedBranch.create( 
					this._B , 
					{ x:Math.cos( a ) , y :Math.sin( a ) } , 
					this._globalDirection,
					this._A , 
					this._C , 
					true ,
					0 ,
					this,
					0
				) );
			else
				this._children.push( Flw.Branch.create( 
					this._B , 
					{ x:Math.cos( a ) , y :Math.sin( a ) } , 
					this._globalDirection,
					this._A , 
					this._C , 
					true ,
					0 , 
					this
				) );
		}
		
		// push leafs
		if( Math.random() > 0.75 ){
			var lu = Flw.Intervalle.create( aToA - Math.PI/6 ,  aToA + Math.PI/6 );
			lu = lu.intersection( Flw.Intervalle.create( this._globalDirection + Math.PI - Math.PI/4 , this._globalDirection + Math.PI + Math.PI/4 ) );
			if( lu.getSum() > 0.1 ){
				var a = lu.getRandom();
				this._children.push( Flw.Leaf.create( 
						this._B , 
						a ,
						27
				) );
			}
		}
		
		this._grown = true;
}
Flw.MajorBranch.prototype._major = true;
Flw.MajorBranch.create = function( ){
	var b = new Flw.MajorBranch();
	b.init.apply( b , arguments );
	return b;
}
Flw.MajorBranch.createSimple = function( A , d ){
	var b = new Flw.MajorBranch();
	var v = { x : Math.cos( d ) , y : Math.sin( d ) }
	b.init( 
		A , 
		v ,
		d ,
		{ x : A.x - v.x * b._radius , y : A.y - v.y * b._radius },
		{ x : A.x - v.x * b._radius * 0.5 + v.y * b._radius * 0.3 , y : A.y - v.y * b._radius * 0.5 - v.x * b._radius * 0.3 },
		false
	)
	return b;
}


Flw.TwistedBranch = function(){}
for( var i in Flw.Branch.prototype )
	Flw.TwistedBranch.prototype[ i ] = Flw.Branch.prototype[ i ];
	
Flw.TwistedBranch.prototype._deepnessFromTwist = 5;
Flw.TwistedBranch.prototype.init = function(){
	this._deepnessFromTwist = arguments[ arguments.length-1 ];
	Flw.Branch.prototype.init.apply( this , arguments );
	
},
Flw.TwistedBranch.prototype.grow = function(){
	
	if( ( Math.random()+ 0.2 ) * this._deepnessFromTwist > 3 )
		return;
	
	
	var cos = -0.5 , sin = Math.sqrt( 3 )/2
	var nd = {
		x : this._direction.x * cos - sin * this._direction.y,
		y : this._direction.x * sin + cos * this._direction.y,
	};
	
	var BC = {
			x : this._C.x  -  this._B.x,
			y : this._C.y  -  this._B.y,
	};
	
	if( this._direction.x * nd.y - this._direction.y * nd.x > 0 == this._direction.x * BC.y - this._direction.y * BC.x > 0 ){
		var nd = {
			x : this._direction.x * cos + sin * this._direction.y,
			y : - this._direction.x * sin + cos * this._direction.y,
		};
	}
	
	this._children.push( Flw.TwistedBranch.create( 
				this._B , 
				nd , 
				this._globalDirection,
				this._A , 
				this._C , 
				false ,
				this._deepness +1  , 
				this,
				this._deepnessFromTwist+1
			) );
	
	this._grown = true;
},
Flw.TwistedBranch.prototype.pullCurve = function( exA , exC , fork ){
		
		
		var dirExA = {
			x : this._A.x  - exA.x,
			y : this._A.y  - exA.y,
		};
		
		
		
		var radius = Math.sqrt( dirExA.x * dirExA.x + dirExA.y * dirExA.y ) * 0.65;
		
		if( this._deepnessFromTwist == 0 )
			radius = this._radius + ( Math.random() - 0.5 ) * this._radiusVar;
		
		this._B = {
			x : this._A.x + this._direction.x * radius,
			y : this._A.y + this._direction.y * radius
		}
		
		var c_radius = radius * ( 0.5 + Math.random()*0.3 );
		
		var dirC = {
			x : this._A.x  - exC.x,
			y : this._A.y  - exC.y,
		};
		var n = Math.sqrt( dirC.x * dirC.x + dirC.y * dirC.y );
		
		this._C = {
			x : this._A.x  + dirC.x / n * c_radius,
			y : this._A.y  + dirC.y / n * c_radius,
		}
	
},
Flw.TwistedBranch.create = function( ){
	var b = new Flw.TwistedBranch();
	b.init.apply( b , arguments );
	return b;
}


Flw.Leaf = function(){}
Flw.Leaf.prototype = {
	_o : null,
	_pic : null,
	_topEar : null,
	_botEar : null,
	_creux : null,
	_hatchingTime : null,
	_radius : null,
	_d : null,
	_color : null,
	_staticlyDrawn : false,
	getHatchinTime : function(){
		return this._hatchingTime;
	},
	init : function( o , d , size ){
		this._o = o;
		this._radius = Math.max( ( Math.random()*0.4 + 0.8 ) * size , 10 );
		this._pic = {
			x : o.x + Math.cos( d ) * this._radius,
			y : o.y + Math.sin( d ) * this._radius
		}
		this._d = d;
		this._hatchingTime = Math.floor( Math.random() * 150 + 150 );
		this._creux = Math.random() * 0.5 + 0.2;
		this._topEar = Math.random() * 0.5 + 0.4;
		this._botEar = Math.random() * 0.5 + 0.4;
		
		this._color = Flw.Color.createWithTSV( 105 + Math.random() * 20 , Math.random() * 0.15 + 0.75 , Math.random() * 0.2 + 0.45 );
	},
	drawWithParam : function( context , pic , o , topEarBelly , botEarBelly , creux , color ){
	
		var opic = {
			x : pic.x - o.x,
			y : pic.y - o.y
		};
		
		var rebond = {
			x : pic.x - opic.x * 0.8 - opic.y * botEarBelly,
			y : pic.y - opic.y * 0.8 + opic.x * botEarBelly
		};
		
		var n = Math.sqrt( ( o.x - pic.x ) * ( o.x - pic.x ) + ( o.y - pic.y )* ( o.y - pic.y ) );
		
		grd = context.createRadialGradient( pic.x - opic.y * botEarBelly * 0.1 , pic.y + opic.x * botEarBelly * 0.1 ,
											0 ,
											pic.x - opic.x * 0.5 - opic.y * creux * botEarBelly * 0.5 , pic.y - opic.y * 0.5 + opic.x * creux * botEarBelly * 0.5 ,
											n*0.8 
											);
		
		var secondarColor = color.clone().setTint( Math.max( 92 , color.getTint() - 40 ) ).setValue( Math.min( 0.999, color.getValue()*1.1 +0.1 ) );
		
		grd.addColorStop(1, color.toString() );
		grd.addColorStop(0, secondarColor.toString() );
		
		context.strokeStyle = "black";
		context.lineWidth = 0.2;
		context.fillStyle = grd;
		context.beginPath();
		context.moveTo( o.x , o.y );
		context.quadraticCurveTo( 	o.x - opic.x * 0.2 + opic.y * topEarBelly , o.y - opic.y * 0.2 - opic.x * topEarBelly ,
									pic.x , pic.y
								);
		
		context.bezierCurveTo( 	pic.x - opic.x * creux * 0.5 - opic.y * creux * botEarBelly * 0.5 , pic.y - opic.y * creux * 0.5 + opic.x * creux * botEarBelly * 0.5 ,
								pic.x - opic.x * creux * 0.9 - opic.y * botEarBelly  , pic.y - opic.y * creux * 0.9 + opic.x * botEarBelly ,
								rebond.x , rebond.y 
							 );
		context.bezierCurveTo( 	pic.x - opic.x * 1.2 - opic.y * botEarBelly * 0.85, pic.y - opic.y * 1.2 + opic.x * botEarBelly * 0.85,
								pic.x - opic.x * 1.1 - opic.y * botEarBelly * 0.1, pic.y - opic.y * 1.1 + opic.x * botEarBelly * 0.1,
								o.x , o.y 
							 );	 
		context.fill();
		//context.stroke();
		
		context.fillStyle = "#756C36";
		context.beginPath();
		context.moveTo( o.x - opic.y * botEarBelly * 0.05 , o.y + opic.x * botEarBelly * 0.05 );
		context.quadraticCurveTo( o.x + opic.x * 0.15 + opic.y * topEarBelly * 0.2 , o.y + opic.y * 0.15 - opic.x * topEarBelly * 0.2 ,
								  o.x + opic.x * 0.8 - opic.y * botEarBelly * 0.08 , o.y + opic.y * 0.8 + opic.x * botEarBelly * 0.08
								);
		context.bezierCurveTo( o.x + opic.x * 0.10 + opic.y * topEarBelly * 0.25 , o.y + opic.y * 0.10 - opic.x * topEarBelly * 0.25 ,
							   o.x , o.y ,
							   o.x + opic.y * topEarBelly * 0.08 , o.y - opic.x * topEarBelly * 0.08 );
		context.lineTo( o.x - opic.y * botEarBelly * 0.05 , o.y + opic.x * botEarBelly * 0.05 );
		context.fill();
	
	},
	draw : function( context ){
		this.drawWithParam( context , this._pic , this._o , this._topEar , this._botEar , this._creux );
	},
	drawFromTo : function( context , t1 , t2 ){
		// draw the state at t2
		
		var r = ( t2 / this._hatchingTime );
		
		
		
		var o, pic,topEarBelly ,botEarBelly ,creux , color ;
		
		if( r < 0.7 ){
			var rr = r / 0.7;
			var radius = ( 0.3 + r ) * this._radius;
			var d = Math.PI/2 * ( 1 - rr ) + this._d * rr;
			o = this._o;
			pic = {
				x : o.x + Math.cos( d ) * radius,
				y : o.y + Math.sin( d ) * radius
			};
			topEarBelly = ( 0.3 + rr ) * this._topEar;
			botEarBelly = ( 0.3 + rr ) * this._botEar;
			creux = this._creux;
			color = this._color.clone();
			color.setTint( ( 1 - rr ) * 70 + rr * color.getTint() );
			color.setSat( ( 1 - rr ) * 0.5 + rr * color.getSat() );
			color.setValue( ( 1 - rr ) * 0.5 + rr * color.getValue() );
		} else
		if( r < 0.99 ){
			var rr = ( r - 0.7 ) / 0.3;
			var sinr = Math.cos( rr * 3 * Math.PI * 2 ) * 0.3 * ( 1 - rr ) + 1;
			var radius = this._radius;
			var d = this._d * ( Math.cos( rr * 3 * Math.PI * 2 ) * 0.05 * ( 1 - rr ) + 1 );
			o = {
				x : this._o.x + Math.cos( d ) * 10 * ( sinr - 1 ),
				y : this._o.y + Math.sin( d ) * 10 * ( sinr - 1 )
			};
			pic = {
				x : o.x + Math.cos( d ) * radius,
				y : o.y + Math.sin( d ) * radius
			};
			topEarBelly = sinr * this._topEar;
			botEarBelly = sinr * this._botEar;
			creux = this._creux;
			color = this._color;
		}else{
			o = this._o,
			pic = this._pic,
			topEarBelly = this._topEar,
			botEarBelly = this._botEar,
			creux = this._creux;
			color = this._color;
		}
		
		this.drawWithParam( context , pic , o , topEarBelly , botEarBelly , creux , color );
	},
	visit : function( context ){
		this.draw( context );
	},
	visitFromTo : function(  contextDynamique , contextStatique , t1 , t2 ){
		if( t2 > this._hatchingTime ){
			if( !this._staticlyDrawn ){
				this.drawFromTo(  contextStatique , t1 , t2 );
				this._staticlyDrawn = true;
			}
		}else
			this.drawFromTo(  contextDynamique , t1 , t2 );
	},
	getLength: function(){
		return this.getHatchingTime();
	},
}
Flw.Leaf.create = function( ){
	var b = new Flw.Leaf();
	b.init.apply( b , arguments );
	return b;
}


Flw.Head = function(){}
Flw.Head.prototype = {
	_hatchingTime : null,
	_radius : null,
	_d : null,
	_children : null,
	init : function( o , d , size ){
		this._children = [];
		
		var radius = Math.max( ( Math.random()*0.4 + 0.8 ) * size , 10 );
		var pic = { 
			x : o.x + Math.cos( d ) * radius,
			y : o.y + Math.sin( d ) * radius
		};
		
		var inclinaison = 0.08 + Math.random() * 0.14;
		
		var hatchingTime = Math.floor( Math.random() * 80 + 150 );
		
		var color = Flw.Color.createWithTSV( 320 + Math.random()*30  , 0.6 , 0.8 );
		var color = Flw.Color.createWithTSV( 0 + Math.random()*30  , 0.6 , 0.8 );
		
		// inner circle
		var t = 0;
		var l = 4;
		for( var i = 0 ; t < 1 ; i ++ ){
			
			t += ( Math.random() * 0.4 + 0.80 ) * 1/2/l ;
			
			var t1 = t
			
			t += ( Math.random() * 0.4 + 0.8 ) * 1/2/l;
			
			var t2 = t
			
			
			var y = 0.499 - Math.cos( (t1+t2)*Math.PI ) / 4;
			
			
			
			this._children.push( Flw.Petal.create(
				{ 
				  x : o.x + Math.cos( d ) * radius * 0.18,
				  y : o.y + Math.sin( d ) * radius * 0.18
				},
				pic ,
				inclinaison , 
				0.4 ,
				t1 ,
				t2 ,
				0 ,
				hatchingTime ,
				color.clone().setSat( 0.5 + 0.2 * y ).setValue( 0.5 + 0.1 * y )
			) );
		}
		
		// outer circle
		var t = 0;
		var l = 8;
		for( var i = 0 ; t < 1 ; i ++ ){
			
			t += ( Math.random() * 0.4 + 0.80 ) * 1/2/l ;
			
			var t1 = t
			
			t += ( Math.random() * 0.4 + 0.8 ) * 1/2/l;
			
			var t2 = t
			
			
			var y = 0.499 - Math.cos( (t1+t2)*Math.PI ) / 2;
			
			this._children.push( Flw.Petal.create(
				o,
				pic ,
				inclinaison * 2 , 
				0.6 ,
				t1 ,
				t2 ,
				0.8 ,
				hatchingTime , 
				color.clone().setSat( 0.5 + 0.2 * y ).setValue( 0.5 + 0.1 * y )
			) );
		}
		
		// add some branch
		
		
		avaibleAngles = Flw.Intervalle.create( d + Math.PI/2  , d - Math.PI/2 );
		
		var w = 1.2;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			
			var a = avaibleAngles.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/7 , a -Math.PI/7 ) );
			
			var  dir = { 
				x : Math.cos( a ) ,
				y : Math.sin( a )
			} ;
			
			var radius = Math.random() * 40 +20;
			
			var exA = {
				x : o.x - dir.x * radius ,
				y : o.y - dir.y * radius 
			};
			var exC = {
				x : o.x - dir.x * radius + dir.y * radius*0.5,
				y : o.y - dir.y * radius - dir.y * radius*0.5
			};
			
			if( Math.random() > 0.3 )
					this._children.push( Flw.TwistedBranch.create( 
					o , 
					dir, 
					a,
					exA , 
					exC ,
					false,
					3 , 
					1  , 
					false ,
					this,
					0
				) );
			else
				this._children.push( Flw.Branch.create( 
					o , 
					dir , 
					a,
					exA , 
					exC ,
					true,
					10 , 
					1  , 
					false ,
					this
				) );
			
			w -= 0.2;
		}
			
		this._children.sort( function(a,b){
			if( !a.getZ )
				return -1;
			if( !b.getZ )
				return 1;
			return b.getZ() - a.getZ();
			});
		
		
		// add some leafs
		
		var avaibleAngles = Flw.Intervalle.create( d + Math.PI/1.5  , d - Math.PI/1.5 );
		
		var w = 1.2;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			
			var a = avaibleAngles.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a + Math.PI/4 , a -Math.PI/4 ) );
			
			var radius = Math.random() * 40 +20;
			var dec = ( Math.random() - 0.5 ) * 10;
			this._children.push( Flw.Leaf.create( { x : o.x + Math.cos( d ) * 5 + Math.sin( d ) * dec , y : o.y + Math.sin( d ) * 5 - Math.cos( d ) * dec } , a , w == 1.2 ? 20 : 10 ) );
			
			w -= 0.3;
		}
	},
	grow : function(){},
	draw : function(){},
	drawFromTo : function(){},
	getLength : function(){ return 0; },
}
Flw.Head.prototype.visit = Flw.Branch.prototype.visit;
Flw.Head.prototype.visitFromTo = Flw.Branch.prototype.visitFromTo;
Flw.Head.prototype.getHatchinTime  = Flw.Branch.prototype.getHatchinTime;
Flw.Head.create = function( ){
	var b = new Flw.Head();
	b.init.apply( b , arguments );
	return b;
}

Flw.Petal = function(){}
Flw.Petal.prototype = {
	_hatchingTime : null,
	_radius : null,
	_d : null,
	_deep : null,
	_globalbours : null,
	_hoop : null,
	_t1 : null,
	_t2 : null,
	_ellipseA : null,
	_ellipseB : null,
	_o : null,
	_pic : null,
	_staticlyDrawn : false,
	_color : null,
	init : function(  o , pic , ellipseA , ellipseB , t1 , t2 , size , ht , color ){
		this._o = o;
		this._pic = pic;
		this._ellipseA = ellipseA;
		this._ellipseB = ellipseB;
		
		while( Math.abs( Math.sin( Math.PI*2*t1) - Math.sin( Math.PI*2*t2)  ) < 0.2 )
			t2 += 0.05;
			
		
		this._t1 = t1;
		this._t2 = t2;
		
		this._deep = Math.min( 0.9 , Math.max( 0.1 , 0.5 + ( Math.random() - 0.5 ) * 4 * Math.abs( Math.sin( Math.PI*2*t1) - Math.sin( Math.PI*2*t2) ) ) );
		this._globalbours = ( size * 0.8 + 0.2 )*(  Math.random() * 0.15 + 0.25 );
		
		this._hatchingTime = ht;
		this._color = color;
	},
	drawWithParam : function( context , o , pic , ellipseA , ellipseB , t1 , t2 , deep , globalbours , color ){
	
		// check sur t1 , t2 , c'st moche si il sont trop proche
		
		var opic = {
			x : pic.x - o.x,
			y : pic.y - o.y
		};
		
		var hoop = {
			h : 0.5,
			v : 0.02 + 0.2 * Math.abs( Math.sin( Math.PI*2*t1) - Math.sin( Math.PI*2*t2)  )
		};
		
		var decbours = Math.sin( Math.PI*( t1+ t2 ) ) * 0.3;
		
		if( Math.sin( Math.PI*2*t1) > Math.sin( Math.PI*2*t2) ){
			var bours1 =  globalbours + decbours;
			var bours2 =  globalbours - decbours;
		} else {
			var bours2 =  globalbours + decbours;
			var bours1 =  globalbours - decbours;
		}
		
		if( bours1 < 0.06 && bours1 > -0.2 )
			bours1 = bours1 * 0.5 -  0.1;
		
		if( bours2 < 0.06  && bours2 > -0.2 )
			bours2 = bours2 * 0.5 -  0.1;
		
		
		
		var c1 = {
			x : pic.x  + Math.cos( Math.PI*2*t1) * opic.x * ellipseA + Math.sin( Math.PI*2*t1) * opic.y * ellipseB,
			y : pic.y  + Math.cos( Math.PI*2*t1) * opic.y * ellipseA - Math.sin( Math.PI*2*t1) * opic.x * ellipseB
		}
		var c2 = {
			x : pic.x  + Math.cos( Math.PI*2*t2) * opic.x * ellipseA + Math.sin( Math.PI*2*t2) * opic.y * ellipseB,
			y : pic.y  + Math.cos( Math.PI*2*t2) * opic.y * ellipseA - Math.sin( Math.PI*2*t2) * opic.x * ellipseB
		}
		
		var d1 = {
			x : o.x  + Math.cos( Math.PI*2*t1) * opic.x * ellipseA *0.3 + Math.sin( Math.PI*2*t1) * opic.y * ellipseB * 0.3,
			y : o.y  + Math.cos( Math.PI*2*t1) * opic.y * ellipseA *0.3 - Math.sin( Math.PI*2*t1) * opic.x * ellipseB * 0.3
		}
		var d2 = {
			x : o.x  + Math.cos( Math.PI*2*t2) * opic.x * ellipseA *0.3 + Math.sin( Math.PI*2*t2) * opic.y * ellipseB * 0.3,
			y : o.y  + Math.cos( Math.PI*2*t2) * opic.y * ellipseA *0.3 - Math.sin( Math.PI*2*t2) * opic.x * ellipseB * 0.3
		}
		
		var c1c2 = {
			x : c2.x - c1.x,
			y : c2.y - c1.y
		};
		
		
		up = {
			x : opic.x,
			y : opic.y
		};
		
		var cm = {
			x : c1.x + hoop.h * c1c2.x  +  hoop.v * up.x,
			y : c1.y + hoop.h * c1c2.y  +  hoop.v * up.y
		};
		
		var d1c1 = {
			x : c1.x - d1.x,
			y : c1.y - d1.y
		};
		
		var d1c1ext;
		if( d1c1.x * c1c2.y - d1c1.y * c1c2.x > 0 )
			d1c1ext = {
				x : d1c1.y,
				y : -d1c1.x
			};
		else
			d1c1ext = {
				x : -d1c1.y,
				y : d1c1.x
			};
		
		var b1 = {
			x : d1.x + d1c1.x * 0.5 + d1c1ext.x * bours1,
			y : d1.y + d1c1.y * 0.5 + d1c1ext.y * bours1
		};
		
		
		var d2c2 = {
			x : c2.x - d2.x,
			y : c2.y - d2.y
		};
		var d2c2ext;
		if( d2c2.x * c1c2.y - d2c2.y * c1c2.x < 0 )
			d2c2ext = {
				x : d2c2.y,
				y : -d2c2.x
			};
		else
			d2c2ext = {
				x : -d2c2.y,
				y : d2c2.x
			};
		
		var b2 = {
			x : d2.x + d2c2.x * 0.7 + d2c2ext.x * bours2,
			y : d2.y + d2c2.y * 0.7 + d2c2ext.y * bours2
		};
		var b2bis = {
			x : d2.x + d2c2.x * 0.3 + d2c2ext.x * bours2,
			y : d2.y + d2c2.y * 0.3 + d2c2ext.y * bours2
		};
		
		
		
		var ctrlC1 = {
			x : c1.x + c1c2.x * hoop.h * 0.5 + up.x * hoop.v * deep,
			y : c1.y + c1c2.y * hoop.h * 0.5 + up.y * hoop.v * deep,
		};
		var ctrlC1_ = {
			x : c1.x + c1c2.x * hoop.h * 0.6 + up.x * hoop.v,
			y : c1.y + c1c2.y * hoop.h * 0.6 + up.y * hoop.v,
		};
		var ctrlC2_ = {
			x : cm.x + c1c2.x * ( 1-hoop.h ) * 0.5,
			y : cm.y + c1c2.y * ( 1-hoop.h ) * 0.5,
		};
		
		var ctrlC2 = {
			x : c2.x + ( c2.x - b2.x ) * hoop.h * hoop.v ,
			y : c2.y + ( c2.y - b2.y ) * hoop.h * hoop.v 
		};
		var ctrlB1_ = {
			x : c1.x + ( c1.x - ctrlC1.x )*2,
			y : c1.y + ( c1.y - ctrlC1.y )*2,
		};
		
		
		
		
		var secondaryColor = color.clone().setTint(Math.max( 0, color.getTint() - 20) ).setValue( 0.9 );
		
		grd = context.createLinearGradient( c1.x + opic.x * 0.3 , c1.y + opic.y * 0.3 , Math.floor( c1.x - opic.x * 0.5 ) , Math.floor(  c1.y - opic.y * 0.5 ) );
		
		grd.addColorStop(0, secondaryColor.toString() );
		grd.addColorStop(0.8, color.toString() );
		
		//grd.addColorStop(0, '#AA4499');
		//grd.addColorStop(1, '#904441');
			 
		context.fillStyle = grd;
		
		context.beginPath();
		context.moveTo( d1.x , d1.y );
		context.bezierCurveTo( 	b1.x , b1.y ,
								ctrlB1_.x , ctrlB1_.y ,
								c1.x , c1.y
							);
		context.bezierCurveTo( 	ctrlC1.x , ctrlC1.y ,
								ctrlC1_.x , ctrlC1_.y ,
								cm.x , cm.y
							);
		context.bezierCurveTo( 	ctrlC2_.x , ctrlC2_.y ,
								ctrlC2.x , ctrlC2.y ,
								c2.x , c2.y
							);
		context.bezierCurveTo( 	b2.x , b2.y ,
								b2bis.x , b2bis.y ,
								d2.x , d2.y
							);
		context.lineTo( d1.x , d1.y );
		context.fill();
		context.strokeStyle = "black";
		context.lineWidth = 0.1;
		//context.stroke();
		
		/*
		var l = -0.08;
		
		context.fillStyle  = '#DD66A9';
		context.beginPath();
		context.moveTo( c1.x , c1.y );
		context.bezierCurveTo( 	ctrlC1.x , ctrlC1.y ,
								ctrlC1_.x , ctrlC1_.y ,
								cm.x , cm.y
							);
		context.bezierCurveTo( 	ctrlC2_.x , ctrlC2_.y ,
								ctrlC2.x , ctrlC2.y ,
								c2.x , c2.y
							);
		context.lineTo( c2.x - opic.x * l * 0.1 , c2.y - opic.y * l * 0.1 );
		context.bezierCurveTo( 	ctrlC2.x - opic.x * l , ctrlC2.y - opic.y * l,
								ctrlC2_.x - opic.x * l, ctrlC2_.y - opic.y * l,
								cm.x - opic.x * l, cm.y - opic.y * l
							);
		context.bezierCurveTo( 	ctrlC1_.x - opic.x * l , ctrlC1_.y - opic.y * l,
								ctrlC1.x  - opic.x * l, ctrlC1.y - opic.y * l,
								c1.x - opic.x * l * 0.1, c1.y - opic.y * l * 0.1
							);
		context.lineTo( c1.x , c1.y );
		context.fill();
		
		*/
		if( !( debug = true ) ){
		
		
		for( var i = 0 ; i < 1 ; i += 0.01 ){
			var e = {
				x : pic.x  + Math.cos( Math.PI*2*i) * opic.x * ellipseA + Math.sin( Math.PI*2*i) * opic.y * ellipseB,
				y : pic.y  + Math.cos( Math.PI*2*i) * opic.y * ellipseA - Math.sin( Math.PI*2*i) * opic.x * ellipseB
			};
			context.fillStyle = "blue";
			context.beginPath();
			context.arc( e.x , e.y , 0.5 , 0 , Math.PI*2 ,  false );
			context.fill();
		}
		
		
		context.strokeStyle = "orange";
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo( d1.x , d1.y );
		context.lineTo( b1.x , b1.y );
		context.lineTo( ctrlB1_.x , ctrlB1_.y );
		context.lineTo( c1.x , c1.y );
		context.lineTo( ctrlC1.x , ctrlC1.y  );
		context.lineTo( ctrlC1_.x , ctrlC1_.y  );
		context.lineTo( cm.x , cm.y );
		context.lineTo( ctrlC2_.x , ctrlC2_.y );
		context.lineTo( ctrlC2.x , ctrlC2.y );
		context.lineTo( c2.x , c2.y );
		context.lineTo( b2.x , b2.y );
		context.lineTo( b2bis.x , b2bis.y );
		context.lineTo( d2.x , d2.y );
		context.stroke();
		
		context.fillStyle = "red";
		context.beginPath();
		context.arc( ctrlC2.x , ctrlC2.y , 2 , 0 , Math.PI*2 ,  false );
		context.fill();
		}
		
	},
	getZ : function( ){
		return this._ellipseA * Math.cos( ( this._t1 + this._t2) * Math.PI );
	},
	draw : function( context ){
		this.drawWithParam( context , this._o , this._pic , this._ellipseA , this._ellipseB , this._t1 , this._t2 , this._deep , this._globalbours  );
	},
	drawFromTo : function( context , t1 , t2 ){
		
		var o , pic , ellipseA , ellipseB , globalbours , color;
		
		var r = ( t2 / this._hatchingTime );
		
		if( r < 0.35 ){
			var rr = r / 0.35;
			
			o = this._o;
			
			var opic = {
				x : this._pic.x - this._o.x,
				y : this._pic.y - this._o.y
			};
			
			pic = {
				x : this._o.x + opic.x * ( rr *0.6 + 0.45 ),
				y : this._o.y + opic.y * ( rr *0.6 + 0.45 )
			}
			
			ellipseA = this._ellipseA * ( rr * 0.1 + 0.1 );
			ellipseB = this._ellipseB * ( rr * 0.1 + 0.1 );
			
			globalbours = this._globalbours * ( rr * 0.8 + 0.4 );
		}
		else
		if( r < 0.5 ){
			var rr = ( r - 0.35 ) / 0.15;
			o = this._o;
			
			pic = this._pic;
			
			ellipseA = this._ellipseA * 0.2;
			ellipseB = this._ellipseB * 0.2;
			
			globalbours = this._globalbours * ( - rr * 0.2 + 1.2 );
		}else
		if( r < 0.7 ){
			var rr = ( r - 0.5 ) / 0.2;
			
			o = this._o;
			
			pic = this._pic;
			
			
			ellipseA = this._ellipseA * ( rr  + 0.2 );
			ellipseB = this._ellipseB * ( rr  + 0.2 );
			
			globalbours = this._globalbours;
		}else
		if( r < 0.99 ){
		
			var rr = ( r - 0.70 ) / 0.30;
			var sinr = Math.cos( rr * 3 * Math.PI * 2 ) * 0.3 * ( 1 - rr ) + 1;
			o = this._o;
			
			pic = this._pic;
			
			
			ellipseA = this._ellipseA * sinr;
			ellipseB = this._ellipseB * sinr;
			
			globalbours = this._globalbours * sinr;
		} else
		{
			pic = this._pic;
			o = this._o;
			ellipseA = this._ellipseA;
			ellipseB = this._ellipseB;
			globalbours = this._globalbours;
			
		}
		
		
		color = this._color;
		
		this.drawWithParam( context , o , pic , ellipseA , ellipseB , this._t1 , this._t2 , this._deep , globalbours , color  );
	},
	visit : function( context ){
		this.draw( context );
	},
	getHatchinTime : function(){
		return this._hatchingTime;
	},
	visitFromTo : function(  contextDynamique , contextStatique , t1 , t2 ){
		
		if( this._staticlyDrawn )
			return;
		
		if( t2 > this._hatchingTime ){
			this._staticlyDrawn = true;
			this.drawFromTo( contextStatique , t1 , t2  );
		} else
			this.drawFromTo( contextDynamique , t1 , t2  );
	},
	getLength: function(){
		return this.getHatchingTime();
	},
}
Flw.Petal.create = function( ){
	var b = new Flw.Petal();
	b.init.apply( b , arguments );
	return b;
};



