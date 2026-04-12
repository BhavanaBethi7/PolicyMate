const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    isGoogleUser: {
        type: Boolean,
        default: false
    }
});

const user = mongoose.model('user', userSchema);

module.exports = user;