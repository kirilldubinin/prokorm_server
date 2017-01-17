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
                        catalogLink: feedUtils.propertyWithHelp[key] ? ('/#/farm/' + sessionData.tenantName + '/catalog/' + feedUtils.propertyWithHelp[key]) : undefined
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
    var analysisSortView = _.isEmpty(analysisView) ? null : Feed.sort(analysisView, 'analysis');
    var generalSortView = _.isEmpty(generalView) ? null : Feed.sort(generalView, 'general');
    var harvestSortView = _.isEmpty(harvestView) ? null : Feed.sort(harvestView, 'harvest');
    var feedingSortView = _.isEmpty(feedingView) ? null : Feed.sort(feedingView, 'feeding');

    var allViews = [analysisView, generalView, harvestView, feedingView];
    allViews = _.filter(allViews, function(v) { return !_.isEmpty(v); });

    var result = {
        general: feed.general,
        feedItemSections: []
    };
    
    // analysis
    if (analysisSortView) {
        result.feedItemSections.push({
            width: 40,
            label: lang('analysis'),
            key: 'analysis',
            controls: analysisSortView
        });
    }

    // general, must have
    if (generalSortView) {
        result.feedItemSections.push({
            width: Math.round(analysisSortView ? (100 - 40)/(allViews.length -1) : 100/allViews.length),
            label: lang('general'),
            key: 'general',
            controls: generalSortView
        });
    }

    // harvest
    if (harvestSortView) {
        result.feedItemSections.push({
            width: Math.round(analysisSortView ? (100 - 40)/(allViews.length-1) : 100/allViews.length),
            label: lang('harvest'),
            key: 'harvest',
            controls: harvestSortView
        });
    } 

    // feeding
    if (feedingSortView) {
        result.feedItemSections.push({
            width: Math.round(analysisSortView ? (100 - 40)/(allViews.length-1) : 100/allViews.length),
            label: lang('feeding'),
            key: 'feeding',
            controls: feedingSortView
        });
    } 

    return result;
}
module.exports = convert;