const express = require("express")
const router = express.Router()
const Wishlist = require("../models/Wishlist")
const requireAuth = require("../middleware/requireAuth")

//GET 
router.get("/",requireAuth,async(req,res)=>{
    const wishlist = await Wishlist.findOne({user:req.user._id}).populate("products")
    res.json(wishlist?.products || [])
})
//POST 
router.post("/add",requireAuth,async(req,res)=>{
    const {productId} = req.body
    let wishlist = await Wishlist.findOne({user:req.user._id})
    if(!wishlist) wishlist= new wishlist({user:req.user._id,products:[]})
    if(!wishlist.products.includes(productId)) wishlist.products.push(productId)
    await wishlist.save()
    res.json({success:true})
})
//DELETE
router.post("/remove",requireAuth,async(req,res)=>{
    const {productId} = req.body
    const wishlist = await Wishlist.findOne({user:req.user._id})
    if(wishlist){
        wishlist.products = wishlist.products.filter(id => id.toString() !== productId)
        await wishlist.save()
    }
    res.json({success:true})
})
moudule.exports = router
