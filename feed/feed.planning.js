var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension.sum');
var _ = require('lodash');

/*
 * Collect sum each properties for each feed from param
 * @return [{key: "dryWeight", value: 456}, {key: "exchangeEnergy", value: 230}]
 */
function getSumsByProps(props, feeds) {

    /*var dryBalanceWeight = _.sumBy(feeds, function(v) {
        var dryMaterial = _.last(v.analysis).dryMaterial;
        return dryMaterial / 100 * v.general.balanceWeight;
    });*/
    return _.map(props, function(prop) {
        if (prop === 'dryWeight') {
            return {
                key: 'dryWeight',
                value: _.sumBy(feeds, function(v) {
                    var dryMaterial = _.last(v.analysis).dryMaterial;
                    return dryMaterial / 100 * v.general.balanceWeight;
                }) * 1000
            }
        } else {
            var total = _.sumBy(feeds, function(v) {

                var lastAnalysis = _.last(v.analysis);
                var dryMaterial = lastAnalysis.dryMaterial / 100;
                var isNaturalWet = lastAnalysis.isNaturalWet;
                var dryBalanceWeight = dryMaterial * v.general.balanceWeight
                //console.log((1000 * (lastAnalysis[prop] / dryMaterial)))

                if (prop === 'crudeProtein') {
                    return isNaturalWet ? 
                        lastAnalysis[prop] / dryMaterial * dryBalanceWeight : 
                        lastAnalysis[prop] * dryBalanceWeight;
                } else {
                    return isNaturalWet ? 
                        1000 * (lastAnalysis[prop] / dryMaterial) * dryBalanceWeight : 
                        1000 * lastAnalysis[prop] * dryBalanceWeight;    
                }
            });

            

            return {
                key: prop,
                value: total
            }
        }
    });
}

function getPlanning(feeds) {
    //filter feeds, feed shoul have analysis
    feeds = _.filter(feeds, function(feed) {
        return feed.analysis.length;
    });
    // filter properties
    // each feed from feeds should have properties from list
    // in last analysis 
    var props = ['dryWeight'];
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
                sumsByProp: getSumsByProps(props, _value)
            };
        });
        var sumsByProp = getSumsByProps(props, value);
        // add percent for byComposition
        // how many percent of each composition in feedType
        _.forEach(byComposition, function(byCompos) {
            _.forEach(byCompos.sumsByProp, function(compositionSumByProp) {
                var totalSum = _.find(sumsByProp, {key: compositionSumByProp.key});
                compositionSumByProp.percentOfTotal = Math.round(compositionSumByProp.value / totalSum.value * 100);
            });
        });
        return {
            label: lang(key),
            key: key,
            byComposition: byComposition,
            sumsByProp: sumsByProp
        };
    });

    sums = _.map(sums, function (sum) {
        return sum.sumsByProp.push({
            key: 'consumptionPerDay',
            label: lang('consumptionPerDay'),
            dimension: dimension('dryWeight')
        })
    });

    return {
        properties: _.map(props, function(prop) {
            return {
                label: lang(prop),
                dimension: dimension(prop),
                key: prop
            }
        }).concat([{
            key: 'consumptionPerDay',
            label: lang('consumptionPerDay'),
            dimension: dimension('dryWeight')
        }]),
        sumsRows: sums
    }
}
module.exports = getPlanning;