const {Category} = require("../models/category.js")
const {Product} = require("../models/product.js")
const express = require("express")
const router = express.Router()
const cloudinary = require("cloudinary").v2; 
const { default: pLimit } = require("p-limit");
// Cấu hình Cloudinary với thông tin từ biến môi trường (.env file)
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name, // Tên cloud trên Cloudinary
  api_key: process.env.cloudinary_Config_api_key,       // API key để xác thực
  api_secret: process.env.cloudinary_Config_api_secret  // API secret để bảo mật
});

//GET "/" - Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
    try {
        // Lấy tham số page từ query, mặc định là 1
        const page = parseInt(req.query.page) || 1
        const perPage = parseInt(req.query.perPage) || 5
        const category = req.query.category; // Lấy category từ query
        const isFeatured = req.query.isFeatured; // Lấy isFeatured từ query

        // Tạo filter object
        let filter = {};
        if (category) {
            filter.category = category;
        }
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === 'true';
        }

        // Đếm tổng số sản phẩm theo filter
        const totalPosts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalPosts / perPage)

        // Nếu page vượt quá tổng số trang, trả về lỗi
        if (page > totalPages && totalPages !== 0) {
            return res.status(404).json({
                message: "Page not found"
            })
        }

        // Lấy danh sách sản phẩm cho trang hiện tại theo filter
        const productList = await Product.find(filter).populate("category")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec()

        // Nếu không có sản phẩm nào
        if (!productList || productList.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm nào"
            });
        }
        
        // Trả về danh sách sản phẩm và thông tin phân trang
        res.status(200).json({
            success: true,
            count: productList.length,
            data: productList,
            page: page,
            totalPages: totalPages,
            totalPosts: totalPosts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server khi lấy danh sách sản phẩm",
            error: error.message
        });
    }
});
//POST "/create" - Route tạo sản phẩm mới
router.post("/create", async(req, res) => {
    try {
        // Kiểm tra các trường bắt buộc trước
        const { name, description, brand, category, countInStock } = req.body;
        
        if (!name || !description || !brand || !category) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc: tên sản phẩm, mô tả, thương hiệu, danh mục"
            });
        }

        // Kiểm tra danh mục có tồn tại không
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại hoặc không hợp lệ"
            });
        }

        // Kiểm tra ảnh được gửi lên
        if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cần có ít nhất một ảnh sản phẩm và phải là một mảng"
            });
        }

        // Giới hạn số lượng ảnh tối đa
        if (req.body.images.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Tối đa 5 ảnh cho mỗi sản phẩm"
            });
        }

        // Giới hạn chỉ upload tối đa 5 ảnh cùng lúc để tránh quá tải server
        const limit = pLimit(5);
        
        // Tạo mảng các promise để upload từng ảnh lên Cloudinary
        const imagesToUpload = req.body.images.map((image) => {
            return limit(async () => {
                try {
                    // Upload từng ảnh lên Cloudinary với tối ưu hóa
                    const result = await cloudinary.uploader.upload(image, {
                        folder: 'products', // Tổ chức ảnh theo thư mục
                        transformation: [
                            { width: 800, height: 800, crop: 'limit' }, // Tối ưu kích thước
                            { quality: 'auto', fetch_format: 'auto' } // Tự động tối ưu chất lượng và định dạng
                        ]
                    });
                    return result;
                } catch (uploadError) {
                    console.error('Lỗi upload ảnh:', uploadError);
                    throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);
                }
            });
        });

        // Chờ tất cả ảnh upload xong
        const uploadStatus = await Promise.all(imagesToUpload);
        
        // Lấy URL của các ảnh đã upload thành công
        const imgUrls = uploadStatus.map((item) => item.secure_url);

        // Kiểm tra xem có ảnh nào upload thành công không
        if (!imgUrls || imgUrls.length === 0) {
            return res.status(500).json({
                success: false,
                message: "Không thể upload ảnh lên server"
            });
        }

        // Tạo sản phẩm mới
        let product = new Product({
            name: name.trim(),
            description: description.trim(),
            images: imgUrls,
            brand: brand.trim(),
            category: category,
            subCat: req.body.subCat,
            countInStock: parseInt(countInStock) || 0,
            rating: parseFloat(req.body.rating) || 0,
            isFeatured: Boolean(req.body.isFeatured),
            price: parseFloat(req.body.price) || 0, 
            oldPrice: parseFloat(req.body.oldPrice) || 0,// Thêm trường giá bị thiếu
            dateCreated: new Date()
        });

        // Lưu sản phẩm vào database
        product = await product.save();
        
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Không thể tạo sản phẩm trong cơ sở dữ liệu"
            });
        }
        
        // Trả về kết quả thành công
        res.status(201).json({
            success: true,
            message: "Tạo sản phẩm thành công",
            data: product
        });

    } catch (error) {
        console.error('Lỗi tạo sản phẩm:', error);
        
        // Xử lý các loại lỗi cụ thể
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "ID danh mục không đúng định dạng"
            });
        }

        res.status(500).json({
            success: false,
            message: "Lỗi server nội bộ",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Lỗi hệ thống'
        });
    }
});
//DELETE "/:id"
router.delete("/:id",async(req,res)=>{
    const deleteProduct = await Product.findByIdAndDelete(req.params.id)
    if(!deleteProduct){
        return res.status(404).json({
            message:"Không tìm thấy sản phẩm",
            status:false,
        })
    }
    res.status(200).send({
        message:"Sản phẩm đã bị xóa",
        status: true,
    })
})
//GET "/:id" Lấy sản phẩm theo ID
router.get("/:id", async(req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category");
        //Khi khong dung populate san pham tra ve chi co string cua category
        //nhung khi su dung populate id se duoc thay the bang toan bo object category
        
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm với ID này"
            });
        }
        
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi server khi tìm kiếm sản phẩm",
            error: error.message
        });
    }
});
//PUT "/:id" - Cập nhật sản phẩm
router.put("/:id", async(req, res) => {
    try {
        // Destructure dữ liệu từ request body
        const { 
            name, 
            description, 
            images, 
            brand, 
            category, 
            countInStock, 
            rating, 
            isFeatured, 
            price,
            oldPrice,
            subCat,
        } = req.body;

        let imgUrls = [];

        // Chỉ xử lý upload ảnh nếu có ảnh mới được gửi lên
        if (images && images.length > 0) {
            // Giới hạn chỉ upload tối đa 5 ảnh cùng lúc để tránh quá tải server
            const limit = pLimit(5);
            
            // Tạo mảng các promise để upload từng ảnh lên Cloudinary
            const imagesToUpload = images.map((image) => {
                return limit(async () => {
                    try {
                        // Upload từng ảnh lên Cloudinary với tối ưu hóa
                        const result = await cloudinary.uploader.upload(image, {
                            folder: 'products', // Tổ chức ảnh theo thư mục
                            transformation: [
                                { width: 800, height: 800, crop: 'limit' }, // Tối ưu kích thước
                                { quality: 'auto', fetch_format: 'auto' } // Tự động tối ưu chất lượng và định dạng
                            ]
                        });
                        return result;
                    } catch (uploadError) {
                        console.error('Lỗi upload ảnh:', uploadError);
                        throw new Error(`Lỗi upload ảnh: ${uploadError.message}`);
                    }
                });
            });

            // Chờ tất cả ảnh upload xong
            const uploadStatus = await Promise.all(imagesToUpload);
            
            // Lấy URL của các ảnh đã upload thành công
            imgUrls = uploadStatus.map((item) => item.secure_url);

            // Kiểm tra xem có ảnh nào upload thành công không
            if (!imgUrls || imgUrls.length === 0) {
                return res.status(500).json({
                    success: false,
                    message: "Không thể upload ảnh lên server"
                });
            }
        }

        // Chuẩn bị dữ liệu cập nhật
        const updateData = {};
        
        if (name) updateData.name = name.trim();
        if (description) updateData.description = description.trim();
        if (imgUrls.length > 0) updateData.images = imgUrls;
        if (brand) updateData.brand = brand.trim();
        if (category) updateData.category = category;
        if (countInStock !== undefined) updateData.countInStock = parseInt(countInStock) || 0;
        if (rating !== undefined) updateData.rating = parseFloat(rating) || 0;
        if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
        if (price !== undefined) updateData.price = parseFloat(price) || 0;
        if (oldPrice !== undefined) updateData.oldPrice = parseFloat(oldPrice) || 0;
        if (subCat !== undefined) updateData.subCat = subCat;
        
        // Thêm thời gian cập nhật
        updateData.dateUpdated = new Date();

        // Cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm để cập nhật",
                success: false
            });
        }

        return res.status(200).json({
            message: "Sản phẩm đã được cập nhật thành công",
            success: true,
            data: product
        });

    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error);
        return res.status(500).json({
            message: "Lỗi server khi cập nhật sản phẩm",
            success: false,
            error: error.message
        });
    }
});
module.exports = router
