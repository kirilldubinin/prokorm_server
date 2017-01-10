var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');
var Feed = require('../models/feed');

var dateFields = {
    'analysis.date': 'date',
    'harvest.start': 'date',
    'harvest.end': 'date',
    'feeding.start': 'date',
    'feeding.end': 'date'
};

function convertValue(key, val) {

    if (key === 'feedType') {
        return lang(val);
    } else if (key === 'isNaturalWet') {
        return val;
    } else if (_.isBoolean(val)) {
        return lang(val);
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/'
             + ('0' + (val.getMonth()+1)).slice(-2) + '/'
             + val.getFullYear();
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
var propertyForRecalculate = ['milkAcid', 'aceticAcid', 'oilAcid', 'dve', 'oeb', 'vos', 'vcos', 'fos', 'nel', 'nelvc', 'exchangeEnergy', 'nxp', 'rnb', 'udp', 'crudeAsh', 'nh3', 'nitrates', 'crudeProtein', 'solubleCrudeProtein', 'crudeFat', 'sugar', 'starch', 'starchPasses', 'crudeFiber', 'ndf', 'adf', 'adl', 'calcium', 'phosphorus', 'carotene', ];
var propertyWithHelp = ['milkAcid'];

function convert(feed) {
    var analysisView = {};
    var firstAnalys = feed.analysis[0];
    _.each(firstAnalys, function(value, key) {
        // check if value not empty
        if (key !== '_id' && (_.isBoolean(value) || _.isNumber(value) || value)) {
            var canBerecalcalated = _.some(propertyForRecalculate, function(p) {
                return p === key;
            });
            var values = _.map(feed.analysis, function(a) {
                var initialValue = a[key];
                if (canBerecalcalated) {
                    var isNaturalWet = a.isNaturalWet;
                    var dryMaterial = a.dryMaterial / 100;
                    var calc = Math.round(initialValue * dryMaterial * 100) / 100;
                    return {
                        dryValue: isNaturalWet ? calc : initialValue,
                        rawValue: isNaturalWet ? initialValue : calc
                    };
                } else {
                    return convertValue(key, initialValue);
                }
            });
            analysisView[key] = {
                key: key,
                values: values,
                label: lang(key),
                dimension: dimension(key),
            }
        }
    });
    var generalView = convertToControl(feed.general);
    var harvestView = convertToControl(feed.harvest);
    var feedingView = convertToControl(feed.feeding);

    // sort field
    var goldFeed = Feed.getEmptyFeed();

    var analysisSortView = Feed.sort(analysisView, 'analysis');
    var generalSortView = Feed.sort(generalView, 'general');
    var harvestSortView = Feed.sort(harvestView, 'harvest');
    var feedingSortView = Feed.sort(feedingView, 'feeding');

    return {
        general: feed.general,
        feedItemSections: [{
            width: 40,
            label: 'analysis',
            key: 'analysis',
            controls: analysisSortView
        }, {
            width: 20,
            label: 'general',
            key: 'general',
            controls: generalSortView
        }, {
            width: 20,
            label: 'harvest',
            key: 'harvest',
            controls: harvestSortView
        }, {
            width: 20,
            label: 'feeding',
            key: 'feeding',
            controls: feedingSortView
        }]
    };
}
module.exports = convert;