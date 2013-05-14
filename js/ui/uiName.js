define( [ 'lib/jquery' ], function( $ ) {
	var UIName = function( container ) {
		this.parentContainer = container;
	};

	UIName.prototype.width = 0;

	UIName.prototype.init = function( initData ) {
		this.container = $('<span>' + initData + '</span>').appendTo( this.parentContainer );
		this.width = this.container.width();

		this.container
		.css( 'position', 'absolute' )
		.css( 'overflow', 'hidden' )
		.css( 'height', 74 )
		.css( 'line-height', '70px' )
		.css( 'visiblity', 'hidden' )
		.css( 'left', 84 );
	};

	UIName.prototype.animateIn = function( delay ) {
		this.container
		.css( 'visiblity', 'visible' );
	};

	UIName.prototype.animateOut = function( delay ) {
		this.container
		.css( 'visiblity', 'hidden' )
		.css( 'width', 0 );
	};

	UIName.prototype.destroy = function() {
		this.container.remove();
	};

	return UIName;
});