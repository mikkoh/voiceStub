requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});

requirejs(['lib/jquery', 'parser/parser'], 
function( $, Parser ) {
	$( function(){
		if( 'webkitSpeechRecognition' in window) {
			var recog = new webkitSpeechRecognition();
			var parser = new Parser();

			recog.onstart = function() { 
				document.getElementById( 'btnStart' ).innerHTML =  'STOP'; 
			}

			recog.onresult = function( ev ) { 
				var results = ev.results;

				for( var i = 0, len = results.length; i < len ; i++ ) {
					if( results[ i ].isFinal ) {
						console.log( results[ i ][ 0 ].transcript );
						parser.parse( results[ i ][ 0 ].transcript );
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