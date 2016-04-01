/**
 * Disallows leading spaces, except at start of multiline comments
 *
 * Type: `Boolean`
 *
 * Values: true
 *
 * #### Example
 *
 * ```js
 *"disallowLeadingWhitespace": true
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
	configure : function(opt) {
		assert(opt === true,this.getOptionName() + "should be true or omitted");
	},
	getOptionName : function() {
		return 'disallowLeadingWhitespace';
	},
	check : function(file, errors) {
		file.getLines().forEach(function(line, i) {
			var match = line.match(/^ +/);
			var multi_comment = line.match(/^ \*/);
			
			if (match && !multi_comment) {
				errors.add("lead space detected",i + 1,0);
			}
		});
	}
};
