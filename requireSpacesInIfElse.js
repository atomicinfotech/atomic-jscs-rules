/**
 * Requires space before `()` or `{}` in if/else blocks.
 *
 * Type: `Object`
 *
 * Values: `"beforeOpeningRoundBrace"` and `"beforeOpeningCurlyBrace"` as child properties.
 * Child properties must be set to `true`.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInIfElse": {
 *	 "beforeOpeningRoundBrace": true,
 *	 "beforeOpeningCurlyBrace": true
 * }
 * ```
 *
 * ##### Valid
 *
 * ```js
 *
 * ```
 *
 * ##### Invalid
 *
 * ```js
 *
 *
 * ```
 * NOTE: this rule was based on the requireSpacesInFunctionDeclaration rule
 *
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
	configure : function(options) {
		assert(
			typeof options === 'object',
			this.getOptionName() + ' option must be the object'
		);

		if ('beforeOpeningRoundBrace' in options) {
			assert(
				options.beforeOpeningRoundBrace === true,
				this.getOptionName() + '.beforeOpeningRoundBrace ' +
				'property requires true value or should be removed'
			);
		}

		if ('beforeOpeningCurlyBrace' in options) {
			assert(
				options.beforeOpeningCurlyBrace === true,
				this.getOptionName() + '.beforeOpeningCurlyBrace ' +
				'property requires true value or should be removed'
			);
		}

		assert(
			options.beforeOpeningCurlyBrace || options.beforeOpeningRoundBrace,
			this.getOptionName() + ' must have beforeOpeningCurlyBrace or beforeOpeningRoundBrace property'
		);

		this._beforeOpeningRoundBrace = Boolean(options.beforeOpeningRoundBrace);
		this._beforeOpeningCurlyBrace = Boolean(options.beforeOpeningCurlyBrace);
	},

	getOptionName : function() {
		return 'requireSpacesInIfElse';
	},

	check : function(file, errors) {
		var beforeOpeningRoundBrace = this._beforeOpeningRoundBrace;
		var beforeOpeningCurlyBrace = this._beforeOpeningCurlyBrace;

		file.iterateNodesByType(['IfStatement'], function(node) {
			var ifToken,elseToken;
			
			if (beforeOpeningRoundBrace) {
				ifToken = file.getFirstNodeToken(node);
				
				errors.assert.whitespaceBetween({
					token     : ifToken,
					nextToken : file.getNextToken(ifToken),
					message   : 'Missing space before opening round brace'
				});
			}
			
			if (beforeOpeningCurlyBrace) {
				ifToken = file.getFirstNodeToken(node.consequent);
				
				errors.assert.whitespaceBetween({
					token     : file.getPrevToken(ifToken),
					nextToken : ifToken,
					message   : 'Missing space before opening curly brace'
				});
				
				if (
					node.alternate
					&& node.consequent
					&& node.consequent.type == "BlockStatement"
				) {
					elseToken = file.getLastNodeToken(node.consequent);
					
					errors.assert.whitespaceBetween({
						token     : elseToken,
						nextToken : file.getNextToken(elseToken),
						message   : 'Missing space after closing curly brace'
					});
				}
				
				if (node.alternate && node.alternate.type == "BlockStatement") {
					elseToken = file.getFirstNodeToken(node.alternate);
					
					errors.assert.whitespaceBetween({
						token     : file.getPrevToken(elseToken),
						nextToken : elseToken,
						message   : 'Missing space before opening curly brace'
					});
				}
			}
		});
	}

};
