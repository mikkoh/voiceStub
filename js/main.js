requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});



requirejs( [ 'lib/jquery', 'parser/parser', 'ui/uiFactory', 'ui/uiCreationBtn', 'model/colours', 'ui/uiRecordPreview', 'ui/uiRecordEntry' ], 
function( $, Parser, UIFactory, UICreationBTN, colours, UIRecordPreview, UIRecordEntry ) {
	$( function(){
		if( 'webkitSpeechRecognition' in window) {
			var container = $( 'body' );

			var interimRecording = '';
			var finalRecording = '';

			var recog = new webkitSpeechRecognition();
			recog.continuous = true;
			recog.interimResults = true;

			console.log( recog );

			var parser = new Parser();
			
			var recordEntry = new UIRecordEntry( container );
			var classEntry = new UICreationBTN( container, 'CREATE A CLASS', colours.colClass );
			var functionEntry = new UICreationBTN( container, 'CREATE A FUNCTION', colours.colFunction );
			var parameterEntry = new UICreationBTN( container, 'ADD A PARAMETER', colours.colParameter );
			var recording = false;

			recordEntry.onRecordPress = function() {
				if( !recording ) {
					recog.lang = 'en-US';
					recog.start();
				} else {
					recog.stop();
				}
			};

			recordEntry.onMessageChange = function( msg ) {
				finalRecording = msg;

				parseTextField();
			};

			recordEntry.onRecordEnd = function( msg ) {
				finalRecording = msg;

				endParseTextField();
			};


			recordEntry.init();
			classEntry.init();
			functionEntry.init();
			parameterEntry.init();





			var classFunctionContainer = $( '<div id="classFunctionContainer"></div>' )
			.css( 'transform', 'scale(50%)')
			.appendTo( container );

			var scrollFade = $( '<div id="scrollFade"></div>' )
			.css( 'position', 'absolute' )
			.css( 'background-image', 'url(images/scrollFade.png)' )
			.css( 'height', 30 )
			.css( 'top', classFunctionContainer.offset().top )
			.css( 'width', '100%' )
			.appendTo( container );

			classFunctionContainer
			.css( 'overflow', 'scroll' )
			.css( 'padding-top', 10 )
			.css( 'height', $( window ).height() - classFunctionContainer.offset().top );

			console.log( classFunctionContainer[0] );

			var uiFactory = new UIFactory( classFunctionContainer );



			onResize();
			$( window ).resize( onResize );



			function endParseTextField() {
				classEntry.deActivate();
				classEntry.setValue('');
				functionEntry.deActivate();
				functionEntry.setValue('');
				parameterEntry.deActivate();
				parameterEntry.setValue('');

				uiFactory.addCommands( parser.parse( finalRecording ) );
			}

			function parseTextField() {
				var curParsedData = parser.parse( finalRecording );
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

			function applyParsedData( entry, parsedData ) {
				entry.activate();

				if( parsedData.parameters ) {
					entry.setValue( parsedData.parameters[ 0 ] );
				}				
			}
			
			function onResize() {
				classFunctionContainer
				.css( 'height', $( window ).height() - classFunctionContainer.offset().top );

				console.log( $(window).height(), classFunctionContainer.height() );
			}

			recog.onstart = function() { 
				recording = true;
				finalRecording = '';
				recordEntry.startRecord();
			}

			recog.onresult = function( ev ) { 
				var results = ev.results;

				finalRecording = '';
				interimRecording = '';

				for( var i = 0, len = results.length; i < len ; i++ ) {
					if( results[ i ].isFinal ) {
						finalRecording += results[ i ][ 0 ].transcript;
					} else {
						interimRecording += results[ i ][ 0 ].transcript;
					}
				}

				if( finalRecording != '' ) {
					recordEntry.setValue( finalRecording )
				} else {
					recordEntry.setValue( interimRecording )
				}

				parseTextField();
			}

			recog.onerror = function( ev ) { 
				console.log( 'ERROR', ev );

				recording = false;
				recordEntry.stopRecord();
				recordEntry.setError( ev );
			}

			recog.onend = function() { 
				recording = false;
				recordEntry.stopRecord();

				endParseTextField();
			}

			recog.onspeechstart = function() {
				console.log( 'sound start' );
			};

			recog.onspeechend = function() {
				console.log( 'sound end' );
			};
		}
	});
});