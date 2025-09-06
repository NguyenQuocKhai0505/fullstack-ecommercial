const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
            type:String,
            required:true
    },
    images:[
        {
            type:String,
            required: true
        }
    ],
    brand:{
        type:String,
        default:""
    },
    price:{
        type:Number,
        default:0
    },
    oldPrice:{
        type:Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    subCat:{
        type:String,
        require:true
    },
    countInStock:{
        type:Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    productRam:[
        {
            type:String
        }
    ],
    productSize:[
        {
            type:String
        }
    ],
    productWeight:[
        {
            type:String
        }
    ],

    isFeatured:{
        type:Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default:Date.now
    },
    
})
module.exports = mongoose.model("Product", productSchema)
