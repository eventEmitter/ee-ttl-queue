


	var Queue = require( "./" )
		, log = require( "ee-log" );


	// queue with items which expire after 100 msec. The queue overflows 
	// after 1'000'000 items, but you can configure that value via the
	// «max» attribute. the queue cannot hold unlimited items, so settings
	// «max» to 0 will cause the queue to reject new items
	var q = new Queue( { 
		  ttl: 1000
		, max: 9 
		, on: {
			timeout: function( item ){ log( item ); }
			, error: function( err, item ){ log( err, item ); }
		}
	} );


	var i = 10;
	while( i-- ){
		q.queue( i );
	}


