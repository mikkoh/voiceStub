define( [ 'exporter/camelCaser', 'exporter/classCaser', 'exporter/getTabs' ], function( camelCaser, classCaser, getTabs ) {

	function getParameterString( name, object ) {
		return camelCaser( name );
	}

	function getFunctionString( name, object, tabAmount, className ) {
		var rVal = null;
		var tabs = getTabs( tabAmount );
		var functionName = camelCaser( name );

		if( className ) {
			rVal = tabs + className + '.prototype.' + functionName + ' = function(';
		} else {
			rVal = tabs + 'function ' + functionName + '(';
		}

		if( object.children ) {
			var addedParameter = false;

			for( var i in object.children ) {
				rVal += ' ' + getParameterString( i, object.children[ i ] ) + ', ';

				addedParameter = true;
			}

			if( addedParameter ) {
				rVal = rVal.substr( 0, rVal.length - 2 ) + ' ';
			}
		}

		rVal += ') { };\n\n'

		return rVal;
	}

	function getClassString( name, object, tabAmount ) {
		var tabs = getTabs( tabAmount );
		var className = classCaser( name );
		
		var rVal = tabs + 'var ' + className + ' = ' + 'function() { };\n\n';

		if( object.children ) {
			for( var i in object.children ) {
				rVal += getFunctionString( i, object.children[ i ], tabAmount, className );
			}
		}

		rVal += '\n\n';

		return rVal;
	}


	var Exporter = function() { };

	Exporter.prototype.getString = function( objectRep ) {
		var rVal = '';

		for( var i in objectRep ) {
			if( objectRep[ i ].type == 'class' ) {
				rVal += getClassString( i, objectRep[ i ] );
			} else if( objectRep[ i ].type == 'function' ) {
				rVal += getFunctionString( i, objectRep[ i ] );
			}
		}

		return rVal;
	};

	return Exporter;
});