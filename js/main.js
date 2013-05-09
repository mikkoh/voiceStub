requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});



requirejs( ['lib/jquery', 'parser/parser', 'ui/uiFactory'], 
function( $, Parser, UIFactory ) {
	$( function(){
		if( 'webkitSpeechRecognition' in window) {
			var recog = new webkitSpeechRecognition();
			var parser = new Parser();
			var uiFactory = new UIFactory( $('body') );

			uiFactory.addCommands( parser.parse( 'add a class called cat with a function called meow with a parameter called sound' ) );


			/*
			uiFactory.addCommands( parser.parse( 'add a class called cat with a function called meow with a parameter called sound' ) );
			uiFactory.addCommands( parser.parse( 'add a function called lick to a class named cat' ) );
			uiFactory.addCommands( parser.parse( 'add a parameter called amount to lick' ) );
			uiFactory.addCommands( parser.parse( 'add a parameter called dampness to lick' ) );
			uiFactory.addCommands( parser.parse( 'add a class called dog with a function called woof with a parameter called sound' ) );
			*/

			/*
			console.log( 'add a class called cat' );
			parser.parse( 'add a class called cat' );
			console.log( '------------' );

			console.log( 'create a class named dog' );
			parser.parse( 'create a class named dog' );
			console.log( '------------' );

			console.log( 'add a class named giraffe' );
			parser.parse( 'add a class named giraffe' );
			console.log( '------------' );

			console.log( 'add a class called zebra' );
			parser.parse( 'add a class called zebra' );
			console.log( '------------' );

			console.log( 'subtract a class called zebra' );
			parser.parse( 'subtract a class called zebra' );
			console.log( '------------' );


			console.log( '********* END OF SIMPLE CLASS CREATION **********' );



			console.log( 'add a function called foo' );
			parser.parse( 'add a function called foo' );
			console.log( '------------' );

			console.log( 'create a function named bar' );
			parser.parse( 'create a function named bar' );
			console.log( '------------' );

			console.log( 'add a function named stool' );
			parser.parse( 'add a function named stool' );
			console.log( '------------' );

			console.log( 'add a function called chair' );
			parser.parse( 'add a function called chair' );
			console.log( '------------' );

			console.log( '********* END OF SIMPLE FUNCTION CREATION **********' );




			console.log( 'create a class called cat with a function called wild thing' );
			parser.parse( 'create a class called cat with a function called wild thing' );
			console.log( '------------' );

			console.log( 'create a class named cat and add a function named meow' );
			parser.parse( 'create a class named cat and add a function named meow' );
			console.log( '------------' );

			console.log( 'add a function named meow to cat' );
			parser.parse( 'add a function named meow to cat' );
			console.log( '------------' );

			console.log( 'delete a function named meow from cat' );
			parser.parse( 'delete a function named meow from cat' );
			console.log( '------------' );

			console.log( 'add a parameter called meow to a function called foo' );
			parser.parse( 'add a parameter called meow to a function called foo' );
			console.log( '------------' );

			console.log( 'add a function called meow to a class called cat with a parameter called three' );
			parser.parse( 'add a function called meow to a class called cat with a parameter called three' );
			console.log( '------------' );



			console.log( 'create a class called cat with functions one two and three' ); 
			parser.parse( 'create a class called cat with functions one two and three' );
			console.log( '------------' );

			console.log( 'add a function named meow to cat with parameters one two and three' );
			parser.parse( 'add a function named meow to cat with parameters one two and three' );
			console.log( '------------' );
			*/


			


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