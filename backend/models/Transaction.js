const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    dateOfSale: { type: Date, required: true },
    isSold: { type: Boolean, required: true }, // This is the problematic field
    category: { type: String, required: true },
});

module.exports = mongoose.model("Transaction", TransactionSchema);




