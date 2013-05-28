define( function() {
	return function( numTabs ) {
		var rVal = '';

		for( var i = 0; i < numTabs; i++ ) {
			rVal += '\t';
		}

		return rVal;
	}
});