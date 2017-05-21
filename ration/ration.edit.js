var _ = require('lodash');
var lang = require('./ration.lang');
var Ration = require('../models/ration');

function convertToControl(item, parentKey) {

    var editObj = {};
    _.each(item, function(value, key) {
        if (item.hasOwnProperty(key)) {
            editObj[key] = {
                label: lang(key),
                key: key,
                value: value
            }
        }
    });
    return editObj;
};

function convert(ration) {
    if (!ration) {
        ration = Ration.getEmptyFeed();
    }

    // sort field
    var goldFeed = Ration.getEmptyFeed();

    return [
        {
            label: lang('general'),
            key: 'general',
            initialItem: ration.general,
            controls: Ration.sort(convertToControl(ration.general, 'general'), 'general')
        }
    ];
}
module.exports = convert;