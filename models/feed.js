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
        number: {
            type: Number,
            required: true
        },
        code: String,
        date: {
            type: Date,
            required: true
        },
        dryMaterial: {
            type: Number,
            required: true
        },
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
        name: {
            type: String
            //required: true
        },
        feedType: {
            type: String,
            required: true
        },
        composition: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        branch: String,
        field: String,
        totalWeight: Number,
        balanceWeight: Number,
        storage: String,
        storageType: String,
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
        end: Date
    },
    feeding: {
        start: Date,
        end: Date,
        tonnPerDay: Number,
        autoDecrement: Boolean
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
        branch: '',
        storage: '',
        storageType: '',
        field: '',
        totalWeight: null,
        balanceWeight: null,
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
        tonnPerDay: null,
        autoDecrement: false
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
    _.forEach(_.isArray(goldObject[rootProperty]) ? goldObject[rootProperty][0] : goldObject[rootProperty], function(value, key) {
        if ((_.isBoolean(object[key]) || _.isNumber(object[key]) || object[key])) {
            result[key] = object[key];
        }
    });
    // add calculate property harvestDays
    if (object.harvestDays) {
        result.harvestDays = object.harvestDays;
    }
    // add calculate property feedingDays
    if (object.feedingDays) {
        result.feedingDays = object.feedingDays
    }
    return result;
};
FeedSchema.pre('validate', function(next) {
    
    // general properies
    if (!this.general.year || 
        this.general.feedType === 'none' || 
        !this.general.feedType ||
        !this.general.composition) {
        return next(Error('"Год", "Тип" и "Состав" корма обязательны для заполнения.'));
    } 

    // analysis
    if (this.analysis.length) {

        if (_.some(this.analysis, function (a) {
            return !a.number;
        })) {
            return next(Error('"Номер" анализа обязателен для заполнения'));
        }

        if (_.some(this.analysis, function (a) {
            return !a.date;
        })) {
            return next(Error('"Дата" анализа обязательна для заполнения'));
        }

        if (_.some(this.analysis, function (a) {
            return !a.dryMaterial;
        })) {
            return next(Error('"Сухое вещество" анализа обязательно для заполнения'));
        }
    }

    // feeding 
    if (this.feeding.autoDecrement && !_.isNumber(this.feeding.tonnPerDay)) {
        return next(Error('"Тонн в день" обязательно для заполнения при включенном автовычитании'));
    }


    // VALIDATION OK
    return next();
});
module.exports = mongoose.model('Feed', FeedSchema);
