define( function() {
	var UIBase = function( parentContainer ) {
		this.parentContainer = parentContainer;
	};

	UIBase.prototype.name = null;
	UIBase.prototype.container = null;
	UIBase.prototype.nameContainer = null;
	UIBase.prototype.parentContainer = null;
	UIBase.prototype.initialized = false;
	UIBase.prototype.numItemsInit = 0;
	UIBase.prototype.numItemsToInit = 1;
	UIBase.prototype.onInit = null;

	UIBase.prototype.changeContainer = function( parentContainer ) {
		this.parentContainer = parentContainer;
		
		this.container.appendTo( this.parentContainer );
	};

	UIBase.prototype.add = function() {
		this.container.appendTo( this.parentContainer );	
	};

	UIBase.prototype.remove = function() {
		this.container.remove();
	};

	UIBase.prototype.onNameClick = function() {
		var startVal = this.nameContainer.html();

		var onFinish = function() {
			this.nameContainer
			.attr( 'contenteditable', false )
			.unbind( 'keydown', onKeyDown )
			.unbind( 'blur', onFinish )
			.bind( 'click', this.onNameClick );

			var nameSplit = this.nameContainer.html().split( /<\/?[^>]*>/).join(' ').split( '\n' ).join( ' ' ).split(/\W/).join(' ').split( ' ' );

			//now we want to camel case this name
			for( var i = 1, len = nameSplit.length; i < len; i++ ) {
				nameSplit[ i ] = nameSplit[ i ].charAt( 0 ).toUpperCase() + nameSplit[ i ].substr( 1 );
			}

			var nName = nameSplit.join( '' );

			if( nName == '' ) {
				nName = startVal;
			}

			this.nameContainer.html( nName );

			if( nName != startVal && this.onNameChange ) {
				this.onNameChange( nName, startVal );
			}
		}.bind( this );


		var onKeyDown = function( ev ) {
			//enter key hit
			switch( ev.which )
			{
				//Enter Key
				case 13:
					this.nameContainer.blur();
				break;

				//Space key
				case 32:
					ev.preventDefault();
				break;
			}
		}.bind( this );

		this.nameContainer
		.attr( 'contenteditable', true )
		.bind( 'keydown', onKeyDown )
		.bind( 'blur', onFinish )
		.unbind( 'click', this.onNameClick );
	};

	UIBase.prototype.addItemToInit = function() {
		this.numItemsToInit++;
	};

	UIBase.prototype.onItemInit = function() {
		if( this.onInit && ++this.numItemsInit == this.numItemsToInit ) {
			this.onInit();
			this.onInit = null;
		}
	};

	return UIBase;
});