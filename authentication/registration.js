var Tenant = require('../models/tenant');
var User = require('../models/user');
var passGenerator = require('generate-password');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://sales%40prokorm.com:4noLimits$@smtp.gmail.com');

function createTenant(data, callback) {
    var newTenant = new Tenant();
    newTenant.loginName = data.loginname;
    newTenant.email = data.email;
    newTenant.createdAt = new Date();
    newTenant.save(function(err, _tenant) {
        if (err) return callback(err);
        else {
            // create first user in new tenant
            // user will have admin right and user name will be the same as a tenant name
            var newUser = new User();
            newUser.tenantId = _tenant._id;
            newUser.name = _tenant.loginName;
            newUser.email = _tenant.email;
            newUser.permissions = ['Admin'];
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
                    }, function (err, info) {

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

function sendNewTenantEmail(emailData, callback) {

	var mailOptions = {
	    from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
	    to: emailData.to, // list of receivers 
	    subject: 'ПРОКОРМ: Регистрация новой организации', // Subject line 
	    html: '<b>Поздравляем! Вы зарегестрировали новую организацию в системе "ПРОКОРМ"</b>' + 
                '<br/>' +
                '<div>Имя вашей организации: "' + emailData.tenant + '"</div>' +
                '<div>Имя пользователя: "' + emailData.tenant + '"</div>' +
                '<div>Пароль: "' + emailData.password + '"</div>' +
                '<br/>' +
                '<div>Для входа в систему перейдите по ссылке <a href="http://ec2-54-186-205-111.us-west-2.compute.amazonaws.com/#/farm/login" target="blank">ПРОКОРМ</a></div>', // plaintext body 
	};
	 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return callback(error);
	    }
	    callback(null, info.response);
	});
}


module.exports = {
    createTenant: createTenant,
    sendNewTenantEmail: sendNewTenantEmail
}