const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    type: {
        type: String,
        enum: ["Featured", "New Arrival", "Best Seller"],
        default: "New Arrival",
    },
    description: String,
    stock: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
});

module.exports = mongoose.model("Product", productSchema);
