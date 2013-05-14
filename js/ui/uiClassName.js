define( [ 'lib/jquery', 'ui/uiName', 'ui/uiClassIcon' ], function( $, UIName, UIClassIcon ) {
	var UIClassName = function( container ) {
		this.parentContainer = container;
	};

	UIClassName.prototype.container = null;
	UIClassName.prototype.parentContainer = null;
	UIClassName.prototype.icon = null;
	UIClassName.prototype.name = null;

	UIClassName.prototype.init = function( initData ) {
		this.container = $('<div></div>').appendTo( this.parentContainer );
		this.container.css( 'position', 'relative' );

		this.icon = new UIClassIcon( this.container );
		this.icon.init();

		this.name = new UIName( this.container );
		this.name.init( initData );

		this.animateIn();
	};

	UIClassName.prototype.animateIn = function( delay ) {
		this.name.animateIn( delay );
	};

	UIClassName.prototype.animateOut = function( delay ) {
		this.name.animateOut( delay );
	};

	UIClassName.prototype.destroy = function() {
		this.name.destroy();

		this.container.remove();
	};

	return UIClassName;
});