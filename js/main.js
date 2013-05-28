requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});



requirejs( [ 'lib/jquery', 'parser/parser', 'ui/uiFactory', 'ui/uiCreationBtn', 'model/colours', 'ui/uiRecordPreview', 'ui/uiRecordEntry', 'exporter/exporterJavascript' ], 
function( $, Parser, UIFactory, UICreationBTN, colours, UIRecordPreview, UIRecordEntry, ExporterJavascript ) {
	$( function(){
		if( 'webkitSpeechRecognition' in window) {
			var parser = new Parser();
			parser.addSeparator( 'with' );
			parser.addSeparator( 'and' );

			parser.addNoun( 'class' );
			parser.addNoun( 'function' );
			parser.addNoun( 'parameter' );

			parser.addPreposition( 'to a class called' );
			parser.addPreposition( 'to a class named' );
			parser.addPreposition( 'to a function called' );
			parser.addPreposition( 'to a function named' );
			parser.addPreposition( 'to' );
			parser.addPreposition( 'on a class called' );
			parser.addPreposition( 'on a class named' );
			parser.addPreposition( 'on a function called' );
			parser.addPreposition( 'on a function named' );
			parser.addPreposition( 'on' );
			parser.addPreposition( 'from a class called' );
			parser.addPreposition( 'from a class named' );
			parser.addPreposition( 'from a function called' );
			parser.addPreposition( 'from a function named' );
			parser.addPreposition( 'from' );

			parser.addVerbForNouns( 'create', 'class', 'function', 'parameter' );
			parser.addVerbForNouns( 'add', 'class', 'function', 'parameter' );
			parser.addVerbForNouns( 'delete', 'class', 'function', 'parameter' );
			parser.addVerbForNouns( 'remove', 'class', 'function', 'parameter' );
			parser.addVerbForNouns( 'subtract', 'class', 'function', 'parameter' );

			parser.addLearningKeyword( 'called' );
			parser.addLearningKeyword( 'named' );

			parser.addDefaultVerbForNoun( 'class', 'add' );
			parser.addDefaultVerbForNoun( 'function', 'add' );
			parser.addDefaultVerbForNoun( 'parameter', 'add' );

			parser.addAssociation( 'class', 'create', 'createClass' );
			parser.addAssociation( 'class', 'add', 'createClass' );
			parser.addAssociation( 'class', 'delete', 'deleteClass' );
			parser.addAssociation( 'class', 'remove', 'deleteClass' );
			parser.addAssociation( 'class', 'subtract', 'deleteClass' );

			parser.addAssociation( 'function', 'create', 'createFunction' );
			parser.addAssociation( 'function', 'add', 'createFunction' );
			parser.addAssociation( 'function', 'delete', 'deleteFunction' );
			parser.addAssociation( 'function', 'remove', 'deleteFunction' );
			parser.addAssociation( 'function', 'subtract', 'deleteFunction' );

			parser.addAssociation( 'parameter', 'create', 'addParameter' );
			parser.addAssociation( 'parameter', 'add', 'addParameter' );
			parser.addAssociation( 'parameter', 'delete', 'deleteParameter' );
			parser.addAssociation( 'parameter', 'remove', 'deleteParameter' );
			parser.addAssociation( 'parameter', 'subtract', 'deleteParameter' );







			
			var container = $( 'body' );

			var interimRecording = '';
			var finalRecording = '';

			var recog = new webkitSpeechRecognition();
			recog.continuous = true;
			recog.interimResults = true;

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

				finalRecording = finalRecording.split( '&nbsp;' ).join( ' ' );
				uiFactory.addCommands( parser.parse( finalRecording, true ) );
			}

			function parseTextField() {
				finalRecording = finalRecording.split( '&nbsp;' ).join( ' ' );
				
				var curParsedData = parser.parse( finalRecording, false );
				var hasClass = false;
				var hasFunction = false;
				var hasParameter = false;

				console.log( curParsedData );

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

				if( parsedData.parameter ) {
					entry.setValue( parsedData.parameter );
				}				
			}
			
			function onResize() {
				classFunctionContainer
				.css( 'height', $( window ).height() - classFunctionContainer.offset().top );
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



			finalRecording = 'create a class called mikko with a function called testing this thing with a parameter called a lot';
			endParseTextField();

			finalRecording = 'create a class called matti with a function called testing this thing with a parameter called a lot';
			endParseTextField();

			finalRecording = 'create a function called testing with a parameter called open';
			endParseTextField();

			var jsExporter = new ExporterJavascript();
			console.log( jsExporter.getString( uiFactory.getObjectRepresentation() ) );
		}
	});
});