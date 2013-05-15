define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName' ], function( $, UIBase, UIName ) {
	
	var UIParameter = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIParameter.prototype = Object.create( UIBase.prototype );
	UIParameter.prototype.nameUI = null;

	UIParameter.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="parameter"><img src="images/parameterSeparator.png" width="7" height="47" /></div>' )
		.css( 'display', 'inline-block')
		.appendTo( this.parentContainer );

		this.container.find('img')
		.css( 'margin-left', 10 )

		this.nameUI = new UIName( this.container );
		this.nameUI.init( initData );
		this.nameUI.container.css( 'margin-top', 11 );
		this.nameUI.container.css( 'margin-left', 10 );
		this.nameUI.animateIn();

		// this.onNameClick = this.onNameClick.bind( this );
		// this.nameContainer = this.container;
		// this.nameContainer.bind( 'click', this.onNameClick );
	};

	UIParameter.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIParameter;
});