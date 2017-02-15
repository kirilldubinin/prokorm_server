var Feed = require('../models/feed');
var lang = require('./lang');
var feedUtils = require('./feed.utils');
var dimension = require('./dimension.sum');
var _ = require('lodash');

function create(req, res) {

    if (!req.user._id || !req.user.tenantId || !req.user.permissions) {
        return res.status(406).json({
            message: 'Недостаточно прав'
        });
    }

    var canEdit = 
        req.user.permissions.indexOf('admin') > -1 ||
        req.user.permissions.indexOf('write') > -1;

    if (!canEdit) {
        return res.status(406).json({
            message: 'Недостаточно прав'
        });
    }

    var general = req.body.general;
    var analysis = req.body.analysis;

    // validate
    if (!general.feedType) {
        return res.status(406).json({
            message: lang('feedType') + ' обязательно для заполнения'
        });
    }

    if (!general.composition) {
        return res.status(406).json({
            message: lang('composition') + ' обязательно для заполнения'
        });
    }

    if (!general.year) {
        return res.status(406).json({
            message: lang('year') + ' обязательно для заполнения'
        });
    }

    if (analysis.length) {

        if (_.some(analysis, function (a) {
            return !a.number;
        })) {
            return res.status(406).json({
                message: lang('number') + 'анализа обязателен для заполнения'
            });
        }

        if (_.some(analysis, function (a) {
            return !a.date;
        })) {
            return res.status(406).json({
                message: lang('date') + 'анализа обязательна для заполнения'
            });
        }

        if (_.some(analysis, function (a) {
            return !a.dryMaterial;
        })) {
            return res.status(406).json({
                message: lang('dryMaterial') + 'анализа обязательно для заполнения'
            });
        }
    }

    return {
        general: req.body.general,
        analysis: req.body.analysis,
        harvest: req.body.harvest,
        feeding: req.body.feeding
    };
}

module.exports = create;