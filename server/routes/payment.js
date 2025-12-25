const express= require("express")
const router = express.Router()
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

router.post("/create-checkout-session",async(req,res)=>{
    const [items,shipping,email] = req.body
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:items.map(item=>({
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:item.name
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity:item.quantity,
            })),
            mode:"payment",
            customer_email:email,
            success_url: process.env.CLIENT_URL + "/order-success",
            cancel_url: process.env.CLIENT_URL + "/checkout"
        })
        res.json({url:session.url})
    }catch(error){
        console.error("STRIPE CHECKOUT SESSION ERROR:", error);
        res.status(500).json({error:error.message})
    }
})

router.post('/stripe-payment-intent', async (req, res) => {
  try {
    const { items, shipping, total } = req.body;
    // Bạn có thể kiểm lại tổng nếu muốn bảo mật
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe dùng đơn vị là cent (USD x 100)
      currency: 'usd',
      payment_method_types: ['card'],
      receipt_email: shipping?.email || undefined,
      metadata: {
        items: JSON.stringify(items),
        customer_name: shipping?.name || "",
      }
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("STRIPE PAYMENT INTENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});
module.exports = router