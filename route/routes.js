// set up ======================================================================
var _ = require('lodash');
var winston = require('winston');

// routes =====================================================================
module.exports = function(app) {

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

    // root
    app.get('/api/', function(req, res) {
        res.json({
            message: 'PROKORM API'
        });
    });

    // init other routes
    var routes = ['login', 'profile', 'feed', 'catalog'];
    _.forEach(routes, function (route) {
        require('./routes.' + route)(app, isAuthenticated, errorHandler); 
    });

    // web application =================================================
    app.get('*', function(req, res) {

        console.log('./../prokorm_client/index.debug.html');
        //res.sendFile(__dirname + './../prokorm_client/index.debug.html');
    });
}