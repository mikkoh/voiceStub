define( function() {
	var UIBase = function( parentContainer ) {
		this.parentContainer = parentContainer;
	};

	UIBase.prototype.name = null;
	UIBase.prototype.container = null;
	UIBase.prototype.parentContainer = null;

	UIBase.prototype.changeContainer = function( parentContainer ) {
		this.parentContainer = parentContainer;
		
		this.container.appendTo( parentContainer );
	};

	UIBase.prototype.destroy = function() {
		this.container.remove();
	};

	return UIBase;
});