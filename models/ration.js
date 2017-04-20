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
    start: Date,
    end: Date,
    inProgress: Boolean,
	name: {
		type: String,
        required: true
	},
	description: {
		type: String
	},
	targetCow: {
		group: {
			type: String
		},
		milkYield: {
			type: Number
		},
		weight: {
			type: Number
		}
	},
    feeds: [{
        feedId: Schema.Types.ObjectId,
        dryMaterial: Number,
        weight: Number,
        price: Number
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