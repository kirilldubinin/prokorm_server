function lang(key) {
	var langObj = {
        general: 'Основные',
        composition: 'Состав',
        year: 'Год',
        weight: 'Вес',
        opened: 'Открыт',
        storage: 'Хранение',
        field: 'Поле',
        done: 'Закончено',
        name: 'Имя',
        dryMaterial: 'Сухое вещество',
        removeFeedConfirmDialogTitle: 'Удалить этот корм ?',
        removeFeedConfirmDialogContent: 'Удаленный корм нельзя будет восстановить.'
    };

    return function (key) {
    	return langObj[key] || key;
    } 
}

function dimension(key) {
	var dimensionObj = {
        dryMaterial: '%'
    };

    return function (key) {
    	return dimensionObj[key] || '';
    } 
}

function convert(feed) {

	return {
		label: lang(key),
		value: value,
		dimension: dimension(key),
		key: key 
	}
}

module.exports = convert;