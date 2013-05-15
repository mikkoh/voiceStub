define( [ 'lib/jquery', 'ui/uiName', 'ui/uiClassIcon' ], function( $, UIName, UIClassIcon ) {
	var UIClassName = function( container ) {
		this.parentContainer = container;
	};

	UIClassName.prototype.container = null;
	UIClassName.prototype.parentContainer = null;
	UIClassName.prototype.icon = null;
	UIClassName.prototype.name = null;

	UIClassName.prototype.init = function( initData, onInit ) {
		this.container = $('<div></div>').appendTo( this.parentContainer );
		this.container.css( 'position', 'relative' );

		var numInit = 0;
		var numItemsToInit = 2;
		var onInitItems = function() {
			if( onInit ) {
				if( ++numInit == numItemsToInit ) {
					onInit();
				}
			}
		};

		this.icon = new UIClassIcon( this.container );
		this.icon.init( initData, onInitItems );

		this.name = new UIName( this.container, 30, 74 );
		this.name.init( initData, onInitItems );
		this.name.container.css( 'left', 84 );
	};

	UIClassName.prototype.animateIn = function( delay ) {
		delay = delay === undefined? 0 : delay;

		this.icon.animateIn( delay );
		this.name.animateIn( delay + 0.25 );
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