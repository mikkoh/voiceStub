define( function() {
	return function( strToCamelCase ) {
		var splitItem = strToCamelCase.split( ' ' );

		for( var i = 0, len = splitItem.length; i < len; i++ ) {
			if( i > 0 ) {
				splitItem[ i ] = splitItem[ i ].charAt( 0 ).toUpperCase() + splitItem[ i ].substr( 1 ).toLowerCase();
			} else {
				splitItem[ i ] = splitItem[ i ].toLowerCase();	
			}
		}

		return splitItem.join( '' );
	};
});