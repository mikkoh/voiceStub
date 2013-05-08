define( [ 'lib/jquery', 'ui/uiBase' ], function( $, UIBase ) {
	
	var UIClass = function( parentContainer ) {
		this.parentContainer = parentContainer;
	}

	UIClass.prototype = Object.create( UIBase.prototype );
	UIClass.prototype.functionContainer = null

	UIClass.prototype.init = function( initData ) {
		this.name = initData[ 0 ];

		this.container = $( '<div class="class">' +
								'<div class="nameContainer"> class ' + this.name + ' {</div>' +
								'<div id="functionContainer"></div>' +
								'<div class="nameContainer">}</div>' +
							'</div>' );

		this.functionContainer = this.container.find( '#functionContainer' );

		this.add();
	};

	UIClass.prototype.addItem = function( ui ) {
		ui.changeContainer( this.functionContainer );
	};

	return UIClass;
});