const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    shipping:{
       name:String,
       phone:String,
       address:String,
       email:String,
    },
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        name:String,
        option:String,
        quantity:Number,
        price:Number
    }],
    paymentMethod:String, //Cod, stripe, paypal
    discount:Number,
    shippingFee:Number,
    total:Number,
    status:{type:String,default:"pending"},
    createAt:{type:Date, default:Date.now}
})
module.exports = mongoose.model("Order", orderSchema);