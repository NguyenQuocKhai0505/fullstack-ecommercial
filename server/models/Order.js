const mongoose = require("mongoose")
const orderSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    shipping:{
       name:String,
       phone:String,
       email:String,
       country:String,   // quốc gia - required cho quốc tế
       address:String,   // street address
       address2:String,  // apartment, suite, ...
       city:String,
       state:String,
       zip:String        // postal code
    },
    items:[{
        product:{type:mongoose.Schema.Types.ObjectId,ref:"Product"},
        name:String,
        option:String,
        quantity:Number,
        price:Number
    }],
    paymentMethod:String, //Cod, stripe, paypal, ...
    discount:Number,
    shippingFee:Number,
    total:Number,
    status:{type:String,default:"pending"},
    paymentId: String, // trace đến id thanh toán của Stripe/PayPal
    paid: { type: Boolean, default: false },
    paymentResult: { type: Object }, // lưu toàn bộ object trả về của bên thanh toán
    createAt:{type:Date, default:Date.now}
})
module.exports = mongoose.model("Order", orderSchema);