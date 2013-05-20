define( [ 'lib/jquery', 'ui/uiRecordBtn' ], function( $, UIRecordBtn ) {
	var UIRecordEntry = function( container ) {
		this.parentContainer = container;
	};

	UIRecordEntry.prototype.startCopy = 'CLICK RECORD OR BEGIN TYPING HERE';
	UIRecordEntry.prototype.onRecordPress = null;
	UIRecordEntry.prototype.onMessageChange = null;
	UIRecordEntry.prototype.onRecordEnd = null;
	UIRecordEntry.prototype.parentContainer = null;
	UIRecordEntry.prototype.container = null;
	UIRecordEntry.prototype.btnRecord = null;
	UIRecordEntry.prototype.entry = null;
	UIRecordEntry.prototype.entryLine = null;
	UIRecordEntry.prototype.hadError = false;

	UIRecordEntry.prototype.init = function() {
		this.container = $( '<div></div>' ).appendTo( this.parentContainer );

		this.entryLine = $( '<img id="entryLine" src="images/longEntry.png" width="578" height="29" />' ).appendTo( this.container );
		this.btnRecord = new UIRecordBtn( this.container );
		this.btnRecord.init();
		this.entry = $( '<div id="entryLine" contenteditable="true">' + this.startCopy + '</div>' ).appendTo( this.container );


		this.container
		.css( 'position', 'relative' );

		this.entryLine
		.css( 'top', 7 )
		.css( 'left', 0 )
		.css( 'z-index', 0 )
		.css( 'position', 'absolute' );


		this.btnRecord.container
		.css( 'display', 'inline-block' );		

		this.entry
		.css( 'vertical-align', 'top' )
		.css( 'top', 13 )
		.css( 'left', 5 )
		.css( 'z-index', 1 )
		.css( 'position', 'relative' )
		.css( 'text-transform', 'uppercase' )
		.css( 'overflow', 'hidden' )
		.css( 'width', 573 )
		.css( 'display', 'inline-block' );

		this.entry.bind( 'keydown', this.onEntryChange.bind( this ) );
		this.entry.bind( 'keyup', this.onEntryChanged.bind( this ) );
		this.entry.bind( 'focus', this.onEntryFocus.bind( this ) );
		this.entry.bind( 'blur', this.onEntryBlur.bind( this ) );

		this.btnRecord.container.click( this.onRecordPress );
	};

	UIRecordEntry.prototype.startRecord = function() {
		this.btnRecord.startRecord();
	};

	UIRecordEntry.prototype.stopRecord = function() {
		this.btnRecord.stopRecord();
	};

	UIRecordEntry.prototype.setValue = function( value ) {
		this.entry.html( value );
	};

	UIRecordEntry.prototype.setError = function( errorCode ) {
		this.hadError = true;
		var value = '';

		switch( errorCode.error ) {
			case 'network':
				value = 'CONNECT TO THE INTERNET TO USE VOICE RECOGNITION';
			break;

			default:
				value = 'THERE WAS AN ERROR WHILE ATTEMPTING TO RECOGNIZE YOUR VOICE';
			break;
		}

		this.entry.html( value );
		this.entry.css( 'color', '#a57c6b' );
	};

	UIRecordEntry.prototype.onEntryChange = function( ev ) {
		if( ev.which == 13 ) {
			ev.preventDefault();

			this.entry.blur();
		}
	};

	UIRecordEntry.prototype.onEntryChanged = function( ev ) {
		this.onMessageChange( this.entry.html() );
	};

	UIRecordEntry.prototype.onEntryFocus = function() {
		this.startRecord();

		if( this.hadError || this.entry.html() == this.startCopy ) {
			this.entry.html( ' ' );
		}

		this.entry.css( 'color', '#7a7775' )
	};

	UIRecordEntry.prototype.onEntryBlur = function() {
		this.stopRecord();

		if( this.entry.html().split( ' ' ).join('').split( '&nbsp;' ).join( '' ).split( '<br>' ).join( '' ) != '' ) {
			this.onRecordEnd( this.entry.html() );
		}

		this.entry.html( this.startCopy );
	};

	return UIRecordEntry;
});