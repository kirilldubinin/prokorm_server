// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var database = require('./config/database');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var helmet = require('helmet');
var morgan = require('morgan');

// logging =====================================================================
// create a custom timestamp format for log statements
const opts = {
	logFilePath:'logs.log',
	timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
	//logDirectory:'/logs',
    //fileNamePattern:'roll-<DATE>.log',
    //dateFormat:'YYYY.MM.DD'
};
const SimpleNodeLogger = require('simple-node-logger'),
	log = SimpleNodeLogger.createSimpleLogger(opts);

// configuration ===============================================================
mongoose.connect(database.localUrl, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', function(err) {
    log.info('connection error:', err.message);
});
db.once('open', function callback() {
    console.log("Connected to DB!");
	// listen (start app with node server.js) ======================================
	app.listen(port);
	log.info("App listening on port " + port);
	console.log("App listening on port " + port);
});

app.use(express.static('./prokorm_client'));        // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(cookieParser());

app.use(session({ 
	saveUninitialized: true, // saved new sessions
	resave: false, // do not automatically write to the session store
	//store: sessionStore,
	cookie : { 
		httpOnly: true, 
		maxAge: 1000 * 60 * 60 
	},
	secret: '4342-dede-5601-xapw-0912-moez', 
}));
//app.use(session({ secret: 'prokorm_kirill' })); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(helmet());



// routes ======================================================================
require('./route/routes.js')(app, log);

// run scheduler ===============================================================
// each day
var feedScheduler = require('./feed/feed.schedule.js')(log);


