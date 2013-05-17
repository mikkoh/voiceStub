requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});



requirejs( [ 'lib/jquery', 'parser/parser', 'ui/uiFactory', 'ui/uiCreationBtn', 'model/colours', 'ui/uiRecordPreview' ], 
function( $, Parser, UIFactory, UICreationBTN, colours, UIRecordPreview ) {
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
			var uiFactory = new UIFactory( container );


			var recordingPreview = new UIRecordPreview( container );
			var classEntry = new UICreationBTN( container, 'CREATE A CLASS', colours.colClass );
			var functionEntry = new UICreationBTN( container, 'CREATE A FUNCTION', colours.colFunction );
			var parameterEntry = new UICreationBTN( container, 'ADD A PARAMETER', colours.colParameter );

			recordingPreview.init();
			classEntry.init();
			functionEntry.init();
			parameterEntry.init();

			// uiFactory.addCommands( parser.parse( 'create a class named mikko with a function named draw' ) );
			// uiFactory.addCommands( parser.parse( 'add a function named program to mikko with a parameter called language' ) );

			// uiFactory.addCommands( parser.parse( 'create a class named teppo with a function named photograph' ) );
			// uiFactory.addCommands( parser.parse( 'add a function named bike to teppo with a parameter called speed' ) );
			function endParseTextField() {
				classEntry.deActivate();
				classEntry.setValue('');
				functionEntry.deActivate();
				functionEntry.setValue('');
				parameterEntry.deActivate();
				parameterEntry.setValue('');

				recordingPreview.clear();
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
			
			console.log( chrome );
			var searchBox = chrome.searchBox;
				searchBox.onchange = function() {
				  if (this.selectionStart == this.selectionEnd &&
				      this.selectionStart == this.value.length)
				    alert('Cursor is at end of input');

				  alert('Setting suggestions for: ' + this.value);
				  this.setSuggestions({
				    suggestions: [
				      { value: "one"
				      },
				      { value: "two"
				      }
				    ]
				  });
				}
				searchBox.onsubmit = function() {
				  alert('User searched for: ' + this.value);
				}
				searchBox.oncancel = function() {
				  alert('Query when user cancelled: ' + this.value);
				}
				searchBox.onresize = function() {
				  alert('Resized to: ' +
				        [this.x,
				         this.y,
				         this.width,
				         this.height].join(','));
				}


			recog.onstart = function() { 
				recording = true;
				finalRecording = '';
				document.getElementById( 'btnStart' ).innerHTML =  'STOP'; 
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

				console.log( finalRecording );
				recordingPreview.setInterim( interimRecording );
				recordingPreview.setFinal( finalRecording );

				parseTextField();
			}

			recog.onerror = function( ev ) { 
				console.log( 'ERROR', ev );

				recording = false;
				document.getElementById( 'btnStart' ).innerHTML =  'START'; 
			}

			recog.onend = function() { 
				recording = false;
				document.getElementById( 'btnStart' ).innerHTML =  'START'; 

				endParseTextField();
			}

			recog.onspeechstart = function() {
				console.log( 'sound start' );
			};

			recog.onspeechend = function() {
				console.log( 'sound end' );
			};

			var recording = false;
			document.getElementById( 'btnStart' ).onclick = function() {
				if( !recording ) {
					recog.lang = 'en-US';
					recog.start();
				} else {
					recog.stop();
				}
			}
		}
	});
});