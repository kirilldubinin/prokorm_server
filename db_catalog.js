// set up ======================================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var database = require('./config/database');
var _ = require('lodash');
var Catalog = require('./models/catalog');
// configuration ===============================================================
mongoose.connect(database.localUrl); // Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)
var db = mongoose.connection;
db.on('error', function(err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback() {
    winston.info("Connected to DB!");
    add();
});

function add() {

    var keys = ['dryMaterial','ph','milkAcid','aceticAcid','oilAcid','vos','vcos','fos','sw','nel','nelvc', 'exchangeEnergy','dve','oeb', 'nxp','rnb','udp','solubleCrudeProtein','nh3','crudeProtein',
    'crudeAsh','crudeFat','sugar','starch','starchPasses','starchPassesPercent','crudeFiber','ndf','ndfDigested',
    'adf','adl','calcium','phosphorus','carotene','nitrates']

    _.forEach(keys, function (key) {
        var catalog = new Catalog();
        catalog.key = key;
        catalog.ru_short = key;
        catalog.ru_content = key;
        catalog.save(function(err, updated) {
            if (err) console.log(err);
            console.log(updated);
        });
    });
}