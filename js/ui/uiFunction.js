define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIFunction = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.parameterContainer = null;

	UIFunction.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="function">' +
								'function <span class="nameContainer">' + this.name + '</span>(' +
								'<div id="parameterContainer"></div>)' +
							'</div>' );

		this.parameterContainer = this.container.find( '#parameterContainer' );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIFunction.prototype.addItem = function( ui ) {
		ui.changeContainer( this.parameterContainer );
	};

	return UIFunction;
});