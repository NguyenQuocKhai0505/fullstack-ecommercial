const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Đăng nhập admin 

router.post("/signIn",async(req,res)=>{
    try{
        const {email,password}  = req.body
        const admin = await Admin.findOne({email})
        if(!admin){
            return res.status(400).json({ success: false, message: "Email không tồn tại" });
        }
        if(!admin.isVerified){
            return res.status(400).json({ success: false, message: "Tài khoản admin chưa được xác thực." });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(400).json({ success: false, message: "Mật khẩu không chính xác" });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
          success: true,
          message: 'Đăng nhập thành công',
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone
          }
        });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
      }
})
// (Tùy chọn) Xác thực email admin (nếu bạn muốn xác thực qua email)
router.get("/verify/:token", async (req, res) => {
    try {
      const { id } = jwt.verify(req.params.token, process.env.JWT_SECRET);
      await Admin.findByIdAndUpdate(id, { isVerified: true });
      res.send('Xác thực thành công! Bạn có thể đăng nhập.');
    } catch (error) {
      res.status(500).json({ success: false, message: 'Lỗi xác thực', error: error.message });
    }
  });
  
  module.exports = router;