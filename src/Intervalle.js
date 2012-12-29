/**
 * @author platane / http://arthur-brongniart.fr/
 */
var Flw = Flw || {};

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

