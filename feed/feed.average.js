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
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/' + ('0' + (val.getMonth() + 1)).slice(-2) + '/' + val.getFullYear();
    }
    return val;
}

function convertToControl(item, code) {
    var result = [];
    _.forEach(item, function(value, key) {

        if (item.hasOwnProperty(key)) {
            var allDryValues = [];
            if (code === 'analysis') {
                _.forEach(value.values, function(values) {
                    _.forEach(values, function(value) {
                        if (!_.isNull(value) && _.isNumber(value.dryValue || value)) {
                            allDryValues.push(value.dryValue || value)
                        }
                    });
                });
            }

            // check if some values exist
            var some = _.some(value.values, function(values) {

                if (_.isArray(values)) {
                    return _.some(values, function(value) {
                        if (_.isObject(value)) {

                            return _.isNumber(value.dryValue) && _.isNumber(value.rawValue);
                        } else {
                            return value || _.isBoolean(value) || _.isNumber(value);
                        }
                    });
                } else {
                    return !_.isNull(value);
                }
                
            });
            if (some) {
                result.push({
                    label: lang(key),
                    dimension: dimension(key),
                    key: key,
                    maxDryValue: allDryValues.length ? _.max(allDryValues) : undefined,
                    values: value.values
                });
            }
        }
    });

    return result;
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
            var lastProp = null;
            var lastValue = null;
            _.each(props, function(prop, index) {
                // set dryRawValues
                if (prop === 'isNaturalWet') {
                    result.dryRawValues.push(_.map(lastValue, 'isNaturalWet'));
                }
                // get value
                if (lastValue && _.isArray(lastValue)) {
                    lastValue = _.map(lastValue, prop).filter(function(o) {
                        return !_.isNull(o)
                    });
                } else {
                    lastValue = lastValue ? lastValue[prop] : feed[prop];
                }

                // return for empty lastValue
                //if (_.isArray(lastValue) && _.size(lastValue) === 0) {
                    //return;
                //}

                // get property
                if (lastProp) {
                    var dryWetValue = null;
                    var canBerecalcalated = _.some(propertyForRecalculate, function(p) {
                        return p === prop;
                    });
                    // get dry and wet value
                    if (canBerecalcalated) {
                        _.forEach(lastProp.analysis.dryMaterial.values[feedIndex], function(val, index1) {
                            var isNaturalWet = result.dryRawValues[feedIndex][index1];
                            var dryMaterial = val / 100;
                            var calcRaw = Math.round(lastValue[index1] * dryMaterial * 100) / 100;
                            var calcDry = Math.round((lastValue[index1] / dryMaterial * 100)) / 100;
                            !dryWetValue && (dryWetValue = []);
                            dryWetValue.push({
                                dryValue: isNaturalWet ? calcDry : lastValue[index1],
                                rawValue: isNaturalWet ? lastValue[index1] : calcRaw
                            });
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
        children: convertToControl(result.diff['analysis'], 'analysis')
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