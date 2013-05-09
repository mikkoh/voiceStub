requirejs.config({
	baseUrl: 'js',

	paths: {
		lib: '../lib/'
	}
});

requirejs( [ 'parser/parser' ], function( Parser ) {
	var parser = new Parser();

	function createTest( command, expectedCommands, expectedParameters, actOn ) {
		return function() {
			var parsedCommand = parser.parse( command );

			for( var i = 0, len = parsedCommand.length; i < len; i++ ) {
				ok( parsedCommand[ i ].error === undefined, parsedCommand[ i ].error );

				equal( parsedCommand[ i ].func, expectedCommands[ i ], 
				'Commands received were not corrected. Expected: ' + expectedCommands[ i ] +
				' Received:' + parsedCommand[ i ].func );

				equal( parsedCommand[ i ].parameters[ 0 ], expectedParameters[ i ], 
				'Parameters received were not corrected. Expected: ' + expectedCommands[ i ] +
				' Received:' + parsedCommand[ i ].parameters[ 0 ] );

				if( actOn ) {
					equal( parsedCommand[ i ].actOn, actOn[ i ], 'ActOn was incorrect expected' + actOn[ i ] + 'got ' + parsedCommand[ i ].actOn );
				}
			}
		}
	};

	module( 'Creating Classes' );
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
									  	'wildThing' ] ));

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

	test( 'create a class called cat with functions one two and three', createTest( 'create a class called cat with functions one two and three', 
									  [ 'createClass',
									  	'createFunction',
									  	'createFunction',
									  	'createFunction' ],
									  [ 'cat',
									    'one',
									    'two',
									    'three' ]));

});

