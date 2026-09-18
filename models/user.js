const mongoose = require("mongoose");

module.exports = mongoose.model("Admins", {
    name: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    otp: Number
}, 'admins');
