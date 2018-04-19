var Tenant = require('../models/tenant');
var User = require('../models/user');
var _ = require('lodash');
var lang = require('../feed/lang');
var modules = require('../config/modules');
var registration = require('../authentication/registration');
var CustomStrategy = require('../authentication/local');

var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var loginNameRegexp = /^[A-Za-z][A-Za-z0-9]*$/;

var passGenerator = require('generate-password');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://sales%40prokorm.com:4noLimits$@smtp.gmail.com');

function sendForgetEmail(emailData, callback) {
    var mailOptions = {
        from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
        to: emailData.to, // list of receivers 
        subject: 'ПРОКОРМ: Восстановление пароля', // Subject line 
        html: 
            '<div>Имя вашей организации: "' + emailData.tenantName + '"</div>' + 
            '<div>Имя пользователя: "' + emailData.userName + '"</div>' + 
            '<div>Пароль: "' + emailData.password + '"</div>'
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return callback(error);
        }
        callback(null, info.response);
    });
}
module.exports = function(app, isAuthenticated, errorHandler) {
    var authStrategy = new CustomStrategy(app);
    app.post('/api/registration', function(req, res) {
        // validate email
        if (!emailRegexp.test(req.body.email)) {
            return res.status(406).send({
                message: 'Вы ввели неверный формат E-Mail адреса.'
            });
        }
        if (!loginNameRegexp.test(req.body.loginname)) {
            return res.status(406).send({
                message: 'Вы ввели неверный формат для имени компании.'
            });
        }
        // check if tenant name is exist
        Tenant.findOne({
            loginName: req.body.loginname
        }).lean().exec(function(err, exist) {
            if (err) {
                return errorHandler(err, req, res);
            }
            if (exist) {
                return res.status(406).send({
                    message: 'Компания c именем "' + req.body.loginname + '"" уже существует. Пожалуйста, укажите другое имя.'
                });
            } else {
                Tenant.findOne({
                    email: req.body.email
                }).lean().exec(function(err, exist) {
                    if (err) {
                        return errorHandler(err, req, res);
                    }
                    if (exist) {
                        return res.status(406).send({
                            message: 'Компания c E-Mail "' + req.body.email + '"" уже существует. Пожалуйста, укажите другой E-Mail.'
                        });
                    } else {
                        registration.createTenant(req.body, function(err, user) {
                            if (err) {
                                return res.status(406).send({
                                    message: err.message || 'Ошибка регистрации'
                                });
                            } else {
                                return res.json({
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
        
        var tenantname = req.body.tenantname;
        var username = req.body.username;
        var password = req.body.password;

        if (!tenantname || !username || !password) {
            return res.status(401).send({
                message: 'Вы указали неверные данные для входа.'
            });
        }

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
    app.post('/api/forget', function(req, res) {
        // check by email
        if (req.body.email) {
            if (!emailRegexp.test(req.body.email)) {
                return res.status(406).send({
                    message: 'Вы ввели неверный формат E-Mail адреса.'
                });
            } else {

                // get user by emeil
                User.findOne({
                    email: req.body.email
                }).then(function (user) {
                    if (user) {

                        // get tenant by tenantId
                        Tenant.findOne({
                            _id: user.tenantId
                        }).lean().exec(function(err, tenant) {
                            if (err) {
                                return errorHandler(err, req, res);
                            }

                            // generate new password and save it for user
                            user.password = passGenerator.generate({
                                length: 6,
                                numbers: true
                            });

                            // save new password for user
                            user.save(function(err, updatedUser) {
                                if (err) {
                                    return errorHandler(err, req, res);
                                }
                                var emailData = {
                                    to: user.email,
                                    userName: user.name,
                                    tenantName: tenant.loginName,
                                    password: user.password
                                };

                                // send email with new password
                                sendForgetEmail(emailData, function () {
                                    res.send({
                                        message: 'На почту ' + user.email + ' отправлено письмо с дальнейшими инструкциями.'
                                    });
                                });
                            });
                        });
                    } else {
                        return res.status(406).send({
                            message: 'Пользователь с таким E-Mail адресом не найден.'
                        });
                    }
                }, function (err) {
                    return errorHandler(err, req, res);
                });
            }
        }
    });
    app.post('/api/logout', isAuthenticated, function(req, res) {
        req.logout();
        res.status(401).send({
            message: 'Authentication failed'
        });
    });
    app.post('/api/users', isAuthenticated, function(req, res) {
        
        // check if this tenant allready has a user with name req.body.name
        User.findOne({
            name: req.body.name,
            tenantId: req.user.tenantId
        }).exec(function(err, _user) {
            if (err) {
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
            } else if (_user) {
                res.status(406).json({
                    message: 'Пользователь с таким именем уже существует в Вашей компании.'
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