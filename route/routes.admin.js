var _ = require('lodash');
var Tenant = require('../models/tenant');
var User = require('../models/user');
var Feed = require('../models/feed');
var lang = require('../feed/lang');

module.exports = function(app, isAuthenticated, errorHandler) {
    
    function isAdmin(req, res, next) {
        
        if (req.user && req.user.name === "prokorm" && req.user.tenantName === "prokorm") {
            next();
        } else {
            return res.status(401).send({
                message: 'Authentication failed'
            });
        }
    }

    app.get('/api/tenants', isAdmin, function(req, res) {

        Tenant.find().lean().exec(function(err, tenants) {
            if (err) {
                return errorHandler(err, req, res);
            }

            res.status(200).json(_.map(tenants, function (tenant) {
                return {
                    _id: tenant._id,
                    name: tenant.fullName,
                    login: tenant.loginName,
                    createdAt: tenant.createdAt,
                    email: tenant.email,
                    createdAt: tenant.createdAt
                }
            }));
        });
    });

    app.get('/api/tenants/:tenant_id', isAdmin, function(req, res) {
        if (req.params.tenant_id) {
            Tenant.findById(req.params.tenant_id).lean().exec(function(err, tenant) {
                if (err) {
                    return errorHandler(err, req, res);
                }
                Feed.find({
                    'createdBy.tenantId': req.params.tenant_id
                }).lean().exec(function(err, feeds) {

                    User.find({'tenantId': req.params.tenant_id}).lean().exec(function(err, users) {
                        var tenantResult = {
                            name: tenant.fullName,
                            login: tenant.loginName,
                            createdAt: tenant.createdAt,
                            email: tenant.email,
                            createdAt: tenant.createdAt,
                            feeds: _.groupBy(feeds, 'general.year'),
                            users: _.map(users, function (user) {
                                return {
                                    name: user.name,
                                    permissions: user.permissions
                                }
                            })
                        };
                        res.status(200).json(tenantResult);
                    });
                });
            });
        } else {
            res.status(406).json({
                message: 'Tenant id is not found'
            });
        }
    });
}