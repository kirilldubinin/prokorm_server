var Tenant = require('../models/tenant');
var User = require('../models/user');
var Tariff = require('../models/tariff');
var passGenerator = require('generate-password');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://sales%40prokorm.com:4noLimits$@smtp.gmail.com');

function createTenant(data, callback) {
    var newTenant = new Tenant();
    newTenant.loginName = data.loginname;
    newTenant.email = data.email;
    newTenant.createdAt = new Date();
    // get tariff plan
    Tariff.findOne({
        plan: "under_40"
    }).lean().exec(function(err, plan) {
        if (err) {
            return callback(err);
        } else {
            newTenant.license = {
                feed: {
                    endDate: new Date('01/01/2018'),
                    tariffPlan: plan._id
                }
            };
            newTenant.save(function(err, _tenant) {
                if (err) return callback(err);
                else {
                    // create first user in new tenant
                    // user will have admin right and user name will be the same as a tenant name
                    var newUser = new User();
                    newUser.tenantId = _tenant._id;
                    newUser.name = _tenant.loginName;
                    newUser.email = _tenant.email;
                    newUser.permissions = ['admin'];
                    newUser.password = passGenerator.generate({
                        length: 6,
                        numbers: true
                    });
                    newUser.createdAt = new Date();
                    newUser.save(function(err, _user) {
                        if (err) return callback(err);
                        else {
                            sendNewTenantEmail({
                                to: data.email,
                                tenant: data.loginname,
                                password: newUser.password
                            }, function(err, info) {
                                if (err) {
                                    return callback(err);
                                } else {
                                    return callback(null, _user);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function sendNewTenantEmail(emailData, callback) {
    var mailOptions = {
        from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
        to: emailData.to, // list of receivers 
        subject: 'ПРОКОРМ: Регистрация новой организации', // Subject line 
        html: '<b>Поздравляем! Вы зарегестрировали новую организацию в системе "ПРОКОРМ"</b>' + '<br/>' + '<div>Имя вашей организации: "' + emailData.tenant + '"</div>' + '<div>Имя пользователя: "' + emailData.tenant + '"</div>' + '<div>Пароль: "' + emailData.password + '"</div>' + '<br/>' + '<div>Для входа в систему перейдите по ссылке <a href="http://prokorm.com/#/login/' + emailData.tenant + '" target="blank">ПРОКОРМ</a></div>',
    };
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return callback(error);
        }
        callback(null, info.response);
    });
}
module.exports = {
    createTenant: createTenant,
    sendNewTenantEmail: sendNewTenantEmail
}