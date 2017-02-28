var _ = require('lodash');
function lang(key) {
	var langObj = {

        admin: 'Администратор',
        read: 'Чтение',
        write: 'Редактирования',

        edit: 'редактировать',
        delete: 'удалить',
        print: 'печать',

        addFeed: 'Добавить',
        diffFeed: 'Сравнить', 
        averageFeed: 'Средний', 
        sumFeed: 'Сумма',
        chartsFeed: 'Аналитика',
        ratingFeed: 'Рейтинг',

        userName: 'Имя пользователя',
        userFullName: 'Полное имя пользователя',
        tenantName: 'Имя компании',
        tenantFullName: 'Полное имя компании',
        email: 'E-mail',
        permissions: 'Права',
        
        removeFeedConfirmDialogTitle: 'Удалить этот корм ?',
        removeFeedConfirmDialogContent: 'Удаленный корм нельзя будет восстановить.',

        analysis: 'Анализы',
        general: 'Основные',

        // general
        composition: 'Состав',
        year: 'Год',
        opened: 'Открыт',
        price: 'Себестоимость',
        storage: 'Хранение',
        field: 'Поле',
        branch: 'Отделение',
        done: 'Завершён',
        name: 'Имя',
        date: 'Дата',
        feedType: 'Тип',
        none: 'Нет',
        haylage: 'Сенаж',
        silage: 'Силос',
        grain: 'Зерно',
        cornSilage: 'Силосованное зерно',

        straw: 'Солома',
        hay: 'Сено',
        oilcake: 'Жмых',
        meal: 'Шрот',
        greenWeight: 'Зеленая масса',
        tmr: 'ТМР',

        totalWeight: 'Всего',
        balanceWeight: 'Осталось',

        // harvest
        harvest: 'Заготовка',
        cutNumber: 'Номер укоса',
        preservative: 'Консервант',
        dosage: 'Дозировка',
        film: 'Пленка',
        harvestDays: 'Дни заготовки',

        // analysis
        dryMaterial: 'Сухое вещество',
        dryWeight: 'Сухое вещество',
        isNaturalWet: 'Натуральная влажность',
        number: 'Номер исследования',
        code: 'Код исследования',
        ph: 'pH',
        milkAcid: 'Молочная кислота',
        aceticAcid: 'Уксусная кислота',
        oilAcid: 'Масляная кислота',
        dve: 'Протеин, усваиваемый в кишечнике, DVE',
        oeb: 'Баланс расщепляемого протеина, OEB',
        vos: 'Переваримое органическое вещество, VOS',
        vcos: 'Переваримость органического вещества, VCOS',
        fos: 'Ферментируемое органическое вещество, FOS',
        sw: 'Структурная ценность',
        nel: 'Чистая энергия на лактацию, NEL',
        nelvc: 'Фактическая чистая энергия на лактацию, NEL-VC',
        exchangeEnergy: 'Обменная энергия',
        nxp: 'Протеин переваримый в тонком кишечнике, nXP',
        rnb: 'Баланс азота в рубце, RNB',
        udp: 'Нерасщепляемый в рубце протеин, UDP',
        crudeAsh: 'Сырая зола',
        nh3: 'NH3-фракция',
        nitrates: 'Нитраты',
        crudeProtein: 'Сырой протеин',
        solubleCrudeProtein: 'Растворимый сырой протеин',
        crudeFat: 'Сырой жир',
        sugar: 'Сахар',
        starch: 'Крахмал',
        starchPasses: 'Крахмал проходящий',
        starchPassesPercent: 'Крахмал проходящий',
        crudeFiber: 'Сырая клетчатка',
        ndf: 'Нейтрально-детергентная клетчатка, NDF',
        ndfDigested: 'Усвояемость NDF',
        adf: 'Кислотно-детергентная клетчатка, ADF',
        adl: 'Лигнин, ADL',
        calcium: 'Кальций',
        phosphorus: 'Фосфор',
        carotene: 'Каротин',

        //feeding
        feeding: 'Кормление',
        start: 'Начало',
        end: 'Конец',
        tonnPerDay: 'Тонн в день',
        feedingDays: 'Дней кормления'
    };

    if (_.isBoolean(key)) {
        return key ? 'Да' : 'Нет';
    }

    return langObj[key] || key;
}

module.exports = lang;