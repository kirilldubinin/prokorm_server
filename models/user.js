var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// user permissions
// - admin
// - read
// - write

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
    fullName: {
        type: String
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    permissions: [{
        type: String
    }],
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