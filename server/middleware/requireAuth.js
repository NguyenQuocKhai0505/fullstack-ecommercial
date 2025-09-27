const jwt = require("jsonwebtoken")
const User = require("../models/user")
const requireAuth = (req,res,next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"No token provided"})
    }
    const token = authHeader.split(" ")[1]
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {...decoded,_id: decoded.id} 
        next()
    }catch(error){
        return res.status(401).json({message:"Unauthorized"})
    }
}
module.exports = requireAuth