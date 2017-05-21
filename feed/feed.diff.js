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
    if (key === 'feedType' || key === 'storageType') {
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
    } else if (_.isDate(v) || _.isBoolean(v)) {
        return true;
    } else if (_.isObject(v)) {
        return _.isNumber(v.dryValue) && _.isNumber(v.rawValue);
    } 
    return v;
}

function getDiff(feeds) {
    var rows = [];
    var result = {
        diff: {},
        dryRawValues: _.map(feeds, 'analysis').map(function(analys) {
            return _.map(analys, 'isNaturalWet');
        })
    };
    var goldFeed = Feed.getEmptyFeed();
    var rootProps = ['analysis', 'general', 'harvest', 'feeding'];
    
    var diffs = _.map(rootProps, function(rootProp) {
        if (rootProp === 'analysis') {
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
                }).filter(function(analysisFeed) {
                    return _.some(analysisFeed.values, filterValueExist)
                }).map(convertToControl)
            }
        } else {
            return {
                label: lang(rootProp),
                key: rootProp,
                children: _.map(goldFeed[rootProp], function(value, key) {
                    var propFeeds = _.map(feeds, rootProp);
                    return {
                        key: key,
                        values: _.map(propFeeds, key)
                    }
                }).filter(function(propFeeds) {
                    return _.some(propFeeds.values, filterValueExist)
                }).map(convertToControl)
            }
        }
    });
    return {
        dryRawValues: result.dryRawValues,
        headers: _.map(feeds, function (feed) {
            if (!feed.general.name) {
                feed.general.name = lang(feed.general.feedType) + ': ' + feed.general.composition;
            }
            return feed.general;
        }),
        diffs: _.filter(diffs, function(diff) {
            return diff.children.length;
        })
    }
}
module.exports = getDiff;