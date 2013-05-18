define( [ 'lib/jquery', 'model/colours', 'lib/TweenLite' ], function( $, colours, TweenLite ) {
	var UICreationBTN = function( container, copy, colour ) {
		if( container === undefined ) {
			throw new Error( 'You must pass in a container that Creation Buttons can go in' );
		}

		this.parentContainer = container;
		this.copy = copy === undefined ? 'CLASS' : copy;
		this.colour = colour === undefined ? colours.colClass : colour;
	};

	UICreationBTN.prototype.parentContainer = null;
	UICreationBTN.prototype.container = null;
	UICreationBTN.prototype.btn = null;
	UICreationBTN.prototype.copy = null;
	UICreationBTN.prototype.colour = colours.colClass;
	UICreationBTN.prototype.copyContainer = null;
	UICreationBTN.prototype.bgSelected = null;
	UICreationBTN.prototype.input = null;
	UICreationBTN.prototype.inputBG = null;

	UICreationBTN.prototype.init = function() {
		this.container = $( '<div>' +
								'<div id="button">' +
								 	'<div id="copy">' + this.copy + '</div>' +
									'<img id="selected" src="images/creationBGSelected.png" width="237" height="74" />' +
							    '</div>' +
							    '<div id="input"></div>' +
							    '<img id="inputBG" src="images/creationEntryBG.png" width="365" height="25" />' +
							'</div>').appendTo( this.parentContainer );
		this.btn = this.container.find( '#button' );
		this.copyContainer = this.container.find( '#copy' );
		this.bgSelected = this.container.find( '#selected' );
		this.input = this.container.find( '#input' );
		this.inputBG = this.container.find( '#inputBG' );

		this.container
		.css( 'margin-bottom', 10 )
		.css( 'margin-top', 10 )
		.css( 'position', 'relative' );

		this.btn
		.css( 'color', this.colour )
		.css( 'font-size', 15 )
		.css( 'width', 213 )
		.css( 'height', 47 )
		.css( 'display', 'inline-block')
		.css( 'position', 'relative' );

		this.copyContainer
		.css( 'padding', 14 );

		this.bgSelected
		.css( 'position', 'absolute' )
		.css( 'top', -15 )
		.css( 'left', -12 )
		.css( 'visibility', 'hidden' )
		.css( 'opacity', 0 );

		this.input
		.css( 'color', this.colour )
		.css( 'font-size', 30 )
		.css( 'overflow', 'hidden' )
		.css( 'padding-left', 10 )
		.css( 'display', 'inline-block');

		this.inputBG
		.css( 'position', 'absolute' )
		.css( 'top', 20 )
		.css( 'left', 214);
	};

	UICreationBTN.prototype.activate = function() {
		TweenLite.to( this.bgSelected, 0.5, { autoAlpha: 1} );
	};

	UICreationBTN.prototype.deActivate = function() {
		TweenLite.to( this.bgSelected, 0.5, { autoAlpha: 0} );
	};

	UICreationBTN.prototype.setValue = function( value ) {
		this.input.html( value );
	};

	return UICreationBTN;
});