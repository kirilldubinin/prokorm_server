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
var average = require('../feed/feed.average');
var view = require('../feed/feed.view');
var edit = require('../feed/feed.edit');
var balance = require('../feed/feed.balance');
//var perDay = require('../feed/feed.perDay');
var registration = require('../authentication/registration');
var CustomStrategy = require('../authentication/local');
var winston = require('winston');
var lang = require('../feed/lang');
var modules = require('../config/modules');
// routes =====================================================================
module.exports = function(app) {

    var authStrategy = new CustomStrategy(app);

    function checkUserRightForFeed(feed, req, res) {
        var check = feed.createdBy.tenantId.equals(req.user.tenantId);
        if (res && !check) {
            res.status(403).send({message: 'You dont have permission for this object.'});
            return false;   
        }

        return check;
    }

    function errorHandler(err, req, res) {

        winston.error(err.name + ':', err.message);
        if (err.name === 'ValidationError') {
            return res.status(406).json({
                message: err.message
            });            
        } 

        return res.status(400).json({
            message: err.message || err.message
        });
    }

    function isAuthenticated(req, res, next) {
        // do any checks you want to in here
        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if (req.user) {
            return next();
        } else {
            // IF A USER ISN'T LOGGED IN
            res.status(401).send({
                message: 'Authentication failed'
            });
            //res.redirect('/');    
        }
    }
    app.get('/api/', function(req, res) {
        res.json({
            message: 'PROKORM API'
        });
    });
    // registration =====================================
    app.post('/api/registration', function(req, res) {
        // check if tenant name is exist
        Tenant.findOne({
            loginName: req.body.loginname
        }).lean().exec(function(err, exist) {
            console.log(exist);
            if (exist) {
                res.status(406).send({
                    message: 'Компания c именем "' + req.body.loginname + '"" уже существует. Пожалуйста, укажите другое имя.'
                });
            } else {
                User.findOne({
                    email: req.body.email
                }).lean().exec(function(err, exist) {
                    console.log(exist);
                    if (exist) {
                        res.status(406).send({
                            message: 'Компания c E-Mail "' + req.body.email + '"" уже существует. Пожалуйста, укажите другой E-Mail.'
                        });
                    } else {
                        registration.createTenant(req.body, function(err, user) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({
                                    message: 'На электронный адрес ' + req.body.email + ' отправлено письмо с дальнейшими инструкциями.'
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    // login ============================================
    app.post('/api/signin', function(req, res) {
        //console.log(req.body);
        // yc5NhI
        // add validation before calling the authenicate() method
        authStrategy.authenticate(req, function(err, user, tenant) {
            if (!err && user && tenant && user.tenantId.equals(tenant._id)) {
                // set tenant data for user object
                var sessionUser = {
                    name: user.name,
                    _id: user._id,
                    tenantId: tenant._id,
                    tenantName: tenant.loginName,
                    tenantFullName: tenant.fullName || tenant.loginName,
                    modules: modules
                };
                console.log(sessionUser);
                req.logIn(sessionUser, function(err) {
                    if (err) {
                        res.json(err);
                    } else {
                        // you can send a json response instead of redirecting the user
                        res.json({
                            username: user.name,
                            tenantFullName: tenant.fullName || tenant.loginName,
                            tenantName: tenant.loginName
                        });
                    }
                });
            } else {
                return res.status(401).send({
                    message: 'Invalid email or password.'
                });
            }
        });
    });
    app.post('/api/logout', isAuthenticated, function(req, res) {
        req.logout();
        res.status(401).send({
            message: 'Authentication failed'
        });
    });
    // session data =====================================
    app.get('/api/sessionData', isAuthenticated, function(req, res) {
        var sessionUser = req.user;
        res.json({
            user: sessionUser
        });
    });
    // feed =============================================
    // new feed

    app.get('/api/feeds/dashboard', isAuthenticated, function (req, res) {

        var currentYear = new Date().getFullYear();
        var prevYear = currentYear - 1;

        Feed.find({'createdBy.tenantId': req.user.tenantId, 'general.year': { $in: [prevYear, currentYear] }}).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }

            // double check
            feeds = _.filter(feeds, function (f) {
                return checkUserRightForFeed(f, req);
            });

            res.status(200).json({
                years: [prevYear, currentYear].join('-'),
                balance: balance(feeds, [prevYear, currentYear]),
                //perDay: perDay(feeds),
                noAnalysis: _.map(_.filter(feeds, function (f) {
                    return !f.analysis.length;
                }), function (f) {
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
            }
            else {
                res.json({
                    message: 'OK',
                    id: newFeed._id
                });
            }
        });
    });
    // get feeds for feed list
    app.get('/api/feeds', isAuthenticated, function(req, res) {
        Feed.find({'createdBy.tenantId': req.user.tenantId}).lean().exec(function(err, feeds) {
            if (err) {
                return errorHandler(err, req, res);
            }

            // double check
            feeds = _.filter(feeds, function (f) {
                return checkUserRightForFeed(f, req);
            });

            //sort
            // all opened: true
            // all closed: true
            // all done: true

            var opened = _.filter(feeds, function (f) {
                return f.general.opened && !f.general.done;
            });

            var closed = _.filter(feeds, function (f) {
                return !f.general.opened && !f.general.done;
            });

            var done = _.filter(feeds, function (f) {
                return f.general.done;
            });            

            var sortedFeeds = _.concat(opened, closed, done);

            var shortFeeds = _.map(sortedFeeds, function(feed) {
                return _.merge({}, feed.general, {
                    _id: feed._id,
                    feedType: (feed.general.feedType === 'none' ? 
                        '' : lang(feed.general.feedType)),
                    field: feed.general.field ? ('Поле: ' + feed.general.field) : undefined
                });
            });
            res.json(shortFeeds);
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

    // catalog =====================================================
    app.get('/api/catalog', isAuthenticated, function (req, res) {
        Catalog.find().lean().exec(function(err, items) {
            if (err) {
                return errorHandler(err, req, res);
            }

            var shortItems = _.map(items, function (item) {
                return {
                    key: item.key,
                    short: item.ru_short
                }
            });
            res.status(200).json(shortItems);
        });
    });

    app.get('/api/catalog/:key', isAuthenticated, function (req, res) {
        Catalog.findOne({key: req.params.key}).lean().exec(function(err, item) {
            if (err) {
                return errorHandler(err, req, res);
            }
            var result = {
                key: item.key,
                short: item.ru_short,
                content: item.ru_content
            }
            res.status(200).json(result);
        });
    });    

    // application =================================================
    app.get('*', function(req, res) {
        res.sendFile(__dirname + './../prokorm_client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}