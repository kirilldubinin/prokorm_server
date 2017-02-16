var _ = require('lodash');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convertToControl(item, parentKey) {

    var editObj = {};
    _.each(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            editObj[key] = {

                isEnum: feedUtils.enumFields[parentKey + '.' + key],
                isNumber: _.isNumber(value),
                isBoolean: value === true || value === false,
                isDisabled: feedUtils.disabledFields[parentKey + '.' + key],
                isRequired: feedUtils.requiredFields[parentKey + '.' + key],
                isDate: feedUtils.dateFields[parentKey + '.' + key],

                label: lang(key),
                dimension: dimension(key),
                key: key
            }
        }
    });
    return editObj;
};

function convert(feed) {
    if (!feed) {
        feed = Feed.getEmptyFeed();
    }

    // sort field
    var goldFeed = Feed.getEmptyFeed();

    return [{
        width: 40,
        label: lang('analysis'),
        key: 'analysis',
        subSections: _.map(feed.analysis, function(analys) {
            return {
                initialItem: analys,
                controls: Feed.sort(convertToControl(analys, 'analysis'), 'analysis')
            }
        })
    }, {
        width: 20,
        label: lang('general'),
        key: 'general',
        subSections: [{
            initialItem: feed.general,
            controls: Feed.sort(convertToControl(feed.general, 'general'), 'general')
        }]
    }, {
        width: 20,
        label: lang('harvest'),
        key: 'harvest',
        subSections: [{
            initialItem: feed.harvest,
            controls: Feed.sort(convertToControl(feed.harvest, 'harvest'), 'harvest')
        }]
    }, {
        width: 20,
        label: lang('feeding'),
        key: 'feeding',
        subSections: [{
            initialItem: feed.feeding,
            controls: Feed.sort(convertToControl(feed.feeding, 'feeding'), 'feeding')
        }]
    }];
}
module.exports = convert;