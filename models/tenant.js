var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    license: {
        feed: {
            endDate: Date,
            tariffPlan: Schema.Types.ObjectId
        },
        ration: {
            endDate: Date,
            tariffPlan: Schema.Types.ObjectId
        }, 
        field: {
            endDate: Date,
            tariffPlan: Schema.Types.ObjectId
        }
    } 
});
module.exports = mongoose.model('Tenant', TenantSchema);