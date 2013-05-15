define( [ 'lib/jquery', 'ui/uiName', 'ui/uiFunctionIcon' ], function( $, UIName, UIFunctionIcon ) {
	var UIFunctionName = function( container ) {
		this.parentContainer = container;
	};

	UIFunctionName.prototype.container = null;
	UIFunctionName.prototype.parentContainer = null;
	UIFunctionName.prototype.icon = null;
	UIFunctionName.prototype.name = null;

	UIFunctionName.prototype.init = function( initData, onInit ) {
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

		this.icon = new UIFunctionIcon( this.container );
		this.icon.init( initData, onInitItems );

		this.name = new UIName( this.container, 15, 46 );
		this.name.init( initData, onInitItems );
		this.name.container.css( 'left', 56 );
	};

	UIFunctionName.prototype.animateIn = function( delay ) {
		delay = delay === undefined? 0 : delay;

		this.icon.animateIn( delay );
		this.name.animateIn( delay + 0.25 );
	};

	UIFunctionName.prototype.animateOut = function( delay ) {
		this.name.animateOut( delay );
	};

	UIFunctionName.prototype.destroy = function() {
		this.name.destroy();

		this.container.remove();
	};

	return UIFunctionName;
});