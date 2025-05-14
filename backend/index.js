const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ These must be correct
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/darkfashion").then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
        console.log("Server is running on port 5000");
    });
});

app.use((req, res, next) => {
    console.log("⛔ Route not found:", req.method, req.originalUrl);
    res.status(404).send("Route not found");
});
