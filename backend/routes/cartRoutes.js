const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const mongoose = require("mongoose"); // Add this at top with other imports

router.post("/", async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: "User ID and Product ID are required" });
        }

        // Verify token
        const verifyUser = jwt.verify(userId, "secret");
        if (!verifyUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.decode(userId);
        const decodedUserId = decoded.id;

        // ✅ Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID" });
        }

        const user = await User.findById(decodedUserId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: "User or Product not found" });
        }

        let cart = await Cart.findOne({ userId: decodedUserId });

        if (!cart) {
            cart = new Cart({
                userId: decodedUserId,
                products: [productId],
            });
            await cart.save();

            user.cart = cart._id;
            await user.save();

            return res.status(200).json({
                message: "New cart created and product added",
                cart,
            });
        }

        // Avoid duplicates (optional)
        if (!cart.products.includes(productId)) {
            cart.products.push(productId);
            await cart.save();
        }

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

const jwt = require("jsonwebtoken");

// Middleware to verify and decode token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, "secret");
    } catch (err) {
        return null;
    }
};

// ➕ Add product to cart
router.post("/", async (req, res) => {
    try {
        const { userId: token, productId } = req.body;

        if (!token || !productId) {
            return res.status(400).json({ message: "Missing user or product ID" });
        }

        const verified = verifyToken(token);
        if (!verified) return res.status(401).json({ message: "Invalid token" });

        const userId = jwt.decode(token).id;

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ message: "User or product not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [productId] });
        } else {
            cart.products.push(productId);
        }

        await cart.save();
        user.cart = cart._id;
        await user.save();

        res.status(200).json({
            message: "Product added to cart",
            cart,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// 🛒 Get user's cart products
router.get("/:userToken", async (req, res) => {
    try {
        const token = req.params.userToken;
        const verified = verifyToken(token);
        if (!verified) return res.status(401).json({ message: "Invalid token" });

        const userId = jwt.decode(token).id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await Cart.findOne({ userId }).populate("products");

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        res.status(200).json(cart.products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// ❌ Remove product from cart
router.delete("/:productId", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const productId = req.params.productId;

        if (!token) return res.status(401).json({ message: "No token provided" });

        const verified = verifyToken(token);
        if (!verified) return res.status(401).json({ message: "Invalid token" });

        const userId = jwt.decode(token).id;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.indexOf(productId);
        if (productIndex === -1)
            return res.status(400).json({ message: "Product not in cart" });

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Product removed from cart", cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
