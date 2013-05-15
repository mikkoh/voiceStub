define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiClassName' ], function( $, UIBase, UIClassName ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.functionContainer = null;
	UIClass.prototype.name = null;

	UIClass.prototype.init = function( initData, onInit ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="class">' +
								'<div id="functionContainer"></div>' +
							'</div>' );

		this.name = new UIClassName( this.container );
		this.name.init( initData, onInit );

		this.functionContainer = this.container.find( '#functionContainer' );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIClass.prototype.animateIn = function( delay ) {
		this.name.animateIn( delay );
	};

	UIClass.prototype.animateOut = function( delay ) {
		this.name.animateOut( delay );
	};

	UIClass.prototype.addItem = function( ui ) {
		ui.changeContainer( this.functionContainer );
	};

	UIClass.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIClass;
});