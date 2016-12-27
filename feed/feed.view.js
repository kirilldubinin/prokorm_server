var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');

function convertValue(key, val) {
    if (key === 'feedType') {
        return lang(val);
    } else if (_.isBoolean(val)) {
        return lang(val);
    }
    return val;
}

function convertToControl(item) {
    var viewObj = {};
    _.each(item, function(value, key) {
        // check if value not empty
        if (_.isBoolean(value) || _.isNumber(value) || value) {
            viewObj[key] = {
                label: lang(key),
                value: convertValue(key, value),
                data: value,
                dimension: dimension(key),
                key: key
            }
        }
    });
    return viewObj;
};
var propertyForRecalculate = ['milkAcid', 'aceticAcid', 'oilAcid', 'dve', 'oeb', 'vos', 'vcos', 'fos', 'nel', 'nelvc', 'exchangeEnergy', 'nxp', 'rnb', 'udp', 'crudeAsh', 'nh3', 'nitrates', 'crudeProtein', 'solubleCrudeProtein', 'crudeFat', 'sugar', 'starch', 'starchPasses', 'crudeFiber', 'ndf', 'adf', 'adl', 'calcium', 'phosphorus', 'carotene', ];
var propertyWithHelp = ['milkAcid'];

function convert(feed) {
    var analysisView = {};
    var firstAnalys = feed.analysis[0];
    _.each(firstAnalys, function(value, key) {
        // check if value not empty
        if (key !== '_id' && (_.isBoolean(value) || _.isNumber(value) || value)) {
            var canBerecalcalated = _.some(propertyForRecalculate, function(p) {
                return p === key;
            });
            var values = _.map(feed.analysis, function(a) {
                var initialValue = a[key];
                if (canBerecalcalated) {
                    var isNaturalWet = a.isNaturalWet;
                    var dryMaterial = a.dryMaterial / 100;
                    var calc = Math.round(initialValue * dryMaterial * 100) / 100;
                    return {
                        dryValue: isNaturalWet ? calc : initialValue,
                        rawValue: isNaturalWet ? initialValue : calc
                    };
                } else {
                    return initialValue;
                }
            });
            analysisView[key] = {
                key: key,
                values: values,
                label: lang(key),
                dimension: dimension(key),
            }
        }
    });
    var generalView = convertToControl(feed.general);
    var harvestView = convertToControl(feed.harvest);
    var feedingView = convertToControl(feed.feeding);
    return {
        analysis: analysisView,
        general: generalView,
        harvest: harvestView,
        feeding: feedingView
    }
}
module.exports = convert;