var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RationSchema = new Schema({
    feeds: [{
        
    }],
    parameters: [{

    }]
});
module.exports = mongoose.model('Ration', RationSchema);