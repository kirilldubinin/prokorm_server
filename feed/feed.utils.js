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
    nh3: 'nh3',
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

var disabledFields = {
    'analysis.number': 'disabled'
};

var enumFields = {
    'general.feedType': 'enum'
};

module.exports = {
    propertyForRecalculate: propertyForRecalculate,
    propertyForAverage: propertyForAverage,
    dateFields: dateFields,
    disabledFields: disabledFields,
    enumFields: enumFields
};