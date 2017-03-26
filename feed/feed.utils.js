var propertyForRecalculate = {
    milkAcid: 'milkAcid',
    aceticAcid: 'aceticAcid',
    oilAcid: 'oilAcid',
    dve: 'dve',
    oeb: 'oeb',
    vos: 'vos',
    fos: 'fos',
    nel: 'nel',
    nelvc: 'nelvc',
    exchangeEnergy: 'exchangeEnergy',
    nxp: 'nxp',
    rnb: 'rnb',
    udp: 'udp',
    crudeAsh: 'crudeAsh',
    nitrates: 'nitrates',
    crudeProtein: 'crudeProtein',
    crudeFat: 'crudeFat',
    sugar: 'sugar',
    starch: 'starch',
    starchPasses: 'starchPasses',
    crudeFiber: 'crudeFiber',
    ndf: 'ndf',
    adf: 'adf',
    adl: 'adl',
    calcium: 'calcium',
    phosphorus: 'phosphorus',
    carotene: 'carotene'
};

var propertyForAverage = {
    dryMaterial: 'milkAcid',
    ph: 'milkAcid',
    milkAcid: 'milkAcid',
    aceticAcid: 'aceticAcid',
    oilAcid: 'oilAcid',
    dve: 'dve',
    oeb: 'oeb',
    vos: 'vos',
    vcos: 'vcos',
    fos: 'fos',
    sw: 'sw',
    nel: 'nel',
    nelvc: 'nelvc',
    exchangeEnergy: 'exchangeEnergy',
    nxp: 'nxp',
    rnb: 'rnb',
    udp: 'udp',
    crudeAsh: 'crudeAsh',
    nh3: 'nh3',
    nitrates: 'nitrates',
    crudeProtein: 'crudeProtein',
    solubleCrudeProtein: 'solubleCrudeProtein',
    crudeFat: 'crudeFat',
    sugar: 'sugar',
    starch: 'starch',
    starchPasses: 'starchPasses',
    starchPassesPercent: 'starchPassesPercent',
    crudeFiber: 'crudeFiber',
    ndf: 'ndf',
    ndfDigested: 'ndfDigested',
    adf: 'adf',
    adl: 'adl',
    calcium: 'calcium',
    phosphorus: 'phosphorus',
    carotene: 'carotene'
};

var dateFields = {
    'analysis.date': 'date',
    'harvest.start': 'date',
    'harvest.end': 'date',
    'feeding.start': 'date',
    'feeding.end': 'date'
};

var requiredFields = {
    'general.feedType': 'required',
    'general.composition': 'required',
    'general.year': 'required',
    'analysis.number': 'required',
    'analysis.dryMaterial': 'required',
    'analysis.date': 'required'
};

var disabledFields = {
    'analysis.number': 'disabled'
};

var enumFields = {
    'general.feedType': 'enum',
    'general.storageType': 'enum'

};

var propertyWithHelp = {
    dryMaterial: 'dryMaterial',
    ph: 'ph',
    milkAcid: 'milkAcid',
    aceticAcid: 'aceticAcid',
    oilAcid: 'oilAcid',
    vos: 'vos',
    vcos: 'vcos',
    fos: 'fos',
    sw: 'sw',
    nel: 'nel',
    nelvc: 'nelvc',
    exchangeEnergy: 'exchangeEnergy',
    dve: 'dve',
    oeb: 'oeb',
    nxp: 'nxp',
    rnb: 'rnb',
    udp: 'udp',
    solubleCrudeProtein: 'solubleCrudeProtein',
    nh3: 'nh3',
    crudeProtein: 'crudeProtein',
    crudeAsh: 'crudeAsh',
    crudeFat: 'crudeFat',
    sugar: 'sugar',
    starch: 'starch',
    starchPasses: 'starchPasses',
    starchPassesPercent: 'starchPassesPercent',
    crudeFiber: 'crudeFiber',
    ndf: 'ndf',
    ndfDigested: 'ndfDigested',
    adf: 'adf',
    adl: 'adl',
    calcium: 'calcium',
    phosphorus: 'phosphorus',
    carotene: 'carotene',
    nitrates: 'nitrates'
};

function calcDryRaw (isNaturalWet, dryMaterial, value) {

    if (value === null || value === undefined) {
        return null;
    }

    dryMaterial = dryMaterial / 100;
    return {
        dryValue: Math.round((isNaturalWet ? (value / dryMaterial) : value)*100)/100,
        rawValue: Math.round((isNaturalWet ? value : (value * dryMaterial))*100)/100
    };
}

module.exports = {
    calcDryRaw: calcDryRaw,
    propertyForRecalculate: propertyForRecalculate,
    propertyForAverage: propertyForAverage,
    dateFields: dateFields,
    disabledFields: disabledFields,
    enumFields: enumFields,
    propertyWithHelp: propertyWithHelp,
    requiredFields: requiredFields
};