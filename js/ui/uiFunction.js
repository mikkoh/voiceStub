define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIFunction = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIFunction.prototype = Object.create( UIBase.prototype );
	UIFunction.prototype.parameterContainer = null;

	UIFunction.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="function">' +
								'<div class="nameContainer"> function ' + this.name + '(</div>' +
								'<div id="parameterContainer"></div>' +
								'<div class="nameContainer"> ) </div>' +
							'</div>' ).appendTo( this.parentContainer );

		this.parameterContainer = this.container.find( '#parameterContainer' );
	};

	UIFunction.prototype.add = function( ui ) {
		ui.changeContainer( this.parameterContainer );
	};

	return UIFunction;
});