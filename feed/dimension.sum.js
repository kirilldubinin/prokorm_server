function dimension(key) {
	var dimensionObj = {
        dryWeight: 'кг',
        nel: 'МДж',
        exchangeEnergy: 'МДж',
        crudeProtein: 'кг',
        ndf: 'кг',
        adf: 'кг'
    };

    return dimensionObj[key] || '';
}

module.exports = dimension;