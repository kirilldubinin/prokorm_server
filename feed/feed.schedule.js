var Feed = require('../models/feed');
var schedule = require('node-schedule');
var _ = require('lodash');

/*
Format for node-schedule
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/
function decrement(feeds, log) {

    _.forEach(feeds, function (feed) {
        // double check
        if (feed.general.done !== true && 
            feed.general.opened === true &&
            feed.feeding.autoDecrement === true &&
            feed.feeding.tonnPerDay > 0 &&
            feed.general.balanceWeight > 0) {

            feed.general.balanceWeight = feed.general.balanceWeight - feed.feeding.tonnPerDay;
            if (feed.general.balanceWeight < 0 || feed.general.balanceWeight === 0) {
                feed.general.balanceWeight = 0;
                feed.general.done = true;
            }
            feed.save(function(err, newFeed) {
                if (err) {
                    log.info(err);
                } else {
                    log.info('FEED scheduler: was set balanceWeight to' + newFeed.general.balanceWeight);
                }
            });
        }
    });
}

function run(log) {
    
    var format = '59 23 * * *';

    // run each hours
    schedule.scheduleJob(format, function() {
        
        log.info('START FEED scheduler');

        Feed.find({
            'general.done': false,
            'general.opened': true,
            'feeding.autoDecrement': true
        }).then(function(feeds) {
            decrement(feeds, log);
        }, function (err){
            log.info(err);
        });
    });
}
module.exports = run;