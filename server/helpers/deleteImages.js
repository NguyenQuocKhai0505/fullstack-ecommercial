const cloudinary = require('cloudinary').v2;

//Cấu hình cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Helper function để xóa ảnh từ cloudinary
const deleteImagesFromCloudinary = async (imgUrl) => {
   // Trích xuất public_id từ URL Cloudinary
    // Ví dụ: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image.jpg
    // Cần lấy: folder/image
    try {
        const urlParts = imgUrl.split("/")
        const uploadIndex = urlParts.findIndex(part => part === "upload")
        if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
            console.log("Invalid Cloudinary URL format:", imgUrl)
            return false
        }
        //Lấy phần sau "upload/v1234567890/"
        const publicIdParts = urlParts.slice(uploadIndex + 2)
        //Bỏ phần extension (.jpg, .png, etc.)
        const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "")
        console.log("Deleting image with public_id:", publicId)
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("Cloudinary delete result:", result)
        return result.result === "ok"
    } catch (error) {
        console.error("Error deleting image from cloudinary:", error)
        return false
    }
}
//Helper function để xóa nhiều ảnh từ Cloudinary
const deleteMultipleImagesFromCloudinary = async (imgUrls) => {
    if (!imgUrls || !Array.isArray(imgUrls) || imgUrls.length === 0) {
        console.log("No images to delete or invalid input")
        return true
    }
    
    console.log(`Attempting to delete ${imgUrls.length} images from Cloudinary`)
    
    const deletePromises = imgUrls.map(url => deleteImagesFromCloudinary(url))
    const results = await Promise.allSettled(deletePromises)

    //Log kết quả xóa từng ảnh
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            console.log(`Image ${index + 1} deleted:`, result.value ? "Success" : "Failed")
        } else {
            console.log(`Image ${index + 1} deletion error:`, result.reason);
        }
    })
    
    //Trả về true nếu ít nhất một ảnh được xóa thành công
    const successCount = results.filter(result => 
        result.status === "fulfilled" && result.value
    ).length;
    
    console.log(`Successfully deleted ${successCount}/${imgUrls.length} images`)
    
    return successCount > 0
}
module.exports = {
    deleteImagesFromCloudinary,
    deleteMultipleImagesFromCloudinary
}