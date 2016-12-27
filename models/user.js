var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	tenantId: {
		type: Schema.Types.ObjectId,
		required: true
	},
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    /*passwordSalt: {
        type: String,
        required: true,
        select: false
    },*/
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', UserSchema);