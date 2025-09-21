const mongoose = require("mongoose")
const reviewSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    name:{
        type:String,
        required: true,
    },
    comment:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min:1,
        max: 5
    },
    approved:{
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Review", reviewSchema)
