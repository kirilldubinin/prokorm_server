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
var rating = require('../feed/feed.rating').getRaiting;
var list = require('../feed/feed.list');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler, log) {
    
    function getName (feed) {
        if (!feed.general.name) {
            return lang(feed.general.feedType) + ':' + feed.general.composition;
        } else {
            return feed.general.name;
        }
    }

    function checkUserRightForFeed(feed, req, res) {
        var check = feed.createdBy.tenantId.equals(req.user.tenantId);
        if (res && !check) {
            res.status(403).send({
                message: 'You dont have permission for this object.'
            });
            return false;
        }
        return check;
    }
    app.get('/api/feeds/dashboard', isAuthenticated, function(req, res) {
        
        var currentYear = new Date().getFullYear();
        var prevYear = currentYear - 1;
        Feed.find({
            'createdBy.tenantId': req.user.tenantId,
            'general.year': {
                $in: [prevYear, currentYear]
            }
        }).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });
            // set user actions for Feed module
            var actions = ['diffFeed', 'averageFeed', 'sumFeed', 'planningFeed', 'ratingFeed', 'chartsFeed'];
            var canAdd = (req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1);
            if (canAdd) {
                actions.unshift('addFeed');
            }
            res.status(200).json({
                actions: _.map(actions, function(f) {
                    return {
                        key: f,
                        label: lang(f)
                    };
                }),
                years: [prevYear, currentYear].join('-'),
                balance: balance(feeds, [prevYear, currentYear]),
                progress: progress(feeds, req.user.tenantName),
                //perDay: perDay(feeds),
                noAnalysis: _.map(_.filter(feeds, function(f) {
                    return !f.analysis.length;
                }), function(f) {
                    return {
                        _id: f._id,
                        label: getName(f),
                        url: ('/#/' + req.user.tenantName + '/feed/' + f._id)
                    };
                })
            });
        });
    });
    // new feed
    app.post('/api/feeds', isAuthenticated, function(req, res) {
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

        var feed = new Feed();
        feed.createdAt = new Date();
        // set userId and tenantId
        feed.createdBy = {
            userId: req.user._id,
            tenantId: req.user.tenantId
        }
        feed.general = req.body.general;
        feed.analysis = req.body.analysis;
        feed.harvest = req.body.harvest;
        feed.feeding = req.body.feeding;
        feed.save(function(err, newFeed) {
            if (err) {
                return errorHandler(err, req, res);
            } else {
                res.json({
                    message: 'OK',
                    id: newFeed._id
                });
            }
        });
    });
    // get feeds for feed list
    app.get('/api/feeds', isAuthenticated, function(req, res) {
        Feed.find({
            'createdBy.tenantId': req.user.tenantId
        }).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check checkUserRightForFeed
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });
            res.json(list(feeds));
        });
    });
    // get feeds by search query
    app.post('/api/feeds/search', isAuthenticated, function(req, res) {
        var query = req.body.query;
        console.log(query);

        Feed.find({
            'createdBy.tenantId': req.user.tenantId
        }).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check checkUserRightForFeed
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });

            var result = list(feeds).feeds;
            result = _.filter(result, function (feed) {
                console.log(feed.name);
                console.log(feed.name.indexOf(query) > -1);
                return feed.name.indexOf(query) > -1;
            });

            console.log(result);

            res.json(result);
        });
    });
    // get feed by id for view mode
    app.get('/api/feeds/:feed_id/view', isAuthenticated, function(req, res) {
        Feed.findById(req.params.feed_id).lean().exec(function(err, feed) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (feed === null) {
                return res.status(406).json({
                    message: 'Нет корма с таким идентификатором.'
                });
            }
            if (checkUserRightForFeed(feed, req, res)) {
                return res.json(view(feed, req.user));
            } else {
                return res.status(406).json({
                    message: 'Недостаточно прав.'
                })
            }
        });
    });
    // get feed by id for edit mode
    app.get('/api/feeds/:feed_id/edit', isAuthenticated, function(req, res) {
        Feed.findById(req.params.feed_id).lean().exec(function(err, feed) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (checkUserRightForFeed(feed, req, res)) {
                res.json(edit(feed));
            }
        });
    });
    // update feed by id
    app.put('/api/feeds/:feed_id', isAuthenticated, function(req, res) {
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        Feed.findById(req.params.feed_id, function(err, feed) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (checkUserRightForFeed(feed, req, res)) {
                // !!! do not update createdBy and createdAt !!!
                feed.general = req.body.general;
                feed.analysis = req.body.analysis;
                feed.harvest = req.body.harvest;
                feed.feeding = req.body.feeding;
                feed.save(function(err, updatedFeed) {
                    if (err) {
                        return errorHandler(err, req, res);
                    } else {
                        res.json({
                            message: 'OK',
                            id: updatedFeed._id
                        });
                    }
                });
            }
        });
    });
    // delete feed by id
    app.delete('/api/feeds/:feed_id', isAuthenticated, function(req, res) {
        var canEdit = req.user.permissions.indexOf('admin') > -1 || req.user.permissions.indexOf('write') > -1;
        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }
        Feed.remove({
            _id: req.params.feed_id
        }, function(err, bear) {
            if (err) {
                return errorHandler(err, req, res);
            }
            res.json({
                message: 'OK',
                id: req.params.feed_id
            });
        });
    });
    // get feed skeleton
    app.post('/api/feeds/new', isAuthenticated, function(req, res) {
        res.json(edit());
    });
    // get analysis skeleton
    app.post('/api/feeds/newAnalysis', isAuthenticated, function(req, res) {
        var emptyFeed = Feed.getEmptyFeed();
        var editEmptyFeed = edit(emptyFeed);
        var analysisSubSection = editEmptyFeed[0].subSections[0];
        res.status(200).json(analysisSubSection);
    });
    // get feeds diff
    app.post('/api/feeds/diff', isAuthenticated, function(req, res) {
        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });
            res.status(200).json(diff(feeds));
        }, function(err) {
            res.send(err);
        });
    });
    // get feeds sum
    app.post('/api/feeds/sum', isAuthenticated, function(req, res) {
        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });
            res.status(200).json(sum(feeds));
        }, function(err) {
            res.send(err);
        });
    });
    // get feeds planning
    app.post('/api/feeds/planning', isAuthenticated, function(req, res) {

        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });

            res.status(200).json(planning({feeds: feeds, tonnPerDay: req.body.tonnPerDay}));
        }, function(err) {
            res.send(err);
        });
    });
    // get feeds average
    app.post('/api/feeds/average', isAuthenticated, function(req, res) {
        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req);
            });
            res.status(200).json(average(feeds));
        }, function(err) {
            res.send(err);
        });
    });
    // charts
    app.post('/api/feeds/charts', isAuthenticated, function(req, res) {
        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            // double check checkUserRightForFeed and feed has analysis
            // sort by harvest.end
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req) && f.analysis && f.analysis.length;
            });
            return res.json(charts(feeds));
        }, function(err) {
            res.send(err);
        });
    });
    // rating
    app.post('/api/feeds/rating', isAuthenticated, function(req, res) {
        var feedIds = req.body.feedIds;
        var feedType = req.body.feedType;

        if (!feedType) {
            return res.status(406).json({
                message: 'Необходимо ввести тип корма.'
            });
        }

        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            // double check checkUserRightForFeed and feed has analysis
            // sort by harvest.end
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req) && f.analysis && f.analysis.length;
            });
            try {
                return res.json(rating(feeds, feedType));
            } 
            catch(e) {
                res.status(406).json({
                    message: e
                });
            }
            
        }, function(err) {
            res.send(err);
        });
    });
}