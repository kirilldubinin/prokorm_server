var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://sales%40prokorm.com:4noLimits$@smtp.gmail.com');
var _ = require('lodash');
var fs = require('fs');
var schedule = require('node-schedule');

//var prokorm = JSON.parse(fs.readFileSync('./sender/prokorm.json', 'utf8'));
var vladimir = JSON.parse(fs.readFileSync('./sender/vladimir.json', 'utf8'));
var zelenina = JSON.parse(fs.readFileSync('./sender/zelenina.json', 'utf8'));
var kirov = JSON.parse(fs.readFileSync('./sender/kirov.json', 'utf8'));
var penza = JSON.parse(fs.readFileSync('./sender/penza.json', 'utf8'));
var orenburg = JSON.parse(fs.readFileSync('./sender/orenburg.json', 'utf8'));
var perm = JSON.parse(fs.readFileSync('./sender/perm.json', 'utf8'));
var mordov = JSON.parse(fs.readFileSync('./sender/mordov.json', 'utf8'));
var prokorm = JSON.parse(fs.readFileSync('./sender/prokorm.json', 'utf8'));
var samara = JSON.parse(fs.readFileSync('./sender/samara.json', 'utf8'));
var tatar = JSON.parse(fs.readFileSync('./sender/tatar.json', 'utf8'));
var kaluga = JSON.parse(fs.readFileSync('./sender/kaluga.json', 'utf8'));
var kaluga_adm = JSON.parse(fs.readFileSync('./sender/kaluga.adm.json', 'utf8'));
var moskva = JSON.parse(fs.readFileSync('./sender/moskva.json', 'utf8'));
var orel = JSON.parse(fs.readFileSync('./sender/orel.json', 'utf8'));
var ryzan = JSON.parse(fs.readFileSync('./sender/ryzan.json', 'utf8'));
var ufo = JSON.parse(fs.readFileSync('./sender/ufo.json', 'utf8'));
var cfo = JSON.parse(fs.readFileSync('./sender/cfo.json', 'utf8'));


/*_.forEach(prokorm, function (o) {

    if (_.some(novikov, function(q) {
        return o === q;
    })) {
        console.log(o);
    }
});*/

var mailOptions = {
    from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
    to: null, // list of receivers 
    subject: 'ПРОКОРМ: Управление кормами #1', // Subject line 
    html: 
        `<meta charset="utf-8">
        <section style="color: #444444; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 20px;">
            <h2 style="color:#3F51B5;margin:0;">
                <a style="color:#3F51B5;text-decoration: none;" href="prokorm.com">ПРОКОРМ</a>
            </h2>
            <lavel style="color: #3F51B5; font-size:14px;">
            все данные о ваших кормах
            </lavel>
            <div style="font-size:12px;">
                <h4 style="color:#3F51B5;">
                ПРОКОРМ - это новая электронная система управления кормами.
                </h4>
                <h4 style="color:#3F51B5;margin:0;">
                Как это работает ?
                </h4>
                <br/>
                Регистрируясь в системе ПРОКОРМ, вы создаете собственную компанию, доступ к которой защищен логином и паролем, далее Вы вводите корма Вашего предприятия в систему, доступ к которым будете иметь только ВЫ.
                <br/>
            </div>
            
            <div style="font-size:12px;">
                <h4 style="color:#3F51B5;">
                Зачем это надо ?
                </h4>

                После того как база кормов создана, Вы можете не только легко найти и посмотреть все показатели кормов за любой год, 
                <br/>
                но и автоматически сгенерировать множество электронных отсчетов, как например:
            </div>
            <p style="font-size:14px;">
                <a href="http://prokorm.com/#/diff" style="color: #3F51B5;" target="_blank">
                    СРАВНЕНИЕ
                </a>
                <br/>
                <span style="color: #666;font-size:12px;">
                    С какой именно культуры вы собрали наибольшее количество Протеина в пересчете на Сухое Вещество.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    С какого именно поля кукурузный силос с наибольшей Обменной Энергией.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Какой именно консервант наилучшим образом сохранил Ваши корма.
                </span>
                <br/>
                <a href="http://prokorm.com/#/diff" style="color: #3F51B5; font-size:12px;" target="_blank">
                    посмотреть пример сравнения
                </a>
            </p>
            <p style="font-size:14px;">
                <a href="http://prokorm.com/#/diff" style="color: #3F51B5;" target="_blank">
                    СРЕДНЕЕ
                </a>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Узнать средние показатели всех сенажей на предприятия за текущий год. Или за прошлый год.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Получить средние показатели кукурузного зерна для разных отделений предприятия.
                </span>
                <br/>
                <a href="http://prokorm.com/#/average" style="color: #3F51B5; font-size:12px;">
                    посмотреть пример среднего значения
                </a>
            </p>
            <p style="font-size:14px;">
                <a href="http://prokorm.com/#/sum" style="color: #3F51B5;" target="_blank">
                    СУММА
                </a>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Сколько всего сенажа, силоса или зерна у вас на балансе.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Какое процентное соотношение из общей массы сенажа составляет козлятник, а сколько - люцерна.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Настроить автовычитание кормов и видеть изменения баланса кормов в реальном времени, что обеспечивает лучшее планирование.
                </span>
                <br/>
                <a href="http://prokorm.com/#/sum" style="color: #3F51B5; font-size:12px;">
                    посмотреть пример суммы кормов
                </a>
            </p>
            <p style="font-size:14px;">
                <a href="http://prokorm.com/#/rating" style="color: #3F51B5;" target="_blank">
                    РЕЙТИНГ
                </a>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Узнать у каких кормов показатели входят в оптимальные границы.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Получить рейтинг травяных сенажей предприятия на основе этих показателей.
                </span>
                <br/>
                <a href="http://prokorm.com/#/rating" style="color: #3F51B5; font-size:12px;">
                    посмотреть пример рейтинга кормов
                </a>
            </p>
            
            <p style="font-size:14px;">
                <a href="http://prokorm.com/#/charts" style="color: #3F51B5;" target="_blank">
                    АНАЛИТИКА
                </a>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Графическое представление изменения показателей кормов по годам.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Узнать улучшились ли Ваши корма за последние 5 лет.
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Какой именно показатель кормов ухудшается с каждым годом.
                </span>
                <br/>
                <a href="http://prokorm.com/#/charts" style="color: #3F51B5; font-size:12px;">
                    посмотреть пример рейтинга кормов
                </a>
            </p>

            <div style="font-size:12px;">
                <h4 style="color:#3F51B5;">
                Хотите увидеть больше примеров ?
                </h4>
                Заходите в нашу ДЕМО компанию - <a target="_blank" href="http://prokorm.com/#/login/demo">demo</a>
                <br/>
                Организация: <b>demo</b>
                <br/>
                Имя пользователя: <b>demo</b>
                <br/>
                Пароль: <b>demo</b>
            </div>

            <div style="font-size:12px;">
                <h4 style="color:#3F51B5;">
                Осталиись вопросы ?
                </h4>
                Звоните - 8 800 550 28 27
            </div>

            <br/>
            <div style="font-size:10px; color: #999">
                Общество с ограниченной ответственностью
                «ПРОКОРМ»
                <br/>
                (ООО«ПРОКОРМ»)
                <br/>
                Юридический адрес: 603123, г. Нижний Новгород,
                <br/>
                ул. Героя Шнитникова, д. 4, кв. (оф.) 3.
                <br/>
                Почтовый адрес: 603116, г. Нижний Новгород,
                ул. Московское шоссе, д. 12, офис 10.
                <br/>
                ИНН 5256122945 КПП 525601001 ОГРН 1135256005994
                <br/>
                р/с 40702810323000478853 Поволжский филиал ЗАО «Райффайзенбанк» в г. Нижнем Новгороде.
                <br/>
                к/с 30101810300000000847
                <br/>
                БИК 042202847
                <br/>
                Тел./факс: 8-800-550-28-27 
                <br/>
                Email: sales@prokorm.com
            </div>

        </section>`
};

var format = '10 * * * * *';

// run each minute
var i = 0;
var emails = _.uniq(cfo);

setInterval(function () {

    console.log(i);
    if (emails[i]) {
        mailOptions.to = emails[i].trim();
        i++;
        
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            } else if (info) {
                console.log(info);
            }
        });        
    } else {
        console.log('DONE');
    }

}, 5000);

/*schedule.scheduleJob(format, function() {
    
    console.log(i);
    if (emails[i]) {
        mailOptions.to = emails[i].trim();
        i++;
        
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            } else if (info) {
                console.log(info);
            }
        });        
    } else {
        console.log('DONE');
    }
});
_.forEach(prokorm, function (email) {
    mailOptions.to = email;
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        } else if (info) {
            console.log(info);
        }
    });
});*/
 
