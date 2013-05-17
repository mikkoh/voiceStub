define( [ 'lib/jquery' ], function( $ ) {
	var UIRecordPreview = function( container ) {
		this.parentContainer = container;
	};

	UIRecordPreview.prototype.parentContainer = null;
	UIRecordPreview.prototype.container = null;
	UIRecordPreview.prototype.interimOut = null;
	UIRecordPreview.prototype.finalOut = null;

	UIRecordPreview.prototype.init = function() {
		this.container = $( '<div><span id="final"></span><span id="interim"></span></div>' ).appendTo( this.parentContainer );

		this.interimOut = this.container.find( '#interim' )
		.css( 'color', '#00F' );
		this.finalOut = this.container.find( '#final' );
	};

	UIRecordPreview.prototype.clear = function() {
		this.interimOut.html( '' );
		this.finalOut.html( '' );
	};

	UIRecordPreview.prototype.setInterim = function( value ) {
		this.interimOut.html( value );
	};

	UIRecordPreview.prototype.setFinal = function( value ) {
		this.finalOut.html( value );
	};

	return UIRecordPreview;
});