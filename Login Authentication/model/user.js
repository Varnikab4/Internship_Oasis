const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
});

const User = mongoose.model("User", userDataSchema); 
module.exports = User;
