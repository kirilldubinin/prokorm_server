var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var _ = require('lodash');

var ratingProperties = [{
    key: 'dryMaterial',
    bestValue: 40
}, {
    key: 'oeb',
    bestValue: 30
}, {
    key: 'vcos',
    bestValue: 100000
}, {
    key: 'nh3',
    bestValue: -1
}, {
    key: 'sugar',
    bestValue: 100
}, {
    key: 'ndf',
    bestValue: 455
} , {
    key: 'crudeProtein',
    bestValue: 100000
}];

function sortByClosest(feeds, prop) {
    return feeds.sort(function (a, b) {
        a = _.last(a.analysis)[prop.key];
        b = _.last(b.analysis)[prop.key];

        return Math.abs(prop.bestValue - a) - Math.abs(prop.bestValue - b)
    });
}

function getRaiting(feeds) {

    // filter by ratingProperties
    // each feeds shoul have analysis with all ratingProperties
    feeds = _.filter(feeds, function (feed) {
        return feed.analysis.length &&
            !_.some(ratingProperties, function (prop) {
                return _.last(feed.analysis)[prop.key] === null || _.last(feed.analysis)[prop.key] === undefined;
            });
    });

    _.forEach(ratingProperties, function (prop) {
        feeds = sortByClosest(feeds, prop);
        _.each(feeds, function (feed, index) {
            
            if (feed.index === undefined) {
                feed.index = 0;
            }
            feed.index += index;

            if (feed.bestValuesByProp === undefined) {
                feed.bestValuesByProp = [];
            }

            if (index === 0 && _.last(feed.analysis)[prop.key] !== _.last(feeds[index+1].analysis)[prop.key]) {
                feed.bestValuesByProp.push(prop);                    
            }
        });
        /*_.each(feeds, function (feed, index) {
            if (feed.bestValuesByProp === undefined) {
                feed.bestValuesByProp = [];
            }
            if (feed.index === 0) {
                feed.bestValuesByProp.push(prop);                    
            }
        });*/
    });

    return {
        properties: _.map(ratingProperties, function (prop) {
            
            var bestValue;
            if (prop.bestValue === 100000) {
                bestValue = 'Больше'
            } else if (prop.bestValue === -1) {
                bestValue = 'Меньше'
            } else {
                bestValue = prop.bestValue;
            }

            return {
                key: prop.key,
                label: lang(prop.key),
                dimension: dimension(prop.key),
                bestValue: bestValue
            }
        }),
        feeds: _.map(feeds.sort(function (a,b) {
            return a.index - b.index;
        }), function (feed) {

            var values = _.map(ratingProperties, function (prop) {
                return {
                    value: _.last(feed.analysis)[prop.key],
                    key: prop,
                    isBestValue: _.some(feed.bestValuesByProp, function (_prop) { return _prop === prop; })
                }
            });
            return [feed.general].concat(values);
        })
    };
}
module.exports = getRaiting;