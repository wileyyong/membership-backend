const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
    },
    privateKey: {
        type: String,
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date,
        required: false,
    },
    dop: {
        type: Date,
        required: false,
    },
    isActive:{
        type:Boolean
    },
    token:{
        type:Number
    },
    membership: {
        type: Schema.Types.ObjectId,
        ref: "membership"
    },
});

const User = mongoose.model("admin", UserSchema);

module.exports = User;