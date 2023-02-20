const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    _createdAt: {
        type: Date,
        required: true,
    },
    _updatedAt: {
        type: Date,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    ccType: {
        type: String,
        required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    paymentMethod:{
     type:JSON
    },
    tokenTransactionHash:{
        type:String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
});

const Transaction = mongoose.model("transaction", TransactionSchema);

module.exports = Transaction;