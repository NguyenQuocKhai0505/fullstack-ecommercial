const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const requireAuth = require("../middleware/requireAuth")

//Tạo đơn hàng mới
router.post("/", requireAuth, async (req, res) => {
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
//Lấy danh sách đơn hàng cho admin
router.get("/",requireAuth,async(req,res)=>{
    try{

    }catch(error){
        res.status(500).json({error:error.message})
    }
})
module.exports = router 