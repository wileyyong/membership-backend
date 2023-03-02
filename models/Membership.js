const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MembershipSchema = new Schema({
    name: {
        type: String,
    },
    month: {
        type: Number,
    },
    annual: {
        type: Number,
    },
    bids: {
        type: Number,
    },
    skills: {
        type: Number,
    },
    rewards: {
        type: Boolean,
    },
    freeSealed: {
        type: Boolean,
    },
    eligible: {
        type: Boolean,
    },
    coverPhoto: {
        type: Boolean,
    },
    highlighted: {
        type: Number,
    },
    extensions: {
        type: Boolean,
    },
});

const Membership = mongoose.model("membership", MembershipSchema);

module.exports = Membership;