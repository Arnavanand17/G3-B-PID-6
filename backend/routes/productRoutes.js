const express = require("express");
const Product = require("../models/Product");
const { addProduct, getProducts } = require("../controllers/productController");

const router = express.Router();

router.post("/add", addProduct);
router.get("/", getProducts);

router.post("/addMany", async (req, res) => {
    console.log("✅ addMany route hit");
    try {
        const products = req.body;
        await Product.insertMany(products);
        res.status(201).json({ message: "Products added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Could not add products", details: err.message });
    }
});

module.exports = router;
