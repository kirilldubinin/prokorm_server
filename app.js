// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var database = require('./config/database');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var log = require('./libs/log');
var winston = require('winston');


// configuration ===============================================================
mongoose.connect(database.localUrl);    // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    winston.error('connection error:', err.message);
});
db.once('open', function callback() {
    winston.info("Connected to DB!");

	// listen (start app with node server.js) ======================================
	app.listen(port);
	console.log("App listening on port " + port);

    var Feed = require('./models/feed');
    var sum = require('./feed/feed.sum');
    var Q = require('q');
    var _ = require('lodash');

    var promises = _.map(['5874df36beef28178710c156'], function(feedId) {
        return Feed.findById(feedId);
    });
    Q.all(promises).then(function(feeds) {

        console.log(sum(feeds));

    }, function(err) {
    });

});

app.use(express.static('./prokorm_client'));        // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser());

app.use(session({ secret: 'prokorm_kirill' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// tmp ========================================================================

var schedule = require('node-schedule');
 
var rule = new schedule.RecurrenceRule();
rule.minute = 1;
 
var j = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');
});

var Feed = require('./models/feed');
var balance = require('./feed/feed.balance');

Feed.find().lean().exec(function(err, feeds) {
    if (err) {
        return errorHandler(err, req, res);
    }
    balance(feeds);
});
// routes ======================================================================
require('./route/routes.js')(app);

// tmp =========================================================================
//5874df36beef28178710c156
