var _ = require('lodash');
var lang = require('./lang');
var dimension = require('./dimension');

var disabledFields = {
    'analysis.number': 'disabled'
};

var enumFields = {
    'general.feedType': 'enum'
};

var dateFields = {
    'analysis.date': 'date',
    'harvest.start': 'date',
    'harvest.end': 'date',
    'feeding.start': 'date',
    'feeding.end': 'date'
};

function convertToControl(item, parentKey) {

    var editObj = {};
    _.each(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            editObj[key] = {

                isEnum: enumFields[parentKey + '.' + key],
                isNumber: _.isNumber(value),
                isBoolean: value === true || value === false,
                isDisabled: disabledFields[parentKey + '.' + key],
                isDate: _.isDate(value),// dateFields[parentKey + '.' + key],

                label: lang(key),
                dimension: dimension(key),
                key: key
            }
        }
    });
    return editObj;
};

function getEmptyFeed() {
    return {
        analysis: [{
            isNaturalWet: false,
            number: 1,
            date: new Date(),
            dryMaterial: 33,
            ph: 12,
            milkAcid: 23,
            aceticAcid: 33,
            oilAcid: 23,
            dve: 44,
            oeb: 55,
            vos: 231,
            vcos: 22,
            fos: 11,
            nel: 21.21,
            nelvc: 211,
            exchangeEnergy: 400,
            nxp: 32,
            rnb: 23,
            udp: 311,
            crudeAsh: 565,
            nh3: 454,
            nitrates: 343,
            crudeProtein: 343,
            solubleCrudeProtein: 22,
            crudeFat: 3,
            sugar: 21,
            starch: 32,
            starchPasses: 455,
            crudeFiber: 34,
            ndf: 23,
            ndfDigested: 12,
            adf: 11,
            adl: 43,
            calcium: 54,
            phosphorus: 43,
            carotene: 21
        }],
        general: {
            name: 'Сенаж1',
            feedType: 'none',
            composition: 'Люцерна',
            year: 2016,
            field: '23.21',
            totalWeight: 2100,
            balanceWeight: 2100,
            storage: 'Курган Семеново',
            opened: false,
            done: false
        },
        harvest: {
            cutNumber: 1,
            preservative: 'Sano',
            dosage: '150гр/50 тонн',
            film: '',
            start: new Date(),
            end: new Date()
        },
        feeding: {
            start: new Date(),
            end: new Date(),
            tonnPerDay: 4
        }
    }
}

function convert(feed) {
    if (!feed) {
        feed = getEmptyFeed();
    }
    return [{
        width: 40,
        label: lang('analysis'),
        key: 'analysis',
        subSections: _.map(feed.analysis, function(analys) {
            return {
                initialItem: analys,
                controls: convertToControl(analys, 'analysis')
            }
        })
    }, {
        width: 20,
        label: lang('general'),
        key: 'general',
        subSections: [{
            initialItem: feed.general,
            controls: convertToControl(feed.general, 'general')
        }]
    }, {
        width: 20,
        label: lang('harvest'),
        key: 'harvest',
        subSections: [{
            initialItem: feed.harvest,
            controls: convertToControl(feed.harvest, 'harvest')
        }]
    }, {
        width: 20,
        label: lang('feeding'),
        key: 'feeding',
        subSections: [{
            initialItem: feed.feeding,
            controls: convertToControl(feed.feeding, 'feeding')
        }]
    }];
}
module.exports = convert;