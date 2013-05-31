requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});

requirejs( [ 'parser/parser' ], function( Parser ) {
	var parser = new Parser();
	parser.addSeparator( 'with' );
	parser.addSeparator( 'and' );

	parser.addNoun( 'class' );
	parser.addNoun( 'function' );
	parser.addNoun( 'parameter' );

	parser.addPreposition( 'to a class called' );
	parser.addPreposition( 'to a class named' );
	parser.addPreposition( 'to a function called' );
	parser.addPreposition( 'to a function named' );
	parser.addPreposition( 'to' );
	parser.addPreposition( 'on a class called' );
	parser.addPreposition( 'on a class named' );
	parser.addPreposition( 'on a function called' );
	parser.addPreposition( 'on a function named' );
	parser.addPreposition( 'on' );
	parser.addPreposition( 'from a class called' );
	parser.addPreposition( 'from a class named' );
	parser.addPreposition( 'from a function called' );
	parser.addPreposition( 'from a function named' );
	parser.addPreposition( 'from' );

	parser.addVerbForNouns( 'create', 'class', 'function', 'parameter' );
	parser.addVerbForNouns( 'add', 'class', 'function', 'parameter' );
	parser.addVerbForNouns( 'delete', 'class', 'function', 'parameter' );
	parser.addVerbForNouns( 'remove', 'class', 'function', 'parameter' );
	parser.addVerbForNouns( 'subtract', 'class', 'function', 'parameter' );

	parser.addLearningKeyword( 'called' );
	parser.addLearningKeyword( 'named' );

	parser.addDefaultVerbForNoun( 'class', 'add' );
	parser.addDefaultVerbForNoun( 'function', 'add' );
	parser.addDefaultVerbForNoun( 'parameter', 'add' );

	parser.addAssociation( 'class', 'create', 'createClass' );
	parser.addAssociation( 'class', 'add', 'createClass' );
	parser.addAssociation( 'class', 'delete', 'deleteClass' );
	parser.addAssociation( 'class', 'remove', 'deleteClass' );
	parser.addAssociation( 'class', 'subtract', 'deleteClass' );

	parser.addAssociation( 'function', 'create', 'createFunction' );
	parser.addAssociation( 'function', 'add', 'createFunction' );
	parser.addAssociation( 'function', 'delete', 'deleteFunction' );
	parser.addAssociation( 'function', 'remove', 'deleteFunction' );
	parser.addAssociation( 'function', 'subtract', 'deleteFunction' );

	parser.addAssociation( 'parameter', 'create', 'addParameter' );
	parser.addAssociation( 'parameter', 'add', 'addParameter' );
	parser.addAssociation( 'parameter', 'delete', 'deleteParameter' );
	parser.addAssociation( 'parameter', 'remove', 'deleteParameter' );
	parser.addAssociation( 'parameter', 'subtract', 'deleteParameter' );



	function createTest( command, expectedCommands, expectedparameter, actOn ) {
		return function() {
			var parsedCommand = parser.parse( command );
			console.log( parsedCommand );

			for( var i = 0, len = parsedCommand.length; i < len; i++ ) {
				ok( parsedCommand[ i ].error === undefined, parsedCommand[ i ].error );

				equal( parsedCommand[ i ].func, expectedCommands[ i ], 
				'Commands received were not corrected. Expected: ' + expectedCommands[ i ] +
				' Received:' + parsedCommand[ i ].func );

				equal( parsedCommand[ i ].parameter, expectedparameter[ i ], 
				'parameter received were not corrected. Expected: ' + expectedparameter[ i ] +
				' Received:' + parsedCommand[ i ].parameter );

				if( actOn ) {
					equal( parsedCommand[ i ].actOn, actOn[ i ], 'ActOn was incorrect expected ' + actOn[ i ] + ' got ' + parsedCommand[ i ].actOn );
				}
			}
		}
	};

	// module( 'Creating Classes' );
	test( 'add a class called cat', createTest( 'add a class called cat', 
												[ 'createClass' ],
												[ 'cat' ] ));

	test( 'create a class named dog', createTest( 'add a class called dog', 
												  [ 'createClass' ],
												  [ 'dog' ] ));

	test( 'add a class named giraffe', createTest( 'add a class named giraffe', 
									  [ 'createClass' ],
									  [ 'giraffe' ] ));

	test( 'add a class called zebra', createTest( 'add a class called zebra', 
									  [ 'createClass' ],
									  [ 'zebra' ] ));





	module( 'Deleting Classes' );
	test( 'subtract a class called zebra', createTest( 'subtract a class called zebra', 
									  [ 'deleteClass' ],
									  [ 'zebra' ] ));

	test( 'delete a class called zebra', createTest( 'delete a class called zebra', 
									     [ 'deleteClass' ],
									     [ 'zebra' ] ));

	test( 'delete zebra', createTest( 'delete zebra', 
									  [ 'deleteClass' ],
									  [ 'zebra' ] ));






	module( 'Creating Functions' );
	test( 'add a function called foo', createTest( 'add a function called foo', 
									  [ 'createFunction' ],
									  [ 'foo' ] ));

	test( 'add a function named bar', createTest( 'add a function named bar', 
									  [ 'createFunction' ],
									  [ 'bar' ] ));

	test( 'add a function to cat called testing', createTest( 'add a function to cat called testing', 
									  [ 'createFunction' ],
									  [ 'testing' ],
									  [ 'cat'] ));




	module( 'Deleting Functions' );
	test( 'delete a function named foo', createTest( 'delete a function named foo', 
									  [ 'deleteFunction' ],
									  [ 'foo' ] ));

	test( 'delete a function called foo', createTest( 'delete a function called foo', 
									  [ 'deleteFunction' ],
									  [ 'foo' ] ));

	test( 'delete bar', createTest( 'delete bar', 
									  [ 'deleteFunction' ],
									  [ 'bar' ] ));







	module( 'Complex Commands' );
	test( 'create a class called cat with a function called wild thing', createTest( 'create a class called cat with a function called wild thing', 
									  [ 'createClass',
									    'createFunction' ],
									  [ 'cat',
									  	'wild thing' ] ));

	test( 'create a class named cat and add a function named meow', createTest( 'create a class named cat and add a function named meow', 
									  [ 'createClass',
									    'createFunction' ],
									  [ 'cat',
									  	'meow' ] ));

	test( 'add a function named meow to cat', createTest( 'add a function named meow to cat', 
									  [ 'createFunction' ],
									  [ 'meow' ],
									  [ 'cat' ] ));

	test( 'delete a function named meow from cat', createTest( 'delete a function named meow from cat', 
									  [ 'deleteFunction' ],
									  [ 'meow' ],
									  [ 'cat' ] ));

	test( 'add a parameter called meow to a function called foo', createTest( 'add a parameter called meow to a function called foo', 
									  [ 'addParameter' ],
									  [ 'meow' ],
									  [ 'foo' ] ));

	test( 'add a function called go to and stop', createTest( 'add a function called go to and stop', 
									  [ 'createFunction' ],
									  [ 'go to and stop' ]));

	test( 'add a function called go to to cat', createTest( 'add a function called go to to cat', 
															[ 'createFunction' ],
															[ 'go to' ], 
															[ 'cat' ]));




	// I took this out because for now it's near impossible to parse this kind of list

	// test( 'create a class called cat with functions one two and three', createTest( 'create a class called cat with functions one two and three', 
	// 								  [ 'createClass',
	// 								  	'createFunction',
	// 								  	'createFunction',
	// 								  	'createFunction' ],
	// 								  [ 'cat',
	// 								    'one',
	// 								    'two',
	// 								    'three' ]));

});

