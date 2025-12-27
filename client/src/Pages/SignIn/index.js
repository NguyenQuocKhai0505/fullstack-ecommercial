import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../../App"
import Logo from "../../assets/images/logo.png"
import TextField from '@mui/material/TextField';
import { Button} from "@mui/material";
import googleImg from "../../assets/images/googleImg.png"
import { Link } from 'react-router-dom';
import {postData} from "../../utils/api"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
const SignIn =()=>{
    
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const context = useContext(MyContext)

    useEffect(()=>{
        context.setisHeaderFooterShow(false)
    },[context])
    const navigate = useNavigate()
    //Submit form
    const handleSignIn = async (e)=>{
        e.preventDefault()
        setLoading(true)
        const res = await postData("/api/auth/signIn",{email,password})
        if(res.success){
            toast.success("Congratulation! You signed in successfully")
            // Nếu backend trả về token, lưu vào localStorage
            if(res.token) localStorage.setItem("token", res.token);
            context.setIsLogin(true)
        setTimeout(()=>{
            navigate("/")
        },1000)
        }else{
            toast.error(res.message || "Failed to sign in")
        }
        setLoading(false)
    }

    return(
      <section className="section signInPage">
          <div className="shape-bottom">
                <svg
                fill="#fff"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 1921 819.8"
                style={{enableBackground:"new 0 0 1921 819.8"}}
                >
                <path
                    className="st0"
                    d="M1921,413.1v406.7H0.5h0.4l1228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4
                    c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"
                />
                </svg>
        </div>

        <div className="container">
            <div className="box card p-3 shadow border-0">
                <div className="text-center">
                    <img src={Logo} className="banner" style={{width: "100px",height:"100px"}} alt="Logo"/>
                </div>

                <form className="mt-3" onSubmit={handleSignIn}>
                <h2>Sign In</h2>
                    <div className="form-group">
                         <TextField
                         id="email-field"
                         label="Email"
                         variant="standard"
                         required
                         type="email"
                         className="w-100"
                         value={email}
                         onChange={(e)=>setEmail(e.target.value)}
                         />
                    </div>
                     <div className="form-group">
                         <TextField
                         id="password-field"
                         label="Password"
                         variant="standard"
                         required
                         type="password"
                         className="w-100"
                         value={password}
                         onChange={(e)=>setPassword(e.target.value)}
                         />
                     </div>
                    
                  <div className="d-flex gap-3 mt-3 mb-3">
                        <Button
                        type="submit"
                        disabled={loading}
                        className="btn-blue col btn-lg btn-big mr-2"
                        >
                           {loading ? "loading..." : "Sign In"}
                        </Button>
                        
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <Button
                            className="btn-lg btn-big"
                            variant="outlined"
                            onClick={() => context.setisHeaderFooterShow(true)}
                            >
                            Cancel
                            </Button>
                        </Link>
                </div>

                  <Link to={"/forgot-password"}>  <button type="button" className="border-effect cursor mb-3" style={{background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline'}}>Forget Password?</button></Link>
                    

                   <p>Not Registered? <Link to="/signUp" className="border-effect cursor mb-3 ml-2">Sign Up</Link></p>

                   <h6 className="mt-3 text-center font-weight-bold">Or continue with your social account</h6>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        width="100%"
                        onSuccess={async (credentialResponse) => {
                        console.log('GoogleLogin clicked, credentialResponse:', credentialResponse);
                        const tokenId = credentialResponse.credential;
                        const res = await postData("/api/auth/google-login", { tokenId });
                        console.log('Response from backend Google Login:', res);
                        if (res.success) {
                            toast.success("Login with Google successfully");
                            if (res.token) localStorage.setItem("token", res.token);
                            context.setIsLogin(true);
                            setTimeout(() => { navigate("/"); }, 800);
                        } else {
                            toast.error(res.message || "Google Login Failed");
                        }
                        }}
                        onError={() => {
                        console.log('GoogleLogin Error');
                        toast.error("Google Login Failed");
                        }}
                    />
                    </div>

                </form>
                
                
            </div>
        </div>
      </section>
    )

}
export default SignIn