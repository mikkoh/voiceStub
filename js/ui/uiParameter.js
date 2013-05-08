define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIParameter = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIParameter.prototype = Object.create( UIBase.prototype );

	UIParameter.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="parameter">' + this.name + '</div>' ).appendTo( this.parentContainer );
	};

	return UIParameter;
});