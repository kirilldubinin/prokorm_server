var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension.sum');
var math = require('mathjs');
var _ = require('lodash');

function sortFeeds (a,b) {
    
    // if harvest and harvest.end DateTime format
    if (a.harvest && b.harvest &&
    	a.harvest.end && a.harvest.end.getTime && 
    	b.harvest.end && b.harvest.end.getTime) {
        return a.harvest.end.getTime() - b.harvest.end.getTime();    
    } 
    // else sort by generak.year
    else {
        return b.general.year - a.general.year;
    }
}

function list(feeds) {

	//feed.general.name and feed.general.year is REQUIRED for any feed

	//sort
    // all opened: true
    // all closed: true
    // all done: true
    var opened = _.filter(feeds, function(f) {
        return f.general.opened && !f.general.done;
    }).sort(sortFeeds);
    var closed = _.filter(feeds, function(f) {
        return !f.general.opened && !f.general.done;
    }).sort(sortFeeds);
    var done = _.filter(feeds, function(f) {
        return f.general.done;
    }).sort(sortFeeds);
    var sortedFeeds = _.concat(opened, closed, done);
    var shortFeeds = _.map(sortedFeeds, function(feed) {
        return _.merge({}, feed.general, {
            _id: feed._id,
            analysis: feed.analysis ? feed.analysis.length : 0,
            feedType: feed.general.feedType ?
            	(feed.general.feedType === 'none' ? '' : lang(feed.general.feedType)) :
            	undefined,
            field: feed.general.field ? 
            	('Поле: ' + feed.general.field) : 
            	undefined
        });
    });

    var filterValues = {
        years: _.filter(_.uniq(_.map(shortFeeds, 'year')), null) ,
        feedTypes: _.filter(_.uniq(_.map(shortFeeds, 'feedType')), null),
        compositions: _.filter(_.uniq(_.map(shortFeeds, 'composition')), null),
        storages: _.filter(_.uniq(_.map(shortFeeds, 'storage')), null)
    };

    return {
        feeds: shortFeeds,
        filterValues: filterValues
    };
}

module.exports = list;