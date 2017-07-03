'use strict';
var passport = require('passport');
var Strategy = require('passport-strategy');
var util = require('util');
// models ======================================================================
var Tenant = require('../models/tenant');
var User = require('../models/user');

function CustomStrategy(app) {
    
    Strategy.call(this);
    
    // required for passport
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        console.log('passport.deserializeUser');
        done(null, user);
    });
}
util.inherits(CustomStrategy, Strategy);
CustomStrategy.prototype.authenticate = function(req, callback) {
    var tenantname = req.body.tenantname;
    var username = req.body.username;
    var password = req.body.password; //yc5NhI
    // get tenant by name
    Tenant.findOne({
        loginName: tenantname
    }, function(err, _tenant) {
        // if err
        if (err) {
            callback(err, null);
        } else if (_tenant) {
            // get user by name
            User.findOne({
                name: username,
                tenantId: _tenant._id
            }).select('+password').exec(function(err, _user) {
                if (err) {
                    callback(err, null);
                } else if (_user) {
                    if (_user.password === password && _user.tenantId.equals(_tenant._id)) {

                        // IMPORTANT: delete password and salt
                        _user.password = undefined;
                        _user.salt = undefined;
                        callback(null, _user, _tenant);
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            })
        } else {
            callback();
        }
    });
};
// export ======================================================================
module.exports = CustomStrategy;