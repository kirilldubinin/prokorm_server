/**
 * label - string: property name
 * values - [] or [ [], [] ]
 * key - string: property key
 * dimension - string: property dimension
 */
var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var _ = require('lodash');

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
    return {
        label: lang(item.key),
        dimension: dimension(item.key),
        key: item.key,
        values: _.map(item.values, function(values) {
            // analysis
            if (_.isArray(values)) {
                return _.map(values, function(value) {
                    if (value && _.isNumber(value.dryValue) && _.isNumber(value.rawValue)) {
                        return value;
                    } else return convertValue(item.key, value);
                });
            } else {
                return convertValue(item.key, values);
            };
        })
    };
};

function filterValueExist(v) {
    if (_.isArray(v)) {
        return _.some(v, function(_v) {
            return filterValueExist(_v);
        });
    } else if (_.isDate(v)) {
        return true;
    } else if (_.isObject(v)) {
        return _.isNumber(v.dryValue) && _.isNumber(v.rawValue);
    } 
    return v;
}

function getAverage(feeds) {

    var rows = [];
    var allProps = Feed.getSkeleton();
    var result = {
        dryRawValues: _.map(feeds, 'analysis').map(function(analys) {
            return _.map(analys, 'isNaturalWet');
        })
    };

    // average isNaturalWet value
    result.dryRawValues.push([false]);

    var goldFeed = Feed.getEmptyFeed();
    var rootProps = ['analysis'];
    result.average = _.map(rootProps, function(rootProp) {
        return {
            label: lang(rootProp),
            key: rootProp,
            children: _.map(_.first(goldFeed['analysis']), function(value, key) {
                var analysisFeeds = _.map(feeds, 'analysis');
                return {
                    key: key,
                    values: _.map(analysisFeeds, function(analys) {
                        return _.map(analys, function(a) {
                            if (feedUtils.propertyForRecalculate[key]) {
                                return feedUtils.calcDryRaw(a.isNaturalWet, a.dryMaterial, a[key])
                            } else {
                                return a[key];
                            }
                        });
                    })
                }
            }).filter(function(averageFeed) {
                return _.some(averageFeed.values, filterValueExist)
            })
            // add average
            .map(function (averageFeed) {
                if (feedUtils.propertyForAverage[averageFeed.key]) {

                    //if (feedUtils.propertyForRecalculate[averageFeed.key]) {
                        var sumByDry = 0;
                        var sumByRaw = 0;
                        var sum = 0;
                        var length = 0;
                        _.forEach(averageFeed.values, function (values) {
                            _.forEach(values, function (value) {
                                //{dryValue: '', rawVakue: ''}
                                if (value !== null) {
                                
                                    if (feedUtils.propertyForRecalculate[averageFeed.key]) {
                                        sumByDry += value.dryValue;
                                        sumByRaw += value.rawValue;
                                    } else sum += value;
                                    length++;
                                }
                            }) 
                        });

                        if (feedUtils.propertyForRecalculate[averageFeed.key]) {
                            averageFeed.values.push([{
                                dryValue: Math.round((sumByDry/length)*100)/100,
                                rawValue: Math.round((sumByRaw/length)*100)/100
                            }]);
                        } else averageFeed.values.push([Math.round((sum/length)*100)/100]);
                    
                } else {
                    averageFeed.values.push(null);
                }

                return averageFeed;
            })
            .map(convertToControl)
        }
    });

    return {
        dryRawValues: result.dryRawValues,
        balance: _.sumBy(feeds, function(f) {
            return f.general.balanceWeight;
        }),
        total: _.sumBy(feeds, function(f) {
            return f.general.totalWeight;
        }),
        headers: _.map(feeds, 'general').concat({
            name: 'Среднее',
            key: 'average'
        }),
        analysis: result.average
    }

    return;

    // got for analisys only
    allProps = _.filter(allProps, function(props) {
        return props[0] === 'analysis';
    });
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
                // get property
                if (lastProp) {
                    var dryWetValue = null;
                    var canBerecalcalated = feedUtils.propertyForRecalculate[prop];
                    // get dry and wet value
                    if (canBerecalcalated) {
                        _.forEach(lastProp.analysis.dryMaterial.values[feedIndex], function(val, index1) {
                            var isNaturalWet = result.dryRawValues[feedIndex][index1];
                            
                            var dryRaw = feedUtils.calclDryRaw(isNaturalWet, dryMaterial, lastValue[index1]);

                            !dryWetValue && (dryWetValue = []);
                            if (_.isNumber(dryRaw.calcDry) && _.isNumber(dryRaw.calcRaw) && _.isNumber(lastValue[index1])){
                                dryWetValue.push(dryRaw);
                            } else {
                                dryWetValue.push(null);
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
                    if (!result.average[prop]) {
                        result.average[prop] = {};
                    }
                    lastProp = result.average;
                }
            });
        });
    });
    // add average
    _.forEach(result.average['analysis'], function(value, key) {
        // get avergae value
        if (feedUtils.propertyForAverage[key]) {
            var sum = null;
            var length = 0;
            _.forEach(value.values, function(values) {
                _.forEach(values, function(value) {

                    if (_.isObject(value) && 
                        _.isNumber(value.dryValue) && 
                        _.isNumber(value.rawValue) && 
                        value.dryValue !== 0 &&
                        value.rawValue !== 0) {
                        if (!sum) {
                            sum = {
                                dryValue: 0,
                                rawValue: 0
                            }
                        }
                        sum.dryValue += value.dryValue;
                        sum.rawValue += value.rawValue;
                        length ++;
                    } else if (_.isNumber(value)) {
                        if (!sum) {
                            sum = 0;
                        }
                        sum += value;
                        length ++;
                    }
                });
            });
            
            if (_.isObject(sum)) {
                sum.dryValue = Math.round(sum.dryValue / length * 100) / 100,
                sum.rawValue = Math.round(sum.rawValue / length * 100) / 100
            } else if (_.isNumber(sum)) {
                sum = Math.round(sum / length * 100) / 100;
            }
            value.values.push([sum]);
        } else {
            value.values.push([null]);
        }
    });

    var analysis = [{
        label: lang('analysis'),
        key: 'analysis',
        children: convertToControl(result.average['analysis'], 'analysis')
    }];

    result.dryRawValues.push([true]);
    return {
        dryRawValues: result.dryRawValues,
        balance: _.sumBy(feeds, function(f) {
            return f.general.balanceWeight;
        }),
        total: _.sumBy(feeds, function(f) {
            return f.general.totalWeight;
        }),
        headers: _.map(feeds, 'general').concat({
            name: 'Среднее',
            key: 'average'
        }),
        analysis: analysis
    }
}
module.exports = getAverage;