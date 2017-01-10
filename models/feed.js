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
        dve: Number,
        oeb: Number,
        vos: Number,
        vcos: Number,
        fos: Number,
        nel: Number,
        nelvc: Number,
        exchangeEnergy: Number,
        nxp: Number,
        rnb: Number,
        udp: Number,
        crudeAsh: Number,
        nh3: Number,
        nitrates: Number,
        crudeProtein: Number,
        solubleCrudeProtein: Number,
        crudeFat: Number,
        sugar: Number,
        starch: Number,
        starchPasses: Number,
        crudeFiber: Number,
        ndf: Number,
        ndfDigested: Number,
        adf: Number,
        adl: Number,
        calcium: Number,
        phosphorus: Number,
        carotene: Number,
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
        code: '621',
        isNaturalWet: false,
        date: new Date(),
        dryMaterial: 33,
        ph: 12,
        milkAcid: 23,
        aceticAcid: 33,
        oilAcid: 23,
        dve: 44,
        oeb: 55,
        vos: 231,
        vcos: 22,
        fos: 11,
        nel: 21.21,
        nelvc: 211,
        exchangeEnergy: 400,
        nxp: 32,
        rnb: 23,
        udp: 311,
        crudeAsh: 565,
        nh3: 454,
        nitrates: 343,
        crudeProtein: 343,
        solubleCrudeProtein: 22,
        crudeFat: 3,
        sugar: 21,
        starch: 32,
        starchPasses: 455,
        crudeFiber: 34,
        ndf: 23,
        ndfDigested: 12,
        adf: 11,
        adl: 43,
        calcium: 54,
        phosphorus: 43,
        carotene: 21
    }],
    general: {
        name: 'Сенаж1',
        feedType: 'none',
        composition: 'Люцерна',
        year: 2016,
        field: '23.21',
        totalWeight: 2100,
        balanceWeight: 2100,
        storage: 'Курган Семеново',
        opened: false,
        done: false
    },
    harvest: {
        cutNumber: 1,
        preservative: 'Sano',
        dosage: '150гр/50 тонн',
        film: '',
        start: new Date(),
        end: new Date()
    },
    feeding: {
        start: new Date(),
        end: new Date(),
        tonnPerDay: 4
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