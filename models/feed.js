var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Feed
var FeedSchema = new Schema({
    general: {
        name: String,
        field: String,
        composition: String,
        year: Number,
        weight: Number,
        opened: Boolean,
        storage: String,
        done: Boolean
    },
    analysis: [
        {
            number: Number,
            date: String,
            isNaturalWet: Boolean,
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
            adf: Number,
            adl: Number,
            calcium: Number,
            phosphorus: Number,
            carotene: Number,
        }
    ],
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
  var data = {};
  Object.keys(FeedSchema.paths).forEach(function (path) {
    return path !== '_id' ? data[path] = "" : false;
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