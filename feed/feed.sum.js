var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension.sum');
var math = require('mathjs');
var _ = require('lodash');
var props = ['dryWeight', 'nel', 'exchangeEnergy', 'crudeProtein', 'ndf', 'adf'];

/*
 * Collect sum each properties for each feed from param
 * @return [{key: "dryWeight", value: 456}, {key: "exchangeEnergy", value: 230}]
 */
function getSumsByProps(feeds) {
    
    return _.map(props, function(prop) {
        var dryBalanceWeight = _.sumBy(feeds, function(v) {
            var dryMaterial = _.last(v.analysis).dryMaterial;
            return dryMaterial / 100 * v.general.balanceWeight;
        });
        if (prop === 'dryWeight') {
            return {
                key: 'dryWeight',
                value: math.round(dryBalanceWeight*1000, 2)
            }
        } else {
            var total = _.sumBy(feeds, function(v) {
                var dryMaterial = _.last(v.analysis).dryMaterial;
                var lastAnalysis = _.last(v.analysis);
                var isNaturalWet = lastAnalysis.isNaturalWet;
                
                return isNaturalWet ? 
                    dryBalanceWeight * (lastAnalysis[prop] / dryMaterial) : 
                    dryBalanceWeight * (lastAnalysis[prop]);
            });

            return {
                key: prop,
                value: math.round(total, 2)
            }
        }
    });
}

function getSum(feeds) {
    var byFeedType = _.map(feeds, function(feed) {
        feed.feedType = feed.general.feedType;
        feed.composition = feed.general.composition;
        return feed;
    });
    byFeedType = _.groupBy(byFeedType, 'feedType');
    var sums = _.map(byFeedType, function(value, key) {
        var byComposition = _.map(_.groupBy(value, 'composition'), function(value, key) {
            return {
                label: lang(key),
                key: key,
                sumsByProp: getSumsByProps(value)
            };
        });

        var sumsByProp = getSumsByProps(value);

        // add percent for byComposition
        // how many percent of each composition in feedType
        _.forEach(byComposition, function (byCompos) {

            _.forEach(byCompos.sumsByProp, function (compositionSumByProp){

                var totalSum = _.find(sumsByProp, function (sumByProp) {
                    return sumByProp.key === compositionSumByProp.key;
                });
                var percentOfTotal = compositionSumByProp.value/totalSum.value*100;
                compositionSumByProp.percentOfTotal = math.round(percentOfTotal,2);
            });
        });

        return {
            label: lang(key),
            key: key,
            byComposition: byComposition,
            sumsByProp: sumsByProp
        };
    });

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