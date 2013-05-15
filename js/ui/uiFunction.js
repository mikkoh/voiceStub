define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'ui/uiFunctionIcon' ], function( $, UIBase, UIName, UIIcon ) {
	
	var UIFunction = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.parameterContainer = null;
	UIFunction.prototype.iconUI = null;
	UIFunction.prototype.nameUI = null;

	UIFunction.prototype.init = function( initData, onInit ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="function"></div>' )
		.css( 'font-size', 20 )
		.appendTo( this.parentContainer );

		var numInit = 0;
		var numItemsToInit = 2;
		var onItemInit = function() {
			if( onInit ) {
				if( ++numInit == numItemsToInit ) {
					onInit();
				}
			}
		};
		
		this.iconUI = new UIIcon( this.container );
		this.iconUI.init( initData, onItemInit );

		this.nameUI = new UIName( this.container );
		this.nameUI.init( initData, onItemInit );
		this.nameUI.container.css( 'margin-top', 11 );

		this.parameterContainer = $( '<div></div>' )
		.css( 'display', 'inline-block' )
		.css( 'vertical-align', 'top' )
		.css( 'width', '40%' )
		.appendTo( this.container );



		// this.parameterContainer = this.container.find( '#parameterContainer' );

		// this.onNameClick = this.onNameClick.bind( this );
		// this.nameContainer = this.container.find( '.nameContainer' );
		// this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIFunction.prototype.animateIn = function( delay ) {
		this.nameUI.animateIn( delay );
		this.iconUI.animateIn( delay );
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