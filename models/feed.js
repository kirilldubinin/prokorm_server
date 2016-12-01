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
            date: Date,
            isDry: Boolean,
            dryMaterial: Number,
            protein: Number,
            digestedProtein: Number,
            fat: Number,
            cellulose: Number,
            sugar: Number,
            ash: Number,
            exchangeEnergy: Number,
            carotene: Number,
            starch: Number
        }
    ],
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