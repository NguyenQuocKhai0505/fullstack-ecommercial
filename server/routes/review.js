const express = require("express")
const router = express.Router()
const Review = require("../models/Review")

//POST /api/reviews
router.post("/",async(req,res) =>{
    try{
        const {product,name,comment,rating} = req.body
        const review = new Review({product,name,comment,rating})
        await review.save()
        res.status(201).json({message: "Review submitted successfully, please wait for approval"})
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
// GET /api/reviews/pending - Lấy review chờ duyệt cho admin
router.get("/pending", async (req, res) => {
    try {
        const reviews = await Review.find({ approved: false })
            .populate('product', 'name images description')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//GET /api/reviews/:productId
router.get("/:productId", async(req,res)=>{
    try{
        const reviews = await Review.find({product: req.params.productId,approved:true}).sort({createdAt: -1})
        res.json(reviews)
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
//PATCH /api/reviews/approve/:id //lấy danh sách review
router.patch("/approve/:id",async(req,res)=>{
    try{
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {approved:true},
            {new:true}
        )
        if(!review) return res.status(404).json({message:"Review not found"})
        res.json({message:"Review approved successfullu"})
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
//DELETE api/reviews/:id
router.delete("/:id", async(req,res)=>{
    try{
        await Review.findByIdAndDelete(req.params.id)
        res.json({message:"Review deleted successfully"})
    }catch(error){
        res.status(500).json({error: error.message})
    }
})
module.exports = router;