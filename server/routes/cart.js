const express = require("express")
const router = express.Router()
const Cart = require("../models/cart")
const { Product } = require("../models/product")


// Middleware kiểm tra đăng nhập
const jwt = require('jsonwebtoken');
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('[Auth] Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[Auth] No token provided');
        return res.status(401).json({ message: "Unauthorized" })
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('[Auth] Token decoded, user:', req.user);
        next();
    } catch (err) {
        console.log('[Auth] Token verify failed:', err.message);
        return res.status(401).json({ message: "Unauthorized" })
    }
}

// Lấy giỏ hàng của user (GET /api/cart)
router.get("/", requireAuth, async (req, res) => {
    console.log('[Cart] GET /api/cart for user:', req.user && req.user._id);
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(cart || { items: [] })
})

// Thêm/cập nhật sản phẩm trong giỏ hàng (POST /api/cart/add)
router.post("/add", requireAuth, async (req, res) => {
    const { productId, quantity } = req.body
    console.log('[Cart] POST /api/cart/add', { user: req.user && req.user._id, productId, quantity });
    const product = await Product.findById(productId)
    if (!product) {
        console.log('[Cart] Product not found:', productId);
        return res.status(404).json({ message: "Product not found" })
    }
    if (product.countInStock < quantity) {
        console.log('[Cart] Not enough stock:', productId, 'Requested:', quantity, 'In stock:', product.countInStock);
        return res.status(400).json({ message: "Not enough stock" })
    }
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        console.log('[Cart] No cart found, creating new cart for user:', req.user._id);
        cart = new Cart({ user: req.user._id, items: [] })
    }
    const itemIndex = cart.items.findIndex(i => i.product.equals(productId))
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity
        console.log('[Cart] Updated quantity for product in cart:', productId, 'Quantity:', quantity);
    } else {
        cart.items.push({ product: productId, quantity })
        console.log('[Cart] Added new product to cart:', productId, 'Quantity:', quantity);
    }
    await cart.save()
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(populatedCart)
})

// Xóa sản phẩm khỏi giỏ hàng (POST /api/cart/remove)
router.post("/remove", requireAuth, async (req, res) => {
    const { productId } = req.body
    console.log('[Cart] POST /api/cart/remove', { user: req.user && req.user._id, productId });
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
        console.log('[Cart] Cart not found for user:', req.user._id);
        return res.status(404).json({ message: "Cart not found" })
    }
    cart.items = cart.items.filter(i => !i.product.equals(productId))
    await cart.save()
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(populatedCart)
})

module.exports = router