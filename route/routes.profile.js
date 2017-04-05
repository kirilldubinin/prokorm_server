var Tenant = require('../models/tenant');
var Tariff = require('../models/tariff');
var Q = require('q');
var User = require('../models/user');
var _ = require('lodash');
var lang = require('../feed/lang');
module.exports = function(app, isAuthenticated, errorHandler) {
    
    app.get('/api/profile/view', isAuthenticated, function(req, res) {
        var sessionUserId = req.user._id;
        User.findOne({
            _id: sessionUserId
        }).then(function(user) {
            var isAdmin = user.permissions.indexOf('admin') > -1;
            var userInfo = [{
                label: lang('userName'),
                value: user.name
            }, {
                label: lang('userFullName'),
                value: user.fullName
            }, {
                label: lang('tenantName'),
                value: req.user.tenantName
            }, {
                label: lang('tenantFullName'),
                value: req.user.tenantFullName
            }, {
                label: lang('email'),
                value: user.email
            }, {
                label: lang('permissions'),
                value: _.map(user.permissions, function(p) {
                    return lang(p);
                }).join(',')
            }];
            if (isAdmin) {

                // users in company
                User.find({
                    tenantId: req.user.tenantId
                }).then(function(users) {

                    // license for company
                    Tenant.findById(req.user.tenantId).lean().exec(function(err, tenant) {
                        if (err) {
                            return errorHandler(err, req, res);
                        }
                        // get Tariff plans
                        var promises = [];
                        tenant.license.feed && promises.push(tenant.license.feed.tariffPlan);
                        tenant.license.ration && promises.push(tenant.license.ration.tariffPlan);
                        tenant.license.field && promises.push(tenant.license.field.tariffPlan);

                        promises = _.map(promises, function (p) {
                            return Tariff.findById(p);
                        })
                        Q.all(promises).then(function(plans) {
                            
                            if (tenant.license.feed) {
                                tenant.license.feed.tariffPlan = plans[0].plan;
                            }
                            if (tenant.license.ration) {
                                tenant.license.ration.tariffPlan = plans[1].plan;
                            }
                            if (tenant.license.field) {
                                tenant.license.field.tariffPlan = plans[2].plan;
                            }

                            var licenseInfo = _.map(tenant.license, function (value, key) {
                                return {
                                    title: lang(key),
                                    subInfo: [
                                        {
                                            label: lang('licenseEnd'),
                                            value: value.endDate
                                        },
                                        {
                                            label: lang('tariffPlan'),
                                            value: lang(value.tariffPlan)
                                        }
                                    ]
                                }
                            });

                            return res.json({
                                userInfo: userInfo,
                                companyUsers: _.map(users, function(u) {
                                    return {
                                        _id: u._id,
                                        userName: u.name
                                    };
                                }),
                                companyLicense: licenseInfo,
                                admin: isAdmin
                            });

                        }, function(err) {
                            return errorHandler(err, req, res);
                        });
                    });
                });
            } else {
                return res.json({
                    userInfo: userInfo
                });
            }
        });
    });
    app.get('/api/profile/edit', isAuthenticated, function(req, res) {
        var sessionUserId = req.user._id;
        User.findOne({
            _id: sessionUserId
        }).then(function(user) {
            var isAdmin = user.permissions.indexOf('admin') > -1;
            res.json({
                controls: [{
                    label: lang('userName'),
                    value: user.name,
                    disabled: true
                }, {
                    label: lang('userFullName'),
                    value: user.fullName
                }, {
                    label: lang('tenantName'),
                    value: req.user.tenantName,
                    disabled: true
                }, {
                    label: lang('tenantFullName'),
                    value: req.user.tenantFullName,
                    disabled: !isAdmin
                }, {
                    label: lang('email'),
                    value: user.email
                }, {
                    label: lang('permissions'),
                    value: user.permissions
                }],
                profile: {
                    userName: user.name,
                    userFullName: user.fullName || '',
                    tenantName: req.user.tenantName,
                    tenantFullName: req.user.tenantFullName || '',
                    email: user.email,
                    permissions: user.permissions
                }
            });
        });
    });
    app.put('/api/profile', isAuthenticated, function(req, res) {
        User.findById(req.user._id, function(err, user) {
            if (err) {
                return errorHandler(err, req, res);
            }
            user.name = req.body.userName;
            user.fullName = req.body.userFullName;
            user.email = req.body.email;
            // if admin, update tenant
            var isAdmin = user.permissions.indexOf('admin') > -1;
            if (isAdmin) {
                Tenant.findById(user.tenantId, function(err, tenant) {
                    if (err) {
                        return errorHandler(err, req, res);
                    }
                    tenant.fullName = req.body.tenantFullName;
                    req.user.tenantFullName = req.body.tenantFullName;
                    tenant.save(function(err, updatedTenant) {
                        if (err) {
                            return errorHandler(err, req, res);
                        }
                        user.save(function(err, updatedUser) {
                            if (err) {
                                return errorHandler(err, req, res);
                            }
                            res.json({
                                message: 'OK',
                                id: updatedUser._id
                            });
                        });
                    });
                });
            } else {
                user.save(function(err, updatedUser) {
                    if (err) {
                        return errorHandler(err, req, res);
                    }
                    res.json({
                        message: 'OK',
                        id: updatedUser._id
                    });
                });
            }
        });
    });
    app.post('/api/profile/password', isAuthenticated, function(req, res) {
        // check new password
        if (!req.body.newPassword || req.body.newPassword !== req.body.newPassword2) {
            return res.json({
                message: 'Повторите ввод нового пароля.'
            });
        }

        req.body.newPassword = req.body.newPassword.trim();
        var passRegExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

        if (!passRegExp.test(req.body.newPassword)) {
            return res.json({
                message: 'Новый пароль недостаточно защищен'
            });    
        }

        User.findById(req.user._id).select('+password').exec(function(err, user) {
        
            if (err) {
                return errorHandler(err, req, res);
            }
            if (user.password !== req.body.currentPassword) {
                return res.json({
                    message: 'Текущий пароль неверен.'
                });
            }
            if (user)
            user.password = req.body.newPassword;
            user.save(function(err, updatedUser) {
                if (err) {
                    return errorHandler(err, req, res);
                }
                res.json({
                    message: 'OK',
                    id: updatedUser._id
                });
            });
        });
    });
}