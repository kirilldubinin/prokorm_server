var Tenant = require('../models/tenant');
var User = require('../models/user');
var _ = require('lodash');
var lang = require('../feed/lang');
var modules = require('../config/modules');
var registration = require('../authentication/registration');
var CustomStrategy = require('../authentication/local');


module.exports = function(app, isAuthenticated, errorHandler) {

	var authStrategy = new CustomStrategy(app);
    app.post('/api/registration', function(req, res) {
        // check if tenant name is exist
        Tenant.findOne({
            loginName: req.body.loginname
        }).lean().exec(function(err, exist) {
            console.log(exist);
            if (exist) {
                res.status(406).send({
                    message: 'Компания c именем "' + req.body.loginname + '"" уже существует. Пожалуйста, укажите другое имя.'
                });
            } else {
                User.findOne({
                    email: req.body.email
                }).lean().exec(function(err, exist) {
                    console.log(exist);
                    if (exist) {
                        res.status(406).send({
                            message: 'Компания c E-Mail "' + req.body.email + '"" уже существует. Пожалуйста, укажите другой E-Mail.'
                        });
                    } else {
                        registration.createTenant(req.body, function(err, user) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.json({
                                    message: 'На электронный адрес ' + req.body.email + ' отправлено письмо с дальнейшими инструкциями.'
                                });
                            }
                        });
                    }
                });
            }
        });
    });
    app.post('/api/signin', function(req, res) {
        //console.log(req.body);
        // yc5NhI
        // add validation before calling the authenicate() method
        authStrategy.authenticate(req, function(err, user, tenant) {
            if (!err && user && tenant && user.tenantId.equals(tenant._id)) {
                // set tenant data for user object
                var sessionUser = {
                    name: user.name,
                    _id: user._id,
                    tenantId: tenant._id,
                    tenantName: tenant.loginName,
                    tenantFullName: tenant.fullName || tenant.loginName,
                    modules: modules,
                    permissions: user.permissions
                };
                req.logIn(sessionUser, function(err) {
                    if (err) {
                        res.json(err);
                    } else {
                        // you can send a json response instead of redirecting the user
                        res.json({
                            username: user.name,
                            tenantFullName: tenant.fullName || tenant.loginName,
                            tenantName: tenant.loginName
                        });
                    }
                });
            } else {
                return res.status(401).send({
                    message: 'Вы указали неверные данные для входа.'
                });
            }
        });
    });
    app.post('/api/logout', isAuthenticated, function(req, res) {
        req.logout();
        res.status(401).send({
            message: 'Authentication failed'
        });
    });
    app.post('/api/users', isAuthenticated, function(req, res) {
        var user = new User();
        user.tenantId = req.user.tenantId;
        user.createdAt = new Date();
        user.name = req.body.name;
        user.fullName = req.body.fullName;
        user.email = req.body.email;
        user.password = req.body.password;
        user.permissions = req.body.permissions;
        user.save(function(err, newUser) {
            if (err) {
                return errorHandler(err, req, res);
            } else {
                res.json({
                    message: 'OK',
                    id: newUser._id
                });
            }
        });
    });
    app.get('/api/sessionData', isAuthenticated, function(req, res) {
        var sessionUser = req.user;
        res.json({
            user: sessionUser
        });
    });
}