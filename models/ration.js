var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RationSchema = new Schema({
    feeds: [{
        feedId: Schema.Types.ObjectId,
        weight: Number
    }],
    parameters: [{
        
    }]
});
module.exports = mongoose.model('Ration', RationSchema);