var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function progress(feeds) {

    // filter
    // feed should be opened and not done
    feeds = _.filter(feeds, function (feed) {
        return feed.general.opened && 
                !feed.general.done && 
                _.isNumber(feed.general.balanceWeight) &&
                _.isNumber(feed.general.totalWeight);
    });

    var autoDecrementFeeds = _.filter(feeds, 'feeding.autoDecrement');
    autoDecrementFeeds = _.filter(autoDecrementFeeds, 'feeding.tonnPerDay');

    autoDecrementFeeds = _.map(autoDecrementFeeds, function (feed) {

        var name;
        if (!feed.general.name) {
            name = lang(feed.general.feedType) + ':' + feed.general.composition;
        } else {
            name = feed.general.name;
        }

        var tonnPerDay = feed.feeding.tonnPerDay;
        var willEnd = new Date(new Date().getTime() + Math.floor(feed.general.balanceWeight/tonnPerDay) * 24 * 60 *60 * 1000)
        willEnd = ('0' + 
                    willEnd.getDate()).slice(-2) + 
                    '/' + 
                    ('0' + (willEnd.getMonth() + 1)).slice(-2) + 
                    '/' + 
                    willEnd.getFullYear();

        var daysLeft = Math.floor(feed.general.balanceWeight/tonnPerDay);
        var percentLeft = Math.round(feed.general.balanceWeight/feed.general.totalWeight*100);

        return {
            _id: feed._id,
            name: name,
            tonnPerDay: tonnPerDay,
            willEnd: willEnd,
            daysLeft: daysLeft,
            percentLeft: percentLeft,
            totalWeight: feed.general.totalWeight,
            balanceWeight: feed.general.balanceWeight        
        }
    });

    autoDecrementFeeds = _.sortBy(autoDecrementFeeds, 'daysLeft');

    return {
        autoDecrementFeeds: autoDecrementFeeds
    }
}
module.exports = progress;