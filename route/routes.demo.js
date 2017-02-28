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
var rating = require('../feed/feed.rating');
var lang = require('../feed/lang');
//588f4854a136f8601a50571e:588f4c21a136f8601a505722:588f5353a136f8601a505726
var demoConfig = {
    viewDemoFeedId: '588f4c21a136f8601a505722',
    diffDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    averageDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    sumDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722','588f5353a136f8601a505726',
    '588f5567a136f8601a505728','588f571ca136f8601a50572a','588f4a90a136f8601a505720'],
    ratingDemoFeeds: ['588f4854a136f8601a50571e', '588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    chartsDemoFeeds:    ['58957f9b9149da6cbc815976','589495e729f0f068bd468f2e','589495e729f0f068bd468f2c',
                        '5894943b29f0f068bd468f2a','5894931729f0f068bd468f28','5891ef318548cb4080704792'
                        ,'5891edc18548cb4080704790']
};

var demoCache = {};

module.exports = function(app, isAuthenticated, errorHandler) {
    app.get('/api/feeds/viewDemo', function(req, res) {
        
        Feed.findById(demoConfig.viewDemoFeedId).lean().exec(function(err, feed) {
            if (err) {
                return res.status(406).json({
                    message: 'Нет доступных кормов.'
                });
            }
            if (feed === null) {
                return res.status(406).json({
                    message: 'Нет доступных кормов.'
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
        
        if (!demoCache.diffDemo) {
            var promises = _.map(demoConfig.diffDemoFeedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {
                
                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }

                demoCache.diffDemo = diff(feeds);    
                res.status(200).json(demoCache.diffDemo);
            }, function(err) {
                res.send(err);
            });
        } else {
            res.status(200).json(demoCache.diffDemo);
        }
    });

    app.post('/api/feeds/averageDemo', function(req, res) {
        
        if (!demoCache.averageDemo) {
            var promises = _.map(demoConfig.averageDemoFeedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {
                
                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }

                demoCache.averageDemo = average(feeds);    
                res.status(200).json(demoCache.averageDemo);
            }, function(err) {
                res.send(err);
            });
        } else {
            res.status(200).json(demoCache.averageDemo);
        }
    });

    app.post('/api/feeds/sumDemo', function(req, res) {
        
        if (!demoCache.sumDemo) {
            var promises = _.map(demoConfig.sumDemoFeedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {

                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }

                demoCache.sumDemo = sum(feeds);    
                res.status(200).json(demoCache.sumDemo);
            }, function(err) {
                res.send(err);
            });    
            
        }  else {
            res.status(200).json(demoCache.sumDemo);
        }
    });

    app.post('/api/feeds/ratingDemo', function(req, res) {
        if (!demoCache.ratingDemo) {
            var feedIds = demoConfig.ratingDemoFeeds;
            var feedType = 'haylage';

            var promises = _.map(feedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {
                
                feeds = _.filter(feeds, Boolean);
                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }                

                try {
                    demoCache.ratingDemo = rating(feeds, feedType);  
                } catch(e) {
                console.log(e);
                }

                  
                console.log(demoCache.ratingDemo);
                return res.json(demoCache.ratingDemo);
            }, function(err) {
                res.send(err);
            });
        } else {
            res.json(demoCache.ratingDemo);
        }
        
    });

    app.post('/api/feeds/chartsDemo', function(req, res) {
        if (!demoCache.chartsDemo) {
            var feedIds = demoConfig.chartsDemoFeeds;
            var feedType = 'haylage';

            var promises = _.map(feedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {

                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                } 

                demoCache.chartsDemo = charts(feeds);
                return res.json(demoCache.chartsDemo);
            }, function(err) {
                res.send(err);
            });
        } else {
            res.json(demoCache.chartsDemo);
        }
    });
}