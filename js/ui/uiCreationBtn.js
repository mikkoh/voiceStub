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
	UICreationBTN.prototype.bgUnselected = null;
	UICreationBTN.prototype.input = null;

	UICreationBTN.prototype.init = function() {
		this.container = $( '<div>' +
								'<div id="button">' +
								 	'<div id="copy">' + this.copy + '</div>' +
									'<img id="selected" src="images/creationBGSelected.png" width="254" height="93" />' +
									'<img id="unselected" src="images/creationBG.png" width="213" height="47" />' +
							    '</div>' +
							    '<div id="input"></div>' +
							'</div>').appendTo( this.parentContainer );

		this.btn = this.container.find( '#button' );
		this.copyContainer = this.container.find( '#copy' );
		this.bgUnselected = this.container.find( '#unselected' );
		this.bgSelected = this.container.find( '#selected' );
		this.input = this.container.find( '#input' );

		this.container
		.css( 'margin-bottom', 10 )
		.css( 'margin-top', 10 );

		this.btn
		.css( 'color', this.colour )
		.css( 'font-size', 15 )
		.css( 'width', 213 )
		.css( 'height', 47 )
		.css( 'display', 'inline-block')
		.css( 'position', 'relative' );

		this.copyContainer
		.css( 'width', 254 )
		.css( 'height', 93 )
		.css( 'padding', 14 );

		this.bgUnselected
		.css( 'top', 0 )
		.css( 'position', 'absolute' );

		this.bgSelected
		.css( 'top', -10 )
		.css( 'left', -10 )
		.css( 'visibility', 'hidden' )
		.css( 'opacity', 0 )
		.css( 'position', 'absolute' );

		this.input
		.css( 'color', this.colour )
		.css( 'font-size', 30 )
		.css( 'overflow', 'hidden' )
		.css( 'display', 'inline-block');
	};

	UICreationBTN.prototype.activate = function() {
		TweenLite.to( this.bgSelected, 0.5, { autoAlpha: 1} );
		TweenLite.to( this.bgUnselected, 0.5, { autoAlpha: 0} );
	};

	UICreationBTN.prototype.deActivate = function() {
		TweenLite.to( this.bgSelected, 0.5, { autoAlpha: 0} );
		TweenLite.to( this.bgUnselected, 0.5, { autoAlpha: 1} );
	};

	UICreationBTN.prototype.setValue = function( value ) {
		this.input.html( value );
	};

	return UICreationBTN;
});