define( [ 'lib/jquery' ], function( $ ) {
	var UIName = function( container, fontSize, height ) {
		this.fontSize = fontSize;
		this.parentContainer = container;
	};

	UIName.prototype.fontSize = 0;
	UIName.prototype.width = 0;
	UIName.prototype.height = 0;
	UIName.prototype.shadowAmount = 1;
	UIName.prototype.shadow = null;
	UIName.prototype.text = null;

	UIName.prototype.init = function( initData, onInit ) {
		this.container = $('<div><div id="text">' + initData + '</div><div id="shadow"></div></div>')
		.css( 'position', 'relative' )
		.css( 'vertical-align', 'top' )
		.appendTo( this.parentContainer );

		this.text = this.container.find( '#text' )
		.css( 'position', 'absolute' )
		.css( 'top', 0 )
		.css( 'z-index', 0 );

		this.shadow = this.container.find( '#shadow' )
		.css( 'position', 'absolute' )
		.css( 'top', 0 )
		.css( 'z-index', 1 );

		this.container
		.css( 'display', 'inline-block' )
		.css( 'visiblity', 'hidden' )
		.css( 'font-size', this.fontSize )
		.ready( function() {
			this.width = this.text.width();
			this.height = this.text.height();

			this.container
			.css( 'width', this.width )
			.css( 'height', this.height );
			
			this.shadow
			.css( 'width', this.width )
			.css( 'height', this.height )
			.css( 'box-shadow', '-' + this.width + 'px ' + this.height + 'px 10px #bbb8b3 inset, -' + this.width + 'px ' + this.height + 'px 10px #bbb8b3 inset');

			if( onInit ) {
				onInit();
			}
		}.bind( this ));
	};

	UIName.prototype.animateIn = function( delay ) {
		this.container
		.css( 'visiblity', 'visible' );


		TweenLite.to( this, 1, { shadowAmount: 0, 
		onUpdate: function(){
			this.shadow
			.css( 'box-shadow', 
				( this.width * -this.shadowAmount ) + 'px 0px 50px rgba( 187, 184, 179, ' + this.shadowAmount + ') inset,' +
				( this.width * -this.shadowAmount ) + 'px 0px 50px rgba( 187, 184, 179, ' + this.shadowAmount + ') inset');
		}.bind( this ),
		onComplete: function() {
			// this.shadow
			// .css( 'box-shadow', 'none');
		}.bind( this ),
		delay: delay });
	};

	UIName.prototype.animateOut = function( delay ) {
		this.container
		.css( 'visiblity', 'hidden' )
		.css( 'width', 0 );
	};

	UIName.prototype.destroy = function() {
		this.container.remove();
	};

	return UIName;
});