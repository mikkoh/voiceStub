define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiFunctionName' ], function( $, UIBase, UIFunctionName ) {
	
	var UIFunction = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.parameterContainer = null;
	UIFunction.prototype.nameUI = null;

	UIFunction.prototype.init = function( initData, onInit ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="function"></div>' )
		.css( 'height', 74 )
		.appendTo( this.parentContainer );

		this.nameUI = new UIFunctionName( this.container );
		this.nameUI.init( initData, onInit );

		// this.parameterContainer = this.container.find( '#parameterContainer' );

		// this.onNameClick = this.onNameClick.bind( this );
		// this.nameContainer = this.container.find( '.nameContainer' );
		// this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIFunction.prototype.animateIn = function( delay ) {
		this.nameUI.animateIn( delay );
	};

	UIFunction.prototype.animateOut = function( delay ) {

	};

	UIFunction.prototype.addItem = function( ui ) {
		ui.changeContainer( this.parameterContainer );
	};

	UIFunction.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIFunction;
});