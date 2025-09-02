
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
import { FaUser } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaHome } from "react-icons/fa";
const SignUp = () =>{

    const context = useContext(MyContext)
    const [inputIndex,setInputIndex]= useState(null)
    const [isShowPassword, setisShowPassword] = useState(false)
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false)
    
    useEffect(() => {
      context.setisHeaderFooterShow(false)
    }, [context]);

    const focusInput = (index)=>{
        setInputIndex(index)
    }
    return(
        <>
        <section className="loginSection signUpSection">
            <div className="row">

                <div className="col-md-8 Welcome">
                        <h2>Welcome to Kmarket - Your One-Stop Shop for Everyday Essentials!</h2>
                        <p>Discover a curated selection of fresh foods, beauty products, and electronics – all in one place.</p>
                        <ul>
                            <li> Quality you can trust </li>
                            <li> Fast nationwide delivery </li>
                            <li> Great deals every day </li>
                        </ul>
                        <div className="w-100 mt-2">
                           <Link to="/">
                            <Button className="btn-blue btn-lg btn-big"><FaHome />&nbsp; Go To Home</Button>
                           </Link>
                        </div>
                        
                </div>

                 <div className="col-md-4">
                        <div className="loginBox">
                <div className="logo text-center">
                    <img src={Logo} style={{width: "120px", borderRadius:"30px"}} className="pb-2" alt="Logo"/>
                    <h4 className="font-weight-bold">Register a new account</h4>
                </div>

                <div className="wrapper mt-3 card border p-3">
                    <form>
                         {/* USER NAME */}
                        <div className={`form-group mt-3 position-relative ${inputIndex===0 && "focus"}`}>
                            <span className="icon"><FaUser/></span>
                            <input type = "text" className="form-control" placeholder="Enter your name"
                            onFocus={()=>focusInput(0)} onBlur={()=>setInputIndex(null)}
                            ></input>
                        </div>
                        {/* EMAIL */}
                        <div className={`form-group mt-3 position-relative ${inputIndex===1 && "focus"}`}>
                            <span className="icon"><IoIosMail/></span>
                            <input type = "text" className="form-control" placeholder="Enter your email"
                            onFocus={()=>focusInput(1)} onBlur={()=>setInputIndex(null)}
                            ></input>
                        </div>
                        {/* PASSWORD */}
                         <div className={`form-group mt-3 position-relative ${inputIndex===2 && "focus"}`}>
                            <span className="icon"><RiLockPasswordFill/></span>
                            <input type = {`${isShowPassword === true ? "text":"password"}`} className="form-control" placeholder="Enter your password"
                            onFocus={()=>focusInput(2)} onBlur={()=>setInputIndex(null)}
                            />
                        {/*SHOW PASSWORD  */}
                        <span className="toggleShowPassword"
                        onClick={()=>setisShowPassword(!isShowPassword)}>
                            {
                                isShowPassword ===true ?  <IoEyeSharp/> : <FaEyeSlash/>
                            }
                           
                        </span>
                        </div>
                        {/*COFIRM PASSWORD */}
                         <div className={`form-group mt-3 position-relative ${inputIndex===3 && "focus"}`}>
                            <span className="icon"><IoShieldCheckmark/></span>
                            <input type = {`${isShowConfirmPassword === true ? "text":"password"}`} className="form-control" placeholder="Confirm your password"
                            onFocus={()=>focusInput(3)} onBlur={()=>setInputIndex(null)}
                            />
                        {/*SHOW PASSWORD  */}
                        <span className="toggleShowPassword"
                        onClick={()=>setisShowConfirmPassword(!isShowConfirmPassword)}>
                            {
                                isShowConfirmPassword ===true ?  <IoEyeSharp/> : <FaEyeSlash/>
                            }
                           
                        </span>
                        </div>
                        {/* Agree */}
                          <FormControlLabel control={<Checkbox />} label="I agree to the all Terms and Conditions" />
                        {/* Button-SignIn */}
                        <div className="form-group">
                            <Button className="btn-blue btn-lg w-100 btn-big">Sign Up</Button>
                        </div>
                        {/* Forget Password */}
                        <div className="form-group text-center">
                            <div className="d-flex align-items-center justify-content-center or mt-2">
                                <span className="line"></span>
                                <span className="txt">or</span>
                                <span className="line"></span>
                            </div>
                            <Button variant="outlined" className="mt-2 w-100 btn-lg loginWithGoogle btn-big">
                             <img src={Google} width ="25px"/>&nbsp;Sign up with Google
                            </Button>
                        </div>
                       
                    </form>
                     <span className="text-center">
                             Already have account?
                            <Link to ="/login" className="link color ml-3">Log in</Link>
                    </span>
               </div>
                 
            </div>
            </div>
            </div>
        
        </section>
        </>
    )
}
export default SignUp