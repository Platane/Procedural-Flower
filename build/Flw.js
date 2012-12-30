/**
 * @author platane / http://arthur-brongniart.fr/
 */
 
var Flw = Flw || {};

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
};
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
};
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
};
Flw.Intervalle.createWithTab = function( t ){
	var i = new Flw.Intervalle();
	i.initWithTab( t );
	return i;
};
Flw.Intervalle.createWithBornes = function( a , b ){
	if( typeof( a ) != "number" || typeof( b ) != "number" || isNaN( a ) || isNaN( b ) )
		throw "init with bornes which are not numbers";
	var i = new Flw.Intervalle();
	i.initWithBornes( a , b );
	return i;
};
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
};


Flw.buildOption = function( o ){
	var defaultOption = {
		
		widthStart : 5,
		widthEnd : 0.1,
		
		colorStart : Flw.Color.createWithTSV( 90 , 0 , 0.11 ),
		colorEnd : Flw.Color.createWithTSV( 90 , 0 , 0.7 ),
		
		maxDeepness:3,
		maxDeepnessVar:2,
		
		maxDeepnessTwisted:5,
		maxDeepnessTwistedVar:0,
		
		maxDeepnessMajor:2,
		maxDeepnessMajorVar:2,
		
		maxDeepnessMaster:5,
		maxDeepnessMasterVar:4,
		
		headSize : 50,
		headSizeVar : 60,
		
		leafSize : 30,
		leafSizeVar : 10,
		
		headColor : Flw.Color.createWithTSV( 90 , 0 , 0.2 ),
		headColorTintVar : 30,
		headColorValueVar : 0.5,
		headColorSatVar : 0.11,
		
		leafColor : Flw.Color.createWithTSV( 90 , 0.7 , 0.5 ),
		leafColorTintVar : 10,
		leafColorValueVar : 0.2,
		leafColorSatVar : 0.2,
		
		radius : 55,
		radiusVar :70,
		
		globalDirection : Math.PI/2,
		
		growVelocity:0.2,
		
		strokeBranchWidth : 0,
		strokeBranchColor : "#000000",
		strokeLeafWidth : 1.8,
		strokeLeafColor : "#000000",
		strokeHeadWidth : 1.1,
		strokeHeadColor : "#000000",
	};
	var o = o || {};
	for( var i in o ){
		if( defaultOption[i]==null || typeof( defaultOption[i] ) != typeof( o[i] ) ){
			console.log( "unkonw option \""+i+"\" ");
			continue;
		}
		defaultOption[i] = o[i];
	}
	return defaultOption;
};


/*
 * a branch is designed as the master, its mostly for the rampant flower, where the master is unlimited
 * there are two type of branch thta behave in same way, basic Basic branch ends getting thicker, MajorBranch stay the same with and ends with a head
 * in fact master is always a major
/*
 * a flower is a string of element, 
 * each element must implement
 * visit( ctxDynamic , ctxStatic ) a function that draw the element and its children, entierly
 * visitFromTo( ctxDynamic , ctxStatic , t1 , t2 )  a function that draw the element and its children, and draw only the elements between the length t1 and t2
 *
 */
Flw.Branch = function(){};
Flw.Branch.prototype = {
	_direction : null,
	
	// points of control of the curve
	_A : null,
	_C : null,
	_B : null,
	
	_children : null,
	
	_deepness : null,
	_maxDeepness : null,
	
	// if the children are already calculated
	_grown : false,
	
	_master : false,
	_major : false,
	
	//option set
	_option:null,
	
	getLastActiveStem : function( t ){
		var l = this.getLength();
		if( t < l || this.getMaster() == null )
			return this;
		else
			return this.getMaster().getLastActiveStem( t - l );
	},
	getHatchinTime : function(){
		var m = 0 , mm ;
		for( var i = 0 ; i < this._children.length ; i ++ )
			if( m < ( mm = this._children[i].getHatchinTime() ) )
				m = mm;
		return m + this.getLength();
	},
	getMasterPointAt : function( t ){
		var l = this.getLength();
		if( t <= l )
			return this._pointAt( t / l );
		return this.getMaster().getMasterPointAt( t - l );
	},
	getLength : function(){
		return this._length;
	},
	getMaster : function(){
		for( var i = 0 ; i < this._children.length ; i ++ )
			if(	this._children[ i ]._master )
				return this._children[ i ];
	},
	getChildren : function(){
		return this._children;
	},
	/**
	 * @param {point} the start of the curve, basicaly, the end of the previous one
	 * @param {point} the direction of the banch, a normalized vector
	 * @param {point} the last curve A point
	 * @param {point} the last curve C point
	 * @param {object} set of attribute
	 * @param {boolean} if true, there is a fork between the last curve and this one, that allow more liberty for the curve ( the C² continuity is not granted )
	 * @param {number} the deepness of the curve,
	 * @param {number} the deepnessMax of the curve,
	 * @param {Branch} the last curve
	 * @param {boolean} true if the branch is a major one
	 * @param {boolean} true if the branch is a master one
	 */
	init : function( A , d ,  exA , exC , option , fork , deepness, maxDeepness , major , master ){
		
		this._children = [];
		
		this._A = A;
		this._direction = d;
		this._deepness = deepness || 0;
		this._maxDeepness = maxDeepness || 0;
		this._option = option;
		
		this._major = major;
		this._master = master;
		
		this.pullCurve( exA , exC , fork );
		
		this._length = this._length();
	},
	/**
	 * calculate the control point of the curve
	 */
	pullCurve : function( exA , exC , fork ){
		
		// calculate the radius of the curve
		var radius = this._option.radius + ( Math.random() - 0.5 ) * this._option.radiusVar;
		// the radius go tighter as the deepness increase
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
	/**
	 * {deprecated} subCurve works better
	*/
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
		if( this._major )
			return this._option.widthStart;
		return this._option.widthEnd + ( this._option.widthStart - this._option.widthEnd )  / ( 1 + this._deepness/ this._maxDeepness * 4 );
	},
	_widthEnd : function(){
		if( this._children.length == 0 && this._grown )
			return this._option.widthEnd;
		if( this._major  )
			return this._option.widthStart;
		return this._option.widthEnd + ( this._option.widthStart - this._option.widthEnd )  / ( 1 + ( this._deepness +1 )/ this._maxDeepness * 4 );
	},
	_colorStart : function(){
		if( this._major )
			return this._option.colorStart.clone();
		
		var alpha = 1 / ( 1 + this._deepness/ this._maxDeepness * 4 );
		
		return Flw.Color.createWithRGB( alpha * this._option.colorStart.getR() + (1-alpha) * this._option.colorEnd.getR() ,
										alpha * this._option.colorStart.getG() + (1-alpha) * this._option.colorEnd.getG() ,
										alpha * this._option.colorStart.getB() + (1-alpha) * this._option.colorEnd.getB() );
	},
	_colorEnd : function(){
		if( this._major )
			return this._option.colorStart.clone();
		
		var alpha = 1 / ( 1 + (this._deepness+1)/ this._maxDeepness * 4 );
		
		return Flw.Color.createWithRGB( alpha * this._option.colorStart.getR() + (1-alpha) * this._option.colorEnd.getR() ,
										alpha * this._option.colorStart.getG() + (1-alpha) * this._option.colorEnd.getG() ,
										alpha * this._option.colorStart.getB() + (1-alpha) * this._option.colorEnd.getB() );
	},
	
	buildTotal : function (){
		// can't build the total if the maxDeep is Infinity
		if( this._maxDeepness > 999 )
			return;
		if( !this._grown ){
			this.grow();
			this._grown = true;
		}
		for( var i = 0 ; i < this._children.length ; i ++ )
			if( this._children[ i ] instanceof Flw.Branch || this._children[ i ] instanceof Flw.TwistedBranch )
				this._children[ i ].buildTotal();
	},
	grow : function( ){
		// stop the propagation when the plant if tall enought ( deepness )
		if( this._grown || this._deepness > this._maxDeepness )
			if( this._major ){
				// if its a major branch, put a head
				var aToC = Math.atan2( this._C.y - this._B.y , this._C.x - this._B.x );
				var lu = Flw.Intervalle.create( aToC + Math.PI - Math.PI/10 , aToC + Math.PI + Math.PI/10 );
				var a = lu.getRandom();
				this._children.push( Flw.Head.create( this._B , a , this._option ) );
				return;
			}else
				return;
		
		// add branches, for estetic reason, branches can not superpose on each other
		// so the angle for the branch to grow is picked on a avaible angle circle
		// we search for the angle from the B point of the currrent curve to the B point of the next one
		var angles = [],
			aToA = Math.atan2( this._A.y - this._B.y , this._A.x - this._B.x ),		// angle from B to A of the current curve
			aToC = Math.atan2( this._C.y - this._B.y , this._C.x - this._B.x ),		// angle from B to C of the current curve
			avaibleAngles = Flw.Intervalle.create( this._option.globalDirection + Math.PI + Math.PI/6 , this._option.globalDirection + Math.PI - Math.PI/6 );
		
		// subtract interval where the angle can't be picked ( because its too close to another angle )
		// substract from the avaible choice of angles a sector center to the aToA, so the angle choised will not be too close
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToA+Math.PI/4 , aToA-Math.PI/4 ) );
		
		// substract from the avaible choice of angles a sector center to the aToA, so the angle choised will not be too close
		avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( aToC+Math.PI/6 , aToC-Math.PI/6 ) );
		
		
		// push the new major branch
		if( this._major ){
			var lu = avaibleAngles.intersection( Flw.Intervalle.create( this._option.globalDirection - Math.PI/5 , this._option.globalDirection + Math.PI/5 ) );
			lu = lu.intersection( Flw.Intervalle.create( this._option.globalDirection + Math.PI/8 , this._option.globalDirection - Math.PI/8 ) );
			var a = lu.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
			var mjb = Flw.Branch.create( 
						this._B , 
						{ x:Math.cos( a ) , y :Math.sin( a ) } , 
						this._A , 
						this._C , 
						this._option,
						false ,
						this._deepness + 1 , 
						this._maxDeepness ,
						this._major,
						this._master
					);
			this._children.push( mjb );
		}	
		
		
		// push minor branches, eventualy twisted ones
		var w = this._major ? 1 : 0.8;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			// while angle be picked, push angle to the array, stop randomly. Have more chance to stop as angle are pushed to array
			var a = avaibleAngles.getRandom();
			angles.push( a );
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a +Math.PI/4 , a -Math.PI/4 ) );
				
			w -= 0.3;
		}
		
		// for all the angle in the array, push branches, twisted ones or regular ones
		for( var i = 0 ; i < angles.length ; i ++ ){
			var a = angles[i];
			if( i != 0 && Math.random() > 0.85 )
				this._children.push( Flw.TwistedBranch.create( 
					this._B , 
					{ x:Math.cos( a ) , y :Math.sin( a ) } , 
					this._A , 
					this._C , 
					this._option,
					true ,
					this._deepness + 1 , 
					this._major ? this._option.maxDeepness : this._maxDeepness ,
					false,
					false,
					0,
					Math.floor(this._option.maxDeepnessTwisted+(Math.random()-0.5)*this._option.maxDeepnessTwistedVar)
				) );
			else{
				var fork = i!=0 || this._major;
				var nmajor = this._major && fork && Math.random() > 0.94;
				var deepnessMax = (fork?
							(nmajor?
								Math.floor(this._option.maxDeepnessMajor+(Math.random()-0.5)*this._option.maxDeepnessMajorVar):
								Math.floor(this._option.maxDeepness+(Math.random()-0.5)*this._option.maxDeepnessVar) ):
							this._maxDeepness);
				var mjb = Flw.Branch.create( 
						this._B , 
						{ x:Math.cos( a ) , y :Math.sin( a ) } , 
						this._A , 
						this._C , 
						this._option,
						fork ,
						( fork && this._major ? 0 : this._deepness + 1 ), 
						deepnessMax,
						nmajor,
						false
					);
				this._children.push( mjb );
			}
		}
		
		// push leafs
		if(  Math.random() > 0.8 ){
			var lu = Flw.Intervalle.create( aToA - Math.PI/6 ,  aToA + Math.PI/6 );
			lu = lu.intersection( Flw.Intervalle.create( this._option.globalDirection + Math.PI - Math.PI/4 , this._option.globalDirection + Math.PI + Math.PI/4 ) );
			if( lu.getSum() > 0.1 ){
				var a = lu.getRandom();
				this._children.push( Flw.Leaf.create( 
						this._B , 
						a ,
						this._major ? 1 : 5 / ( this._deepness +5 ),
						this._option
				) );
			}
		}
		
		this._grown = true;
	},
	drawFromTo : function( context , t1 , t2 ){
		this.drawFromToCurve( context , t1 , t2 );
		if( Flw.debug ){
			
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
	/**
	 * {deprecated} drawCurve works better
	*/
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
		
		// w start and end of the curve
		var ws = this._widthStart(),
			we = this._widthEnd();
		
		// color start and end of the curve
		var cs = this._colorStart(),
			ce = this._colorEnd(),
			tmpColor = Flw.Color.create();
		
		// interpolation for the start and the end of the segment ( if the original curve is draw from 0 to 1, the segment is drawn from t1 to t2 )
		var wSegs = ws + ( we - ws ) * t1_, 
			wSege = ws + ( we - ws ) * t2_;
			
		cs.setTint(  cs.getTint() - ( cs.getTint() - ce.getTint() ) * t1_ );
		cs.setSat(  cs.getSat() - ( cs.getSat() - ce.getSat() ) * t1_ );
		cs.setValue(  cs.getValue() - ( cs.getValue() - ce.getValue() ) * t1_ );
		
		ce.setTint(  cs.getTint() - ( cs.getTint() - ce.getTint() ) * t2_ );
		ce.setSat(  cs.getSat() - ( cs.getSat() - ce.getSat() ) * t2_ );
		ce.setValue(  cs.getValue() - ( cs.getValue() - ce.getValue() ) * t2_ );
		
		// number of sub-segment
		var km = Math.floor( ( t2_ - t1_ ) * Math.abs( we- ws ) * 5 )+1;
		for( var k = 0 ; k < km ; k ++ ){
			
			// sub-segment start and end
			var s1 = t1_ + ( k / km ) * ( t2_ - t1_ );
			var s2 = t1_ + ( (k+1) / km ) * ( t2_ - t1_ );
			
			var curv = this._subCurve( s1 , s2 );
			
			// interpolation to the sub-segment
			tmpColor.setTint( cs.getTint() * ( 1 - (k + 0.5) / km  ) + ce.getTint() * (k + 0.5) / km );
			tmpColor.setValue( cs.getValue() * ( 1 - (k + 0.5) / km  ) + ce.getValue() * (k + 0.5) / km );
			tmpColor.setSat( cs.getSat() * ( 1 - (k + 0.5) / km  ) + ce.getSat() * (k + 0.5) / km );
			
			if( this._option.strokeBranchWidth > 0 ){
				
				var curvShort = this._subCurve( s1+0.004 , s2 );
				
				context.beginPath();
				context.moveTo( curvShort.a.x , curvShort.a.y );
		        context.quadraticCurveTo(  curvShort.c.x , curvShort.c.y , curvShort.b.x , curvShort.b.y );
				context.strokeStyle = this._option.strokeBranchColor;
				context.lineWidth = wSegs * ( 1 - (k + 0.5) / km  ) + wSege * (k + 0.5) / km + this._option.strokeBranchWidth*2;
				context.stroke();
			}
			
			context.beginPath();
			context.moveTo( curv.a.x , curv.a.y );
	        context.quadraticCurveTo(  curv.c.x , curv.c.y , curv.b.x , curv.b.y );
			context.lineWidth = wSegs * ( 1 - (k + 0.5) / km  ) + wSege * (k + 0.5) / km ;
			context.strokeStyle = tmpColor.toString();
			context.stroke();
			
		}
	},
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
};
Flw.Branch.create = function( ){
	var b = new Flw.Branch();
	b.init.apply( b , arguments );
	return b;
};
Flw.Branch.createSimple = function( A , d , option ){
	var b = new Flw.Branch();
	var v = { x : Math.cos( d ) , y : Math.sin( d ) }
	var option = Flw.buildOption( option || {} );
	b.init(
		A , 
		v ,
		{ x : A.x - v.x * option.radius , y : A.y - v.y * option.radius },
		{ x : A.x - v.x * option.radius * 0.5 + v.y * option.radius * 0.3 , y : A.y - v.y * option.radius * 0.5 - v.x * option.radius * 0.3 },
		option,
		false ,
		0, 
		Math.floor(option.maxDeepnessMaster+(Math.random()-0.5)*option.maxDeepnessMasterVar),
		true,
		true
	);
	return b;
};



Flw.TwistedBranch = function(){}
for( var i in Flw.Branch.prototype )
	Flw.TwistedBranch.prototype[ i ] = Flw.Branch.prototype[ i ];	
Flw.TwistedBranch.prototype._deepnessFromTwist = 0;		//actually not used
Flw.TwistedBranch.prototype._deepnessMaxFromTwist = 0;	//actually not used
Flw.TwistedBranch.prototype.init = function(){
	this._deepnessFromTwist = arguments[ arguments.length-2 ];
	this._deepnessMaxFromTwist = arguments[ arguments.length-1 ];
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
				nd,
				this._A , 
				this._C , 
				this._option,
				false ,
				this._deepness + 1 , 
				this._maxDeepness ,
				this._major,
				this._master,
				this._deepnessFromTwist+1,
				this._deepnessMaxFromTwist
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
			radius = this._option.radius + ( Math.random() - 0.5 ) * this._option.radiusVar;
		
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
	_option : null,
	getHatchinTime : function(){
		return this._hatchingTime;
	},
	init : function( o , d , size , option ){
		this._o = o;
		this._radius = ( option.leafSize + (Math.random()-0.5) * option.leafSizeVar )*size;
		this._pic = {
			x : o.x + Math.cos( d ) * this._radius,
			y : o.y + Math.sin( d ) * this._radius
		}
		this._d = d;
		this._hatchingTime = Math.floor( Math.random() * 150 + 150 );
		this._creux = Math.random() * 0.5 + 0.2;
		this._topEar = Math.random() * 0.5 + 0.4;
		this._botEar = Math.random() * 0.5 + 0.4;
		
		this._color = option.leafColor.clone();
		this._color.setTint( ( this._color.getTint()  + (Math.random()-0.5)*option.leafColorTintVar +360 ) % 360  );
		this._color.setSat( Math.min( 0.99 , Math.max( 0.01 , this._color.getSat()   + (Math.random()-0.5)*option.leafColorSatVar )));
		this._color.setValue( Math.min( 0.99 , Math.max( 0.01 , this._color.getValue()   + (Math.random()-0.5)*option.leafColorValueVar )));
		this._option = option;
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
		
		var secondarColor = color.clone().setTint( (color.getTint() - 40 +360)%360 ).setValue( Math.min( 0.999, color.getValue()*1.1 +0.1 ) );
		
		grd.addColorStop(1, color.toString() );
		grd.addColorStop(0, secondarColor.toString() );
		
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
		if( this._option.strokeLeafWidth > 0 ){
			context.strokeStyle = this._option.strokeLeafColor;
			context.lineWidth = this._option.strokeLeafWidth;
			context.stroke();
		}
		
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
			
			
			color = Flw.Color.createWithRGB( ( 1 - rr )*this._option.colorStart.getR() + rr * this._color.getR() ,
											( 1 - rr )*this._option.colorStart.getG() + rr * this._color.getG() ,
											( 1 - rr )*this._option.colorStart.getB() + rr * this._color.getB() );
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
	_children : null,
	init : function( o , d , option ){
		this._children = [];
		
		var radius = option.headSize + ( Math.random() - 0.5 ) * option.headSizeVar;
		var pic = { 
			x : o.x + Math.cos( d ) * radius,
			y : o.y + Math.sin( d ) * radius
		};
		
		var inclinaison = 0.08 + Math.random() * 0.14;
		
		var hatchingTime = Math.floor( Math.random() * 80 + 150 );
		
		var color = option.headColor.clone();
		color.setTint( ( color.getTint()  + (Math.random()-0.5)*option.headColorTintVar +360 ) % 360  );
		var sat =  Math.min( 0.8 , Math.max( 0.1 , color.getSat()   + (Math.random()-0.5)*option.headColorSatVar ));
		var value = Math.min( 0.8 , Math.max( 0.1 , color.getValue() + (Math.random()-0.5)*option.headColorValueVar ));
		
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
				//color.clone().setSat( 0.5 + 0.2 * y ).setValue( 0.5 + 0.1 * y ),
				color.clone().setSat( Math.min(0.99,Math.max(0, sat + 0.3 * y)) ).setValue( Math.min(0.99,Math.max(0, value + 0.15 * y)) ),
				option
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
				//color.clone().setSat( 0.5 + 0.2 * y ).setValue( 0.5 + 0.1 * y )
				color.clone().setSat( Math.min(0.99,Math.max(0, sat + 0.3 * y)) ).setValue( Math.min(0.99,Math.max(0, value + 0.15 * y)) ),
				option
			) );
		}
		
		////////////////////
		// add some branch  //
		
		
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
					exA , 
					exC ,
					option,
					false ,
					0, 
					5,
					false,
					false,
					0,
					Math.ceil((option.maxDeepnessTwisted+(Math.random()-0.5)*option.maxDeepnessTwistedVar)/2)
				) );
			else
				this._children.push( Flw.Branch.create( 
					o , 
					dir,  
					exA , 
					exC ,
					option,
					false ,
					0, 
					5,
					false,
					false
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
		
		////////////////////
		// add some leafs  ////
		
		var avaibleAngles = Flw.Intervalle.create( d + Math.PI/1.5  , d - Math.PI/1.5 );
		
		var w = 1.2;
		while( Math.random() < w  && avaibleAngles.getSum() > 0.1 ){
			
			var a = avaibleAngles.getRandom();
			avaibleAngles = avaibleAngles.intersection( Flw.Intervalle.create( a + Math.PI/4 , a -Math.PI/4 ) );
			
			var radius = Math.random() * 40 +20;
			var dec = ( Math.random() - 0.5 ) * 10;
			this._children.push( Flw.Leaf.create( 
				{ x : o.x + Math.cos( d ) * 5 + Math.sin( d ) * dec , y : o.y + Math.sin( d ) * 5 - Math.cos( d ) * dec } ,
				a ,
				0.7 ,
				option
				) );
			
			w -= 0.3;
		}
		
	},
	grow : function(){},
	visitFromTo : Flw.Branch.prototype.visitFromTo,
	getHatchinTime : Flw.Branch.prototype.getHatchinTime,
	drawFromTo : function(){},
	getLength : function(){ return 0; },
}
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
	_option : null,
	init : function(  o , pic , ellipseA , ellipseB , t1 , t2 , size , ht , color , option ){
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
		this._option = option;
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
		if( this._option.strokeHeadWidth > 0 ){
			context.strokeStyle = this._option.strokeHeadColor;
			context.lineWidth = this._option.strokeHeadWidth;
			context.stroke();
		}
		
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
		if( Flw.debug ){
		
		
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


window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60 );
    };
})();

/**
 * A simple flower that grow with an animation and stop when its fully grown
 */
Flw.LimitedFlower = function(){};
Flw.LimitedFlower.prototype = {
	
	_canvasHeight : null,
	_canvasWidth : null,
	
	_growSpeed : 0.18,
	
	_staticContext : null,
	_dynamicContext : null,
	
	
	_root : null,
	
	_age : null,
	
	_running : true,
	
	_endHatchin : null,
	
	init : function( divElement , option , run ){
		
		// get the option
		if( option && option.growVelocity && typeof(option.growVelocity) == "number" )
			this._growSpeed = option.growVelocity;
		
		
		// initiate the canvas
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
		
		this._root = Flw.Branch.createSimple( {x:0,y:0} , Math.PI/2 , option || {} );	
		this._root.buildTotal();
		this._endHatchin = this._root.getHatchinTime();
		
		// setup the timeline
		if( run ){
			var self=this;
			(function(){
				var lastTime=(new Date()).getTime();
				var cycle = function(){
					var t=(new Date()).getTime();
					var dt = t-lastTime;
					lastTime=t;
					
					self.cycle( dt );
					if( self._running )
						window.requestAnimFrame( cycle );
				};
				cycle();
			})();
		}
		
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
			this._running=false;
		}
	},

}
/**
 *@param {htmlElement} the element where to put the flower, Must have the width and height style property set, with px
 * @param {object} a set of option for the flower, see the controled example if you want to konw more about option
 * @param {boolean} if true, use it own animation caller ( with a requestAnimFrame ) if false, consider call the cycle method by yourself
 * @return {Flw.ControledFlower} the flower
 */
Flw.LimitedFlower.create = function( divElement , option ,run ){
	var rf = new Flw.LimitedFlower();
	rf.init( divElement , option , run );
	return rf;
};

/**
 * A flower that grow inifinitly. 
 * The window automaticly scroll to follow the growth of the flower. Never stop.
 */
Flw.RampantFlower = function(){};
Flw.RampantFlower.prototype = {
	_canvasHeight :1000,
	_canvasWidth : null,
	
	_window : null,						// size of the window in the y axis
	
	_vBuffer : null,					// on the y axis, top of the window to top of the buffer
	_baseRoot : null,					// on the y axis,  bottom of the buffer to the lower point of root
	
	_growSpeed : 0.2,
	
	_scrollCalculatorTimer : null,		//value to decremente
	_scrollCalculatorInterval : null,	// in ms, interval between two heavy calcul
	
	
	
	_scrollSpeed : null,				//the buffer go down at scrollSpeed pixel per s ( calculate by the system )
	_targetScrollSpeed : null,
	
	
	_staticContext : null,
	_dynamicContext : null,
	
	_staticCanvas : null,
	_dynamicCanvas : null,
	
	_running : true,					//put that to false end the animation
	_root : null,
	_age : null,
	
	init : function( divElement , option , run ){
		
		if( option && option.growVelocity && typeof(option.growVelocity) == "number" )
			this._growSpeed = option.growVelocity;
		
		// setup the canvas
		this._window = parseInt( (/^[0-9]*/).exec( divElement.style.height )[0] );
		this._canvasWidth = parseInt( (/^[0-9]*/).exec( divElement.style.width )[0] );
		
		this._canvasHeight = Math.max( this._canvasHeight , this._window * 2 );
		
		var staticCanvas = document.createElement("canvas");
		this._staticContext =  staticCanvas.getContext( "2d" );
		staticCanvas.width = this._canvasWidth;
		staticCanvas.height = this._canvasHeight;
		
		var dynamicCanvas = document.createElement("canvas");
		this._dynamicContext =  dynamicCanvas.getContext( "2d" );
		dynamicCanvas.width = this._canvasWidth;
		dynamicCanvas.height = this._window;
		
		divElement.style.overflow = "hidden";
		divElement.appendChild( staticCanvas );
		divElement.appendChild( dynamicCanvas );
		
		staticCanvas.style.position = "absolute";
		staticCanvas.style.left = ( -this._canvasWidth/2 + this._width/2 )+"px";
		dynamicCanvas.style.position = "absolute";
		dynamicCanvas.style.left = ( -this._canvasWidth/2 + this._width/2 )+"px";

		this._staticCanvas = staticCanvas;
		this._dynamicCanvas = dynamicCanvas;
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		this._dynamicContext.translate( this._canvasWidth/2 , this._window );
		this._staticContext.translate( this._canvasWidth/2 , this._canvasHeight );
		this._dynamicContext.scale( 1 , -1 );
		this._staticContext.scale( 1 , -1 );
		
		this._dynamicContext.save();
		this._staticContext.save();
		
		this._baseRoot = this._canvasHeight - this._window;
		
		// setup the flower
		var option = option || {};
		option.maxDeepnessMaster = Infinity;
		this._root = Flw.Branch.createSimple( {x:0,y:0} , Math.PI/2 , option);
		
		// get the option
		this._age = 0;
		this._scrollCalculatorInterval = Math.min( 600 , Math.max( 200 , 150/this._growSpeed )); 
		this._scrollSpeed=0;
		
		// setup the timeline
		if( run ){
			var self=this;
			(function(){
				var lastTime=(new Date()).getTime();
				var cycle = function(){
					var t=(new Date()).getTime();
					var dt = t-lastTime;
					lastTime=t;
					
					self.cycle( dt );
					
					if( self._running )
						window.requestAnimFrame( cycle );
				};
				cycle();
			})();
		}
	},
	cycle : function( dt ){
		
		// limit the speed
		if( dt > 100 )
			dt = 100;
		
		newAge = this._age + dt * this._growSpeed;
		
		this._scrollCalculatorTimer -= dt;
		
		// do that part only when its necessary, 
		if( this._scrollCalculatorTimer <= 0 ){
			
			// retreive the top of the flower ( the highest stem )
			var top = this._root;
			var ageAtTop = this._root.getLength();
			while( top._grown ){	// search for the last grown master branch
				top = top.getMaster();
				ageAtTop += top.getLength();
			}
			
			// force the grow if needed
			while( ageAtTop < newAge ){
				top.grow();
				top = top.getMaster();
				ageAtTop += top.getLength();
			}
			
			// the last point that will be drawn
			var pointe = this._root.getMasterPointAt( newAge );
			
			var centre = 55 + this._window * ( 0.2 + this._growSpeed/3 );		// where the point should be
			
			var py = this._vBuffer + this._canvasHeight - centre; // position of a point a centre / 1.3 from the top of the window, relatively to the base of the buffer
			var cy = pointe.y + this._baseRoot; // pointe of the stem relatively to the base of the buffer
			
			
			//////////
			// Set the vertical speed
			
			// by the time of the next checkpoint, the current delay will be catched
			if( pointe.y > this._window - centre )
				this._targetScrollSpeed = -( py - cy )/ this._scrollCalculatorInterval;
			else
				this._targetScrollSpeed=0;
			
			//////////
			// change the global direction if needed, we dont want the flower to grow away from the window
			
			//retreive the top of the top
			var upperTop = top;
			while( upperTop.getMaster() != null )
				upperTop = upperTop.getMaster();
			upperTop._option.globalDirection = Math.atan2( this._canvasWidth , -upperTop._B.x ); 
			
			//////////
			// check for swapping the buffer
			if( this._vBuffer >= -50 ){
				var d = this._window - this._canvasHeight - this._vBuffer;
				
				// restore to the point where the context base is 0 ( not baseRoot )
				this._staticContext.restore();
				
				//clean the buffer anywhere but in the window
				this._staticContext.clearRect( -this._canvasWidth/2 , 0 , this._canvasWidth , this._canvasHeight - ( this._window - this._vBuffer )  );
				
				// replice what s in the window
				this._staticContext.scale( 1 , -1 );
				this._staticContext.drawImage( this._staticCanvas , 0 , 0 , this._canvasWidth , ( this._window - this._vBuffer ) , -this._canvasWidth/2 , -( this._window - this._vBuffer ) , this._canvasWidth , ( this._window - this._vBuffer ) );
				this._staticContext.scale( 1 , -1 );
				
				// clear the previous window
				this._staticContext.clearRect( -this._canvasWidth/2 , this._canvasHeight-( this._window - this._vBuffer ) , this._canvasWidth , ( this._window - this._vBuffer )  );
				
				this._staticContext.save();
				
				this._baseRoot += d;
				this._vBuffer += d;
				
				// the context base is baseRoot ( the base is beyond 0 )
				this._staticContext.translate( 0 , this._baseRoot );
				
				
				
				//by the way, shrink the flower, the root is now the most recent part that have already be drawn
				//this element cannot be know perfectly, 
				// I make the assumption that its pointe is beyond a certain amount of pixel, 
				// lets say that the point is under the base of the buffer
				var downStem = this._root;
				var ageAtDownStem = 0;
				while( downStem.getMaster() && downStem._B.y + this._baseRoot < 0 ){
					ageAtDownStem += downStem.getLength();
					downStem = downStem.getMaster();
				}
				this._root = downStem;
				this._age -= ageAtDownStem;
				newAge -= ageAtDownStem;
				
				
			}
			
			this._scrollCalculatorTimer = Math.min( -(this._vBuffer+40) / Math.max( this._scrollSpeed , this._targetScrollSpeed ) , this._scrollCalculatorInterval );
			
		}
		
		// interpolation of the scrollSpeed
		this._scrollSpeed = this._scrollSpeed + ( this._targetScrollSpeed - this._scrollSpeed )/10*this._growSpeed;
		//this._scrollSpeed = this._targetScrollSpeed;
		
		this._vBuffer += this._scrollSpeed * dt;
		
		this._dynamicContext.clearRect( -this._canvasWidth/2 , 0 , this._canvasWidth , this._window );
		
		if( Flw.debug ){
			// speed test
			this._dynamicContext.beginPath();
			var l = this._scrollSpeed*300;
			this._dynamicContext.rect( 50 , 10  , 40 , l );
			this._dynamicContext.fillStyle="#a13EB1";
			this._dynamicContext.fill();
		}
		this._dynamicContext.save();
		this._dynamicContext.translate( 0 , this._baseRoot - ( this._canvasHeight + this._vBuffer  ) + this._window );
		
		this._root.visitFromTo( this._dynamicContext , this._staticContext , this._age - 1 , newAge );
		
		this._dynamicContext.restore();
		this._staticCanvas.style.top = (Math.round( this._vBuffer *100)/100)+"px";
		
		this._age = newAge;
	},
	
}
/**
 *@param {htmlElement} the element where to put the flower, Must have the width and height style property set, with px
 * @param {object} a set of option for the flower, see the controled example if you want to konw more about option
 * @param {boolean} if true, use it own animation caller ( with a requestAnimFrame ) if false, consider call the cycle method by yourself
 * @return {Flw.ControledFlower} the flower
 */
Flw.RampantFlower.create = function( divElement , option , run ){
	var rf = new Flw.RampantFlower();
	rf.init( divElement , option , run );
	return rf;
};

/**
 * A flower that grow as the tick method is called,. Great for a loading barre
 * At start the flower is at the 0 state, call tick(  dt ) to make it go to the 0+dt state. The flower is totaly grown at the state 1
 * Use a predictive interpoler to make the way between two tick smooth.
 */
Flw.ControledFlower = function(){};
Flw.ControledFlower.prototype = {
	
	_canvasHeight : 500,
	_canvasWidth : 500,
	
	_staticContext : null,
	_dynamicContext : null,
	
	_root : null,
	
	_age : 0,
	_endHatchin : 0,
	_predictiveInterpolar : null,
	init : function( divElement , option ){
		
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
		
		this._root = Flw.Branch.createSimple( {x:0,y:0} , Math.PI/2 , option || {} );	
		this._root.buildTotal();
		this._endHatchin = this._root.getHatchinTime();
		
		
		//
		this._predictiveInterpolar = Flw.PredictiveInterpolar.create({f:this.cycle,o:this},true);
	},
	tick : function( dt ){
		this._predictiveInterpolar.tick( dt );
	},
	cycle : function( dt ){
		
		newAge = this._age + dt * this._endHatchin;
		
		// draw
		
		this._dynamicContext.clearRect( -this._canvasWidth/2 , 0 , this._canvasWidth , this._canvasHeight );
		this._dynamicContext.save();
		this._staticContext.save();
		this._root.visitFromTo( this._dynamicContext , this._staticContext , this._age - 1 , newAge );
		this._dynamicContext.restore();
		this._staticContext.restore();
	
		this._age = newAge;
		
	},
};
/**
 *@param {htmlElement} the element where to put the flower, Must have the width and height style property set, with px
 * @param {object} a set of option for the flower, see the controled example if you want to konw more about option
 * @return {Flw.ControledFlower} the flower
 */
Flw.ControledFlower.create = function( divElement , option ){
	var rf = new Flw.ControledFlower();
	rf.init( divElement , option );
	return rf;
};

/**
 * a object that receive discrete call with a value parameter
 * is able to interpolate between the previous call and the next even if it doesnt know when the next will occur. Use basic estimation.
 * all the way between two points, make calls with the register callBack
 */
Flw.PredictiveInterpolar=function(){};
Flw.PredictiveInterpolar.prototype={
	_velocity:null,			// unity per ms, ( odre de grandeur 0.0001 ) pour un remplissage en 10s
	_estimateCursor:null,
	_reelCursor:null,
	beyond:0.3,			// the system is autorized to go beyond the last registered point
	minimalStep:0.005,		// the system make a callBack when the difference of quatum with the last callBack is greater than minimalStep
	catchIn:250,			// ms, estimate time to join the next point
	delta:200,				// the greater it is, the less reactive the system is, the more linear it seems ( in some cases )
	_callBack:null,
	_stack:null,
	init:function( callBack , run ){
		this._velocity=0;
		this._estimateCursor=0;
		this._reelCursor=0;
		this._callBack = callBack;
		this._stack = 0;
		if( run ){
			var self=this;
			(function(){
				var last = (new Date()).getTime();
				var cycle = function(){
					var t = (new Date()).getTime();
					self.cycle( t-last );
					last = t;
					if( self._estimateCursor < 1 )
						window.requestAnimFrame( function(){
							cycle();
						});
				};
				cycle();
			})();
		}
	},
	cycle:function(dt){
		// adapt the velocity
		var d=this._reelCursor-this._estimateCursor;
		if( d<0 ){
			// if the estimation is beyond the reel
			if( this.beyond + d < 0 )
				// if its too far beyond, cut the run
				this._velocity = 0;
			else
				// if its resonnably far, simply reduce the velocity
				this._velocity = Math.max(0, this._velocity / 1.1);
		}else{
			var velocityCatchIn = d/this.catchIn;
			var f=velocityCatchIn-this._velocity;
			this._velocity += f/this.delta;
		}
		
		// step
		this._stack+=dt*this._velocity;
		this._estimateCursor+=dt*this._velocity;
		
		if( this._stack > this.minimalStep ){
			this._callBack.f.call( this._callBack.o , this._stack );
			this._stack=0;
		}
	},
	tick:function(dc){
		this._reelCursor+=dc;
	},
}
Flw.PredictiveInterpolar.create=function( callBack ,run ){
	var e = new Flw.PredictiveInterpolar();
	e.init( callBack , run );
	return e;
}
	
	
	
