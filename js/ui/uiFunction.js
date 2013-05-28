define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'ui/uiFunctionIcon' ], function( $, UIBase, UIName, UIIcon ) {
	
	var UIFunction = function( parentContainer, initData ) {
		this.name = initData;
		this.parentContainer = parentContainer;
		this.children = [];
		this.initData = initData;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.childContainer = null;
	UIFunction.prototype.iconUI = null;
	UIFunction.prototype.nameUI = null;

	UIFunction.prototype.init = function( onInit ) {
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

		this.childContainer = $( '<div></div>' )
		.css( 'display', 'inline-block' )
		.css( 'vertical-align', 'top' )
		.css( 'width', '40%' )
		.appendTo( this.container );

		for( var i = 0; i < this.children.length; i++ ) {
			this.children[i].init( this.onItemInit.bind( this ) );
			this.children[i].changeContainer( this.childContainer );
		}

		this.initialized = true;
		this.onItemInit();
	};

	UIFunction.prototype.animateIn = function( delay ) {
		this.iconUI.animateIn( delay );
		this.nameUI.animateIn( delay );
		
		for( var i = 0, len = this.children.length; i < len; i++ ) {
			this.children[ i ].animateIn( delay + 0.5 + i * 0.3 );
		}

		this.animatedIn = true;
	};

	UIFunction.prototype.animateOut = function( delay ) {

	};

	UIFunction.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIFunction;
});