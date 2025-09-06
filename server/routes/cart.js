const express = require("express")
const router = express.Router()
const Cart = require("../models/cart")
const Product = require("../models/product")

//Midleware kiem tra dang nhap
const requireAuth = (req,res,next) =>{
    if(!req.user) return res.status(401).json({message:"Unauthorized"})
    next()
}
//Lay gio hang cua User
router.post("/",requireAuth,async(req,res)=>{
    const {productId, quantity} = req.body
    //Kiem tra san pham co ton tai hay khong
    const product = await Product.findById(productId)
    if(!product) return res.status(404).json({message:"Product not found"})
    //Kiem tra ton kho
    if(product.countInStock < quantity) return res.status(400).json({message:"Not enough stock"})
    //Tim cart cua user, neu chua co thi tao moi
    let cart = await Cart.findOne({user:req.body._id})
    if(!cart) cart = new Cart({uset:req.user._id, items:[]})
    //Neu san pham da co trong cart thi cap nhat so luong, chua co thi them moi
    const itemIndex = cart.items.findIndex(i=>i.product.equals(productId))
    if(itemIndex > -1){
        cart.items[itemIndex].quantity = quantity
    }else{
        cart.items.push({product:productId,quantity})
    }
    await cart.save()
    res.json(cart)
})

//Xoa san pham khoi gio hang
router.post("/remove",requireAuth,async(req,res,next)=>{
    const {productId} = req.body
    let cart = await Cart.findOne({user:req.user._id})
    if(!cart) return res.status(404).json({message:"Cart not found"})
    cart.items = cart.items.filter(i => !i.product.equals("productId"))
    await cart.save()
    res.json(cart)
})
module.exports = router