define( function() {
	
	var Parser = function() { 
		this.separators = [];
		this.separatorLookUp = {};
		this.verbs = [];
		this.verbLookUp = {};
		this.prepositions = [];
		this.prepositionLookUp = {};
		this.nouns = [];
		this.nounLookUp = {};
		this.learnedNouns = [];
		this.baseNounForLearned = {};
		this.learnedNounLookUp = {};
		this.verbsForNouns = {};
		this.learningKeyWords = [];
		this.learningKeyWordLookUp = {};
		this.associations = {};
	};

	Parser.prototype.separators = null;
	Parser.prototype.separatorLookUp = null;
	Parser.prototype.verbs = null;
	Parser.prototype.verbLookUp = null;
	Parser.prototype.prepositions = null;
	Parser.prototype.prepositionLookUp = null;
	Parser.prototype.nouns = null;
	Parser.prototype.nounLookUp = null;
	Parser.prototype.learnedNouns = null;
	Parser.prototype.baseNounForLearned = null;
	Parser.prototype.learnedNounLookUp = null;
	Parser.prototype.verbsForNouns = null;
	Parser.prototype.learningKeyWords = null;
	Parser.prototype.learningKeyWordLookUp = null;
	Parser.prototype.associations = null;


	Parser.prototype.addSeparator = function( word ) {
		this.separators.push( word );
		this.separatorLookUp[ word ] = true;
	};

	Parser.prototype.isSeparator = function( word ) {
		return this.separatorLookUp[ word ];
	};

	Parser.prototype.addVerbForNouns = function( word ) {
		this.verbs.push( word );
		this.verbLookUp[ word ] = true;

		for( var i = 1, len = arguments.length; i < len; i++ ) {
			var noun = arguments[ i ];

			if( this.verbsForNouns[ noun ] === undefined ) {
				this.verbsForNouns[ noun ] = [];
			}

			this.verbsForNouns[ noun ].push( word );
		}
	};

	Parser.prototype.isVerb = function( word ) {
		return this.verbLookUp[ word ];
	};

	Parser.prototype.addPreposition = function( word ) {
		this.prepositions.push( word );
		this.prepositionLookUp[ word ] = true;
	};

	Parser.prototype.isPreposition = function( word ) {
		return this.prepositionLookUp[ word ];
	};

	Parser.prototype.addNoun = function( word, baseNoun ) {
		this.nouns.push( word );
		this.nounLookUp[ word ] = true;

		if( baseNoun !== undefined ) {
			if( this.verbsForNouns[ baseNoun ] === undefined ) {
				throw new Error( 'Base noun is not defined previously or no verbs have been defined for it' );
			}

			this.verbsForNouns[ word ] = this.verbsForNouns[ baseNoun ];
		}
	};

	Parser.prototype.isNoun = function( word ) {
		return this.nounLookUp[ word ];
	};

	Parser.prototype.addLearnedNoun = function( word, baseNoun ) {
		this.learnedNouns.push( word );
		this.learnedNounLookUp[ word ] = true;
		this.baseNounForLearned[ word ] = baseNoun;

		if( baseNoun !== undefined ) {
			if( this.verbsForNouns[ baseNoun ] === undefined ) {
				throw new Error( 'Base noun is not defined previously or no verbs have been defined for it' );
			}

			this.verbsForNouns[ word ] = this.verbsForNouns[ baseNoun ];
		}
	};

	Parser.prototype.isLearnedNoun = function( word ) {
		return this.learnedNounLookUp[ word ];
	};

	Parser.prototype.addLearningKeyword = function( word ) {
		this.learningKeyWords.push( word );
		this.learningKeyWordLookUp[ word ] = true;
	};

	Parser.prototype.isLearningKeyword = function( word ) {
		return this.learningKeyWordLookUp[ word ];
	};

	Parser.prototype.addAssociation = function( noun, verb, item ) {
		if( this.associations[ noun ] === undefined ) {
			this.associations[ noun ] = {};
		}

		this.associations[ noun ][ verb ] = item;
	};


	Parser.prototype.parse = function( statement, allowLearning ) {
		if( allowLearning === undefined ) {
			allowLearning = true;
		}

		var separated = this.separateStatement( statement );
		var parsedCommands = [];

		for( var i = 0, len = separated.length; i < len; i++ ) {
			var parsedData = {};

			separated[ i ] = this.parseOutFirstVerb( separated[ i ], parsedData );
			separated[ i ] = this.parseOutPrepositionAndNoun( separated[ i ], parsedData );
			separated[ i ] = this.parseOutNouns( separated[ i ], parsedData );
			separated[ i ] = this.parseOutAndLearnNouns( separated[ i ], parsedData, allowLearning );

			if( this.associations[ parsedData.baseNoun ] ){
				parsedData.func = this.associations[ parsedData.baseNoun ][ parsedData.verb ];	
				parsedData.parameter = parsedData.noun;
			} else {
				parsedData.func = null;
				parsedData.parameter = null;
			}
			
			parsedCommands.push( parsedData );
		}

		return parsedCommands;
	};


	/*
	The following are steps to parse out statements

	1) statement separators
	2) verbs
	3) preposition
	4) key nouns
	5) learned nouns
	*/
	Parser.prototype.separateStatement = function( statement, parsedData ) {
		for( var i = 0, len = this.separators.length; i < len; i++ ) {
			statement.split( this.separators[ i ] ).join( '||' );
		}

		return statement.split( '||' );
	};

	Parser.prototype.parseOutFirstVerb = function( statement, parsedData ) {
		var idx = statement.length;
		var word = null;
		parsedData.verb = null;

		for( var i = 0, len = this.verbs.length; i < len; i++ ) { 
			var curIdx = statement.indexOf( this.verbs[ i ] );

			//if we found a verb we want to check if this verb is
			//earlier in the sentence we do this because
			if( curIdx > -1 && i < idx ) {
				word = this.verbs[ i ];
				idx = curIdx;
			}
		}

		if( word !== null ) {
			statement = this.removeAtIdx( statement, idx, word );

			parsedData.verb = word;
		}

		return statement;
	};

	Parser.prototype.parseOutPrepositionAndNoun = function( statement, parsedData ) {
		parsedData.actOn = [];

		for( var i = 0, len = this.prepositions.length; i < len; i++ ) { 
			var actOnIdx = parsedData.actOn.length;
			var cPreposition = this.prepositions[ i ];
			var cPrepsositionIdx = statement.indexOf( cPreposition );
			var nextWordIdx = -1;

			//if we found a preposition
			if( cPrepsositionIdx > -1 ) {
				//this is where the next word after preposition starts
				nextWordIdx = cPrepsositionIdx + cPreposition.length + 1; //+1 because of a space

				//if nextWordIdx is the same length as the statement its the end of the
				//statement and we shouldn't continue on further
				if( nextWordIdx < statement.length ) {
					var nextWordEndIdx = statement.indexOf( ' ', nextWordIdx );
					
					if( nextWordEndIdx == -1 ) {
						nextWordEndIdx = statement.length;
					}

					while( nextWordEndIdx != -1 || nextWordEndIdx == statement.length ) {
						var potentialNoun = statement.substring( nextWordIdx, nextWordEndIdx );

						//if this is a noun then we'll add it to the list of nouns to
						//act on if it's not a noun stop looking further
						if( this.isLearnedNoun( potentialNoun ) ) {
							parsedData.actOn[ actOnIdx ] = potentialNoun;
						} else {
							break;
						}

						//if we're not at the end of the statement we'll continue looking for words
						if( nextWordEndIdx != statement.length ) {
							nextWordEndIdx = statement.indexOf( ' ', nextWordEndIdx );

							if( nextWordEndIdx == -1 ) {
								nextWordEndIdx = statement.length;
							}
						} else {
							//because we're at the end of the statement we'll break out
							break;
						}
					}
				}
			}

			//if we added an item to act on we'll remove the preposition and noun
			//if the actOnIdx is not the same as the lenght then an item to act on was added
			if( actOnIdx != parsedData.actOn.length ) {
				statement = this.removeAtIdx( statement, cPrepsositionIdx, cPreposition + ' ' + parsedData.actOn[ actOnIdx ] );
			}
		}

		return statement;
	};

	Parser.prototype.parseOutNouns = function( statement, parsedData ) {
		parsedData.baseNoun = null;

		for( var i = 0, len = this.nouns.length; i < len; i++ ) { 
			var cNoun = this.nouns[ i ];
			var nounIdx = statement.indexOf( cNoun );

			if( nounIdx != -1 ) {
				parsedData.baseNoun = cNoun;
				statement = this.removeAtIdx( statement, nounIdx, cNoun );
			}
		}	


		for( var i = 0, len = this.learnedNouns.length; i < len; i++ ) { 
			var cNoun = this.learnedNouns[ i ];
			var nounIdx = statement.indexOf( cNoun );

			if( nounIdx != -1 ) {
				parsedData.baseNoun = this.baseNounForLearned[ cNoun ];
				parsedData.noun = cNoun;

				statement = this.removeAtIdx( statement, nounIdx, cNoun );
			}
		}

		return statement;
	};

	Parser.prototype.parseOutAndLearnNouns = function( statement, parsedData, allowLearning ) {
		if( parsedData.noun === undefined ) {
			parsedData.noun = null;

			//if we don't have a a noun then we'll try to learn a noun if there is something present
			for( var i = 0, len = this.learningKeyWords.length; i < len; i++ ) { 
				var cLearning = this.learningKeyWords[ i ];
				var learningIdx = statement.indexOf( cLearning );

				if( learningIdx != -1 ) {
					var nNounIdx = learningIdx + cLearning.length; //+1 for space

					if( nNounIdx != statement.length ) {
						parsedData.noun = statement.substr( nNounIdx + 1, statement.length );
						statement = this.removeAtIdx( statement, learningIdx, cLearning + ' ' + parsedData.noun );

						//we will learn this noun for future reference
						//and if there is a keyNoun for this statement we'll also 
						if( allowLearning && !this.isLearnedNoun( parsedData.noun ) ) {
							this.addLearnedNoun( parsedData.noun, parsedData.baseNoun );
						}
					}
				}
			}
		}


		return statement;	
	};

	Parser.prototype.removeAtIdx = function( statement, i, word ) {
		var rVal = statement.substring( 0, i - 1 ) + statement.substring( i + word.length, statement.length );	
		
		return rVal;
	}


	return Parser;
});