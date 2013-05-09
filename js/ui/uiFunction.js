define( [ 'lib/jquery', 'ui/uiBase', 'ui/editableFunction' ], function( $, UIBase, onEdit ) {
	
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

		this.container.find( '.nameContainer' ).bind( 'click', onEdit );

		this.parameterContainer = this.container.find( '#parameterContainer' );
	};

	UIFunction.prototype.addItem = function( ui ) {
		ui.changeContainer( this.parameterContainer );
	};

	return UIFunction;
});