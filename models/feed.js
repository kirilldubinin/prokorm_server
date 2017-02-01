var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Feed
var FeedSchema = new Schema({
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
    analysis: [{
        isNaturalWet: Boolean,
        number: Number,
        code: String,
        date: Date,
        dryMaterial: Number,
        ph: Number,
        milkAcid: Number,
        aceticAcid: Number,
        oilAcid: Number,
        vos: Number,
        vcos: Number,
        fos: Number,
        sw: Number,
        nel: Number,
        nelvc: Number,
        exchangeEnergy: Number,
        dve: Number,
        oeb: Number,
        nxp: Number,
        rnb: Number,
        udp: Number,
        solubleCrudeProtein: Number,
        nh3: Number,
        crudeProtein: Number,
        crudeAsh: Number,
        crudeFat: Number,
        sugar: Number,
        starch: Number,
        starchPasses: Number,
        starchPassesPercent: Number,
        crudeFiber: Number,
        ndf: Number,
        ndfDigested: Number,
        adf: Number,
        adl: Number,
        calcium: Number,
        phosphorus: Number,
        carotene: Number,
        nitrates: Number
    }],
    general: {
        name: String,
        feedType: String,
        composition: String,
        year: Number,
        field: String,
        totalWeight: Number,
        balanceWeight: Number,
        storage: String,
        price: Number,
        opened: Boolean,
        done: Boolean
    },
    harvest: {
        cutNumber: Number,
        preservative: String,
        dosage: String,
        film: String,
        start: Date,
        end: Date,
    },
    feeding: {
        start: Date,
        end: Date,
        tonnPerDay: Number
    }
});
var goldObject = {
    analysis: [{
        number: 1,
        code: '',
        isNaturalWet: false,
        date: new Date(),
        dryMaterial: null,
        ph: null,
        milkAcid: null,
        aceticAcid: null,
        oilAcid: null,
        vos: null,
        vcos: null,
        fos: null,
        sw: null,
        nel: null,
        nelvc: null,
        exchangeEnergy: null,
        dve: null,
        oeb: null,
        nxp: null,
        rnb: null,
        udp: null,
        solubleCrudeProtein: null,
        nh3: null,
        crudeProtein: null,
        crudeAsh: null,
        crudeFat: null,
        sugar: null,
        starch: null,
        starchPasses: null,
        starchPassesPercent: null,
        crudeFiber: null,
        ndf: null,
        ndfDigested: null,
        adf: null,
        adl: null,
        calcium: null,
        phosphorus: null,
        carotene: null,
        nitrates: null
    }],
    general: {
        name: '',
        feedType: 'none',
        composition: '',
        year: null,
        field: '',
        totalWeight: null,
        balanceWeight: null,
        storage: '',
        price: null,
        opened: false,
        done: false
    },
    harvest: {
        cutNumber: 1,
        preservative: '',
        dosage: '',
        film: '',
        start: null,
        end: null
    },
    feeding: {
        start: null,
        end: null,
        tonnPerDay: null
    }
};

FeedSchema.statics.getSkeleton = function() {
    var data = [];
    // analysis property
    Object.keys(FeedSchema.paths.analysis.schema.paths).forEach(function(path) {
        if (path !== '_id') {
            data.push(['analysis', path]);
        }
    });
    // oter property
    Object.keys(FeedSchema.paths).forEach(function(path) {
        if (path !== '_id' && path !== 'analysis') {
            data.push(path.split('.'));
        }
    });
    return data;
};
FeedSchema.statics.getEmptyFeed = function() {
    return goldObject;
};
FeedSchema.statics.sort = function(object, rootProperty) {
    var result = {};

    _.forEach(_.isArray(goldObject[rootProperty]) ? goldObject[rootProperty][0] : goldObject[rootProperty], 
        function (value, key) {
            result[key] = object[key];
        });

    return result;
};

    /*FeedSchema.path("general.name").validate(function (v) {
        return v.length;
    });
    FeedSchema.path('general.year').validate(function (v) {
        return v.length;
    });*/
module.exports = mongoose.model('Feed', FeedSchema);
// Feed END