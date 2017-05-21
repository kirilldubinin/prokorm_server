var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RationSchema = new Schema({
	createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdBy: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    general: {
        type: {
            type: String,
            required: true
        },
        target: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        groupName: {
            type: String
        },
        cowWeight: {
            type: Number
        },
        startDate: Date,
        endDate: Date
    },
    feeds: [{
        _id: Schema.Types.ObjectId,
        name: String,
        year: Number,
        branch: String,
        storage: String,
        weight: Number,
        dryMaterial: Number, // gr/kilo
        price: Number // for kilo
    }],
    parameters: [{
        dryMaterial: {
            type: Number,
            required: true
        },
        wet: {
        	type: Number
        },
        exchangeEnergy: Number,
        exchangeEnergyInKg: Number,
        nel: Number,
        nelInKg: Number,
        crudeProtein: Number,
        nxp: Number,
        rnb: Number,
        crudeFat: Number,
        crudeFiber: Number,
        structuralFiber: Number,
        sugar: Number,
        starch: Number,
        uncrackedStarch: Number,
        starchPlusSugar: Number,
        milkByNel: Number,
        milkByProtein: Number,
        milkByNxp: Number
    }]
});

var goldObject = {
    general: {
        type: '',
        target: '',
        name: '',
        groupName: '',
        cowWeight: null,
        startDate: null,
        endDate: null
    },
    feeds: [],
    parameters: [{
        dryMaterial: null,
        wet: null,
        exchangeEnergy: null,
        exchangeEnergyInKg: null,
        nel: null,
        nelInKg: null,
        crudeProtein: null,
        nxp: null,
        rnb: null,
        crudeFat: null,
        crudeFiber: null,
        structuralFiber: null,
        sugar: null,
        starch: null,
        uncrackedStarch: null,
        starchPlusSugar: null,
        milkByNel: null,
        milkByProtein: null,
        milkByNxp: null
    }]
};

RationSchema.statics.getEmptyFeed = function() {
    return goldObject;
};
RationSchema.statics.sort = function(object, rootProperty) {
    var result = {};
    _.forEach(_.isArray(goldObject[rootProperty]) ? goldObject[rootProperty][0] : goldObject[rootProperty], function(value, key) {
        if ((_.isBoolean(object[key]) || _.isNumber(object[key]) || object[key])) {
            result[key] = object[key];
        }
    });
    return result;
};
RationSchema.pre('validate', function(next) {
    
    // general properies
    if (!this.general.type || 
        !this.general.name) {
        return next(Error('"Тип" и "Имя" рациона обязательны для заполнения.'));
    } 

    // VALIDATION OK
    return next();
});

module.exports = mongoose.model('Ration', RationSchema);