var mongoose = require('mongoose');
var logger = require('./log')(module);

mongoose.connect('mongodb://localhost:27017/feed');
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Feed
var Feed = new Schema({
    type: String,
    year: Number
    composition: String,
    totalWeight: Number
});

Feed.path('type').validate(function (v) {
    return v.length;
});
Feed.path('year').validate(function (v) {
    return v.length;
});
var FeedModel = mongoose.model('Feed', Feed);
module.exports.FeedModel = FeedModel;
// Feed END
