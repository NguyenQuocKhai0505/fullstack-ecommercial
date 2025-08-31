const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
require("dotenv").config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Đăng kí tài khoản
router.post("/signUp", async(req,res)=>{
    console.log("[signUp] Nhận request:", req.body);
    try{
        const {name,email,password, phone}= req.body
        //Kiểm tra email đã tồn tại hay chua
        const existingUser = await User.findOne({email})
        if(existingUser) {
            console.log("[signUp] Email đã tồn tại:", email);
            return res.status(400).json({success:false,message:"Email đã tồn tại"})
        }
        //Hash Password 
        const hashedPassword = await bcrypt.hash(password,10)
        //Tạo user mới với verified:false 
        const newUser = new User({name,email,phone,password:hashedPassword,isVerified:false,status:false})
        await newUser.save()
        console.log("[signUp] Đã lưu user mới:", newUser._id);

        //Tạo token xác thực email
        const emailToken = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        const url = `http://localhost:4000/api/auth/verify/${emailToken}`;
        
        //Gửi email xác thực bằng SendGrid
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Xác thực email',
            html: `Bấm vào <a href="${url}">đây</a> để xác thực tài khoản của bạn.`
        };
        try {
            await sgMail.send(msg);
            console.log("[signUp] Đã gửi email xác thực tới:", email);
        } catch (mailError) {
            console.error("[signUp] Lỗi gửi email:", mailError);
            return res.status(500).json({ success: false, message: 'Lỗi gửi email', error: mailError.message });
        }
        res.status(201).json({ success: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.' });
    }catch(error){
        console.error("[signUp] Lỗi server:", error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
})
//Xác thực email
router.get("/verify/:token",async(req,res)=>{
    console.log("[verify] Nhận request xác thực với token:", req.params.token);
    try{
        const {id} = jwt.verify(req.params.token,process.env.JWT_SECRET)
        await User.findByIdAndUpdate(id,{isVerified:true,status:true})
        console.log("[verify] Xác thực thành công cho user:", id);
        res.send('Xác thực thành công! Bạn có thể đăng nhập.');
    }catch(error){
        console.error("[verify] Lỗi xác thực:", error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
})
//Đăng nhập
router.post("/signIn", async(req,res)=>{
    console.log("[signIn] Nhận request:", req.body);
    try{
        const {email,password} = req.body
        //Tìm user theo email
        const user = await User.findOne({email})
        if(!user) {
            console.log("[signIn] Email không tồn tại:", email);
            return res.status(400).json({success:false,message:"Email không tồn tại"})
        }
        //Kiểm tra đã xác thực email hay chưa
        if (!user.isVerified) {
            console.log("[signIn] Email chưa xác thực:", email);
            return res.status(400).json({ success: false, message: "Bạn cần xác thực email trước khi đăng nhập." });
        }
        //So sánh password 
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) {
            console.log("[signIn] Mật khẩu không chính xác cho email:", email);
            return res.status(400).json({success:false,message:"Mật khẩu không chính xác"})
        }
        
        //Tạo JWT token đăng nhập
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log("[signIn] Đăng nhập thành công cho user:", user._id);
        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status
            }
          });
    }catch(error){
        console.error("[signIn] Lỗi server:", error);
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
})
module.exports = router;