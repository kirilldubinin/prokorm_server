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
    key: 'crudeProtein',
    min: 180
}, {
    key: 'vcos',
    min: 65
}, {
    key: 'ndf',
    min: 350,
    max: 450
}, {
    key: 'oeb',
    min: 5,
    max: 70
}, {
    key: 'nh3',
    max: 8
}, {
    key: 'sugar',
    min: 30,
    max: 150
}];

var ratingPropertiesSilage = [{
    key: 'dryMaterial',
    min: 30,
    max: 40
}, {
    key: 'vcos',
    min: 60
}, {
    key: 'ndf',
    min: 370,
    max: 420
}, {
    key: 'nel',
    min: 6.5
}, {
    key: 'nh3',
    max: 10
}, {
    key: 'starch',
    min: 300,
    max: 400
}];

var ratingPropertiesGreenMass = [{
    key: 'crudeProtein',
    min: 180
}, {
    key: 'vcos',
    min: 65
}, {
    key: 'ndf',
    min: 350,
    max: 450
}, {
    key: 'adl',
    min: 20,
    max: 60
}, {
    key: 'oeb',
    min: 5,
    max: 70
}, {
    key: 'crudeAsh',
    max: 100
}, {
    key: 'sugar',
    min: 30,
    max: 150
}];

function score_crudeAsh(val) {
    val = Math.round(val / 10) * 10;
    val < 50 && (val = 50);
    val > 140 && (val = 140);
    return 150 - val;
}

function score_ndf(val) {
    val = Math.round(val / 10) * 10;
    val < 310 && (val = 310);
    val > 490 && (val = 490);
    
    if (val === 400) {
        return 100;
    } else if (val < 400) {
        return val - 300;
    } else if (val > 400) {
        return 500 - val;
    }
}

function score_crudeProtein(val) {
    val = Math.round(val / 10) * 10;
    val < 130 && (val = 130);
    val > 220 && (val = 220);

    return -1 * (120 - val);
}

function score_vcos(val) {
    val = Math.round(val / 10) * 10;
    val < 35 && (val = 35);
    val > 80 && (val = 80);

    return val + 20;
}

function score_sugar(val) {
    val = Math.round(val / 10) * 10;
    val < 30 && (val = 30);
    val > 210 && (val = 210);

    if (val === 120) {
        return 100;
    } else if (val < 120) {
        return val - 20;
    } else if (val > 120) {
        return 220 - val;
    }
}

function score_oeb(val) {
    val = Math.round(val / 10) * 10;
    val < 5 && (val = 10);
    val > 90 && (val = 90);

    if (val === 50) {
        return 100;
    } else if (val < 50) {
        return val + 50;
    } else if (val > 50) {
        return 100 - val;
    }
}

var getScore = {
    score_oeb: score_oeb,
    score_sugar: score_sugar,
    score_vcos: score_vcos,
    score_crudeProtein: score_crudeProtein,
    score_ndf: score_ndf,
    score_crudeAsh: score_crudeAsh
};

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

    // filter by ratingProperties
    var ratingProperties;
    if (feedType === 'haylage') {
        ratingProperties = ratingPropertiesHaylage;
    } else if (feedType === 'silage') {
        ratingProperties = ratingPropertiesSilage;
    } else if (feedType === 'greenmass') {
        ratingProperties = ratingPropertiesGreenMass;
    }

    if (!ratingProperties) {
        return null;
    }

    // each feeds shoul have analysis with all ratingProperties
    var beforeFilter = _.size(feeds);
    feeds = _.filter(feeds, function (feed) {
        return feed.analysis.length &&
            !_.some(ratingProperties, function (prop) {
                return _.last(feed.analysis)[prop.key] === null || _.last(feed.analysis)[prop.key] === undefined;
            });
    });

    if (_.size(feeds) !== beforeFilter) {
        throw 'У ' + 
            (beforeFilter - _.size(feeds)) + 
            ((beforeFilter - _.size(feeds)) > 1 ? ' выбранных кормов ' : ' выбранного корма ') +
            'введены не все обязательные показатели';
    }

    var ratingFeeds = _.map(feeds, function (feed) {
        var score = 0;
        var values = _.map(ratingProperties, function (prop) {
            var lastAnalysis = _.last(feed.analysis);
            var value = feedUtils.calcDryRaw (lastAnalysis.isNaturalWet, lastAnalysis.dryMaterial, lastAnalysis[prop.key]);

            score += getScore['score_' + prop.key] ? getScore['score_' + prop.key](value.dryValue) : 0;
            
            return {
                value: value.dryValue,
                inRange: inRange(prop, value.dryValue)
            }
        });

        if (!feed.general.name) {
            feed.general.name = lang(feed.general.feedType) + ': ' + feed.general.composition;
        }
        
        return [{
            name: feed.general.name,
            year: feed.general.year,
            score: score
        }].concat(values);
    });

    console.log(ratingFeeds);
    ratingFeeds = ratingFeeds.sort(function (a, b) {
        return _.first(b).score - _.first(a).score;
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
module.exports = {
    getRaiting: getRaiting,
    getScore: getScore
};