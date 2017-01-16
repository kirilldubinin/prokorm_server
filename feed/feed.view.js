var _ = require('lodash');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convertValue(key, val) {
    if (key === 'feedType') {
        return lang(val);
    } else if (key === 'isNaturalWet') {
        return val;
    } else if (_.isBoolean(val)) {
        return lang(val);
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/' + ('0' + (val.getMonth() + 1)).slice(-2) + '/' + val.getFullYear();
    }
    return val;
}

function convertToControl(item) {
    var viewObj = {};
    _.each(item, function(value, key) {
        // check if value not empty
        if (_.isBoolean(value) || _.isNumber(value) || value) {
            viewObj[key] = {
                label: lang(key),
                value: convertValue(key, value),
                dimension: dimension(key),
                key: key
            }
        }
    });
    return viewObj;
};
var propertyWithHelp = {
    milkAcid: 'milkAcid'
};

function convert(feed, sessionData) {
    var analysisView = {};
    if (feed.analysis.length) {
        var firstAnalys = feed.analysis[0];
        _.each(firstAnalys, function(value, key) {
            // check if value not empty
            if (key !== '_id') {
                var canBerecalcalated = feedUtils.propertyForRecalculate[key];
                var values = _.map(feed.analysis, function(a) {
                    var initialValue = a[key];
                    if (canBerecalcalated) {
                        var isNaturalWet = a.isNaturalWet;
                        var dryMaterial = a.dryMaterial / 100;
                        var calcRaw = Math.round(initialValue * dryMaterial * 100) / 100;
                        var calcDry = Math.round((initialValue / dryMaterial * 100)) / 100;
                        return {
                            dryValue: isNaturalWet ? calcDry : initialValue,
                            rawValue: isNaturalWet ? initialValue : calcRaw
                        };
                    } else {
                        return convertValue(key, initialValue);
                    }
                });
                // check if some values exist
                var some = _.some(values, function(value) {
                    if (_.isObject(value)) {
                        return _.isNumber(value.dryValue) && _.isNumber(value.rawValue);
                    } else {
                        return value || _.isBoolean(value) || _.isNumber(value);
                    }
                });
                if (some) {
                    analysisView[key] = {
                        key: key,
                        values: values,
                        label: lang(key),
                        dimension: dimension(key),
                        catalogLink: propertyWithHelp[key] ? ('/#/farm/' + sessionData.tenantName + '/catalog/' + propertyWithHelp[key]) : undefined
                    }
                }
            }
        });
    }
    var generalView = convertToControl(feed.general);
    var harvestView = convertToControl(feed.harvest);
    var feedingView = convertToControl(feed.feeding);
    // sort field
    var goldFeed = Feed.getEmptyFeed();
    var analysisSortView = Feed.sort(analysisView, 'analysis');
    var generalSortView = Feed.sort(generalView, 'general');
    var harvestSortView = Feed.sort(harvestView, 'harvest');
    var feedingSortView = Feed.sort(feedingView, 'feeding');
    
    if (!feed.analysis.length) {
        return {
            general: feed.general,
            feedItemSections: [{
                width: 40,
                label: lang('general'),
                key: 'general',
                controls: generalSortView
            }, {
                width: 30,
                label: lang('harvest'),
                key: 'harvest',
                controls: harvestSortView
            }, {
                width: 30,
                label: lang('feeding'),
                key: 'feeding',
                controls: feedingSortView
            }]
        };
    }
    return {
        general: feed.general,
        feedItemSections: [{
            width: 40,
            label: lang('analysis'),
            key: 'analysis',
            controls: analysisSortView
        }, {
            width: 20,
            label: lang('general'),
            key: 'general',
            controls: generalSortView
        }, {
            width: 20,
            label: lang('harvest'),
            key: 'harvest',
            controls: harvestSortView
        }, {
            width: 20,
            label: lang('feeding'),
            key: 'feeding',
            controls: feedingSortView
        }]
    };
}
module.exports = convert;