define( [ 'lib/jquery', 'ui/uiBase', 'ui/editableFunction' ], function( $, UIBase, onEdit ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );
	UIClass.prototype.functionContainer = null

	UIClass.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="class">' +
								'class <span class="nameContainer">' + this.name + ' </span> {' +
								'<div id="functionContainer"></div>' +
								'}' +
							'</div>' );

		this.container.find( '.nameContainer' ).bind( 'click', onEdit );

		this.functionContainer = this.container.find( '#functionContainer' );
	};

	UIClass.prototype.addItem = function( ui ) {
		ui.changeContainer( this.functionContainer );
	};

	return UIClass;
});