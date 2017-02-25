// set up ======================================================================
var Q = require('q');
var _ = require('lodash');
// models ======================================================================
var Feed = require('../models/feed');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var Catalog = require('../models/catalog');
// helpers =====================================================================
var diff = require('../feed/feed.diff');
var sum = require('../feed/feed.sum');
var average = require('../feed/feed.average');
var view = require('../feed/feed.view');
var edit = require('../feed/feed.edit');
var balance = require('../feed/feed.balance');
var charts = require('../feed/feed.charts');
var list = require('../feed/feed.list');
var lang = require('../feed/lang');
//588f4854a136f8601a50571e:588f4c21a136f8601a505722:588f5353a136f8601a505726
var demoConfig = {
    viewDemoFeedId: '588f4c21a136f8601a505722',
    diffDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    averageDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    sumDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722','588f5353a136f8601a505726',
    '588f5567a136f8601a505728','588f571ca136f8601a50572a','588f4a90a136f8601a505720']
};

var demoCache = {};

module.exports = function(app, isAuthenticated, errorHandler) {
    app.get('/api/feeds/viewDemo', function(req, res) {
        
        Feed.findById(demoConfig.viewDemoFeedId).lean().exec(function(err, feed) {
            if (err) {
                return res.status(406).json({
                    message: 'Нет корма с таким идентификатором.'
                });
            }
            if (feed === null) {
                return res.status(406).json({
                    message: 'Нет корма с таким идентификатором.'
                });
            }

            if (!demoCache.viewDemo) {
                var feedView = view(feed);
                demoCache.viewDemo = {
                    general: feedView.general,
                    feedItemSections: feedView.feedItemSections,
                    actions: [_.find(feedView.actions, {key: 'print'})]
                };
            }
            return res.json(demoCache.viewDemo);
        });
    });

    app.post('/api/feeds/diffDemo', function(req, res) {
        var promises = _.map(demoConfig.diffDemoFeedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            if (!demoCache.diffDemo) {
                demoCache.diffDemo = diff(feeds);
            }
            res.status(200).json(demoCache.diffDemo);
        }, function(err) {
            res.send(err);
        });
    });

    app.post('/api/feeds/averageDemo', function(req, res) {
        var promises = _.map(demoConfig.averageDemoFeedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {

            if (!demoCache.averageDemo) {
                demoCache.averageDemo = average(feeds);
            }
            res.status(200).json(demoCache.averageDemo);
        }, function(err) {
            res.send(err);
        });
    });

    app.post('/api/feeds/sumDemo', function(req, res) {
        var promises = _.map(demoConfig.sumDemoFeedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            if (!demoCache.sumDemo) {
                demoCache.sumDemo = sum(feeds);
            }
            res.status(200).json(demoCache.sumDemo);
        }, function(err) {
            res.send(err);
        });
    });
}