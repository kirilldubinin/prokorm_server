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
var planning = require('../feed/feed.planning');
var average = require('../feed/feed.average');
var view = require('../feed/feed.view');
var edit = require('../feed/feed.edit');
var balance = require('../feed/feed.balance');
var progress = require('../feed/feed.progress');
var charts = require('../feed/feed.charts');
var list = require('../feed/feed.list');
var rating = require('../feed/feed.rating');
var lang = require('../feed/lang');

var demoConfig = {
    tenantId: '588f2a75a136f8601a50571c',// '586e44a29f6b081ab6bb947a',
    tenantName: 'demo',
    viewDemoFeedId: '588f4c21a136f8601a505722', //'5874df36beef28178710c156'
    diffDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    averageDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    sumDemoFeedIds: ['588f4854a136f8601a50571e','588f4c21a136f8601a505722','588f5353a136f8601a505726',
    '588f5567a136f8601a505728','588f571ca136f8601a50572a','588f4a90a136f8601a505720'],
    ratingDemoFeeds: ['588f4854a136f8601a50571e', '588f4c21a136f8601a505722', '588f5353a136f8601a505726'],
    chartsDemoFeeds:    ['58957f9b9149da6cbc815976','589495e729f0f068bd468f2e','589495e729f0f068bd468f2c',
                        '5894943b29f0f068bd468f2a','5894931729f0f068bd468f28','5891ef318548cb4080704792'
                        ,'5891edc18548cb4080704790'],
    planningDemoFeeds: ['588f4854a136f8601a50571e', '588f4c21a136f8601a505722']
};

var demoCache = {};

module.exports = function(app, isAuthenticated, errorHandler) {

    // get feeds for feed list
    app.get('/api/demoFeeds', function(req, res) {

        if (!demoCache.feeds) {
            Feed.find({
                'createdBy.tenantId': demoConfig.tenantId
            }).lean().exec(function(err, feeds) {
                if (err) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }
                // double check checkUserRightForFeed
                demoCache.feeds = list(feeds);
                res.status(200).json(demoCache.feeds);
            });    
        } else {
            res.status(200).json(demoCache.feeds);
        }
    });

    app.get('/api/feeds/demoDashboard', function(req, res) {
        
        var currentYear = new Date().getFullYear();
        var prevYear = currentYear - 1;
        Feed.find({
            'createdBy.tenantId': demoConfig.tenantId,
            'general.year': {
                $in: [prevYear, currentYear]
            }
        }).lean().exec(function(err, feeds) {
            if (err) {
                return res.status(406).json({
                    message: 'Нет доступных кормов.'
                });
            }
            res.status(200).json({
                years: [prevYear, currentYear].join('-'),
                balance: balance(feeds, [prevYear, currentYear]),
                progress: progress(feeds, demoConfig.tenantName),
                noAnalysis: _.map(_.filter(feeds, function(f) {
                    return !f.analysis.length;
                }), function(f) {
                    return {
                        _id: f._id,
                        label: f.general.name + ' ' + f.general.year,
                        url: ('/#/' + demoConfig.tenantName + '/feed/' + f._id)
                    };
                })
            });
        });
    });

    app.get('/api/feeds/viewDemo', function(req, res) {
        
        if (!demoCache.viewDemo) {
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

                var feedView = view(feed);
                demoCache.viewDemo = {
                    general: feedView.general,
                    feedItemSections: feedView.feedItemSections,
                    actions: [_.find(feedView.actions, {key: 'print'})]
                };

                res.status(200).json(demoCache.viewDemo);
            });
        } else {
            res.status(200).json(demoCache.viewDemo);
        }
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

    app.post('/api/feeds/planningDemo', function(req, res) {
        
        if (!demoCache.planningDemo) {
            var feedIds = demoConfig.planningDemoFeeds;
            var promises = _.map(feedIds, function(feedId) {
                return Feed.findById(feedId);
            });
            Q.all(promises).then(function(feeds) {

                if (!feeds || !feeds.length) {
                    return res.status(406).json({
                        message: 'Нет доступных кормов.'
                    });
                }

                console.log('1')
                demoCache.planningDemo = planning({
                    feeds: feeds, 
                    tonnPerDay: {
                        haylage: 32
                    }
                });
                console.log('2')
                res.status(200).json(demoCache.planningDemo);
            }, function(err) {
                res.send(err);
            });  
        } else {
            res.status(200).json(demoCache.planningDemo);
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