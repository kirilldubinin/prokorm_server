var _ = require('lodash');
function lang(key) {
	var langObj = {
        
        removeFeedConfirmDialogTitle: 'Удалить этот корм ?',
        removeFeedConfirmDialogContent: 'Удаленный корм нельзя будет восстановить.',

        analysis: 'Анализы',
        general: 'Основные',

        // general
        composition: 'Состав',
        year: 'Год',
        opened: 'Открыт',
        storage: 'Хранение',
        field: 'Поле',
        done: 'Закончено',
        name: 'Имя',
        date: 'Дата',
        feedType: 'Тип',
        none: 'Нет',
        haylage: 'Сенаж',
        silage: 'Силос',
        grain: 'Зерно',
        totalWeight: 'Всего',
        balanceWeight: 'Осталось',

        // harvest
        harvest: 'Заготовка',
        cutNumber: 'Номер укоса',
        preservative: 'Консервант',
        dosage: 'Дозировка',
        film: 'Пленка',

        // analysis
        dryMaterial: 'Сухое вещество',
        isNaturalWet: 'Натуральная влажность',
        number: 'Номер',
        milkAcid: 'Молочная кислота',
        aceticAcid: 'Уксусная кислота',
        oilAcid: 'Масляная кислота',
        dve: 'Протеин, усваиваемый в кишечнике, DVE',
        oeb: 'Баланс расщепляемого протеина, OEB',
        vos: 'Переваримое органическое вещество, VOS',
        vcos: 'Переварримость органического вещества, VCOS',
        fos: 'Ферментируемое органическое вещество, FOS',
        nel: 'Чистая энергия на лактацию/молоко, NEL',
        nelvc: 'NEL-VC',
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
        crudeFiber: 'Сырая клетчатка',
        ndf: 'Нейтрально-детергентная клетчатка, NDF',
        ndfDigested: 'Усвояемость',
        adf: 'Кислотно-детергентная клетчатка, ADF',
        adl: 'Лигнин, ADL',
        calcium: 'Калиций',
        phosphorus: 'Фосфор',
        carotene: 'Каротин',

        //feeding
        feeding: 'Кормление',
        start: 'Начало',
        end: 'Конец',
        tonnPerDay: 'Тонн в день'
    };

    if (_.isBoolean(key)) {
        return key ? 'Да' : 'Нет';
    }

    return langObj[key] || key;
}

module.exports = lang;