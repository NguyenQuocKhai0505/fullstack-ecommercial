const express = require("express")
const router = express.Router()
const Cart = require("../models/cart")
const Product = require("../models/product")

// Middleware kiểm tra đăng nhập
const requireAuth = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" })
    next()
}

// Lấy giỏ hàng của user (GET /api/cart)
router.get("/", requireAuth, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(cart || { items: [] })
})

// Thêm/cập nhật sản phẩm trong giỏ hàng (POST /api/cart/add)
router.post("/add", requireAuth, async (req, res) => {
    const { productId, quantity } = req.body
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: "Product not found" })
    if (product.countInStock < quantity) return res.status(400).json({ message: "Not enough stock" })

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) cart = new Cart({ user: req.user._id, items: [] })

    const itemIndex = cart.items.findIndex(i => i.product.equals(productId))
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity
    } else {
        cart.items.push({ product: productId, quantity })
    }
    await cart.save()
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(populatedCart)
})

// Xóa sản phẩm khỏi giỏ hàng (POST /api/cart/remove)
router.post("/remove", requireAuth, async (req, res) => {
    const { productId } = req.body
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })
    cart.items = cart.items.filter(i => !i.product.equals(productId))
    await cart.save()
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product")
    res.json(populatedCart)
})

module.exports = router