var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CatalogSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    ru_short: {
        type: String,
        required: true
    },
    ru_content: {
        type: String,
        required: true    
    }
});
module.exports = mongoose.model('Catalog', CatalogSchema);