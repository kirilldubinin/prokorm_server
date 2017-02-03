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
//var perDay = require('../feed/feed.perDay');
var lang = require('../feed/lang');
module.exports = function(app, isAuthenticated, errorHandler) {

    function sortFeeds (a,b) {
        if (a.harvest.end && b.harvest) {
            return a.harvest.end.getTime() - b.harvest.end.getTime();    
        } else {
            return a.general.year - b.general.year;
        }
    }

    function checkUserRightForFeed (feed, req, res) {
        var check = feed.createdBy.tenantId.equals(req.user.tenantId);
        if (res && !check) {
            res.status(403).send({
                message: 'You dont have permission for this object.'
            });
            return false;
        }
        return check;
    }
    // new feed
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
            var actions = ['diffFeed', 'averageFeed', 'sumFeed'];
            var canAdd = 
                (req.user.permissions.indexOf('admin') > -1 ||
                req.user.permissions.indexOf('write') > -1);

            if (canAdd) {
                actions.unshift('addFeed');    
            }
            
            res.status(200).json({
                actions: _.map(actions, function (f) {
                    return {
                        key: f,
                        label: lang(f)
                    };
                }),
                years: [prevYear, currentYear].join('-'),
                balance: balance(feeds, [prevYear, currentYear]),
                //perDay: perDay(feeds),
                noAnalysis: _.map(_.filter(feeds, function(f) {
                    return !f.analysis.length;
                }), function(f) {
                    return {
                        _id: f._id,
                        label: f.general.name + ' ' + f.general.year,
                        url: ('/#/farm/' + req.user.tenantName + '/feed/' + f._id)
                    };
                })
            });
        });
    });
    app.post('/api/feeds', isAuthenticated, function(req, res) {
        
        var canEdit = 
            req.user.permissions.indexOf('admin') > -1 ||
            req.user.permissions.indexOf('write') > -1;

        if (!canEdit) {
            return res.status(406).json({
                message: 'Недостаточно прав'
            });
        }

        var feed = new Feed();
        feed.createdAt = new Date();
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
            //sort
            // all opened: true
            // all closed: true
            // all done: true
            var opened = _.filter(feeds, function(f) {
                return f.general.opened && !f.general.done;
            }).sort(sortFeeds);
            var closed = _.filter(feeds, function(f) {
                return !f.general.opened && !f.general.done;
            }).sort(sortFeeds);
            var done = _.filter(feeds, function(f) {
                return f.general.done;
            }).sort(sortFeeds);
            var sortedFeeds = _.concat(opened, closed, done);
            var shortFeeds = _.map(sortedFeeds, function(feed) {
                return _.merge({}, feed.general, {
                    _id: feed._id,
                    analysis: feed.analysis.length,
                    feedType: (feed.general.feedType === 'none' ? '' : lang(feed.general.feedType)),
                    field: feed.general.field ? ('Поле: ' + feed.general.field) : undefined
                });
            });

            var filterValues = {
                years: _.filter(_.uniq(_.map(shortFeeds, 'year')), null) ,
                feedTypes: _.filter(_.uniq(_.map(shortFeeds, 'feedType')), null),
                compositions: _.filter(_.uniq(_.map(shortFeeds, 'composition')), null),
                storages: _.filter(_.uniq(_.map(shortFeeds, 'storage')), null)
            };

            res.json({
                feeds: shortFeeds,
                filterValues: filterValues
            });
        });
    });
    // get feed by id for view mode
    app.get('/api/feeds/:feed_id/view', isAuthenticated, function(req, res) {
        Feed.findById(req.params.feed_id).lean().exec(function(err, feed) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (checkUserRightForFeed(feed, req, res)) {
                res.json(view(feed, req.user));
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
        
        var canEdit = 
            req.user.permissions.indexOf('admin') > -1 ||
            req.user.permissions.indexOf('write') > -1;

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
                // save the bear
                feed.save(function(err, updatedFeed) {
                    if (err) res.send(err);
                    res.json({
                        message: 'OK',
                        id: updatedFeed._id
                    });
                });
            }
        });
    });
    // delete feed by id
    app.delete('/api/feeds/:feed_id', isAuthenticated, function(req, res) {
        
        var canEdit = 
            req.user.permissions.indexOf('admin') > -1 ||
            req.user.permissions.indexOf('write') > -1;

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
    app.get('/api/feeds/charts', isAuthenticated, function(req, res) {
        Feed.find({
            'createdBy.tenantId': req.user.tenantId
        }).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }
            // double check checkUserRightForFeed and feed has analysis
            // sort by harvest.end
            feeds = _.filter(feeds, function(f) {
                return checkUserRightForFeed(f, req) && f.analysis && f.analysis.length;
            }).sort(sortFeeds);

            var series = ['dryMaterial', 'ph', 'oilAcid', 'exchangeEnergy', 'crudeAsh']
            var allYears = [];
            var chartSeries = _.map(series, function (seria) {
               
                var seriaDates = _.map(feeds, function (feed) {
                    var lastAnalys = _.last(feed.analysis);
                    allYears.push(lastAnalys.date.getFullYear())
                    return {
                        year: lastAnalys.date.getFullYear(),
                        data: lastAnalys[seria]
                    };
                });

                seriaDates = _.groupBy(seriaDates, 'year');
                seriaDates = _.map(seriaDates, function (data, key){
                    return {
                        year: key,
                        data: _.sumBy(data, 'data')
                    };
                });

                return {
                    name: lang(seria),
                    data: seriaDates
                }
            });

            allYears = _.uniq(allYears);
            chartSeries = _.map(chartSeries, function(chartSeria){
                
                var groupByYear = _.groupBy(chartSeria.data, 'year');
                console.log(groupByYear);
                return {
                    name: chartSeria.name,
                    data: _.map(allYears, function (year) {
                        console.log('================');
                        console.log(groupByYear[year]);
                        if (!groupByYear[year]) {
                            return null;
                        } else {
                            return _.first(_.map(groupByYear[year], 'data'));
                        }
                    })
                }
            })

            return res.json({
                categories: allYears,
                chartSeries: chartSeries
            });

            console.log('====================');
            console.log(chartSeries);
             _.filter(_.map(feeds, function (feed) {
                var a = _.last(feed.analysis);
                return {
                    x: a.date.getFullYear(),
                    y: a.crudeAsh
                };
            }), function (data) { return data.y !== null; });

            
            var crudeAsh = _.filter(_.map(feeds, function (feed) {
                var a = _.last(feed.analysis);
                return {
                    x: a.date.getFullYear(),
                    y: a.crudeAsh
                };
            }), function (data) { return data.y !== null; });

            crudeAsh = _.groupBy(crudeAsh, 'x');
            console.log(crudeAsh);
            crudeAsh = _.map(crudeAsh, function (data, key) {
                console.log(key);
                console.log(data);
                return {
                    x: parseInt(key),
                    y: _.sumBy(data, 'y')/data.length    
                }
            });

            res.json(crudeAsh);
        });
    });
}