requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});



requirejs( [ 'lib/jquery', 'parser/parser', 'ui/uiFactory', 'ui/uiEntry' ], 
function( $, Parser, UIFactory, UIEntry ) {
	$( function(){
		if( 'webkitSpeechRecognition' in window) {
			var container = $( 'body' );

			var recog = new webkitSpeechRecognition();
			var parser = new Parser();
			var uiFactory = new UIFactory( container );


			var classEntry = new UIEntry( container, 'CREATE CLASS' );
			var functionEntry = new UIEntry( container, 'CREATE FUNCTION' );
			var parameterEntry = new UIEntry( container, 'ADD PARAMETER' );

			classEntry.init();
			functionEntry.init();
			parameterEntry.init();

			uiFactory.addCommands( parser.parse( 'create a class named mikko with a function named draw' ) );
			uiFactory.addCommands( parser.parse( 'add a function named program to mikko with a parameter called language' ) );

			var txtField = $( '#txtField' );

			txtField.keyup( function( ev ) {
				if( ev.which == 13 ) {
					txtField.blur();

					uiFactory.addCommands( parser.parse( txtField.val() ) );
					console.log( parser.parse( txtField.val() ) );

					classEntry.deActivate();
					classEntry.setValue('');
					functionEntry.deActivate();
					functionEntry.setValue('');
					parameterEntry.deActivate();
					parameterEntry.setValue('');

					txtField.val('');
				} else {
					var curParsedData = parser.parse( txtField.val() );
					var hasClass = false;
					var hasFunction = false;
					var hasParameter = false;

					for( var i = 0; i < curParsedData.length; i++ ) {
						switch( curParsedData[ i ].func ) {
							case 'createClass':
								applyParsedData( classEntry, curParsedData[ i ] );
								hasClass = true;
							break;

							case 'createFunction':
								applyParsedData( functionEntry, curParsedData[ i ] );
								hasFunction = true;
							break;

							case 'addParameter':
								applyParsedData( parameterEntry, curParsedData[ i ] );
								hasParameter = true;
							break;
						}
					}

					if( !hasClass ) {
						classEntry.deActivate();
						classEntry.setValue('');
					}

					if( !hasFunction ) {
						functionEntry.deActivate();
						functionEntry.setValue('');
					}

					if( !hasParameter ) {
						parameterEntry.deActivate();
						parameterEntry.setValue('');
					}
				}
			});

			function applyParsedData( entry, parsedData ) {
				entry.activate();

				if( parsedData.parameters ) {
					entry.setValue( parsedData.parameters[ 0 ] );
				}				
			}
			



			recog.onstart = function() { 
				document.getElementById( 'btnStart' ).innerHTML =  'STOP'; 
			}

			recog.onresult = function( ev ) { 
				var results = ev.results;

				for( var i = 0, len = results.length; i < len ; i++ ) {
					if( results[ i ].isFinal ) {
						console.log( results[ i ][ 0 ].transcript );
						uiFactory.addCommands( parser.parse( results[ i ][ 0 ].transcript ) );
					}
				}
			}

			recog.onerror = function( ev ) { 
				document.getElementById( 'btnStart' ).innerHTML =  'START'; 
			}

			recog.onend = function() { 
				document.getElementById( 'btnStart' ).innerHTML =  'START'; 
			}

			document.getElementById( 'btnStart' ).onclick = function() {
				recog.lang = 'en-US';
				recog.start();
			}
		}
	});
});