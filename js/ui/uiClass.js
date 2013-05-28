define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'ui/uiClassIcon' ], function( $, UIBase, UIName, UIIcon ) {
	
	var UIClass = function( parentContainer, initData ) {
		this.name = initData;
		this.parentContainer = parentContainer;
		this.children = [];
		this.initData = initData;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.childContainer = null;
	UIClass.prototype.nameUI = null;
	UIClass.prototype.iconUI = null;
	UIClass.prototype.children = null;

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

		this.childContainer = $('<div id="childContainer"></div>')
		.css( 'margin-left', 70 )
		.css( 'margin-top', 20 )
		.appendTo( this.container );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );

		for( var i = 0; i < this.children.length; i++ ) {
			this.children[i].init( this.onItemInit.bind( this ) );
			this.children[i].changeContainer( this.childContainer );
		}

		this.initialized = true;
		this.onItemInit();
	};

	UIClass.prototype.animateIn = function( delay ) {
		this.iconUI.animateIn( delay );
		this.nameUI.animateIn( delay );
		
		for( var i = 0, len = this.children.length; i < len; i++ ) {
			this.children[ i ].animateIn( i * 0.5 + 0.5 );
		}

		this.animatedIn = true;
	};

	UIClass.prototype.animateOut = function( delay ) {
		
	};
	
	UIClass.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIClass;
});