var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TariffSchema = new Schema({
    module: String,
    plan: String
});
module.exports = mongoose.model('Tariff', TariffSchema);