define( [ 'lib/jquery', 'ui/uiBase', 'ui/uiName', 'lib/TweenLite' ], function( $, UIBase, UIName, TweenLite ) {
	
	var UIParameter = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIParameter.prototype = Object.create( UIBase.prototype );
	UIParameter.prototype.nameUI = null;
	UIParameter.prototype.separator = null;

	UIParameter.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="parameter"><img id="separator" src="images/parameterSeparator.png" width="7" height="47" /></div>' )
		.css( 'display', 'inline-block')
		.appendTo( this.parentContainer );

		this.separator = this.container.find('#separator')
		.css( 'margin-left', 10 )
		.css( 'height', 0 );

		this.nameUI = new UIName( this.container );
		this.nameUI.init( initData );
		this.nameUI.container.css( 'margin-top', 11 );
		this.nameUI.container.css( 'margin-left', 10 );
	};

	UIParameter.prototype.animateIn = function( delay ) {
		TweenLite.to( this.separator, 0.5, { height: 47, ease: Expo.easeOut, delay: delay });
		this.nameUI.animateIn( delay + 0.3 );
	};

	UIParameter.prototype.onNameChange = function( nName, oValue ) {
		console.log( 'value changed', nName, oValue );
	};

	return UIParameter;
});