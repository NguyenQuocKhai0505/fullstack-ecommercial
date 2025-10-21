const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const order = new Order({
      user: req.userId,
      ...req.body
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/:id/status",requireAuth, async(req,res)=>{
    try{
      const {status} = req.body
      const order = await Order.findByIdAndUpdate(req.params.id,{status},{new:true})
      if(!order) return res.status(404).json({error:"Order not found"})
      res.json(order)
    }catch(error){
      res.status(500).json({error:error.message})
    }
})
router.get("/my-orders",requireAuth,async(req,res)=>{
    try{
      const orders = await Order.find({user:req.userId}).sort({createdAt:-1})
      res.json({orders})
    }catch(error){
      res.status(500).json({error:err.message})
    }
})
module.exports = router;