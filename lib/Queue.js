


	var   Class 		= require( "ee-class" )
		, EventEmitter 	= require( "ee-event-emitter" )
		, type 			= require( "ee-types" )
		, log 			= require( "ee-log" );





	module.exports = new Class( {
		inherits: EventEmitter

		, itemqueue: 	[]
		, max: 		1000000
		, ttl: 		5000


		, init: function( options ){
			if ( options.max ) this.max = options.max;
			if ( options.ttl ) this.ttl = options.ttl;
		}


		, get: function(){
			if ( this.length > 0 ) return this.itemqueue.shift().item;
			else return null;
		}


		, queue: function( item ){
			if ( this.length < this.max ){
				this.itemqueue.push( { item: item, timeout: Date.now() + this.ttl } );
				if ( type.undefined( this.timeout ) ) this.doTimeout();
				return true;
			}
			else this.emit( "error", new Error( "the queue holds currently «"+this.length+"» which is the configured maximum!"  ).setName( "OverflowException" ) );
			return false;
		}


		, remove: function( item ){
			var i = this.length;
			while( i-- ) if ( this.itemqueue[ i ].item === item ) return this.itemqueue.splice( i, 1 )[ 0 ];
			return null;
		}


		, doTimeout: function(){
			while( this.length > 0 && this.itemqueue[ 0 ].timeout <= Date.now() ){
				this.emit( "timeout", this.itemqueue.shift().item );
			}

			if ( this.length > 0 ) this.timeout = setTimeout( this.doTimeout.bind( this ), this.itemqueue[ 0 ].timeout - Date.now() );
		}


		, get length(){
			return this.itemqueue.length;
		}
	} );