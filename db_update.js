// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var _ = require('lodash');
var Feed = require('./models/feed');
var Tenant = require('./models/tenant');
var Tariff = require('./models/tariff');

// configuration ===============================================================
mongoose.connect(database.localUrl);    // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback() {
    console.log("Connected to DB!");
    addField_autoDecrement_for_FEED_feeding();
});

function add_Tariff_Plans (ready) {
    var tariff = new Tariff();
    tariff.module = 'feed';
    tariff.plan = 'under_40';

    tariff.save(function (err, newTariff) {
        if (err) {
            console.log(err);
        } else {
            console.log(newTariff);
        }   
    });
}

function addField_autoDecrement_for_FEED_feeding () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.feeding.autoDecrement === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.feeding.autoDecrement = false;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_license_for_TENANT () {

    Tenant.find().then(function(tenants) {
        tenants.forEach(function (tenant){

            if (tenant.license.feed.endDate === undefined) {
                console.log('update feed with name: ' + tenant.loginName);
                tenant.license.feed = {
                    endDate: new Date('01/01/2018'),
                    tariffPlan: '58d18c84542a803bd64feccc'    
                }

                tenant.save(function(err, _tenant) {
                    if (err) {
                        console.log(err);
                    }
                });  
            }
        });
    });
}

function addField_storageType_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.storageType === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.storageType = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_price_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.price === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.price = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_branch_for_FEED_GENERAL () {
    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){
            
            if (feed.general.branch === undefined) {
                console.log('update feed with name: ' + feed.general.name);
                feed.general.branch = null;
            }

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
}

function addField_SW_for_FEED_ANALYSIS () {

    console.log('addField_CODE_for_FEED_ANALYSIS');

    Feed.find().then(function(feeds) {
        feeds.forEach(function (feed){

            feed.analysis.forEach(function (analys) {
                if (analys.sw === undefined) {
                    console.log('update feed with name: ' + feed.general.name);
                    analys.sw = null;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
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
                    console.log('update feed with name: ' + feed.general.name);
                    analys.starchPassesPercent = 0;
                }
            });

            feed.save(function(err, _feed) {
                if (err) {
                    console.log(err);
                }
            });  
        });
    });
} 

function addField_CODE_for_FEED_ANALYSIS () {

	console.log('addField_CODE_for_FEED_ANALYSIS');

	Feed.find().then(function(feeds) {
    	
		console.log(feeds.length + ' was found');

        console.log(feeds);

        feeds.forEach(function (feed){

    		feed.analysis.forEach(function (analys) {
        		if (analys.code === undefined) {

        			console.log('update feed with name: ' + feed.general.name);
        			analys.code = analys.number;
        		}
        	});

        	feed.save(function(err, _feed) {
                if (err) {
                	console.log(err);
                } else {
                	console.log(_feed.general.name);
                	console.log(_feed.analysis[0].code);

                	Feed.findOne({_id: _feed._id}).then(function(f) {
                	});
                }
            });  
        });
    });
} 
