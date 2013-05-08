define( function() {
	var Dictionary = {
		ignore: [
			{ value: 'a' },
			{ value: 'an' }
		],


		nouns: [
			{ 
				value: 'class',
				verbs: [
					{ value: 'add', func: 'createClass' },
					{ value: 'create', func: 'createClass' },
					{ value: 'subtract', func: 'deleteClass' },
					{ value: 'delete', func: 'deleteClass' }
				],
				defaultFunc: 'createClass'
			},
			
			{ 
				value: 'function',
				verbs: [
					{ value: 'add', func: 'createFunction' },
					{ value: 'create', func: 'createFunction' },
					{ value: 'subtract', func: 'deleteFunction' },
					{ value: 'delete', func: 'deleteFunction' }
				],
				defaultFunc: 'createFunction'
			},

			{ 
				value: 'parameter',
				verbs: [
					{ value: 'add', func: 'addParameter' },
					{ value: 'create', func: 'addParameter' },
					{ value: 'subtract', func: 'deleteParameter' },
					{ value: 'delete', func: 'deleteParameter' }
				],
				defaultFunc: 'addParameter'
			}
		],

		addedNouns: [ ],

		verbs: [
			{ value: 'add' },
			{ value: 'create' }
		],

		prepositions: [
			{ value: 'to' },
			{ value: 'on' },
			{ value: 'from' }
		],

		addNoun: function( noun, extendNoun ) {
			var nNounObj = {};

			for( var i in extendNoun ) {
				nNounObj[ i ] = extendNoun[ i ];
			}

			nNounObj.extendedNoun = extendNoun.value;
			nNounObj.value = noun.toLowerCase();

			Dictionary.addedNouns.push( nNounObj );
		}
	};


	function Parser() {}

	Parser.prototype.parse = function( value ) {
		var rVal = [];

		var speechArr = value.split( ' ' );
		var scrubbedArr = speechArr.concat();
		var splitScrubbed = [];

		//clean up this array of junk
		for( var i = scrubbedArr.length - 1; i >= 0; i-- ) {
			for( var j = 0; j < Dictionary.ignore.length; j++ ) {
				if( this.isIgnore( scrubbedArr[ i ] ) != -1 ) {
					scrubbedArr.splice( i, 1 );
				}
			}
		}


		//split the command by the word with
		var splitStart = 0;
		for( var i = 0; i < scrubbedArr.length; i++ ) {

			//with a function called X
			//and add a function called X
			if( scrubbedArr[ i ] == 'with' || ( scrubbedArr[ i ] == 'and' && 
												this.isVerb( scrubbedArr[ i + 1 ] ) != -1 && 
												this.isNoun( scrubbedArr[ i + 2 ] ) != -1 )) {

				splitScrubbed[ splitScrubbed.length ] = scrubbedArr.slice( splitStart, i );
				splitStart = i + 1;
			}
		}

		//add in the final bit to split scrubbed
		splitScrubbed[ splitScrubbed.length ] = scrubbedArr.slice( splitStart, i + 1 );



		//now parse out each bit
		for( var i = 0; i < splitScrubbed.length; i++ ) {
			rVal.push( this.parseScrubbed( splitScrubbed[ i ] ) );
		}


		
		return rVal;	
	};

	Parser.prototype.parseScrubbed = function( scrubbedArr ) {
		var rValItem = {};
		var nounIndices = [];

		//actOn is going to be what this command should act on
		rValItem.actOn = null;

		//find what we want to apply this function to look for prepositions (on, to)
		//if we find one we we want to delete the preposition and the noun so the rest can
		//take precedence
		for( var i = 0; i < scrubbedArr.length; i++ ) {
			if( this.isPreposition( scrubbedArr[ i ] ) != -1 ) {
				//now that we found a preposition we want to find a noun what to add to
				//note the nouns dictionary should grow as this program is used
				if( this.isNoun( scrubbedArr[ i + 1 ] ) != -1 &&  
					( scrubbedArr[ i + 2 ] == 'called' || scrubbedArr[ i + 2 ] == 'named' )) {

					var combinedWord = '';
					for( var j = i + 3; j < scrubbedArr.length; j++ ) {
						combinedWord += scrubbedArr[ j ];

						if( this.isAddedNoun( combinedWord ) != -1 ) {
							//now we need to add up all remaining words to check if its an added noun
							rValItem.actOn = combinedWord;
							scrubbedArr.splice( i, ( j + 1 ) - i );

							break;
						}
					}
				} else {
					var combinedWord = '';

					for( var j = i + 1; j < scrubbedArr.length; j++ ) {
						combinedWord += scrubbedArr[ j ];

						if( this.isAddedNoun( combinedWord ) != -1 ) {
							//now we need to add up all remaining words to check if its an added noun
							rValItem.actOn = combinedWord;
							scrubbedArr.splice( i, ( j + 1 ) - i );

							break;
						}
					}
				}
			}
		}



		//now find the indices of the nouns
		for( var i = 0; i < scrubbedArr.length; i++ ) {
			for( var j = 0; j < Dictionary.nouns.length; j++ ) {
				var idx = this.isNoun( scrubbedArr[ i ] );

				if( idx != -1 ) {
					nounIndices.push( { wordIDX: i, dictionaryIDX: idx } );
				}
			}
		}




		//figure out major action or key noun
		if( nounIndices.length > 0 ) {

			var nounIdx = nounIndices[ 0 ].dictionaryIDX;
			var followingWordIDX = nounIndices[ 0 ].wordIDX + 1;
			var followingWord = scrubbedArr[ followingWordIDX ];

			//check if there is a preceding verb such as create, add, subtract, delete
			if( nounIndices[ 0 ].wordIDX > 0 ) {
				var precedingWordIDX = nounIndices[ 0 ].wordIDX - 1;
				var precedingWord = scrubbedArr[ precedingWordIDX ];

				var verbIDX = this.isVerbForNoun( precedingWord, nounIndices[ 0 ].dictionaryIDX );

				//this was not a registered verb
				if( verbIDX != -1 ) {
					rValItem.func = Dictionary.nouns[ nounIdx ].verbs[ verbIDX ].func;
				}
			} else {

				//since the first word is the key noun we'll use the defaultFunc for this key noun
				rValItem.func = Dictionary.nouns[ nounIdx ].defaultFunc;
			}

				


			//we know what to do for this key nouyn
			if( rValItem.func ) {
				if( followingWord == 'named' || followingWord == 'name' || followingWord == 'called' || followingWord == 'call' ) {
					for( var i = followingWordIDX + 1; i < scrubbedArr.length; i++ ) {
						if( rValItem.parameters == null ) {
							rValItem.parameters = [];
							rValItem.parameters[ 0 ] = scrubbedArr[ i ];
						} else {
							rValItem.parameters[ 0 ] +=	scrubbedArr[ i ].charAt( 0 ).toUpperCase() + scrubbedArr[ i ].substr( 1 );
						}
					}

					if( rValItem.parameters == null ) {
						rValItem.error = 'no parameters for function';
						rValItem.parsed = false;	
					} else {
						//because we got something we want to add it to the nouns list
						Dictionary.addNoun( rValItem.parameters[ 0 ], Dictionary.nouns[ nounIdx ] );
					}
				} else {
					rValItem.error = 'no name for key noun for creation';
					rValItem.parsed = false;
				}

			} else {
				rValItem.error = 'not parsed because perceding word to key noun was not a verb or we have no function for that key noun';
				rValItem.parsed = false;
			}
		} else {
			rValItem.error = 'not parsed since we have no key nouns';
			rValItem.parsed = false;
		}

		return rValItem;
	};

	Parser.prototype.isIgnore = function( word ) {
		var foundIdx = -1;

		for( var j = 0; j < Dictionary.ignore.length; j++ ) {
			if( word == Dictionary.ignore[ j ].value ) {
				foundIdx = j;
				break;
			}
		}

		return foundIdx;
	};

	Parser.prototype.isNoun = function( word ) {
		var foundIdx = -1;

		for( var j = 0; j < Dictionary.nouns.length; j++ ) {
			if( word == Dictionary.nouns[ j ].value ) {
				foundIdx = j;
				break;
			}
		}

		return foundIdx;
	};

	Parser.prototype.isAddedNoun = function( word ) {
		var foundIdx = -1;

		for( var j = 0; j < Dictionary.addedNouns.length; j++ ) {
			if( word == Dictionary.addedNouns[ j ].value ) {
				foundIdx = j;
				break;
			}
		}

		return foundIdx;
	};

	Parser.prototype.isVerb = function( word ) {
		var foundIdx = -1;

		for( var j = 0; j < Dictionary.verbs.length; j++ ) {
			if( word == Dictionary.verbs[ j ].value ) {
				foundIdx = j;
				break;
			}
		}

		return foundIdx;
	};

	Parser.prototype.isPreposition = function( word ) {
		var foundIdx = -1;

		for( var j = 0; j < Dictionary.prepositions.length; j++ ) {
			if( word == Dictionary.prepositions[ j ].value ) {
				foundIdx = j;
				break;
			}
		}

		return foundIdx;
	};

	Parser.prototype.isVerbForNoun = function( possibleVerb, nounDictionaryIDX ) {
		var verbs = Dictionary.nouns[ nounDictionaryIDX ].verbs;
		var foundIdx = -1;

		for( var i = 0; i < verbs.length; i++ ) {
			if( verbs[ i ].value == possibleVerb ) {
				foundIdx = i;
				break;
			}
		}

		return foundIdx;
	};



	return Parser;
});