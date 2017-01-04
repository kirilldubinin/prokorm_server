// set up ======================================================================
var Q = require('q');
var _ = require('lodash');
// models ======================================================================
var Feed = require('../models/feed');
var Tenant = require('../models/tenant');
var User = require('../models/user');
// helpers =====================================================================
var diff = require('../feed/feed.diff');
var view = require('../feed/feed.view');
var edit = require('../feed/feed.edit');
var registration = require('../authentication/registration');
var CustomStrategy = require('../authentication/local');

// routes =====================================================================
module.exports = function(app) {

    var authStrategy = new CustomStrategy(app);

    function isAuthenticated(req, res, next) {

        // do any checks you want to in here
        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if (req.user) {
            return next();
        } else {
            // IF A USER ISN'T LOGGED IN
            res.status(401).send({message: 'Authentication failed'});
            //res.redirect('/');    
        }
    }
	
    app.get('/api/', function(req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });

    // registration =====================================
    app.post('/api/registration', function(req, res) {

        registration.createTenant(req.body, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    message: 'На Ваш электронный адрес отправлено письмо.'
                });
            }
        });

        /*var newTenant = new Tenant();
        newTenant.loginName = req.body.loginname;
        newTenant.email = req.body.email;
        newTenant.createdAt = new Date();
        newTenant.save(function(err, _tenant) {
            if (err) res.send(err);
            else {
                // create first user in new tenant
                // user will have admin right and user name will be the same as a tenant name
                var newUser = new User();
                newUser.tenantId = _tenant._id;
                newUser.name = _tenant.loginName;
                newUser.email = _tenant.email;
                newUser.password = passGenerator.generate({
                    length: 6,
                    numbers: true
                });
                newUser.createdAt = new Date();
                newUser.save(function(err, _user) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json({
                            message: 'На электронный адрес отправлен логин и пароль для входу в систему "ПРОКОРМ"'
                        });
                    }
                });
            }
        });*/
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
                    tenantFullName: tenant.fullName || tenant.loginName
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
                return res.status(401).send({message: 'Invalid email or password.'});
            }
        });
    });

    app.post('/api/logout', isAuthenticated, function(req, res) {
        
        req.logout();
        res.status(401).send({message: 'Authentication failed'});
    });    

    // session data =====================================
    app.get('/api/sessionData',isAuthenticated, function(req, res) {
        
        var sessionUser = req.user;
        res.json({
            user: sessionUser
        });
    });

    // feed =============================================
    // new feed
    app.post('/api/feeds', isAuthenticated, function(req, res) {
        var feed = new Feed();
        feed.general = req.body.general;
        feed.analysis = req.body.analysis;
        feed.harvest = req.body.harvest;
        feed.feeding = req.body.feeding;
        feed.save(function(err, newFeed) {
            if (err) res.send(err);
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
        Feed.find().lean().exec(function(err, feeds) {
            if (err) res.send(err);
            var shortFeeds = _.map(feeds, function(feed) {
                return _.merge({}, feed.general, {
                    _id: feed._id
                });
            });
            res.json(shortFeeds);
        });
    });
    // get feed by id for view mode
    app.get('/api/feeds/:feed_id/view', function(req, res) {
        Feed.findById(req.params.feed_id).lean().exec(function(err, feed) {
            if (err) res.send(err);
            res.json(view(feed));
        });
    });
    // get feed by id for edit mode
    app.get('/api/feeds/:feed_id/edit', function(req, res) {
        Feed.findById(req.params.feed_id).lean().exec(function(err, feed) {
            if (err) res.send(err);
            res.json(edit(feed));
        });
    });
    // update feed by id
    app.put('/api/feeds/:feed_id', function(req, res) {
        Feed.findById(req.params.feed_id, function(err, feed) {
            if (err) res.send(err);
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
        });
    });
    // delete feed by id
    app.delete('/api/feeds/:feed_id', function(req, res) {
        Feed.remove({
            _id: req.params.feed_id
        }, function(err, bear) {
            if (err) res.send(err);
            res.json({
                message: 'OK',
                id: req.params.feed_id
            });
        });
    });
    // get feed skeleton
    app.post('/api/feeds/new', function(req, res) {
        res.json(edit());
    });
    // get feeds diff
    app.post('/api/feeds/diff', function(req, res) {
        var feedIds = req.body.feedIds;
        var promises = _.map(feedIds, function(feedId) {
            return Feed.findById(feedId);
        });
        Q.all(promises).then(function(feeds) {
            res.json(diff(feeds));
        }, function(err) {
            res.send(err);
        });
    });

    // application =================================================
    app.get('*', function (req, res) {
        res.sendFile(__dirname + './../prokorm_client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}