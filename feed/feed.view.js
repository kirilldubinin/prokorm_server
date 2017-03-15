var _ = require('lodash');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convertValue(key, val) {
    if (key === 'feedType' || key === 'storageType') {
        return lang(val);
    } else if (key === 'isNaturalWet') {
        return val;
    } else if (_.isBoolean(val)) {
        return lang(val);
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/' + ('0' + (val.getMonth() + 1)).slice(-2) + '/' + val.getFullYear();
    } else if(_.isNumber(val) && feedUtils.propertyForRecalculate[key]) {
        return val.toFixed(1);
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
    
    // set harvestDays if harvest.start and harvest.end is exist
    if (feed.harvest && feed.harvest.start && feed.harvest.end) {
        feed.harvest.harvestDays = 
        Math.round((feed.harvest.end.getTime() - feed.harvest.start.getTime()) / (1000*60*60*24));

        if (feed.harvest.harvestDays === 0) {
            feed.harvest.harvestDays = 1;
        }        
    }

    // set feedingDays if feeding.start and feeding.end is exist
    if (feed.feeding && feed.feeding.start && feed.feeding.end) {
        feed.feeding.feedingDays = 
        Math.round((feed.feeding.end.getTime() - feed.feeding.start.getTime()) / (1000*60*60*24));

        if (feed.feeding.feedingDays === 0) {
            feed.feeding.feedingDays = 1;
        }    
    }

    var analysisView = {};
    if (feed.analysis && feed.analysis.length) {
        var firstAnalys = feed.analysis[0];
        _.each(firstAnalys, function(value, key) {
            
            var some = _.some(feed.analysis, function (analys) {
                return _.isBoolean(analys[key]) || _.isNumber(analys[key]) || analys[key];
            });

            if (key === 'id' || !some) {
                return;
            }

            var canBerecalcalated = feedUtils.propertyForRecalculate[key];
            var values = _.map(feed.analysis, function(a) {
                var initialValue = a[key];
                
                if (initialValue === null) {
                    return null;
                }

                if (canBerecalcalated) {
                    return feedUtils.calcDryRaw(a.isNaturalWet, a.dryMaterial, initialValue, key);
                } else {
                    return convertValue(key, initialValue);
                }
            });
            // check if some values exist
            /*var some = _.some(values, function(value) {
                if (_.isObject(value)) {
                    return _.isNumber(value.dryValue) && _.isNumber(value.rawValue);
                } else {
                    return value || _.isBoolean(value) || _.isNumber(value);
                }
            });*/
            //if (some) {
            analysisView[key] = {
                key: key,
                values: values,
                label: lang(key),
                dimension: dimension(key),
                catalogLink: sessionData && feedUtils.propertyWithHelp[key] ? 
                    ('/#/' + sessionData.tenantName + '/catalog/' + feedUtils.propertyWithHelp[key]) : 
                    undefined
            }
            //}
        });
    }
    var generalView = convertToControl(feed.general);
    var harvestView = convertToControl(feed.harvest);
    var feedingView = convertToControl(feed.feeding);

    // sort field
    var analysisSortView = _.isEmpty(analysisView) ? null : Feed.sort(analysisView, 'analysis');
    var generalSortView = _.isEmpty(generalView) ? null : Feed.sort(generalView, 'general');
    var harvestSortView = _.isEmpty(harvestView) ? null : Feed.sort(harvestView, 'harvest');
    var feedingSortView = _.isEmpty(feedingView) ? null : Feed.sort(feedingView, 'feeding');

    var allViews = [analysisView, generalView, harvestView, feedingView];
    allViews = _.filter(allViews, function(v) { return !_.isEmpty(v); });

    var actions = ['print'];
    if (sessionData) {
        var perms = sessionData.permissions;
        if (_.indexOf(perms, 'admin') !== -1 || _.indexOf(perms, 'write') !== -1) {
            actions.push('edit');
            actions.push('delete');    
        }
    }

    // add name if name is empty
    if (!feed.general.name) {
        feed.general.name = lang(feed.general.feedType) + ': ' + feed.general.composition;
    }

    var result = {
        actions: _.map(actions, function (action) {
            return {
                key: action,
                label: lang(action),
                icon: action === 'print' ? 'local_print_shop' : '',
                buttonType: action === 'delete' ? 
                    'warn' : 'raised'
            };
        }),
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