define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiClassName' ], function( $, UIBase, UIClassName ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );

	UIClass.prototype.functionContainer = null;
	UIClass.prototype.nameUI = null;
	UIClass.prototype.functions = null;

	UIClass.prototype.init = function( initData, onInit ) {
		this.name = initData[ 0 ];
		this.functions = [];

		this.container = $( '<div class="class"></div>' );

		this.nameUI = new UIClassName( this.container );
		this.nameUI.init( initData, onInit );

		this.functionContainer = $('<div id="functionContainer"></div>')
		.css( 'position', 'relative' )
		.css( 'left', 74 )
		.css( 'top', 94 )
		.appendTo( this.container );

		this.onNameClick = this.onNameClick.bind( this );
		this.nameContainer = this.container.find( '.nameContainer' );
		this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIClass.prototype.animateIn = function( delay ) {
		this.nameUI.animateIn( delay );

		for( var i = 0, len = this.functions.length; i < len; i++ ) {
			this.functions[ i ].animateIn( i * 0.5 + 0.5 );
		}
	};

	UIClass.prototype.animateOut = function( delay ) {
		this.nameUI.animateOut( delay );
	};

	UIClass.prototype.addItem = function( ui ) {
		this.functions.push( ui );
		ui.changeContainer( this.functionContainer );
	};

	UIClass.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIClass;
});