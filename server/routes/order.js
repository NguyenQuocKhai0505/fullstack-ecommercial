const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('[DEBUG] POST /orders, user:', req.user && req.user._id, 'Body:', req.body);
    const order = new Order({
      user: req.user._id,
      ...req.body
    });
    await order.save();
    console.log('[DEBUG] Order CREATED:', order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error('[ERROR] POST /orders:', err.message, err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", requireAuth, async(req,res)=>{
    try{
      const page = Number(req.query.page) || 1
      const perPage = Number(req.query.perPage) || 10
      const totalOrders = await Order.countDocuments()
      const totalPages = Math.ceil(totalOrders/perPage)

      const orders = await Order.find()
        .sort({createdAt:-1})
        .skip((page-1)*perPage)
        .limit(perPage)
      
        res.json({orders,totalPages})
    }catch(error){
      res.status(500).json({error:error.message})
    }
})
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    console.log('[DEBUG] PATCH /orders/:id/status:', req.params.id, 'New status:', status);
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      console.warn('[WARN] PATCH /orders/:id/status - Not found:', req.params.id);
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('[ERROR] PATCH /orders/:id/status:', error.message);
    res.status(500).json({ error: error.message });
  }
});
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('[DEBUG] GET /my-orders, user:', userId);
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    console.log('[DEBUG] /my-orders Orders found:', orders.length);
    res.json({ orders });
  } catch (error) {
    console.error('[ERROR] /my-orders:', error.message);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;