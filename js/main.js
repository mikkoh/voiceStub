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


			var txtField = $( '#txtField' );
			txtField.keyup( function() {
				console.log( parser.parse( txtField.val() ) );
			});
			




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