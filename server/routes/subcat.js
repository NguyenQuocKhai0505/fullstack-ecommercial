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

// GET "/"
router.get("/", async (req, res) => {
    try {
        const subcats = await SubCategory.find().populate("category"); // KHÔNG có new
        res.json({ success: true, subcats });
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