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
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    countInStock:{
        type:Number,
        required: true
    },
    rating:{
        type: Number,
        default: 0
    },
    numReviews:{
        type:Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default: false
    },
    dateCreated:{
        type: Date,
        default:Date.now
    },
    
})
exports.Product = mongoose.model("Product",productSchema)

//Updated Code
/**
 * const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        default: 0
    },
    oldPrice: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0,
        min: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    images: [{
        type: String
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Thêm virtual để tính discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (this.oldPrice && this.oldPrice > this.price) {
        return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
    }
    return 0;
});

// Đảm bảo virtual fields được include khi convert to JSON
productSchema.set('toJSON', { virtuals: true });

exports.Products = mongoose.model("Product", productSchema);
 */