var _ = require('lodash');

function lang(key) {
	var langObj = {
        analysis: 'Анализы',
        general: 'Основные',
        composition: 'Состав',
        year: 'Год',
        totalWeight: 'Вес',
        opened: 'Открыт',
        storage: 'Хранение',
        field: 'Поле',
        done: 'Закончено',
        name: 'Имя',
        dryMaterial: 'Сухое вещество',
        removeFeedConfirmDialogTitle: 'Удалить этот корм ?',
        removeFeedConfirmDialogContent: 'Удаленный корм нельзя будет восстановить.',

        // general
        date: 'Дата',

        // harvest
        harvest: 'Заготовка',
        cutNumber: 'Номер укоса',
        preservative: 'Консервант',
        dosage: 'Дозировка',
        film: 'Пленка',

        // analysis
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
        adf: 'Кислотно-детергентная клетчатка, ADF',
        adl: 'Лигнин, ADL',
        calcium: 'Калиций',
        phosphorus: 'Фосфор',
        carotene: 'Каротин',

        //feeding
        feeding: 'Кормление'
    };
    return langObj[key] || key;
}

function dimension(key) {
	var dimensionObj = {
        dryMaterial: '%',

        // analysis
        milkAcid: 'г',
        aceticAcid: 'г',
        oilAcid: 'г',
        dve: 'г',
        oeb: 'г',
        vos: 'г',
        vcos: '%',
        fos: 'г',
        nel: 'МДж',
        nelvc: 'МДж',
        exchangeEnergy: 'МДж',
        nxp: 'г',
        rnb: 'г',
        udp: 'г',
        crudeAsh: 'г',
        nh3: '%',
        nitrates: 'г',
        crudeProtein: 'г',
        solubleCrudeProtein: '%',
        crudeFat: 'г',
        sugar: 'г',
        starch: 'г',
        starchPasses: 'г',
        crudeFiber: 'г',
        ndf: 'г',
        adf: 'г',
        adl: 'г',
        calcium: 'г',
        phosphorus: 'г',
        carotene: 'г'
    };

    return dimensionObj[key] || '';
}

function convertToControl(item) {
    var viewObj = {};
    _.each(item, function(value, key) {
        viewObj[key] = {
            label: lang(key),
            value: value,
            dimension: dimension(key),
            key: key
        }
    });
    return viewObj;
};

var propertyForRecalculate = [
  'milkAcid',
  'aceticAcid',
  'oilAcid',
  'dve',
  'oeb',
  'vos',
  'vcos',
  'fos',
  'nel',
  'nelvc',
  'exchangeEnergy',
  'nxp',
  'rnb',
  'udp',
  'crudeAsh',
  'nh3',
  'nitrates',
  'crudeProtein',
  'solubleCrudeProtein',
  'crudeFat',
  'sugar',
  'starch',
  'starchPasses',
  'crudeFiber',
  'ndf',
  'adf',
  'adl',
  'calcium',
  'phosphorus',
  'carotene',
];

function convert(feed) {

	var analysisView = {};
    var firstAnalys = feed.analysis[0];

    _.each(firstAnalys, function (value, key) {

        var values = _.map(feed.analysis, function (a) {
            var canBerecalcalated = _.some(propertyForRecalculate, function (p) {
                return p === key;
            });

            var initialValue = a[key];
            if (canBerecalcalated) {
                var isNaturalWet = a.isNaturalWet;
                var dryMaterial = a.dryMaterial / 100;
                var calc = Math.round(initialValue * dryMaterial * 100) / 100;

                return {
                    dryValue: isNaturalWet ? calc : initialValue,
                    rawValue: isNaturalWet ? initialValue : calc
                };               
            } else {
                return initialValue;
            }
        });

        analysisView[key] = {
            key: key,
            values: values,
            label: lang(key),
            dimension: dimension(key),
        }
    });

    var generalView = convertToControl(feed.general);
    var harvestView = convertToControl(feed.harvest);
    var feedingView = convertToControl(feed.feeding);

    return {
        analysis: analysisView,
        general: generalView,
        harvest: harvestView,
        feeding: feedingView
    }
}

module.exports = convert;