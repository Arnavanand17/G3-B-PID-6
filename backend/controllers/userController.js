const User = require("../models/User");

exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.json(user.cart);
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.addToWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json(user.wishlist);
  } catch (err) {
    console.error("Add to Wishlist Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("Remove from Wishlist Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("cart");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.cart);
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("wishlist");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.wishlist);
  } catch (err) {
    console.error("Get Wishlist Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
