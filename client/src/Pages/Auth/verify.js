import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CircularProgress, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { MyContext } from "../../App";
const Verify = () =>{
    const {token} = useParams()
    const [status, setStatus] = useState("loading")
    const context = useContext(MyContext)
    useEffect(()=>{
      context.setisHeaderFooterShow(false)
  },[context])
    useEffect(() => {
        const verifyEmail = async () => {
          try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify/${token}`);
            if (res.ok) {
              setStatus("success");
            } else {
              setStatus("error");
            }
          } catch {
            setStatus("error");
          }
        };
        verifyEmail();
      }, [token]);
    return(
        <div style ={{minHeight:"60vh", display:"flex",flexDirection:"column",alignItems:"center", justifyContent:"center"}}>
            {status ==="loading" && <CircularProgress color="primary"/>}
            {status ==="success" && (
                <>
                <CheckCircleIcon style={{fontSize:"100px",color:"green"}}/>
                <h2 style={{color:"green"}}>Congratulations!</h2>
                <p>Your email has been verified successfully.</p>
                <Button variant="contained" color="primary" component={Link} to="/signIn">Sign In</Button>
                </>
            )}
            {status === "error" && (
            <>
            <ErrorIcon style={{ fontSize: 80, color: "#d32f2f" }} />
            <h2 style={{ color: "#d32f2f" }}>Xác thực thất bại!</h2>
            <p>Link xác thực không hợp lệ hoặc đã hết hạn.</p>
            <Button variant="contained" color="primary" component={Link} to="/signUp">Đăng ký lại</Button>
            </>
        )}
        </div>
    )
}
export default Verify