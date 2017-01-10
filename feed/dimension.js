function dimension(key) {
	var dimensionObj = {
        dryMaterial: '%',

        // general
        totalWeight: 'тонн',
        balanceWeight: 'тонн',

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
        ndfDigested: '%',
        adf: 'г',
        adl: 'г',
        calcium: 'г',
        phosphorus: 'г',
        carotene: 'мг'
    };

    return dimensionObj[key] || '';
}

module.exports = dimension;