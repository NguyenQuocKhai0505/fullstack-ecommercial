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
        res.status(500).json({error:error.message})
    }
})
module.exports = router