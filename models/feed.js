var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Feed
var FeedSchema = new Schema({
    analysis: [
        {
            isNaturalWet: Boolean,
            number: {
                type: Number,  
                required: true,
                unique: true
            },
            date: String,
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
        }
    ],
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
        start: String,
        end: String,
    },
    feeding: {
        start: String,
        end: String,
        tonnPerDay: Number
    }
});

FeedSchema.statics.getSkeleton = function () {
  var data = [];

  debugger;
  // analysis property
  Object.keys(FeedSchema.paths.analysis.schema.paths).forEach(function (path) {
    if (path !== '_id') {
        data.push(['analysis', path]);    
    }
  });

  // oter property
  Object.keys(FeedSchema.paths).forEach(function (path) {
    if (path !== '_id' && path !== 'analysis') {
        data.push(path.split('.'));    
    }
  });

  return data;
};

/*FeedSchema.path("general.name").validate(function (v) {
    return v.length;
});
FeedSchema.path('general.year').validate(function (v) {
    return v.length;
});*/

module.exports = mongoose.model('Feed', FeedSchema);
// Feed END