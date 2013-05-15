define( [ 'lib/jquery', 'lib/TweenLite' ], function( $, TweenLite ) {
	var UIClassIcon = function( container ) {
		this.parentContainer = container;
	};

	UIClassIcon.prototype.parentContainer = null;
	UIClassIcon.prototype.container = null;
	UIClassIcon.prototype.icon = null;
	UIClassIcon.prototype.highlight1 = null;
	UIClassIcon.prototype.highlight2 = null;

	UIClassIcon.prototype.init = function( initData, onInit ) {
		this.container = $( '<div><div>' ).appendTo( this.parentContainer );
		
		this.icon = $( '<img src="images/classLetter.png" width="113" height="113" />' ).appendTo( this.container );
		this.highlight1 = $( '<img src="images/classHighLight1.png" width="85" height="85" />' ).appendTo( this.container );
		this.highlight2 = $( '<img src="images/classHighLight2.png" width="45" height="45" />' ).appendTo( this.container );

		this.container
		.css( 'position', 'absolute' )
		.css( 'display', 'inline-block' )
		.css( 'width', 113 )
		.css( 'height', 113 )
		.css( 'left', -14 )
		.css( 'top', -10 )
		.css( 'visibility', 'hidden' )
		.css( '-webkit-transform-style', 'preserve-3d' )
		.css( '-webkit-transform', 'perspective(1200) rotateY(-90deg)' );

		this.icon
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(0px, 0px, -20px)' );

		this.highlight1
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(17px, -30px, 0px)' );

		this.highlight2
		.css( 'position', 'absolute' )
		.css( '-webkit-transform', 'translate3d(-12px, -12px, 0px)' );

		if( onInit )
			onInit();
	};

	UIClassIcon.prototype.animateIn = function( delay ) {
		TweenLite.to( this.container, 0.5, { rotationY: 0, ease: Quad.easeOut, delay: delay, onStart: function() {
			this.container.css( 'visibility', 'visible' );
		}.bind( this ) } );
	};

	UIClassIcon.prototype.animateOut = function( delay ) {
			
	};

	UIClassIcon.prototype.destroy = function() {
		this.container.remove();
	};

	return UIClassIcon;
});