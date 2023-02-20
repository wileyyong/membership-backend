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
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: false,
    },
    renew: {
        type: Date,
        required: false,
    },
    type:{
        type:String
    },
    amount:{
type:Number
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

const User = mongoose.model("user", UserSchema);

module.exports = User;