var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension.sum');
var _ = require('lodash');

function getSumsByProps(props, feeds) {
    return _.map(props, function(prop) {
        return {
            key: 'balanceWeight',
            value: _.sumBy(feeds, function(v) {
                return v.general.balanceWeight;
            })
        }
    });
}

function getSum(planningParams) {

    console.log(planningParams);

    var feeds = planningParams.feeds;
    //filter feeds, feed shoul have analysis
    feeds = _.filter(feeds, function(feed) {
        return feed.analysis.length;
    });
    
    var byFeedType = _.map(feeds, function(feed) {
        feed.feedType = feed.general.feedType;
        feed.composition = feed.general.composition;
        return feed;
    });
    byFeedType = _.groupBy(byFeedType, 'feedType');
    var sums = _.map(byFeedType, function(value, key) {
        var byComposition = _.map(_.groupBy(value, 'composition'), function(_value, key) {
            return {
                label: lang(key),
                key: key,
                sumsByProp: _.sumBy(_value, function(v) {
                    return v.general.balanceWeight;
                })
            };
        });
        var sumsByProp = _.sumBy(value, function(v) {
            return v.general.balanceWeight;
        });
        // add percent for byComposition
        // how many percent of each composition in feedType
        _.forEach(byComposition, function(byCompos) {
            byCompos.percentOfTotal = Math.round(byCompos.sumsByProp / sumsByProp * 100);
        });

        // add percent for byComposition
        // how many percent of each composition in feedType
        _.forEach(byComposition, function(byCompos) {
            _.forEach(byCompos.sumsByProp, function(compositionSumByProp) {
                var totalSum = _.find(sumsByProp, {key: compositionSumByProp.key});
                compositionSumByProp.percentOfTotal = Math.round(compositionSumByProp.value / totalSum.value * 100);
            });
        });

        var tonnPerDay = planningParams.tonnPerDay[key];
        var willEnd;
        var daysLeft;
        if (tonnPerDay > 0) {
            willEnd = new Date(new Date().getTime() + Math.floor(sumsByProp/tonnPerDay) * 24 * 60 *60 * 1000)
            willEnd = ('0' + 
                        willEnd.getDate()).slice(-2) + 
                        '/' + 
                        ('0' + (willEnd.getMonth() + 1)).slice(-2) + 
                        '/' + 
                        willEnd.getFullYear();

            daysLeft = Math.floor(sumsByProp/tonnPerDay);
        }
        
        return {
            label: lang(key),
            key: key,
            tonnPerDay: planningParams.tonnPerDay[key],
            willEnd: willEnd,
            daysLeft: daysLeft,
            byComposition: byComposition,
            balanceWeight: sumsByProp
        };
    });

    var props = ['leftWeight', 'tonnPerDay', 'daysLeft', 'willEnd'];
    return {
        properties: _.map(props, function(prop) {
            return {
                label: lang(prop),
                dimension: dimension(prop),
                key: prop
            }
        }),
        sumsRows: sums
    }
}

module.exports = getSum;