define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'ui/uiClassIcon' ], function( $, UIBase, UIName, UIIcon ) {
	
	var UIClass = function( parentContainer, initData ) {
		this.name = initData;
		this.parentContainer = parentContainer;
		this.functions = [];
		this.initData = initData;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.functionContainer = null;
	UIClass.prototype.nameUI = null;
	UIClass.prototype.iconUI = null;
	UIClass.prototype.functions = null;

	UIClass.prototype.init = function( onInit ) {
		this.onInit = onInit;

		this.container = $( '<div class="class"></div>' )
		.css( 'margin-top', 40 )
		.appendTo( this.parentContainer );

		this.addItemToInit();
		this.iconUI = new UIIcon( this.container );
		this.iconUI.init( this.initData, this.onItemInit.bind( this ) );

		this.addItemToInit();
		this.nameUI = new UIName( this.container, 36 );
		this.nameUI.init( this.initData, this.onItemInit.bind( this ) );
		this.nameUI.container.css( 'margin-top', 11 );

		this.functionContainer = $('<div id="functionContainer"></div>')
		.css( 'margin-left', 70 )
		.css( 'margin-top', 20 )
		.appendTo( this.container );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );

		for( var i = 0; i < this.functions.length; i++ ) {
			this.functions[i].init( this.onItemInit.bind( this ) );
			this.functions[i].changeContainer( this.functionContainer );
		}

		this.initialized = true;
		this.onItemInit();
	};

	UIClass.prototype.animateIn = function( delay ) {
		this.iconUI.animateIn( delay );
		this.nameUI.animateIn( delay );
		
		for( var i = 0, len = this.functions.length; i < len; i++ ) {
			this.functions[ i ].animateIn( i * 0.5 + 0.5 );
		}

		this.animatedIn = true;
	};

	UIClass.prototype.animateOut = function( delay ) {
		
	};

	UIClass.prototype.addItem = function( ui ) {
		this.addItemToInit();
		this.functions.push( ui );

		if( this.initialized ) {
			if( !ui.initialized ) {
				ui.init( this.onItemInit.bind( this ) );
			}

			ui.changeContainer( this.functionContainer );
		}

		if( this.animatedIn ) {
			ui.animateIn();
		}
	};

	UIClass.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIClass;
});