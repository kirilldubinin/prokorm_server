var _ = require('lodash');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler) {
    app.get('/api/tenants', function(req, res) {

        if (req.user && req.user.name === "prokorm" && req.user.tenantName === "prokorm") {

        } else {
            res.status(406).send({
                message: 'You dont have permission for this object.'
            });
        }

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