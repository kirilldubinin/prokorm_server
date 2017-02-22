var _ = require('lodash');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler) {
    
    function isAdmin(req, res, next) {
        
        if (req.user && req.user.name === "prokorm" && req.user.tenantName === "prokorm") {
            next()
        } else {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }
    }

    app.get('/api/tenants', function(req, res) {

        Tenant.find().lean().exec(function(err, tenants) {
            if (err) {
                return errorHandler(err, req, res);
            }

            res.status(200).json(_.map(tenants, function (tenant) {
                return {
                    name: tenant.fullName,
                    login: tenant.loginName,
                    createdAt: tenant.createdAt,
                    email: tenant.email
                }
            }));
        });
    });
}