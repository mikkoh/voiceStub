define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'ui/uiFunctionIcon' ], function( $, UIBase, UIName, UIIcon ) {
	
	var UIFunction = function( parentContainer, initData ) {
		this.parentContainer = parentContainer;
		this.parameters = [];
		this.initData = initData;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.parameterContainer = null;
	UIFunction.prototype.iconUI = null;
	UIFunction.prototype.nameUI = null;
	UIFunction.prototype.parameters = null;

	UIFunction.prototype.init = function( onInit ) {
		this.name = this.initData[ 0 ];
		this.onInit = onInit;
		
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
		
		this.addItemToInit();
		this.iconUI = new UIIcon( this.container, this.onItemInit.bind( this ) );
		this.iconUI.init( this.initData, onItemInit );

		this.addItemToInit();
		this.nameUI = new UIName( this.container, this.onItemInit.bind( this ) );
		this.nameUI.init( this.initData, onItemInit );
		this.nameUI.container.css( 'margin-top', 11 );

		this.parameterContainer = $( '<div></div>' )
		.css( 'display', 'inline-block' )
		.css( 'vertical-align', 'top' )
		.css( 'width', '40%' )
		.appendTo( this.container );

		for( var i = 0; i < this.parameters.length; i++ ) {
			this.parameters[i].init( this.onItemInit.bind( this ) );
			this.parameters[i].changeContainer( this.parameterContainer );
		}

		this.initialized = true;
		this.onItemInit();
	};

	UIFunction.prototype.animateIn = function( delay ) {
		this.iconUI.animateIn( delay );
		this.nameUI.animateIn( delay );
		
		for( var i = 0, len = this.parameters.length; i < len; i++ ) {
			this.parameters[ i ].animateIn( delay + 0.5 + i * 0.3 );
		}
	};

	UIFunction.prototype.animateOut = function( delay ) {

	};

	UIFunction.prototype.addItem = function( ui ) {
		this.addItemToInit();
		this.parameters.push( ui );

		if( this.initialized ) {
			if( !ui.initialized ) {
				ui.init( this.onItemInit.bind( this ) );
			}

			ui.changeContainer( this.parameterContainer );
		}
	};

	UIFunction.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIFunction;
});