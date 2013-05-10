define( function() {
	var UIEntry = function( container, buttonCopy ) {
		this.parentContainer = container;
		this.buttonCopy = buttonCopy;
	};

	UIEntry.prototype.container = null;
	UIEntry.prototype.parentContainer = null;
	UIEntry.prototype.buttonCopy = null;
	UIEntry.prototype.button = null;
	UIEntry.prototype.entry = null;

	UIEntry.prototype.init = function() {
		this.container = $( '<div><div id="button">' + this.buttonCopy + '</div><input id="entry" type="text"></div></div>' ).appendTo( this.parentContainer );
		this.button = this.container.find( '#button' );
		this.entry = this.container.find( '#entry' );

		this.button
		.css( 'border', '1px solid #000' )
		.css( 'padding', 5	 )
		.css( 'display', 'inline-block' );
	};

	UIEntry.prototype.activate = function() {
		this.button
		.css( 'background', '#CAFE00' );
	};

	UIEntry.prototype.deActivate = function() {
		this.button
		.css( 'background', '#FFF' );
	};

	UIEntry.prototype.setValue = function( value ) {
		this.entry.val( value );
	};

	UIEntry.prototype.getValue = function() {
		return this.entry.val();
	};

	return UIEntry;
});