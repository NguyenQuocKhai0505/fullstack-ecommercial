const mongoose = require("mongoose")
//Moi item trong gio hang gom product va quantity
const cartItemSchema = new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
    quantity:{type:Number,required:true,min:1},
    size: { type: String } // Thêm trường size
})
//Moi user co mot cart fom nhieu items 
const cartSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    items:[cartItemSchema],
})

module.exports = mongoose.model('Cart', cartSchema);