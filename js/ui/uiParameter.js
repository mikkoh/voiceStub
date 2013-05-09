define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIParameter = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIParameter.prototype = Object.create( UIBase.prototype );

	UIParameter.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<span class="parameter">' + this.name + '</span>' )
		.appendTo( this.parentContainer );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container;
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	return UIParameter;
});