var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Tenant
var TenantSchema = new Schema({
    loginName: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Tenant', TenantSchema);