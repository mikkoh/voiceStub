define( function() {
	var onClick = function( ev ) {
		var startVal = $( this ).html();

		var onFinish = function() {
			$( this )
			.attr( 'contenteditable', false )
			.unbind( 'keydown', onKeyDown )
			.unbind( 'blur', onFinish )
			.bind( 'click', onClick );

			var nameSplit = $( this ).html().split( /<\/?[^>]*>/).join(' ').split( '\n' ).join( ' ' ).split(/\W/).join(' ').split( ' ' );

			//now we want to camel case this name
			for( var i = 1, len = nameSplit.length; i < len; i++ ) {
				nameSplit[ i ] = nameSplit[ i ].charAt( 0 ).toUpperCase() + nameSplit[ i ].substr( 1 );
			}

			var nName = nameSplit.join( '' );

			if( nName == '' ) {
				nName = startVal;
			}

			$( this ).html( nName );
		};


		var onKeyDown = function( ev ) {
			//enter key hit
			switch( ev.which )
			{
				//Enter Key
				case 13:
					$( this ).blur();
				break;

				//Space key
				case 32:
					ev.preventDefault();
				break;
			}
		};

		$( this )
		.attr( 'contenteditable', true )
		.bind( 'keydown', onKeyDown )
		.bind( 'blur', onFinish )
		.unbind( 'click', onClick );
	};

	return onClick;
} );