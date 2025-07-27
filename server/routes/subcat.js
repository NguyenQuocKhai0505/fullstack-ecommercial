const express = require('express');
const router = express.Router();
const SubCategory = require('../models/subcategory');

// POST: "/create"
router.post("/create", async (req, res) => {
    try {
        const subCat = new SubCategory({
            category: req.body.category,
            subCategory: req.body.subCategory // Đúng tên trường schema
        });
        await subCat.save();
        res.json({ success: true, subCat });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET "/" - Lấy tất cả subcategories hoặc filter theo category
router.get("/", async (req, res) => {
    try {
        let filter = {};
        
        // Nếu có query category, filter theo category
        if (req.query.category) {
            filter.category = req.query.category;
        }
        
        const subcats = await SubCategory.find(filter).populate("category");
        res.json({ success: true, subcats });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// GET "/:id" - Lấy subcategory theo ID
router.get("/:id", async (req, res) => {
    try {
        const subCat = await SubCategory.findById(req.params.id).populate("category");
        
        if (!subCat) {
            return res.status(404).json({
                success: false,
                message: "Subcategory not found"
            });
        }
        
        res.json({ success: true, subCat });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// DELETE "/:id"
router.delete("/:id", async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// PUT "/:id"
router.put("/:id", async (req, res) => {
    try {
        const subCat = await SubCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({ success: true, subCat });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

module.exports = router;