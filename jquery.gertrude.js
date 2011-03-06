/*!
 * Gertrude plugin for jQuery v0.0.1
 * https://github.com/richmarr/gertrude
 * Copyright 2011, Richard Marr
 * Free to use, modify or redistribute.
 */
(function($) {
	
	// Module libs, exposed with a namespace in case they're unexpectedly useful
	$.gertrude = {
		// Takes an input string, entity definition, and optional string methods and returns matches
		textToEntities : function( entities, tokeniser, normaliser, input ){
			var words = tokeniser ? tokeniser(input) : input.split(/[\s\.,]+/ig); // use a custom tokeniser or [\s\.,]
			if (!normaliser) normaliser = function(a){return a;}; // default to null normaliser
			var found = [];
			for ( var i = 0; i < words.length; i++ )
			{
				// need a clean way to associate adjectives/modifiers with nouns/entities
				var entity = entities[normaliser(words[i])];
				if ( entity ) found.push(entity);
			}
			return found;
		},
		// This just iterates through two arrays testing for equality. Must be a better way to do this.
		entitylistequals = function( a, b ){
			if ( a.length != b.length ) return false;
			for ( var i = 0; i < a.length; i++ )
			{
				if ( a[i] != b[i] ) return false;
			}
			return true;
		}
	};
	
	/*	
	 *	This is the public method used to bind DOM elements to the entity recognition
	 *	and downstream event handlers. Usage is (predictably) as follows:
	 *			$("#foo .bar").entitychange( options );
	 *	options takes the form: 
	 *			{
	 *				entities : {
	 *					foo : {custom:'any customer properties make this a recognisable entity'},
	 *					bar : {modifier:'this property means this word is attached to a nearby entity'}
	 *				}
	 *				entitychange : function( event, discoveredEntities ) { ... handler code here ... },
	 *				normaliser : function( stringToNormalise ) { ... optional function to stem or depluralise terms ... },
	 *				tokeniser : function( stringToTokenise ) { ... optional function to tokenise a string into an array of strings ... }
	 *			} 
	 */
	$.fn.entitychange = function(opt){
		var entities = opt.entities, fn = opt.entitychange, tokeniser = opt.tokeniser, normaliser = opt.normaliser;
		// bind the client code's handler to the chosen DOM objects
		var $this = $(this);
		if ( fn ) $this.bind('entitychange',fn);
		// bind the entity analysis to each key action
		$this.keyup(function(e){
			// currently a brute-force implementation that may suffer poor performance with larger bodies of text
			var el = $(this);
			var found = $.gertrude.textToEntities( entities, tokeniser, normaliser, el.val() ); // get the current entity set
			if ( found.length > 0 && !$.gertrude.entitylistequals(found,el.data("gertrude.entities")) ) {
				el.trigger({
					type:"entitychange",
					found:found,
					latest:found[found.length-1] // assumes incorrectly that the latest is the new one?
				}); // if there's a new entity then trigger the event on this DOM object
			}
			el.data("gertrude.entities", found); // save to do a diff later
		});
	}
	
})(jQuery);