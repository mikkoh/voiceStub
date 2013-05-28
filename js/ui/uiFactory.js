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
		var newTopLevelItems = [];

		for( var i = 0; i < command.length; i++ ) {
			//We want to stop the execution of commands if an error was returned
			if( command[ i ].error ) {
				break;
			}

			numCommandsRun++;

			switch( command[ i ].func ) {
				case 'createClass':
					curItem = this.factory.getClass( command[ i ].parameter );

					if( curItem === null ) {
						var nClass = curItem = new UIClass( this.factory.container, command[ i ].parameter );

						this.factory.addClass( curItem );

						newTopLevelItems.push( nClass );
					}

					classToActOn = curItem;
				break;

				case 'createFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameter, classToActOn );

					if( curItem === null ) {
						curItem = new UIFunction( this.factory.container, command[ i ].parameter );	
						
						this.factory.addFunction( curItem, classToActOn );

						if( classToActOn !== null ) {
							classToActOn.addItem( curItem );
						} else {
							newTopLevelItems.push( curItem );
						}
					}

					functionToActOn = curItem;
				break;

				case 'addParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameter, functionToActOn );

					if( functionToActOn !== null ) {
						if( curItem === null ) {
							curItem = new UIParameter( this.factory.container, command[ i ].parameter );

							this.factory.addParameter( curItem, functionToActOn );

							functionToActOn.addItem( curItem );
						}
					}
				break;

				case 'deleteClass':
					curItem = this.factory.getClass( command[ i ].parameter );

					if( curItem !== null ) {
						curItem.remove();
					}
				break;

				case 'deleteFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameter, classToActOn );

					if( curItem !== null ) {
						curItem.remove();
					}
				break;

				case 'deleteParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameter, functionToActOn );

					if( curItem !== null ) {	
						curItem.remove();
					}
				break;

				default:
					throw new Error( 'Command ' + command[ i ].func + 'not defined' );
				break;
			}
		}



		//now we need to loop through top level items and init them and animate them in
		for( var i = 0, len = newTopLevelItems.length; i < len; i++ ) {
			var curItem = newTopLevelItems[ i ];

			curItem.init( function() {
				curItem.animateIn();
			});

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
					curItem = this.factory.getClass( command[ i ].parameter );
					curItem.remove();
				break;

				case 'createFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameter, classToActOn );
					curItem.remove();
				break;

				case 'addParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameter, functionToActOn );
					curItem.remove();
				break;

				case 'deleteClass':
					curItem = this.factory.getClass( command[ i ].parameter );
					curItem.add();
				break;

				case 'deleteFunction':
					if( command[ i ].actOn ) {
						classToActOn = this.factory.getClass( command[ i ].actOn );
					}

					curItem = this.factory.getFunction( command[ i ].parameter, classToActOn );
					curItem.add();
				break;

				case 'deleteParameter':
					if( command[ i ].actOn ) {
						functionToActOn = this.factory.getFunction( command[ i ].actOn );
					}

					curItem = this.factory.getParameter( command[ i ].parameter, functionToActOn );
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

	UIFactory.prototype.getItems = function() {
		for( var i = 0, len = this.classes.length; i < len; i++ ) {
			if( this.classes[ i ].isOnStage ) {
				
			}
		}

		for( var i = 0, len = this.functions.length; i < len; i++ ) {
			
		}
	};

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

	UIFactory.prototype.getFunction = function( item, parentClass ) {
		var rVal = null;
		var curFunctionArr = null;

		if( parentClass && this.functionsForClass[ parentClass.name ] !== undefined ) {
			curFunctionArr = this.functionsForClass[ parentClass.name ];
		} else {
			curFunctionArr = this.functions;
		}

		rVal = this._getItemInArr( item, curFunctionArr );

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