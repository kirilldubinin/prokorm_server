// set up ======================================================================
var Q = require('q');
var _ = require('lodash');
// models ======================================================================
var Feed = require('../models/feed');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var Catalog = require('../models/catalog');
var Ration = require('../models/ration');
// helpers =====================================================================
var diff = require('../feed/feed.diff');
var sum = require('../feed/feed.sum');
var average = require('../feed/feed.average');
var view = require('../feed/feed.view');
var edit = require('../ration/ration.edit');
var balance = require('../feed/feed.balance');
var charts = require('../feed/feed.charts');
var rating = require('../feed/feed.rating');
var list = require('../feed/feed.list');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler, log) {
    
    function checkUserRightForRation(ration, req, res) {
        var check = feed.createdBy.tenantId.equals(req.user.tenantId);
        if (res && !check) {
            res.status(403).send({
                message: 'You dont have permission for this object.'
            });
            return false;
        }
        return check;
    }
    app.get('/api/rations/dashboard', isAuthenticated, function(req, res) {
        
    });
    // new ration
    app.post('/api/rations', isAuthenticated, function(req, res) {
        if (!req.user._id || !req.user.tenantId || !req.user.permissions) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }

        var ration = new Ration();
        ration.createdAt = new Date();
        // set userId and tenantId
        ration.createdBy = {
            userId: req.user._id,
            tenantId: req.user.tenantId
        }

        ration.name = req.body.name;
        ration.description = req.body.description;
        ration.targetCow = req.body.targetCow;
        ration.feeds = req.body.feeds;
        ration.feeds = req.body.feeds;

        ration.save(function(err, newRation) {
            if (err) {
                return errorHandler(err, req, res);
            } else {
                res.json({
                    message: 'OK',
                    id: newRation._id
                });
            }
        });
    });
    // get feeds for feed list
    app.get('/api/rations', isAuthenticated, function(req, res) {
        Ration.find({
            'createdBy.tenantId': req.user.tenantId
        }).lean().exec(function(err, rations) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check checkUserRightForFeed
            rations = _.filter(rations, function(f) {
                return checkUserRightForRation(f, req);
            });
            res.json(list(rations));
        });
    });

    // get ration skeleton
    app.post('/api/rations/new', isAuthenticated, function(req, res) {
        res.json(edit());
    });
}