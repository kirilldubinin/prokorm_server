var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convert(feeds) {

    // filter
    // balance weight should exist
    feeds = _.filter(feeds, function (feed) {
        return _.isNumber(feed.general.totalWeight) && _.isNumber(feed.general.balanceWeight);
    });

    var byFeedType = _.map(feeds, 'general');
    byFeedType = _.groupBy(byFeedType, 'feedType');
    byFeedType = _.map(byFeedType, function (value, key) {
        
        var byCompos = _.map(_.groupBy(value, 'composition'), function (value, key){
            
            var total = _.sumBy(value, 'totalWeight');
            var balance = _.sumBy(value, 'balanceWeight');
            return {
                label: lang(key),
                total: total,
                balance: balance,
                balancePercent: Math.round((balance/total *100))                    
            }
        });

        var total = _.sumBy(value, 'totalWeight');
        var balance = _.sumBy(value, 'balanceWeight');
        return{
            label: lang(key),
            total: total,
            balance: balance,
            balancePercent: Math.round((balance/total *100)),
            byComposition: byCompos 
        };
    });

    var byComposition = _.map(feeds, 'general');
    byComposition = _.groupBy(byComposition, 'composition');
    byComposition = _.map(byComposition, function (value, key) {
        var byFeedType = _.map(_.groupBy(value, 'feedType'), function (value, key){
            
            var total = _.sumBy(value, 'totalWeight');
            var balance = _.sumBy(value, 'balanceWeight');
            return {
                label: lang(key),
                total: total,
                balance: balance,
                balancePercent: Math.round((balance/total *100))                    
            }
        });

        var total = _.sumBy(value, 'totalWeight');
        var balance = _.sumBy(value, 'balanceWeight');
        return{
            label: lang(key),
            total: total,
            balance: balance,
            balancePercent: Math.round((balance/total *100)),
            byFeedType: byFeedType 
        };
    });

    return {
        byFeedType: byFeedType,
        byComposition: byComposition,
        current: 'byFeedType'
    }
}
module.exports = convert;