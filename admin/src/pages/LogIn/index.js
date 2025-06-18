
import { useContext, useEffect, useState } from "react"
import Logo from "../../assets/images/Logo.png"
import { MyContext } from "../../App"
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri"
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom'; // Thay đổi này
import Google from "../../assets/images/Google.png"
const Login =()=>{
    const context = useContext(MyContext)
    const [inputIndex,setInputIndex]= useState(null)
    const [isShowPassword, setisShowPassword] = useState(false)

    useEffect(()=>{
        context.setisHiddenSidebarAndHeader(true)
    },[])

    const focusInput = (index)=>{
        setInputIndex(index)
    }
    return(
        <>
        <section className="loginSection">
            <div className="loginBox">
                <div className="logo text-center">
                    <img src={Logo} style={{width: "120px", borderRadius:"30px"}} className="pb-2"/>
                    <h4 className="font-weight-bold">Login to Kmarket</h4>
                </div>

                <div className="wrapper mt-3 card border p-3">
                    <form>
                        {/* EMAIL */}
                        <div className={`form-group mt-3 position-relative ${inputIndex===0 && "focus"}`}>
                            <span className="icon"><IoIosMail/></span>
                            <input type = "text" className="form-control" placeholder="Enter your email"
                            onFocus={()=>focusInput(0)} onBlur={()=>setInputIndex(null)}
                            ></input>
                        </div>
                        {/* PASSWORD */}
                         <div className={`form-group mt-3 position-relative ${inputIndex===1 && "focus"}`}>
                            <span className="icon"><RiLockPasswordFill/></span>
                            <input type = {`${isShowPassword === true ? "text":"password"}`} className="form-control" placeholder="Enter your password"
                            onFocus={()=>focusInput(1)} onBlur={()=>setInputIndex(null)}
                            />
                        {/*SHOW PASSWORD  */}
                        <span className="toggleShowPassword"
                        onClick={()=>setisShowPassword(!isShowPassword)}>
                            {
                                isShowPassword ===true ?  <IoEyeSharp/> : <FaEyeSlash/>
                            }
                           
                        </span>
                        </div>
                        {/* Button-SignIn */}
                        <div className="form-group">
                            <Button className="btn-blue btn-lg w-100 btn-big">Sign In</Button>
                        </div>
                        {/* Forget Password */}
                        <div className="form-group text-center">
                            <Link to="/forgot-password" className="link">
                                FORGOT PASSWORD?
                            </Link>
                            <div className="d-flex align-items-center justify-content-center or mt-2">
                                <span className="line"></span>
                                <span className="txt">or</span>
                                <span className="line"></span>
                            </div>
                            <Button variant="outlined" className="mt-2 w-100 btn-lg loginWithGoogle btn-big">
                             <img src={Google} width ="25px"/>&nbsp;Sign in with Google
                            </Button>
                        </div>
                       
                    </form>
                     <span className="text-center">
                            Don't have an accounts?
                            <Link to ="/signUp" className="link color ml-3">Register</Link>
                    </span>
               </div>
                 
            </div>
            
        </section>
        </>
    )

}
export default Login