define( [ 'lib/jquery', 'lib/TweenLite' ], function( $, TweenLite ) {
	var UIFunctionIcon = function( container ) {
		this.parentContainer = container;
	};

	UIFunctionIcon.prototype.parentContainer = null;
	UIFunctionIcon.prototype.container = null;
	UIFunctionIcon.prototype.icon = null;
	UIFunctionIcon.prototype.highlight1 = null;
	UIFunctionIcon.prototype.highlight2 = null;

	UIFunctionIcon.prototype.init = function( initData, onInit ) {
		this.container = $( '<div><div>' ).appendTo( this.parentContainer );
		
		this.icon = $( '<img src="images/functionLetter.png" width="87" height="88" />' ).appendTo( this.container );
		this.highlight1 = $( '<img src="images/functionHighLight1.png" width="54" height="55" />' ).appendTo( this.container );
		this.highlight2 = $( '<img src="images/functionHighLight2.png" width="27" height="27" />' ).appendTo( this.container );

		this.container
		.css( 'position', 'absolute' )
		.css( 'display', 'inline-block' )
		.css( 'width', 113 )
		.css( 'height', 113 )
		.css( 'left', -13 )
		.css( 'top', -11 )
		.css( 'visibility', 'hidden' )
		.css( '-webkit-transform-style', 'preserve-3d' )
		.css( '-webkit-transform', 'perspective(1200) rotateY(-90deg)' );

		this.icon
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(0px, 0px, -20px)' );

		this.highlight1
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(17px, -10px, 0px)' );

		this.highlight2
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(5px, 0px, 0px)' );

		if( onInit )
			onInit();
	};

	UIFunctionIcon.prototype.animateIn = function( delay ) {
		TweenLite.to( this.container, 0.5, { rotationY: 0, ease: Quad.easeOut, delay: delay, onStart: function() {
			this.container.css( 'visibility', 'visible' );
		}.bind( this ) } );
	};

	UIFunctionIcon.prototype.animateOut = function( delay ) {
			
	};

	UIFunctionIcon.prototype.destroy = function() {
		this.container.remove();
	};

	return UIFunctionIcon;
});