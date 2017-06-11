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
        },
        {
            label: lang('feeds'),
            key: 'feeds',
            initialItem: ration.feeds,
            header: [
                {
                    label: '#'
                },
                {
                    label: lang('feed')
                },
                {
                    label: lang('weight')
                },
                {
                    label: lang('dryMaterial')
                },
                {
                    label: lang('dryMaterialTotal')
                },
                {
                    label: lang('price')
                },
                {
                    label: lang('priceTotal')
                }
            ],
            body: _.map(ration.feeds, function (feed, index) {

                return [
                    index,
                    feed.name,
                    feed.weight,
                    feed.dryMaterial,
                    Math.round(feed.weight * feed.dryMaterial),
                    feed.price,
                    Math.round(feed.weight * feed.price)
                ];
            })
        }
    ];
}
module.exports = convert;