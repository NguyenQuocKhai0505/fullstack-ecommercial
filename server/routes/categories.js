// Import các thư viện và model cần thiết
const { Category } = require("../models/category"); // Model Category từ database
const express = require("express"); // Framework Express.js
const cloudinary = require("cloudinary").v2; // Cloudinary để upload ảnh lên cloud
// Import p-limit với ES6 syntax cho phiên bản mới
const { default: pLimit } = require("p-limit"); // Giới hạn số lượng request đồng thời
const router = express.Router(); // Tạo router để định nghĩa các route

// Cấu hình Cloudinary với thông tin từ biến môi trường (.env file)
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name, // Tên cloud trên Cloudinary
  api_key: process.env.cloudinary_Config_api_key,       // API key để xác thực
  api_secret: process.env.cloudinary_Config_api_secret  // API secret để bảo mật
});

// ROUTE GET: Lấy danh sách tất cả categories "/"
router.get("/", async (req, res) => {
  try {
     // Nếu có all=true thì trả về toàn bộ category
     if (req.query.all === "true") {
      const categoryList = await Category.find();
      return res.status(200).json({ categoryList });
    }
    const page = parseInt(req.query.page) || 1 
    const perPage = 3
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts/perPage)
    if(page > totalPages){
      return res.status(404).json({message:"Page not found"})
    }

    // Tìm tất cả category trong database
    const categoryList = await Category.find()
      .skip((page-1) * perPage)
      .limit(perPage)
      .exec()
    
    // Kiểm tra nếu không tìm thấy dữ liệu
    if (!categoryList) {
      return res.status(500).json({ success: false });
    }
    
    // Trả về danh sách categories
    return res.status(200).json({
      "categoryList":categoryList,
      "totalPages":totalPages,
      "page":page

    })
  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
//ROUTER GET: "/:id"
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục với ID này!",
        success: false
      });
    }
    
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi khi tìm danh mục",
      success: false,
      error: error.message
    });
  }
});

// ROUTE POST: Tạo category mới với upload ảnh lên Cloudinary
//"/create"
router.post("/create", async (req, res) => {
  try {
    // Giới hạn chỉ upload tối đa 2 ảnh cùng lúc để tránh quá tải server
    const limit = pLimit(2);
    
    // Kiểm tra xem có ảnh được gửi lên không
    if (!req.body.images || !Array.isArray(req.body.images)) {
      return res.status(400).json({
        error: "Cần có ảnh và phải là một mảng",
        success: false
      });
    }

    // Tạo mảng các promise để upload từng ảnh lên Cloudinary
    const imagesToUpload = req.body.images.map((image) => {
      return limit(async () => {
        // Upload từng ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(image);
        return result; // Trả về thông tin ảnh đã upload
      });
    });

    // Chờ tất cả ảnh upload xong
    const uploadStatus = await Promise.all(imagesToUpload);
    
    // Lấy URL của các ảnh đã upload thành công
    const imgurl = uploadStatus.map((item) => {
      return item.secure_url; // URL bảo mật của ảnh trên Cloudinary
    });

    // Kiểm tra xem có ảnh nào upload thành công không
    if (!uploadStatus || uploadStatus.length === 0) {
      return res.status(500).json({
        error: "Không thể upload ảnh",
        success: false
      });
    }

    // Tạo đối tượng Category mới với dữ liệu từ request
    let category = new Category({
      name: req.body.name,    // Tên category
      images: imgurl,         // Mảng URL các ảnh đã upload
      subCat: req.body.subCat,
      color: req.body.color   // Màu sắc của category
    });

    // Lưu category vào database
    category = await category.save();
    
    // Trả về kết quả thành công
    res.status(201).json({
      success: true,
      category: category
    });

  } catch (error) {
    // Xử lý lỗi nếu có
    res.status(500).json({
      error: error.message,
      success: false
    });
  }
});

//ROUTER DELETE "/:id"
router.delete("/:id", async (req, res) => {
  try {
    const deleteUser = await Category.findByIdAndDelete(req.params.id);
    
    if (!deleteUser) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
        success: false
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công!",
      data: deleteUser // Tùy chọn: trả về category đã xóa
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa danh mục",
      success: false,
      error: error.message
    });
  }
});
//ROUTER PUT "/:id"
router.put("/:id", async (req, res) => {
  try {
    // console.log("Request params ID:", req.params.id); // Debug log
    // console.log("Request body:", req.body); // Debug log
    
    let imgurl = [];
    
    // Nếu có ảnh mới được gửi lên, thực hiện upload
    if (req.body.images && Array.isArray(req.body.images)) {
      // Giới hạn chỉ upload tối đa 2 ảnh cùng lúc để tránh quá tải server
      const limit = pLimit(2);
      
      // Tạo mảng các promise để upload từng ảnh lên Cloudinary
      const imagesToUpload = req.body.images.map((image) => {
        return limit(async () => {
          // Upload từng ảnh lên Cloudinary
          const result = await cloudinary.uploader.upload(image);
          return result;
        });
      });
      
      // Chờ tất cả ảnh upload xong
      const uploadStatus = await Promise.all(imagesToUpload);
      
      // Lấy URL của các ảnh đã upload thành công
      imgurl = uploadStatus.map((item) => {
        return item.secure_url;
      });
      
      // Kiểm tra xem có ảnh nào upload thành công không
      if (!uploadStatus || uploadStatus.length === 0) {
        return res.status(500).json({
          error: "Không thể upload ảnh",
          success: false
        });
      }
    }
    
    // Tạo object cập nhật động - KHÔNG bao gồm id từ body
    const updateData = {};
    
    // Chỉ thêm các field cần thiết
    if (req.body.name) {
      updateData.name = req.body.name;
    }
    
    if (req.body.subCat) {
      updateData.subCat = req.body.subCat;
    }
    
    if (req.body.color) {
      updateData.color = req.body.color;
    }
    
    // Chỉ thêm images nếu có upload ảnh mới
    if (imgurl.length > 0) {
      updateData.images = imgurl;
    }
    
    // console.log("Update data:", updateData); // Debug log
    
    // Kiểm tra xem có dữ liệu để cập nhật không
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Không có dữ liệu để cập nhật!",
        success: false
      });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Trả về document sau khi update
        runValidators: true // Chạy validation
      }
    );
    
    // console.log("Updated category:", category); // Debug log
    
    if (!category) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục để cập nhật!",
        success: false
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công!",
      data: category
    });
    
  } catch (error) {
    // console.error("Update error:", error); // Debug log
    res.status(500).json({
      message: "Lỗi khi cập nhật danh mục",
      success: false,
      error: error.message
    });
  }
});
// Xuất router để sử dụng trong file chính của ứng dụng
module.exports = router;