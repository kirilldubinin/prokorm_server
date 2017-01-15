/**
 * label - string: property name
 * values - [] or [ [], [] ]
 * key - string: property key
 * dimension - string: property dimension
 */
var Feed = require('../models/feed');
var lang = require('./lang');
var dimension = require('./dimension');
var _ = require('lodash');
var propertyForRecalculate = {
    milkAcid: 'milkAcid',
    aceticAcid: 'aceticAcid',
    oilAcid: 'oilAcid',
    dve: 'dve',
    oeb: 'oeb',
    vos: 'vos',
    vcos: 'vcos',
    fos: 'fos',
    nel: 'nel',
    nelvc: 'nelvc',
    exchangeEnergy: 'exchangeEnergy',
    nxp: 'nxp',
    rnb: 'rnb',
    udp: 'udp',
    crudeAsh: 'crudeAsh',
    nh3: 'nh3',
    nitrates: 'nitrates',
    crudeProtein: 'crudeProtein',
    solubleCrudeProtein: 'solubleCrudeProtein',
    crudeFat: 'crudeFat',
    sugar: 'sugar',
    starch: 'starch',
    starchPasses: 'starchPasses',
    crudeFiber: 'crudeFiber',
    ndf: 'ndf',
    adf: 'adf',
    adl: 'adl',
    calcium: 'calcium',
    phosphorus: 'phosphorus',
    carotene: 'carotene'
};

var propertyForAverage = {
    dryMaterial: 'milkAcid',
    ph: 'milkAcid',
    milkAcid: 'milkAcid',
    aceticAcid: 'aceticAcid',
    oilAcid: 'oilAcid',
    dve: 'dve',
    oeb: 'oeb',
    vos: 'vos',
    vcos: 'vcos',
    fos: 'fos',
    nel: 'nel',
    nelvc: 'nelvc',
    exchangeEnergy: 'exchangeEnergy',
    nxp: 'nxp',
    rnb: 'rnb',
    udp: 'udp',
    crudeAsh: 'crudeAsh',
    nh3: 'nh3',
    nitrates: 'nitrates',
    crudeProtein: 'crudeProtein',
    solubleCrudeProtein: 'solubleCrudeProtein',
    crudeFat: 'crudeFat',
    sugar: 'sugar',
    starch: 'starch',
    starchPasses: 'starchPasses',
    crudeFiber: 'crudeFiber',
    ndf: 'ndf',
    adf: 'adf',
    adl: 'adl',
    calcium: 'calcium',
    phosphorus: 'phosphorus',
    carotene: 'carotene'
}

function convertValue(key, val) {
    if (key === 'feedType') {
        return lang(val);
    } else if (_.isBoolean(val)) {
        return lang(val);
    } else if (_.isDate(val)) {
        return ('0' + val.getDate()).slice(-2) + '/' + ('0' + (val.getMonth() + 1)).slice(-2) + '/' + val.getFullYear();
    }
    return val;
}

function convertToControl(item, code) {
    var result = [];
    _.forEach(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            // check if some values exist
            var some = _.some(value.values, function(values) {
                if (_.isArray(values)) {
                    return _.some(values, function(value) {
                        if (_.isObject(value)) {
                            return _.isNumber(value.dryValue) && _.isNumber(value.rawValue);
                        } else {
                            return value || _.isBoolean(value) || _.isNumber(value);
                        }
                    });
                } else {
                    return !_.isNull(value);
                }
            });
            if (some) {
                result.push({
                    label: lang(key),
                    dimension: dimension(key),
                    key: key,
                    values: value.values
                });
            }
        }
    });
    return result;
};

function getAverage(feeds) {

    console.log(feeds[0].general.name);
    console.log(feeds[0].general.balanceWeight);
    console.log(_(feeds).map('general').sumBy('balanceWeight'));

    var rows = [];
    var allProps = Feed.getSkeleton();
    var result = {
        average: {},
        dryRawValues: []
    };
    // got for analisys only
    allProps = _.filter(allProps, function(props) {
        return props[0] === 'analysis';
    });
    _.each(allProps, function(props) {
        _.each(feeds, function(feed, feedIndex) {
            var lastProp = null;
            var lastValue = null;
            _.each(props, function(prop, index) {
                // set dryRawValues
                if (prop === 'isNaturalWet') {
                    result.dryRawValues.push(_.map(lastValue, 'isNaturalWet'));
                }
                // get value
                if (lastValue && _.isArray(lastValue)) {
                    lastValue = _.map(lastValue, prop).filter(function(o) {
                        return !_.isNull(o)
                    });
                } else {
                    lastValue = lastValue ? lastValue[prop] : feed[prop];
                }
                // get property
                if (lastProp) {
                    var dryWetValue = null;
                    var canBerecalcalated = propertyForRecalculate[prop];
                    // get dry and wet value
                    if (canBerecalcalated) {
                        _.forEach(lastProp.analysis.dryMaterial.values[feedIndex], function(val, index1) {
                            var isNaturalWet = result.dryRawValues[feedIndex][index1];
                            var dryMaterial = val / 100;
                            var calcRaw = Math.round(lastValue[index1] * dryMaterial * 100) / 100;
                            var calcDry = Math.round((lastValue[index1] / dryMaterial * 100)) / 100;
                            !dryWetValue && (dryWetValue = []);
                            
                            if (_.isNumber(calcDry) && _.isNumber(calcRaw) && _.isNumber(lastValue[index1])){
                                dryWetValue.push({
                                    dryValue: isNaturalWet ? calcDry : lastValue[index1],
                                    rawValue: isNaturalWet ? lastValue[index1] : calcRaw
                                });
                            } else {
                                dryWetValue.push(null);
                            }
                        });
                    }
                    if (!lastProp[props[index - 1]][prop]) {
                        lastProp[props[index - 1]][prop] = {
                            values: [dryWetValue || lastValue]
                        };
                    } else {
                        lastProp[props[index - 1]][prop].values.push(dryWetValue || lastValue);
                    }
                    lastProp = lastProp[props[index - 1]];
                    dryWetValue = null;
                } else {
                    if (!result.average[prop]) {
                        result.average[prop] = {};
                    }
                    lastProp = result.average;
                }
            });
        });
    });
    // add average
    _.forEach(result.average['analysis'], function(value, key) {
        // get avergae value
        if (propertyForAverage[key]) {
            var sum = null;
            var length = 0;
            _.forEach(value.values, function(values) {
                _.forEach(values, function(value) {
                    
                    if (_.isObject(value) && 
                        _.isNumber(value.dryValue) && 
                        _.isNumber(value.rawValue) && 
                        value.dryValue !== 0 &&
                        value.rawValue !== 0) {
                        if (!sum) {
                            sum = {
                                dryValue: 0,
                                rawValue: 0
                            }
                        }
                        sum.dryValue += value.dryValue;
                        sum.rawValue += value.rawValue;
                        length ++;
                    } else if (_.isNumber(value)) {
                        if (!sum) {
                            sum = 0;
                        }
                        sum += value;
                        length ++;
                    }
                });
            });
            if (!sum) {
                sum = 1;
            } 
            
            if (_.isObject(sum)) {
                sum.dryValue = Math.round(sum.dryValue / length * 100) / 100,
                sum.rawValue = Math.round(sum.rawValue / length * 100) / 100
            } else {
                sum = Math.round(sum / length * 100) / 100;
            }
            value.values.push([sum]);
        } else {
            value.values.push([null]);
        }
    });

    var analysis = [{
        label: lang('analysis'),
        key: 'analysis',
        children: convertToControl(result.average['analysis'], 'analysis')
    }];

    result.dryRawValues.push([true])

    console.log(feeds[0].general.name);
    console.log(feeds[0].general.balanceWeight);

    return {
        dryRawValues: result.dryRawValues,
        balance: _.sumBy(feeds, function(f) {
            return f.general.balanceWeight;
        }),
        total: _.sumBy(feeds, function(f) {
            return f.general.totalWeight;
        }),
        headers: _.map(feeds, 'general').concat({
            name: 'Среднее',
            key: 'average'
        }),
        analysis: analysis
    }
}
module.exports = getAverage;