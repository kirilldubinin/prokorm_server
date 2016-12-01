// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Q = require('q');
var _ = require('lodash');

var log4js = require('log4js');
var logger = log4js.getLogger();
var diff = require('./feed/feed.diff');
var feedToUI = require('./feed/feed.ui');

// MODELS
var Feed = require('./models/feed');
//

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// configure mongoose
var mongoose = require('mongoose');
//var logger = require('./libs/log')(module);
mongoose.connect('mongodb://localhost:27017/feed');

var db = mongoose.connection;
db.on('error', function (err) {
    //log.error('connection error:', err.message);
});
db.once('open', function callback () {
    //log.info("Connected to DB!");
});

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/feeds')
.post(function(req, res) {

	var feed = new Feed();
    feed.general = req.body.general;
    feed.analysis = req.body.analysis;
    feed.harvest = req.body.harvest;
    //feed.feeding = req.body.feeding;

	feed.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'OK' });
        });   
})
.get(function(req, res) {
    Feed.find().lean().exec(function (err, feeds) {
        if (err)
            res.send(err);

        var shortFeeds = _.map(feeds, function (feed) {
        	return _.merge({}, feed.general, {_id: feed._id});
        });
        
        res.json(shortFeeds);
    });
});

router.route('/feeds/:feed_id')
.get(function(req, res) {
    Feed.findById(req.params.feed_id, function(err, feed) {
        if (err)
            res.send(err);
        res.json(feed);
    });
})
.put(function(req, res) {

    Feed.findById(req.params.feed_id, function(err, feed) {
        if (err)
            res.send(err);

        feed.general = req.body.general;
        feed.analysis = req.body.analysis;
        feed.harvest = req.body.harvest;
        feed.feeding = req.body.feeding;

        // save the bear
        feed.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'OK' });
        });

    });  
})
.delete(function(req, res) {
    Feed.remove({
        _id: req.params.feed_id
    }, function(err, bear) {
        if (err)
            res.send(err);

        res.json({ message: 'OK' });
    });
});

router.route('/feeds/new')
.post(function(req, res) {

	console.log('new');
	res.json({
		general: {
	        name: 'Сенаж',
	        field: '123.32',
	        composition: 'Люцерна',
	        year: 2016,
	        weight: '2200',
	        opened: false,
	        storage: 'Траншея #4',
	        done: false
	    },
	    analysis: [
            {
                number: 1,
                date: new Date(),
                isNaturalWet: false,
                dryMaterial: '33',
                ph: 12,
                milkAcid: '23',
                aceticAcid: '33',
                oilAcid: '23',
                dve: '44',
                oeb: '55',
                vos: '231',
                vcos: '22',
                fos: '11',
                nel: '21.21',
                nelvc: '211',
                exchangeEnergy: '400',
                nxp: '32',
                rnb: '23',
                udp: '311',
                crudeAsh: '565',
                nh3: '454',
                nitrates: '343',
                crudeProtein: '343',
                solubleCrudeProtein: '22',
                crudeFat: '3',
                sugar: '21',
                starch: '32',
                starchPasses: '455',
                crudeFiber: '34',
                ndf: '23',
                adf: '11',
                adl: '43',
                calcium: '54',
                phosphorus: '43',
                carotene: '21'
    	    }
        ],
	    harvest: {
	        cutNumber: 1,
	        preservative: 'Sano',
	        dosage: '150гр/50 тонн',
	        film: '',
	        start: '11-06-2016',
	        end: '23-11-2016'
	    },
	    feeding: {
	        start: '',
	        end: '',
	        tonnPerDay: ''
    	}
    });
});

router.route('/feeds/diff')
.post(function(req, res) {
	var feedIds = req.body.feedIds;
	var promises = _.map(feedIds, function (feedId) {
		return Feed.findById(feedId);
	});

	Q.all(promises).then(function (feeds) {
        res.json(diff(feeds));
	}, function(err) {
		res.send(err);
	});
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);