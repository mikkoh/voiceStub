define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiClassName' ], function( $, UIBase, UIClassName ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.functionContainer = null;
	UIClass.prototype.name = null;
	UIClass.prototype.nameUI = null;

	UIClass.prototype.init = function( initData, onInit ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="class"></div>' );

		this.nameUI = new UIClassName( this.container );
		this.nameUI.init( initData, onInit );

		this.functionContainer = $('<div id="functionContainer"></div>')
		.css( 'position', 'relative' )
		.css( 'top', 74 )
		.appendTo( this.container );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIClass.prototype.animateIn = function( delay ) {
		this.nameUI.animateIn( delay );
	};

	UIClass.prototype.animateOut = function( delay ) {
		this.nameUI.animateOut( delay );
	};

	UIClass.prototype.addItem = function( ui ) {
		ui.changeContainer( this.functionContainer );
	};

	UIClass.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIClass;
});