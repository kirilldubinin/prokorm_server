var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');
var Feed = require('../models/feed');

function convert(feeds, sessionData) {

    var byFeedType = _.map(feeds, 'general');
    byFeedType = _.groupBy(byFeedType, 'feedType');
    return _.map(byFeedType, function (value, key) {

        var byComposition = _.map(_.groupBy(value, 'composition'), function (value, key){
            
            var total = _.sumBy(value, 'totalWeight');
            var balance = _.sumBy(value, 'balanceWeight');
            return {
                label: key,
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
            byComposition: byComposition 
        };
    });
}
module.exports = convert;