/**
 * label - string: property name
 * values - [] or [ [], [] ]
 * key - string: property key
 * dimension - string: property dimension
 */
var Feed = require('../models/feed');
var lang = require('./lang');
var dimension = require('./dimension');
var _ = require('lodash');

function convertValue(key, val) {
    if (key === 'feedType') {
        return lang(val);
    } else if (_.isBoolean(val)) {
        return lang(val);
    }
    return val;
}

function convertToControl(item) {
    return _.map(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            return {
                label: lang(key),
                dimension: dimension(key),
                key: key,
                values: value.values,
                children: (value && 
                			!value.values && 
                			!_.isArray(value) && 
                			!_.isNumber(value) && 
                			!_.isString(value)) 
                ? convertToControl(value) : 
                null
            }
        }
    });
};

function getDiff(feeds) {
    var rows = [];
    var allProps = Feed.getSkeleton();
    var result = {
        diff: {}
    };
    _.each(allProps, function(props) {
        _.each(feeds, function(feed) {

        	var isNaturalWet = feed.analysis.isNaturalWet;

            var lastProp;
            var lastValue = null;
            _.each(props, function(prop, index) {
                // get value
                if (lastValue && _.isArray(lastValue)) {
                    lastValue = _.map(lastValue, prop);
                } else {
                    lastValue = lastValue ? lastValue[prop] : feed[prop];
                }
                // get property
                if (lastProp) {
                    if (!lastProp[props[index - 1]][prop]) {
                        lastProp[props[index - 1]][prop] = {
                            values: [lastValue]
                        };
                    } else {
                        lastProp[props[index - 1]][prop].values.push(lastValue);
                    }
                    lastProp = lastProp[props[index - 1]];
                } else {
                    if (!result.diff[prop]) {
                        result.diff[prop] = {};
                    }
                    lastProp = result.diff;
                }
            });
        });
    });

    var diffs = [{
        label: lang('general'),
        key: 'general',
        children: convertToControl(result.diff['general'])
    }, {
        label: lang('analysis'),
        key: 'analysis',
        children: convertToControl(result.diff['analysis'])
    }, {
        label: lang('harvest'),
        key: 'harvest',
        children: convertToControl(result.diff['harvest'])
    }, {
        label: lang('feeding'),
        key: 'feeding',
        children: convertToControl(result.diff['feeding'])
    }];

    return {
    	headers: _.map(feeds, 'general'),
    	diffs: diffs
    } 
}
module.exports = getDiff;