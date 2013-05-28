define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'lib/TweenLite' ], function( $, UIBase, UIName, TweenLite ) {
	
	var UIParameter = function( parentContainer, initData ) {
		this.type = 'parameter';
		this.name = initData;
		this.parentContainer = parentContainer;
		this.initData = initData;
	}

	UIParameter.prototype = Object.create( UIBase.prototype );
	UIParameter.prototype.nameUI = null;
	UIParameter.prototype.separator = null;

	UIParameter.prototype.init = function( onInit ) {
		this.onInit = onInit;

		this.container = $( '<div class="parameter"><img id="separator" src="images/parameterSeparator.png" width="7" height="47" /></div>' )
		.css( 'display', 'inline-block');

		this.addItemToInit();
		this.nameUI = new UIName( this.container );
		this.nameUI.init( this.initData, this.onItemInit.bind( this ) );
		this.nameUI.container.css( 'margin-top', 11 );
		this.nameUI.container.css( 'margin-left', 10 );

		this.addItemToInit();
		this.separator = this.container.find('#separator')
		.css( 'margin-left', 10 )
		.css( 'height', 0 )
		.load( this.onItemInit.bind( this ) );

		this.add();
		this.initialized = true;
		this.onItemInit();
	};

	UIParameter.prototype.animateIn = function( delay ) {
		TweenLite.to( this.separator, 0.5, { height: 47, ease: Expo.easeOut, delay: delay });
		this.nameUI.animateIn( delay + 0.3 );

		this.animatedIn = true;
	};

	UIParameter.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIParameter;
});