// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var winston = require('winston');
var _ = require('lodash');
var Feed = require('./models/feed');

// configuration ===============================================================
mongoose.connect(database.localUrl);    // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    winston.error('connection error:', err.message);
});
db.once('open', function callback() {
    winston.info("Connected to DB!");
    addField_branch_for_FEED_GENERAL();
});

function addField_price_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.price === undefined) {
                winston.info('update feed with name: ' + feed.general.name);
                feed.general.price = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    winston.error(err);
                }
            });  
        });
    });
}

function addField_branch_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.branch === undefined) {
                winston.info('update feed with name: ' + feed.general.name);
                feed.general.branch = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    winston.error(err);
                }
            });  
        });
    });
}

function addField_SW_for_FEED_ANALYSIS () {

    winston.info('addField_CODE_for_FEED_ANALYSIS');

    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){

            feed.analysis.forEach(function (analys) {
                if (analys.sw === undefined) {
                    winston.info('update feed with name: ' + feed.general.name);
                    analys.sw = null;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    winston.error(err);
                } else {
               }
            });  
        });
    });
} 


function addField_starchPassesPercent_for_FEED_ANALYSIS () {

    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            feed.analysis.forEach(function (analys) {
                if (analys.starchPassesPercent === undefined) {
                    winston.info('update feed with name: ' + feed.general.name);
                    analys.starchPassesPercent = 0;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    winston.error(err);
                }
            });  
        });
    });
} 

function addField_CODE_for_FEED_ANALYSIS () {

	winston.info('addField_CODE_for_FEED_ANALYSIS');

	Feed.find().then(function(feeds) {
    	
		winston.info(feeds.length + ' was found');

        console.log(feeds);

        feeds.forEach(function (feed){

        	winston.info('feed.general.name');
    		winston.info(feed.general.name);
        		
    		feed.analysis.forEach(function (analys) {
        		winston.info('analys.code');
        		winston.info(analys.code);

        		if (analys.code === undefined) {
        			winston.info('update feed with name: ' + feed.general.name);
        			analys.code = analys.number;
        		}
        	});

        	feed.save(function(err, _feed) {
                if (err) {
                	winston.error(err);
                } else {
                	winston.info(_feed.general.name);
                	winston.info(_feed.analysis[0].code);

                	Feed.findOne({_id: _feed._id}).then(function(f) {
            			winston.info('f');
	                	winston.info(f.analysis[0].code);
                	});
                }
            });  
        });
    });
} 
