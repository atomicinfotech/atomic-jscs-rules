/**
 * Disallows a specified set of identifier names with custom error messages.
 *
 * Type: `Array`
 *
 * Values: Array of strings, which should be disallowed as identifier names
 *
 * #### Example
 *
 * ```js
 *"disallowIdentifierNamesWithMessages": [
 *  "parseFloat",
 *  ["parseInt","parseInt(n) has unexpected behavior, use int(n) instead"]
 *]
 * ```
 *
 * ##### Valid
 *
 * ```js
 *
 *
 *
 * ```
 *
 * ##### Invalid
 *
 * ```js
 *
 *
 *
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
	configure : function(identifiers) {
		var allowAfter;
		
		assert(
			Array.isArray(identifiers),
			'disallowIdentifierNamesWithMessages option requires an array'
		);
		
		this._identifierIndex = {};
		this._allowAfter = {};
		for (var i = 0, l = identifiers.length; i < l; i++) {
			allowAfter = [];
			
			if (Array.isArray(identifiers[i])) {
				this._identifierIndex[identifiers[i][0]] = identifiers[i][1];
				
				allowAfter = (identifiers[i][2] instanceof Array)
					? identifiers[i][2]
					: (typeof identifiers[i][2] == 'undefined' || identifiers[i][2] === null)
						? []
						: [identifiers[i][2]];
				
				this._allowAfter[identifiers[i][0]] = allowAfter;
			}
			else {
				this._identifierIndex[identifiers[i]] = "Illegal Identifier Name: " + identifiers[i];
				this._allowAfter[identifiers[i]] = [];
			}
		}
	},
	getOptionName : function() {
		return 'disallowIdentifierNamesWithMessages';
	},
	check : function(file, errors) {
		var disallowedIdentifiers = this._identifierIndex;
		var allowList = this._allowAfter;
		
		file.iterateNodesByType('Identifier', function(node) {
			if (Object.prototype.hasOwnProperty.call(disallowedIdentifiers, node.name)) {
				if (
					node.parentNode
					&& node.parentNode.object
					&& node.parentNode.object.type == 'Identifier'
				) {
					if (
						allowList[node.name].length === 1
						&& allowList[node.name][0] === '*'
					) return;
					
					for(var i = 0;i < allowList[node.name].length;i++) {
						if (node.parentNode.object.name == allowList[node.name][i]) {
							return;
						}
					}
				}
				
				errors.add(disallowedIdentifiers[node.name], node.loc.start);
			}
		});
		file.iterateNodesByType('MemberExpression', function(node) {
			if (node.property.type === 'Literal') {
				if (Object.prototype.hasOwnProperty.call(disallowedIdentifiers, node.property.value)) {
					errors.add(disallowedIdentifiers[node.property.value], node.property.loc.start);
				}
			}
		});
	}
};
