define( [ 'ui/uiClass', 'ui/uiFunction', 'ui/uiParameter' ], function( UIClass, UIFunction, UIParameter ) {
	//UI Factory will run commands and and undo and redo commands
	var FactoryJob = function( factory, command ) {
		this.factory = factory;
		this.command = command;
	};

	FactoryJob.prototype.factory = null;
	FactoryJob.prototype.command = null;

	FactoryJob.prototype.redo = function() {
		var command = this.command;
		var curItem = null;
		var classToActOn = null;
		var functionToActOn = null;
		var numCommandsRun = 0;

		for( var i = 0; i < command.length; i++ ) {
			//We want to stop the execution of commands if an error was returned
			if( command[ i ].error ) {
				break;
			}

			numCommandsRun++;

			switch( command[ i ].func ) {
				case 'createClass':
					curItem = this.factory.getClass( command[ i ].parameters[ 0 ] );

					if( curItem === null ) {
						curItem = new UIClass( this.factory.container );
						curItem.init( command[ i ].parameters, function() {
							curItem.animateIn();
						} );

						this.factory.addClass( curItem );
					}

					curItem.add();

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
							classToActOn.addItem( curItem );
						}
					}

					curItem.add();

					functionToActOn = curItem;
				break;

				case 'addParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameters[ 0 ], functionToActOn );

					if( functionToActOn !== null ) {
						if( curItem === null ) {
							curItem = new UIParameter( this.factory.container );
							curItem.init( command[ i ].parameters );

							this.factory.addParameter( curItem, functionToActOn );

							functionToActOn.addItem( curItem );
						}

						curItem.add();
					}
				break;

				case 'deleteClass':
					curItem = this.factory.getClass( command[ i ].parameters[ 0 ] );

					if( curItem !== null ) {
						curItem.remove();
					}
				break;

				case 'deleteFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameters[ 0 ], classToActOn );

					if( curItem !== null ) {
						curItem.remove();
					}
				break;

				case 'deleteParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameters[ 0 ], functionToActOn );

					if( curItem !== null ) {	
						curItem.remove();
					}
				break;

				default:
					throw new Error( 'Command ' + command[ i ].func + 'not defined' );
				break;
			}
		}

		return numCommandsRun;
	};

	FactoryJob.prototype.undo = function() {
		var command = this.command;
		var curItem = null;
		var classToActOn = null;
		var functionToActOn = null;
		var numCommandsRun = 0;

		for( var i = 0; i < command.length; i++ ) {
			//We want to stop the execution of commands if an error was returned
			if( command[ i ].error ) {
				break;
			}

			numCommandsRun++;

			switch( command[ i ].func ) {
				case 'createClass':
					curItem = this.factory.getClass( command[ i ].parameters[ 0 ] );
					curItem.remove();
				break;

				case 'createFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameters[ 0 ], classToActOn );
					curItem.remove();
				break;

				case 'addParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameters[ 0 ], functionToActOn );
					curItem.remove();
				break;

				case 'deleteClass':
					curItem = this.factory.getClass( command[ i ].parameters[ 0 ] );
					curItem.add();
				break;

				case 'deleteFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameters[ 0 ], classToActOn );
					curItem.add();
				break;

				case 'deleteParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameters[ 0 ], functionToActOn );
					curItem.add();
				break;
			}
		}
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
			var numCommandsRun = job.redo();

			//if something was run then we'll add it
			//otherwise it parsing errored immediately
			//and we wont add anything at all
			if( numCommandsRun > 0 ) {
				this.jobs.length = this.jobIdx;
				this.jobs[ this.jobIdx ] = job;

				this.jobIdx++;
			}
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
			this.jobs[ this.jobIdx ].redo();

			this.jobIdx++;
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

		if( parentFunction ) {
			if( this.parametersForFunctions[ parentFunction.name ] ) {
				rVal = this._getItemInArr( item, this.parametersForFunctions[ parentFunction.name ] );
			}
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