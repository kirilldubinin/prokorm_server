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
module.exports = mongoose.model('Ration', RationSchema);