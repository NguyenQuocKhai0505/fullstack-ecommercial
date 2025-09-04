import React from "react"
import {Navigate} from "react-router-dom"
const ProtectedRoutes = ({children}) =>{
    const token = localStorage.getItem("token")
    if(!token){
        //Mếu chưa đăng nhập, render children chuyển về trang đăng nhập
        return <Navigate to="/signIn" replace/>
    }
    //Nếu đã đăng nhập, render children (tức là component bên trong)
    return children
}
export default ProtectedRoutes