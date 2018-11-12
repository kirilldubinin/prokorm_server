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

var mailOptionsSilage = {
    from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
    to: null, // list of receivers 
    subject: 'ПРОКОРМ: Коммерческое предложение на биологический консервант Josilac Combi®', // Subject line 
    html: 
        `<meta charset="utf-8">
        <section style="color: #444444; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 20px;">
            <h2 style="margin:0;">
                <a style="text-decoration: none;font-size:26px;color: #555;" href="prokorm.com">ПРОКОРМ </a>
            </h2>
            <label style="font-size: 16px">8-800-550-28-27<br/>8-920-257-63-96</label>
            <br/>
            <table>
                <tr>
                    <td><img style="width: 360px;margin-right: 40px;" src="http://www.josilac.de/bilder/josilac-combi.png"/></td>
                    <td style="
                            padding: 0 10px;
                            margin: 0;
                            vertical-align: top;
                            line-height: 1.5em;
                        ">
                        <p style="font-size:16px;">
                            Предлагаем Вам биологический консервант для силосования <b>Josilac Combi®</b>, производства компании <b>Josera</b> (Германия).
                            <br/>
                            Закваска сухая, в пакетах по <b>150</b> грамм. Один пакет рассчитан на <b>50</b> тонн силосуемой массы.
                            <br/>
                            Рекомендуемый процент сухого вещества в силосуемой массе - <b>25-40%</b>.
                            <br/>
                            Область применения: 
                            <br/>
                            - травяной силос из бобовых и смеси бобово-злаковых культур
                            <br/>
                            - кукурузный силос
                            <br/>
                            - зерносенаж
                            <br/>
                            - плющеное зерно.
                            <br/>
                            <br/>
                            Цена за один пакет <b>6100</b> рублей, включая НДС.
                        </p>
                    </td>
                </tr>
            </table>
            
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

var mailOptionsEpam = {
    from: '<kirill_dubinin@epam.com>', // sender address 
    to: 'kirill_dubinin@epam.com', // list of receivers 
    subject: 'test', // Subject line 
    html: 
        `<!doctype html>
        <section>
            <table border="0" cellpadding="0" cellspacing="0" width="600px" style="font-family:Arial, Helvetica, sans-serif;border: 1px solid #f5f5f5;">
				<tr>
					<td bgcolor="#fff" style="padding: 32px;background-color: #fff;"><img 
			src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAAAaCAYAAABivWp1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2MjAyMzkxNTZDQjRFNTExQjc2OUU2NTM5NDkxNUYxMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQUEwNEFBOUI1MUYxMUU1ODQzMDg5M0Y4MzA4MDE0OCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQUEwNEFBOEI1MUYxMUU1ODQzMDg5M0Y4MzA4MDE0OCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZENDI1NkJBOTVCNEU1MTFCNzY5RTY1Mzk0OTE1RjEyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjYyMDIzOTE1NkNCNEU1MTFCNzY5RTY1Mzk0OTE1RjEyIi8+IDwvcmRmOkRlc2NyaXB0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"></td>
				</tr>
                <tr>
                    <td bgcolor="#f5f5f5" style="padding: 32px;">
                        <div align="left">
                            <table width="100%">
                                <tr>
                                    <td width="100%">
                                    <b>{ALERTNEWRESULTS}</b> new results for the period {ALERTDATE} to {ALERTDATENOW} were found for the alert <b>{ALERTNAME}</b>.
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                    Total number of results: {ALERTTOTALRESULTS}.
                                    </td>
                                </tr>
							</table>
							<br/>
							<table>
                                <tr>
                                    <td width="185">
                                        <table cellspacing="0" cellpadding="0">
											<tr>
												<td bgcolor="#00749c" style="padding: 8px 14px;border: 2px solid #00749c;">
                                                    <a href="{ALERTLINKNEW}" style="text-decoration:none; color: #fff;">
                                                    View New Results
                                                    </a>
													
												</td>
											</tr>
										</table>
                                    </td>
									<td width="170">
                                        <table cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#fff" style="padding: 8px 14px; border: 2px solid #00749c;background-color: #fff;">
                                                    <a href="{ALERTLINKTOTAL}" style="text-decoration:none; color: #000;">
                                                        View All Results
                                                    </a>
                                                </td>
                                            </tr>    
                                        </table>
                                    </td>
                                    <td width="150">
                                        <table cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#fff" style="padding: 8px 14px; border: 2px solid #00749c;background-color: #fff;">
                                                    <a href="{ALERTLINKEDIT}" style="text-decoration:none; color: #000;">
                                                        Edit Alert
                                                    </a>
                                                </td>
                                            </tr>    
                                        </table>
                                    </td>
									
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
				<tr>
					<td style="padding: 32px;">
						<h3>Query Details:</h3>
						{ALERTDETAILS}
					</td>
				</tr>
				<tr>
					<td style="padding: 32px;">
						<a style="color: #00749c;margin-right: 16px; text-decoration: none;" href="https://www.elsevier.com/legal/elsevier-website-terms-and-conditions">Terms and conditions</a>
						<a style="color: #00749c; text-decoration: none;" href="https://www.elsevier.com/legal/privacy-policy">Privacy policy</a>
						<br/>
						<p><span>&copy;</span>2018 RELX Intellectual Properties SA.</p>
					</td>
				</tr>
            </table>
        </section>
        `
}

var format = '10 * * * * *';

// run each minute
var i = 0;
var emails = ['kirill_dubinin@epam.com']; // _.uniq(mordov);

setInterval(function () {
    if (emails[i]) {
        mailOptionsEpam.to = emails[i].trim();
        i++;
        console.log(mailOptionsSilage.to);
        console.log(mailOptionsSilage.subject);
        transporter.sendMail(mailOptionsEpam, function(error, info){
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
 
