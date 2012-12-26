var TimeLine = function( max_fps ){
	
	
	this.run;
	this.lastTime;
	
	// fps counter relative
	this.max_fps = max_fps;
	if( !this.max_fps )
		this.max_fps = 60;
	if( this.max_fps <= 0.01 )
		this.max_fps = 0.01;
	this.plage = 5;
	this.averageFps = this.max_fps;
	
	// event
	this.listener = {};
	this.listener.eachFrame = [];
	this.listener.start = [];
	this.listener.stop = [];
}
TimeLine.prototype = {
	constructor : TimeLine ,
	start : function(){
		this.setRun( true );
	},
	stop : function(){
		this.setRun( false );
	},
	setRun : function(val){
		if( !val )
			this.run = !this.run;
		else
			this.run = val;
			
		
		if( this.run ){
		
			this.lastTime = new Date().getTime();
		
			var self = this;
			window.requestAnimFrame( function(){
				self.appelFrame.call( self ); 
			} );
			
			for( var i = 0 ; i < this.listener[ "start" ].length ; i ++ )
				this.listener[ "start" ][ i ].callBack.call( this.listener[ "start" ][ i ].o  );
		} else
			for( var i = 0 ; i < this.listener[ "stop" ].length ; i ++ )
				this.listener[ "stop" ][ i ].callBack.call( this.listener[ "stop" ][ i ].o  );
	},
	appelFrame : function(){
	     var time = new Date().getTime();
	     var timeDiff = time - this.lastTime;
		 
		 if( timeDiff > 1000/this.max_fps ){
			this.averageFps = ( ( this.plage-1) * this.averageFps   +    ( 1/timeDiff *1000) ) /  this.plage ;
			
			this.onEnterFrame( timeDiff );
			this.lastTime = time;
		 }
		 
		var self = this;
		if( this.run )
			window.requestAnimFrame( function(){
				self.appelFrame.call( self ); 
			} );
		
	},
	getAverageFps : function(){
		return this.averageFps;
	},
	
	
	onEnterFrame : function( delta ){
		
		for( var i = 0 ; i < this.listener[ "eachFrame" ].length ; i ++ )
			this.listener[ "eachFrame" ][ i ].callBack.call( this.listener[ "eachFrame" ][ i ].o , delta );
	},
	
	// event
	addListener : function( type , callBack , o ){
		if( this.listener[ type ] == null )
			return false;
		this.listener[ type ].push( { callBack : callBack , o:o } );
		return { type:type , callBack :callBack , o:o };
	},
	removeListener : function(  ){
		if(  arguments.length == 0 ){
			for( var t in this.listener )
				this.listener[ t ] = [];
			return true;
		}
		if(  arguments.length == 1 ){
			if( typeof(  arguments[0] ) == String ){
				this.listener[  arguments[0] ] = [];
				return true;
			}else
				return this.removeUniqueListener( arguments[0] );
		}
		if(  arguments.length > 1 ){
			return this.removeUniqueListener( arguments[1] );
		}
		return false;
	},
	removeUniqueListener : function( r ){
			if( !r.type || !r.o || !r.callBack || this.listener[ r.type ] == null )
				return false;
			for( var i = 0 ; i < this.listener[ r.type ].length ; i ++ )
				if( r.o == this.listener[ r.type ][ i ].o && r.callBack == this.listener[ r.type ][ i ].callBack ){
					this.listener[ r.type ].splice( i , 1 );
					return true;
				}
			return true;
	},
	notifyListener : function ( type ){
		for( var i = 0 ; i < this.listener[ type ].length ; i ++ )
			this.listener[ type ][ i ].callBack.call( this.listener[ type ][ i ].o  );
		
	},
	
	// tools
	genereWakeUp : function( timer , callBack , o ){
		return new this.wakeMeUp( timer , callBack , o , this );
	},
	genereRepeat : function( timer , callBack , o ){
		return new this.repeat( timer , callBack , o , this );
	},
	wakeMeUp : function( timer , callBack , o , timeLine ){
		this.o = o; 
		this.callBack = callBack; 
		this.timer = timer ; 
		this.timeLine = timeLine;
		this.caps;
		if( !this.__proto__.init ){
			this.__proto__.everyTime = function( frame ){
				this.timer -= frame; 
				if( this.timer <= 0 ){
					this.timeLine.removeListener( this.caps );
					this.callBack.call( this.o , frame ); 
				}  
			}
			this.__proto__.init = true;
		}
		if( this.timeLine )
			this.caps = this.timeLine.addListener( "eachFrame" , this.everyTime , this );
		return this.caps;
	},
	repeat : function( timer , callBack , o , timeLine ){
		this.o = o; 
		this.callBack = callBack; 
		this.timer = timer ; 
		this.timeLine = timeLine;
		this.caps;
		if( !this.__proto__.init ){
			this.__proto__.everyTime = function( frame ){
				this.timer -= frame; 
				this.callBack.call( this.o , frame ); 
				if( this.timer <= 0 )
					this.timeLine.removeListener( this.caps );
			}
			this.__proto__.init = true;
		}
		if( this.timeLine )
			this.caps = this.timeLine.addListener( "eachFrame" , this.everyTime , this );
		return this.caps;
	},
	interrupt : function( caps ){
		this.removeListener( caps );
	}
}
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