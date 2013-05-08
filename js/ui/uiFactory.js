define( [ 'ui/uiClass', 'ui/uiFunction', 'ui/uiParameter' ], function( UIClass, UIFunction, UIParameter ) {
	//UI Factory will run commands and and undo and redo commands
	var FactoryJob = function( factory, command ) {
		this.factory = factory;
		this.command = command;

		this.redo();
	};

	FactoryJob.prototype.factory = null;
	FactoryJob.prototype.command = null;

	FactoryJob.prototype.redo = function() {
		var command = this.command;
		var curItem = null;
		var classToActOn = null;
		var functionToActOn = null;

		for( var i = 0; i < command.length; i++ ) {
			console.log( command[ i ] );

			switch( command[ i ].func ) {
				case 'createClass':
					curItem = this.factory.getClass( command[ i ].parameters[ 0 ] );

					if( curItem === null ) {
						curItem = new UIClass( this.factory.container );
						curItem.init( command[ i ].parameters );

						this.factory.addClass( curItem );
					}

					classToActOn = curItem;
				break;

				case 'createFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameters[ 0 ], classToActOn );

					if( curItem === null ) {
						curItem = new UIFunction( this.factory.container );	
						curItem.init( command[ i ].parameters );

						this.factory.addFunction( curItem, classToActOn );

						if( classToActOn !== null ) {
							classToActOn.add( curItem );
						}
					}

					functionToActOn = curItem;
				break;

				case 'addParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameters[ 0 ], functionToActOn );

					if( curItem === null ) {
						curItem = new UIParameter( this.factory.container );
						curItem.init( command[ i ].parameters );

						this.factory.addParameter( curItem, functionToActOn );

						functionToActOn.add( curItem );
					}
				break;

				default:
					throw new Error( 'Command ' + command[ i ].func + 'not defined' );
				break;
			}
		}
	};

	FactoryJob.prototype.undo = function() {

	};








	var UIFactory = function( container ) {
		this.container = container;
		this.jobs = [];
		this.classes = [];
		this.functions = [];
		this.functionsForClass = {};
		this.parametersForFunctions = {};
	}

	UIFactory.prototype.jobIdx = 0;
	UIFactory.prototype.jobs = null;
	UIFactory.prototype.classes = null;
	UIFactory.prototype.functions = null;
	UIFactory.prototype.functionsForClass = null;
	UIFactory.prototype.parametersForFunctions = null;

	UIFactory.prototype.addCommands = function( command ) {
		if( command ) {
			var job = new FactoryJob( this, command );

			this.jobs.length = this.jobIdx;
			this.jobs[ this.jobIdx ] = job;

			this.jobIdx++;
		}
	};

	UIFactory.prototype.undo = function() {
		if( this.jobIdx > 0 ) {
			this.jobIdx--;

			this.jobs[ this.jobIdx ].undo();
		}
	};

	UIFactory.prototype.redo = function() {
		if( this.jobIdx < this.jobs.length ) {
			this.jobIdx++;

			this.jobs[ this.jobIdx ].redo();
		}
	};

	UIFactory.prototype.addClass = function( item ) {
		if( this._getItemInArr( item, this.classes ) === null ) {
			this.classes.push( item );
		}
	};

	UIFactory.prototype.getClass = function( item ) {
		return this._getItemInArr( item, this.classes );
	};

	UIFactory.prototype.addFunction = function( item, parentClass ) {
		if( parentClass ) {
			if( this.functionsForClass[ parentClass.name ] === undefined ) {
				this.functionsForClass[ parentClass.name ] = [];
			}

			if( this._getItemInArr( item, this.functionsForClass[ parentClass.name ] ) === null ) {
				this.functionsForClass[ parentClass.name ].push( item );
			}
		} else if( this._getItemInArr( item, this.functions ) === null ) {
			this.functions.push( item );
		}
	};

	UIFactory.prototype.getFunction = function( item ) {
		var rVal = this._getItemInArr( item, this.functions );

		if( rVal === null ) {
			for( var i in this.functionsForClass ) {
				rVal = this._getItemInArr( item, this.functionsForClass[ i ] );
				
				if( rVal !== null ) {
					break;
				}
			}
		}

		return rVal;
	};

	UIFactory.prototype.addParameter = function( item, parentFunction ) {
		if( parentFunction ) {
			if( this.parametersForFunctions[ parentFunction.name ] === undefined ) {
				this.parametersForFunctions[ parentFunction.name ] = [];
			}

			if( this._getItemInArr( item, this.parametersForFunctions[ parentFunction.name ] ) === null ) {
				this.parametersForFunctions[ parentFunction.name ].push( item );
			}
		}
	};

	UIFactory.prototype.getParameter = function( item, parentFunction ) {
		var rVal = null;

		if( this.parametersForFunctions[ parentFunction.name ] ) {
			rVal = this._getItemInArr( item, this.parametersForFunctions[ parentFunction.name ] );
		}

		return rVal;
	};

	UIFactory.prototype._getItemInArr = function( item, array ) {
		if( array ) {
			for( var i = 0, len = array.length; i < len; i++ ) {
				if( array[ i ].name == item ) {
					return array[ i ];
				}
			}
		}

		return null;
	};

	return UIFactory;
});