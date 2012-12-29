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


