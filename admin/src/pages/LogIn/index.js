
import { useContext, useEffect, useState } from "react"
import Logo from "../../assets/images/Logo.png"
import { MyContext } from "../../App"
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri"
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom'; // Thay đổi này
import Google from "../../assets/images/Google.png"
import { postData } from "../../utils/api";

const Login =()=>{
    const context = useContext(MyContext)
    const [inputIndex,setInputIndex]= useState(null)
    const [isShowPassword, setisShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        context.setisHiddenSidebarAndHeader(true)
    },[])

    const focusInput = (index)=>{
        setInputIndex(index)
    }

    const handleSignIn = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            context.showSnackbar("Mật khẩu xác nhận không khớp!", "error");
            return;
        }
        setLoading(true);
        const res = await postData("/api/admin/signIn", { email, password });
        if (res.success) {
            if (res.token) {
                localStorage.setItem("token", res.token);
                context.setIsLogin(true);
                // Gọi API lấy thông tin admin
                fetch("/api/admin/me", {
                    headers: { Authorization: `Bearer ${res.token}` }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data && (data.admin || data.name)) {
                            context.setAdminInfo(data.admin || data);
                        }
                    });
            }
            context.showSnackbar("Đăng nhập thành công!", "success");
            navigate("/dashboard");
        } else {
            context.showSnackbar(res.message || "Đăng nhập thất bại!", "error");
        }
        setLoading(false);
    };

    return(
        <>
        <section className="loginSection">
            <div className="loginBox">
                <div className="logo text-center">
                    <img src={Logo} style={{width: "120px", borderRadius:"30px"}} className="pb-2" alt="Logo"/>
                    <h4 className="font-weight-bold">Login to Kmarket</h4>
                </div>
                <div className="wrapper mt-3 card border p-3">
                    <form onSubmit={handleSignIn}>
                        {/* EMAIL */}
                        <div className={`form-group mt-3 position-relative ${inputIndex===0 && "focus"}`}>
                            <span className="icon"><IoIosMail/></span>
                            <input type = "text" className="form-control" placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onFocus={()=>focusInput(0)} onBlur={()=>setInputIndex(null)}
                            required
                            />
                        </div>
                        {/* PASSWORD */}
                         <div className={`form-group mt-3 position-relative ${inputIndex===1 && "focus"}`}>
                            <span className="icon"><RiLockPasswordFill/></span>
                            <input type = {isShowPassword ? "text" : "password"} className="form-control" placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={()=>focusInput(1)} onBlur={()=>setInputIndex(null)}
                            required
                            />
                            {/*SHOW PASSWORD  */}
                            <span className="toggleShowPassword"
                            onClick={()=>setisShowPassword(!isShowPassword)}>
                                {
                                    isShowPassword ===true ?  <IoEyeSharp/> : <FaEyeSlash/>
                                }
                            </span>
                        </div>
                        {/* CONFIRM PASSWORD */}
                        <div className={`form-group mt-3 position-relative ${inputIndex===2 && "focus"}`}>
                            <span className="icon"><RiLockPasswordFill/></span>
                            <input type = {isShowConfirmPassword ? "text" : "password"} className="form-control" placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            onFocus={()=>focusInput(2)} onBlur={()=>setInputIndex(null)}
                            required
                            />
                            {/*SHOW CONFIRM PASSWORD  */}
                            <span className="toggleShowPassword"
                            onClick={()=>setIsShowConfirmPassword(!isShowConfirmPassword)}>
                                {
                                    isShowConfirmPassword ===true ?  <IoEyeSharp/> : <FaEyeSlash/>
                                }
                            </span>
                        </div>
                        {/* Button-SignIn */}
                        <div className="form-group">
                            <Button className="btn-blue btn-lg w-100 btn-big" type="submit" disabled={loading}>
                                {loading ? "Login..." : "Sign In"}
                            </Button>
                        </div>
                        {/* Forget Password */}
                        <div className="form-group text-center">
                            <Link to="/forgot-password" className="link">
                                FORGOT PASSWORD?
                            </Link>
                        </div>
                    </form>
               </div>
            </div>
        </section>
        </>
    )
}
export default Login