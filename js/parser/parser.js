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
		this.defaultVerbForNoun = {};
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
	Parser.prototype.defaultVerbForNoun = null;


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

	Parser.prototype.addDefaultVerbForNoun = function( word, verb ) {
		this.defaultVerbForNoun[ word ] = verb;
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

			//this if statement will check if a verb hasnt been found but a basenoun has
			//if so we'll use the default verb
			if( parsedData.baseNoun && parsedData.verb == null && this.defaultVerbForNoun[ parsedData.baseNoun ] ) {
				parsedData.verb = this.defaultVerbForNoun[ parsedData.baseNoun ];
			}


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
		var splitStatements = statement;

		for( var i = 0, len = this.separators.length; i < len; i++ ) {
			splitStatements = splitStatements.split( this.separators[ i ] );

			//now we want to go through each statement part and check if there are nouns
			//if we don't have any nouns then we should not have split that part out
			//eg. this would be for a case where a separator is in a function name
			for( var j = 0; j < splitStatements.length; j++ ) {
				var hasNoun = false;

				for( var k = 0, len2 = this.nouns.length; k < len2; k++ ) {
					if( this.indexOfWholeWord( splitStatements[ j ], this.nouns[ k ] ) > -1 ) {
						hasNoun = true;
						break;
					}
				}

				if( !hasNoun ) {
					for( var k = 0, len2 = this.learnedNouns.length; k < len2; k++ ) {
						if( this.indexOfWholeWord( splitStatements[ j ], this.learnedNouns[ k ] ) > -1 ) {
							hasNoun = true;
							break;
						}
					}
				}

				//now if we wont don't have nouns we want to combine to another part
				if( !hasNoun ) {
					//add this statement part to the next one
					if( j < splitStatements.length - 1 ) {
						splitStatements[ j + 1 ] = splitStatements[ j ] + this.separators[ i ] + splitStatements[ j + 1 ];
						splitStatements.splice( i, 1 );
					//add it to the previous one since this is the last item
					//if there is a previous one that is
					} else if( splitStatements.length > 1 ) {
						splitStatements[ j - 1 ] = splitStatements[ j - 1 ] + this.separators[ i ] + splitStatements[ j ];
						splitStatements.splice( i, 1 );
					}
				}
			}

			splitStatements = splitStatements.join( '||' );
		}

		return splitStatements.split( '||' );
	};

	Parser.prototype.parseOutFirstVerb = function( statement, parsedData ) {
		var idx = statement.length;
		var word = null;
		parsedData.verb = null;

		for( var i = 0, len = this.verbs.length; i < len; i++ ) { 
			var curIdx =  this.indexOfWholeWord( statement, this.verbs[ i ] );

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
		parsedData.actOn = null;

		for( var i = 0, len = this.prepositions.length; i < len; i++ ) { 
			var cPreposition = this.prepositions[ i ];
			var cPrepsositionIdx = this.indexOfWholeWord( statement, cPreposition );
			var startSpaceIdx = cPrepsositionIdx + cPreposition.length + 1;

			//if we found a preposition
			if( cPrepsositionIdx > -1 ) {
				//we'll start looking from the preposition index forward and see if we find nouns
				var endSpaceIndex = statement.indexOf( ' ', startSpaceIdx + 1 );

				if( endSpaceIndex == -1 ) {
					endSpaceIndex = statement.length;
				}

				var currentLearnedNoun = null;

				while( endSpaceIndex > 0 ) {
					var cPossibleNoun = statement.substring( startSpaceIdx, endSpaceIndex );

					if( ! this.isLearnedNoun( cPossibleNoun ) ) {
						break;
					} else {
						parsedData.actOn = cPossibleNoun;
					}


					if( endSpaceIndex != statement.length )
					{
						var endSpaceIndex = statement.indexOf( ' ', endSpaceIndex + 1 );

						if( endSpaceIndex == -1 ) {
							endSpaceIndex = statement.length;
						}
					} else {
						break;
					}
				}

				//break out of proposition loop
				//since we found a propostion
				break;
			}
		}

		if( parsedData.actOn !== null )  {
			statement = this.removeAtIdx( statement, startSpaceIdx, parsedData.actOn );
		}


		return statement;
	};

	Parser.prototype.parseOutNouns = function( statement, parsedData ) {
		parsedData.baseNoun = null;

		for( var i = 0, len = this.nouns.length; i < len; i++ ) { 
			var cNoun = this.nouns[ i ];
			var nounIdx = this.indexOfWholeWord( statement, cNoun );

			if( nounIdx != -1 ) {
				parsedData.baseNoun = cNoun;
				statement = this.removeAtIdx( statement, nounIdx, cNoun );
			}
		}	

		for( var i = 0, len = this.learnedNouns.length; i < len; i++ ) { 
			var cNoun = this.learnedNouns[ i ];
			var nounIdx = this.indexOfWholeWord( statement, cNoun );

			if( nounIdx != -1 ) {
				if( parsedData.baseNoun == null ) {
					parsedData.baseNoun = this.baseNounForLearned[ cNoun ];
				}

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
				var learningIdx = this.indexOfWholeWord( statement, cLearning );

				if( learningIdx != -1 ) {
					var nNounIdx = learningIdx + cLearning.length; //+1 for space

					if( nNounIdx != statement.length ) {
						parsedData.noun = statement.substr( nNounIdx + 1, statement.length ).trim();
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

	Parser.prototype.indexOfWholeWord = function( statement, word ) {
		var startIdx = statement.indexOf( word );
		var endIdx = startIdx + word.length;

		if( startIdx != -1 ) {
			if( startIdx == 0 ) {
				// if this is not at the end of the statement and the character after is not a space
				// then this is not a whole word
				if( endIdx != statement.length && statement.charAt( endIdx ) != ' ' ) {
					startIdx = -1;
				}
			} else if( startIdx == statement.length - word.length ) {
				// if the character before the start index is not a space then it's not a whole word
				if( statement.charAt( startIdx - 1 ) != ' ' ) {
					startIdx = -1;
				}
			} else {
				// if there are no space characters before and after then it's not a whole word
				if( statement.charAt( startIdx - 1 ) != ' ' || statement.charAt( endIdx ) != ' ' ) {
					startIdx = -1;
				}
			}
		}

		return startIdx;
	}

	Parser.prototype.removeAtIdx = function( statement, i, word ) {
		var rVal = statement.substring( 0, i - 1 ) + statement.substring( i + word.length, statement.length );	
		
		return rVal;
	}


	return Parser;
});