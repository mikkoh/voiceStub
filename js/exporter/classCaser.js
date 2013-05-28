define( [ 'exporter/camelCaser' ], function( camelCaser ) {
	return function( strToClassCase ) {
		var rVal = camelCaser( strToClassCase );

		return strToClassCase.charAt( 0 ).toUpperCase() + strToClassCase.substr( 1 );
	};
});