// set up ======================================================================
var _ = require('lodash');

// routes =====================================================================
module.exports = function(app, log) {

    function errorHandler(err, req, res) {
        log.info('ROUTE: ' + err.name + ':', err.message);
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
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }
    }

    // root
    app.get('/api/', function(req, res) {
        res.json({
            message: 'PROKORM API'
        });
    });

    // init other routes
    var routes = ['login', 'profile', 'feed', 'ration', 'catalog', 'admin', 'demo'];
    _.forEach(routes, function (route) {
        require('./routes.' + route)(app, isAuthenticated, errorHandler, log); 
    });
}