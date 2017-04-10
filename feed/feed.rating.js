var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension');
var _ = require('lodash');
var ratingPropertiesHaylage = [{
    key: 'dryMaterial',
    min: 30,
    max: 50
}, {
    key: 'oeb',
    min: 5,
    max: 55
}, {
    key: 'vcos',
    min: 60
}, {
    key: 'nh3',
    max: 10
}, {
    key: 'sugar',
    min: 60,
    max: 140
}, {
    key: 'ndf',
    min: 430,
    max: 480
} , {
    key: 'crudeProtein',
    min: 200
}];

var ratingPropertiesSilage = [{
    key: 'dryMaterial',
    min: 30,
    max: 40
}, {
    key: 'nel',
    min: 6.5
}, {
    key: 'vcos',
    min: 60
}, {
    key: 'nh3',
    max: 10
}, {
    key: 'starch',
    min: 300,
    max: 400
}, {
    key: 'ndf',
    min: 370,
    max: 420
}];

function sortByClosest(feeds, prop) {
    return feeds.sort(function (a, b) {
        a = _.last(a.analysis)[prop.key];
        b = _.last(b.analysis)[prop.key];

        return Math.abs(prop.bestValue - a) - Math.abs(prop.bestValue - b)
    });
}

function inRange (prop, value) {
    if (prop.min && prop.max) {
        return value >= prop.min && value <= prop.max;
    } else if (prop.min && !prop.max) {
        return value > prop.min;
    } else if (!prop.min && prop.max) {
        return value < prop.max;
    }
};

function getRaiting(feeds, feedType) {

    if (feedType !== 'haylage' && feedType !== 'silage') {
        return null;
    }

    // filter by ratingProperties
    var ratingProperties = feedType === 'haylage' ?
        ratingPropertiesHaylage :
        ratingPropertiesSilage;

    // each feeds shoul have analysis with all ratingProperties
    feeds = _.filter(feeds, function (feed) {
        return feed.analysis.length &&
            !_.some(ratingProperties, function (prop) {
                return _.last(feed.analysis)[prop.key] === null || _.last(feed.analysis)[prop.key] === undefined;
            });
    });

    var ratingFeeds = _.map(feeds, function (feed) {
        var values = _.map(ratingProperties, function (prop) {
            var lastAnalysis = _.last(feed.analysis);
            var dryMaterial = lastAnalysis.dryMaterial/100;
            var value = Math.round(
                (lastAnalysis.isNaturalWet ? 
                    (lastAnalysis[prop.key] / dryMaterial) : 
                    lastAnalysis[prop.key]
                )*100
            )/100;

            return {
                value: value,
                inRange: inRange(prop, value)
            }
        });

        if (!feed.general.name) {
            feed.general.name = lang(feed.general.feedType) + ': ' + feed.general.composition;
        }
        return [feed.general].concat(values);
    });

    ratingFeeds = ratingFeeds.sort(function (a, b) {

        var aInRange = _.filter(a, {inRange: true}).length;
        var bInRange = _.filter(b, {inRange: true}).length;
        return bInRange - aInRange;
    });

    return {
        properties: _.map(ratingProperties, function (prop) {
            var bestValue;
            if (prop.min && prop.max) {
                bestValue = prop.min + ' - ' + prop.max;
            } else if (prop.min && !prop.max) {
                bestValue = 'Больше ' + prop.min;
            } else if (!prop.min && prop.max) {
                bestValue = 'Меньше ' + prop.max;
            }

            return {
                key: prop.key,
                label: lang(prop.key),
                dimension: dimension(prop.key),
                bestValue: bestValue
            }
        }),
        feeds: ratingFeeds
    };
}
module.exports = getRaiting;