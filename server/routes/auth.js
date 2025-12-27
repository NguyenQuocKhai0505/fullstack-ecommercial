const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sgMail = require('@sendgrid/mail');
const {OAuth2Client} = require("google-auth-library")
const clientGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
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
        // Sử dụng biến môi trường BACKEND_URL nếu có, fallback về localhost khi dev
        const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
        const url = `https://fullstack-ecommercial.vercel.app/verify/${emailToken}`;
        
        //Gửi email xác thực bằng SendGrid
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM,
            subject: 'Xác thực email',
            html: `
              <div style="font-family: Arial, sans-serif; color: #222;">
                <h2>Chào ${name},</h2>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Kmarket</b>.</p>
                <p>Vui lòng bấm vào nút bên dưới để xác thực tài khoản:</p>
                <a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;background:#0f288e;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin:16px 0;">Xác thực tài khoản</a>
                <p>Nếu nút không hoạt động, hãy copy và dán link sau vào trình duyệt:</p>
                <p><a href="${url}" target="_blank">${url}</a></p>
                <p style="color:#888;font-size:13px;">Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
              </div>
            `
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
//Quen mat khau - Yeu cau gui link dat lai mat khau
router.post("/forgot-password" , async(req,res) =>{
    const {email} = req.body
    const user = await User.findOne(email)

    if(!user) {
        return res.json({success:true, message:"Invalid email. Please check again"})
    }
    //Reset token 
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"15m"})
    user.resetToken = token
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000
    await user.save()

    //Gui mail
    const url = `https://fullstack-ecommercial.vercel.app/reset-password?token=${token}`;
    const msg = {
        to: email,
        from:process.env.EMAIL_FROM,
        subject: 'Email Verification',
        html: `
        <div style="font-family: Arial, sans-serif; color: #222;">
            <h2>Hello ${name},</h2>
            <p>Thank you for registering an account at <b>Kmarket</b>.</p>
            <p>Please click the button below to verify your account:</p>
            <a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;background:#0f288e;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin:16px 0;">Verify Account</a>
            <p>If the button does not work, copy and paste the link below into your browser:</p>
            <p><a href="${url}" target="_blank">${url}</a></p>
            <p style="color:#888;font-size:13px;">If you did not register for this account, please disregard this email.</p>
        </div>
        `
        }
        try{
            await sgMail.send(msg)
            res.json({success:true,message:"If valid email, please check your gmail letter"})
        }catch(error)
        {
            res.status(500).json({success: false, message:"Failed send mail", error: error.message})
        }
})
// ĐẶT LẠI MẬT KHẨU - Khi user nhận đc token từ mail
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      // Kiểm tra token còn hạn và hợp lệ
      if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now())
        return res.status(400).json({ success: false, message: 'Invalid Token' });
      // Hash và lưu password mới
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      res.json({ success: true, message: 'Change password succesfully!' });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Invalid Token' });
    }
});
//LOGIN WITH GOOGLE
router.post("/google-login",async(req,res) =>{
    const {tokenId} = req.body
    try{
        const ticket = await clientGoogle.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = ticket.getPayload()
        const {email, name} = payload

        //Check or create user 
        let user = await User.findOne({email})
        if(!user){
            user = new User({
                name,
                email,
                password:"GOOGLE_SIGNIN",
                isVerified: true,
                status: true
            })
            await user.save()
        }
        //Phat token login 
        const myToken = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
        res.json({
            success: true,
            message:"Google Login Successfully",
            token: myToken,
            user:{
                id:user._id,
                name: user.name,
                email: user.email,
                status: user.status
            }
        })
    }catch(error)
    {
        res.status(400).json({success: false, message:"Google Login Failed",error: error.message})
    }
})
module.exports = router;