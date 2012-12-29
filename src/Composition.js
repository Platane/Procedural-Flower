/**
 * @author platane / http://arthur-brongniart.fr/
 */
var Flw = Flw || {};

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
	
	
	