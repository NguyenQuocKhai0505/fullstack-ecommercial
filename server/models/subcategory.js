const mongoose = require('mongoose');

const SubCatSchema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    subCategory:{
        type:String,
        required:true,
        unique:true
    }
}, { timestamps: true })

module.exports = mongoose.model('SubCategory', SubCatSchema);
