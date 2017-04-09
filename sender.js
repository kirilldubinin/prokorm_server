var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://sales%40prokorm.com:4noLimits$@smtp.gmail.com');

var emailsNovikov = [
    'redin.molkoop@gmail.com',
    'rzay2008@rambler.ru',
    'klueva.tanya@mail.ru',
    'yukatex@yandex.ru',
    'info@allgroup.su',
    'ilkino.spk@mail.ru',
    'ilkino-vladimir@mail.ru',
    'intelclean@yandex.ru',
    'ooo.gmk@mail.ru',
    'ozhiganova@moloko.vologda.ru',
    'oao_emelanovka@mail.ru',
    'poluhin.roman@mail.ru',
    'pzbarybino@yandex.ru',
    'plemzavod@yandex.ru',
    'alexiwa@mail.ru',
    'atkblg@mail.ru',
    's.kluchnikov@agrivolga.ru',
    'sasha2006_@mail.ru',
    'denlezin@gmail.com',
    'fabdec.ru@gmail.com',
    'kmomin@mail.ru',
    'kripets@extraservice.by',
    'lorin@yku.ru',
    'zaoneva@yandex.ru',
    'vochrinka@mail.ru',
    'mikhail.kurashov@yandex.ru',
    'misagro@yandex.ru',
    'anna.astafyevaa@gmail.com',
    'A.Kashkin@agrohold.ru',
    'andrey.gaponov.2014@mail.ru',
    'atk-amur@mail.ru',
    'af-85@list.ru',
    'koshman@limens.by',
    'algar2000@mail.ru',
    'agrogrupa@yandex.ru',
    'apahmutov@rambler.ru',
    'a.kazachkov.m@gmail.com',
    'Anastasia.Shabanova@brenntag.com.ru',
    'agrokemcfo@gmail.com',
    'anna.krylova@pepsico.com',
    'andresmail@rambler.ru',
    'angela2006@inbox.ru',
    'akazakov.ecolab@mail.ru',
    'bobyleva.m@aetp.ru',
    'bomber2106@mail.ru',
    'chika-72@yandex.ru',
    'diter@ivc.nnov.ru',
    'dimo.murgov@ybp.kz',
    'doctor@kukareks.ru',
    'evgen.q7@yandex.ru',
    'evgeniy.khachay@gefco.ru',
    'evgenii_shevcov@mail.ru',
    'Ekaterina.ELISTRATOVA@gefco.ru',
    'elena_tokareva@coface.ru',
    'Fomichov@moloko.vologda.ru',
    'filxxx@mail.ru',
    'filipp.s@extraservice.by',
    'radex.grzegorz@wp.pl',
    'gogi_mob@mail.ru',
    'geryfox@mail.ru',
    'gazetasport@mail.ru',
    'G.Brazhenko@medlex.ru',
    'galkina_nadezhda@mail.ru',
    'hotimchenko@ion.ru',
    'juravlev@mvcvvc.com',
    'kladov_sekr@prioskolie.ru',
    'ke@alcert.ru',
    'vklim2008@yandex.ru',
    'ksuvet@mail.ru',
    'mahmuud@rambler.ru',
    'Kuznetsova@moloko.vologda.ru',
    'kapustinf1@rambler.ru',
    'kolesov@sezs.ru',
    'krugletsov@mail.ru',
    'lega-dz@yandex.ru',
    'Lyudmila.SAVENOK@gefco.ru',
    'Maria.Giatsintova@zenteum.ru',
    'mikhail.kurashov@yandex.ru',
    'molokobel@gmail.com',
    'mylnikov@br.chickenkingdom.ru',
    'mironov@mamamila.ru',
    'mos-bulls@mail.ru',
    '88353821720@mail.ru',
    'N.Misyra@agrohold.ru',
    'n.robik@medlex.ru',
    'natalja.kueffner@krones.com',
    'shtukin@limens.by',
    'N.Ohvays@medlex.ru',
    'n-malceva@mail.ru',
    'olesya@radex.com.pl',
    'O.vanDael@vivochem.nl',
    'o.v.dael@vivochem.nl',
    'oskolmilk@gmail.com',
    'Olga.Beleneva@brenntag.com.ru',
    'o.vetchanina@suzdalbeer.ru',
    'P.Kruglov@agrohold.ru',
    'pavel.uomz@mail.ru',
    'pdp@novadan.dk',
    'patent-07@mail.ru',
    'zig_andrei@bk.ru',
    'zgorodok@mail.ru',
    'x-dimos@yandex.ru',
    'verhub@yandex.ru',
    'vet@prioskolie.ru',
    'vvgorelik@gmail.com',
    'Vivian.Brunner@clariant.com',
    'vdyadkov@aqua-italy.ru',
    'verdikt@r52.ru',
    'teh2@molvest.ru',
    'Vnivip-Dmitrieva@yandex.ru',
    'vetintorg.bel@mail.ru',
    'slums@mail.ru',
    'said-ka@mail.ru',
    'srs@stg-rus.ru',
    'sibircenter@mail.ru',
    'stanki.ru@mail.ru',
    'titoikin@sezs.ru',
    'yag-alena@yandex.ru',
    'yvol55@mail.ru',
    'y.vlassova@ybp.kz',
    'yusel1@yandex.ru',
    'uralbiovet@uralbiovet.ru'
];

var emailsPiter = [
    'info@detskoselsky.ru', 
    'trudeconomist@mail.ru',
    'rabititsy@inbox.ru', 
    'sea5555@mail.ru',
    'Oao-novolad@yandex.ru',
    'info@prinevskoe.ru',
    'Mf-bugry@yandex.ru',
    'info@roskar-spb.ru', 
    'spk-poljani@yandex.ru',
    'info@shp-losevo.ru', 
    'pzplamya@gmail.com',
    'secretary@pz-lesnoe.ru', 
    'premiumagro@mail.ru',
    'agrobalt@yandex.ru',
    'zakaz@pfsin.ru', 
    'predport@list.ru',
    'info@lkkz.ru', 
    'grajdansky@yandex.ru',
    'bratbor@mail.ru',
    'td-agrotechnika@mail.ru', 
    'info@idavang.ru',
    'info@agro78.ru' 
];

var mailOptions = {
    from: '"ПРОКОРМ" <sales@prokorm.com>', // sender address 
    to: "dubininkg@gmail.com", // list of receivers 
    subject: 'ПРОКОРМ: Управление кормами', // Subject line 
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
                ПРОКОРМ - это новая электоронная система управления кормами.
                </h4>
                <h4 style="color:#3F51B5;margin:0;">
                Как это работает ?
                </h4>
                <br/>
                Регистрируясь в системе ПРОКОРМ, вы создаете собственную компанию, доступ к которой защищен логином и паролем, 
                далее Вы вводите корма Вашего предприятия в систему, доступ к которым будете иметь только ВЫ.
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
                    Получить средние показатели кукурузного зерна для разных отделений предприятия
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Какое процентное соотношение из общей массы сенажа составляет козлятник, а сколько люцерна.
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
                    Графическое представление изменения показателей кормов по годам
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Узнать стали лучше ли Ваши корма за последние 5 лет
                </span>
                <br/>
                <span style="color: #666;font-size:12px;">
                    Какой именно показатель кормов ухудшается с каждым годом
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
        </section>`
};
 
// send mail with defined transport object 
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }
});