define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.functionContainer = null;

	UIClass.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="class">' +
								'class <span class="nameContainer">' + this.name + ' </span> {' +
								'<div id="functionContainer"></div>' +
								'}' +
							'</div>' );

		
		this.functionContainer = this.container.find( '#functionContainer' );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIClass.prototype.addItem = function( ui ) {
		ui.changeContainer( this.functionContainer );
	};

	return UIClass;
});