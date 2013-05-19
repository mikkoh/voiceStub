define( [ 'lib/jquery', 'ui/uiRecordBtn' ], function( $, UIRecordBtn ) {
	var UIRecordEntry = function( container ) {
		this.parentContainer = container;
	};

	UIRecordEntry.prototype.parentContainer = null;
	UIRecordEntry.prototype.container = null;
	UIRecordEntry.prototype.btnRecord = null;
	UIRecordEntry.prototype.entry = null;
	UIRecordEntry.prototype.entryLine = null;

	UIRecordEntry.prototype.init = function() {
		this.container = $( '<div></div>' ).appendTo( this.parentContainer );

		this.entryLine = $( '<img id="entryLine" src="images/longEntry.png" width="578" height="29" />' ).appendTo( this.container );
		this.btnRecord = new UIRecordBtn( this.container );
		this.btnRecord.init();
		this.entry = $( '<div contenteditable="true"></div>' ).appendTo( this.container );

		this.entry.html( 'CREATE A CLASS CALLED MIKKO' );


		this.container
		.css( 'position', 'relative' );

		this.entryLine
		.css( 'top', 7 )
		.css( 'left', 0 )
		.css( 'position', 'absolute' );

		this.btnRecord.container
		.css( 'display', 'inline-block' );		

		this.entry
		.css( 'vertical-align', 'top' )
		.css( 'margin-top', 13 )
		.css( 'margin-left', 5 )
		.css( 'z-index', 1 )
		.css( 'display', 'inline-block' );
	};

	return UIRecordEntry;
});