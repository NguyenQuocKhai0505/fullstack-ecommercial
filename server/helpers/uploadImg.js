// Import các thư viện cần thiết
const cloudinary = require("cloudinary").v2;
const { default: pLimit } = require("p-limit");

// Cấu hình Cloudinary với thông tin từ biến môi trường (.env file)
cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_api_key,
  api_secret: process.env.cloudinary_Config_api_secret
});

/**
 * Upload nhiều ảnh lên Cloudinary
 * @param {Array} images - Mảng các ảnh cần upload (base64 hoặc URL)
 * @param {number} limitCount - Số lượng ảnh upload đồng thời (mặc định: 2)
 * @returns {Promise<Array>} - Mảng URL các ảnh đã upload thành công
 */
const uploadMultipleImages = async (images, limitCount = 2) => {
  try {
    // Kiểm tra input
    if (!images || !Array.isArray(images)) {
      throw new Error("Images phải là một mảng");
    }

    if (images.length === 0) {
      throw new Error("Mảng images không được rỗng");
    }

    // Giới hạn số lượng request đồng thời
    const limit = pLimit(limitCount);
    
    // Tạo mảng các promise để upload từng ảnh lên Cloudinary
    const imagesToUpload = images.map((image) => {
      return limit(async () => {
        // Upload từng ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(image);
        return result;
      });
    });

    // Chờ tất cả ảnh upload xong
    const uploadStatus = await Promise.all(imagesToUpload);
    
    // Lấy URL của các ảnh đã upload thành công
    const imgUrls = uploadStatus.map((item) => {
      return item.secure_url;
    });

    // Kiểm tra kết quả
    if (!uploadStatus || uploadStatus.length === 0) {
      throw new Error("Không thể upload ảnh");
    }

    return imgUrls;

  } catch (error) {
    throw new Error(`Lỗi upload ảnh: ${error.message}`);
  }
};

/**
 * Upload một ảnh lên Cloudinary
 * @param {string} image - Ảnh cần upload (base64 hoặc URL)
 * @returns {Promise<string>} - URL ảnh đã upload thành công
 */
const uploadSingleImage = async (image) => {
  try {
    if (!image) {
      throw new Error("Image không được rỗng");
    }

    const result = await cloudinary.uploader.upload(image);
    return result.secure_url;

  } catch (error) {
    throw new Error(`Lỗi upload ảnh: ${error.message}`);
  }
};

/**
 * Xóa ảnh trên Cloudinary
 * @param {string} publicId - Public ID của ảnh cần xóa
 * @returns {Promise<Object>} - Kết quả xóa ảnh
 */
const deleteImage = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID không được rỗng");
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;

  } catch (error) {
    throw new Error(`Lỗi xóa ảnh: ${error.message}`);
  }
};

/**
 * Lấy Public ID từ Cloudinary URL
 * @param {string} url - URL của ảnh trên Cloudinary
 * @returns {string} - Public ID
 */
const getPublicIdFromUrl = (url) => {
  try {
    if (!url) {
      throw new Error("URL không được rỗng");
    }

    // Tách public ID từ URL Cloudinary
    // VD: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
    // Public ID sẽ là: sample
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    
    return publicId;

  } catch (error) {
    throw new Error(`Lỗi lấy Public ID: ${error.message}`);
  }
};

module.exports = {
  uploadMultipleImages,
  uploadSingleImage,
  deleteImage,
  getPublicIdFromUrl
};