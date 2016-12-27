/**
 * label - string: property name
 * value - string, number: property value
 * key - string: property key
 * dimension - string: property dimension
 * children - Array<object>: children properties
 */
var Feed = require('../models/feed');
var _ = require('lodash');

function getDiff(feeds) {

	var rows = [];
	var allProps = [];
	Feed.schema.eachPath(function(path) {
	    allProps.push(path.split('.'));
	});

	var result = {
		diff: {}
	};

	_.each(allProps, function (props) {

		_.each(feeds, function (feed) {

			var lastProp;
			var lastValue = null;
			_.each(props, function (prop, index) {

				// get value
				lastValue = lastValue ? lastValue[prop] : feed[prop];

				// get property
				if (lastProp) {
					if (!lastProp[props[index-1]][prop]) {
						lastProp[props[index-1]][prop] = {
							values: [lastValue]
						};
					} else {
						lastProp[props[index-1]][prop].values.push(lastValue);
					}
					lastProp = lastProp[props[index-1]];
				} else {
					if (!result.diff[prop]) {
						result.diff[prop] = {};	
					}
					lastProp = result.diff;
				}
			});
		});
	});
	return result.diff;
}

module.exports = getDiff;
