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
var propertyForRecalculate = ['milkAcid', 'aceticAcid', 'oilAcid', 'dve', 'oeb', 'vos', 'vcos', 'fos', 'nel', 'nelvc', 'exchangeEnergy', 'nxp', 'rnb', 'udp', 'crudeAsh', 'nh3', 'nitrates', 'crudeProtein', 'solubleCrudeProtein', 'crudeFat', 'sugar', 'starch', 'starchPasses', 'crudeFiber', 'ndf', 'adf', 'adl', 'calcium', 'phosphorus', 'carotene', ];

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
                children: (value && !value.values && !_.isArray(value) && !_.isNumber(value) && !_.isString(value)) ? convertToControl(value) : null
            }
        }
    });
};

function getDiff(feeds) {
    var rows = [];
    var allProps = Feed.getSkeleton();
    var result = {
        diff: {},
        dryRawValues: []
    };
    _.each(allProps, function(props) {
        _.each(feeds, function(feed, feedIndex) {
            var isNaturalWet = feed.analysis.isNaturalWet;
            var lastProp = null;
            var lastValue = null;

            _.each(props, function(prop, index) {

                // set dryRawValues
                if (prop === 'isNaturalWet') {
                    result.dryRawValues.push(_.map(lastValue, 'isNaturalWet'));   
                }

                // get value
                if (lastValue && _.isArray(lastValue)) {
                    lastValue = _.map(lastValue, prop);
                } else {
                    lastValue = lastValue ? lastValue[prop] : feed[prop];
                }
                // get property
                if (lastProp) {
                    var dryWetValue;
                    var canBerecalcalated = _.some(propertyForRecalculate, function(p) {
                        return p === prop;
                    });
                    // get dry and wet value
                    if (canBerecalcalated) {
                        dryWetValue = [];
                        _.forEach(lastProp.analysis.dryMaterial.values[feedIndex], function(val, index1) {

                            if (!_.isNumber(lastValue[index1])) {
                                dryWetValue.push({
                                    dryValue: null,
                                    rawValue: null
                                });    
                            } else {
                                var dryMaterial = val / 100;
                                var calc = Math.round(lastValue[index1] * dryMaterial * 100) / 100;
                                dryWetValue.push({
                                    dryValue: isNaturalWet ? calc : lastValue[index1],
                                    rawValue: isNaturalWet ? lastValue[index1] : calc
                                });    
                            }
                        });
                    }
                    if (!lastProp[props[index - 1]][prop]) {
                        lastProp[props[index - 1]][prop] = {
                            values: [dryWetValue || lastValue]
                        };
                    } else {
                        lastProp[props[index - 1]][prop].values.push(dryWetValue || lastValue);
                    }
                    lastProp = lastProp[props[index - 1]];
                    dryWetValue = null;
                        
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
        dryRawValues: result.dryRawValues,
        headers: _.map(feeds, 'general'),
        diffs: diffs
    }
}
module.exports = getDiff;