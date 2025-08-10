import { useContext, useEffect } from "react"
import { MyContext } from "../../App"
import Logo from "../../assets/images/logo.png"
import TextField from '@mui/material/TextField';
import { Button} from "@mui/material";
import googleImg from "../../assets/images/googleImg.png"
import { Link } from 'react-router-dom';
const SignUp =()=>{

    const context = useContext(MyContext)

    useEffect(()=>{
        context.setisHeaderFooterShow(false)
    },[context])

    return(
      <section className="section signUpPage">
          <div className="shape-bottom">
                <svg
                fill="#fff"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 1921 819.8"
                style={{enableBackground:"new 0 0 1921 819.8;"}}
                >
                <path
                    class="st0"
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

                <form className="mt-3">
                <h2>Sign Up</h2>
                <div  className="row">
                    <div className="col-md-6">
                         <div className="form-group">
                            <TextField label="Name" 
                            variant="standard"  required type="text" className="w-100"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                          <div className="form-group">
                            <TextField label="Phone No." 
                            variant="standard"  required type="number" className="w-100"/>
                         </div>
                    </div>
                </div>
                  
                    <div className="form-group">
                         <TextField id="standard-basic" label="Email" 
                         variant="standard"  required type="email" className="w-100"/>
                    </div>

                     <div className="form-group">
                         <TextField id="standard-basic" label="Password" 
                         variant="standard"  required type="password" className="w-100"/>
                    </div>
                    
                  <div className="d-flex align-items-center mt-3 mb-3">
                        <div className="row w-100">
                            
                            {/* Nút Create Account */}
                            <div className="col-md-6">
                            <Button className="btn-blue w-100 btn-lg btn-big">
                                Create Account
                            </Button>
                            </div>

                            {/* Nút Cancel */}
                            <div className="col-md-6">
                            <Link to="/signIn" className="d-block w-100">
                                <Button
                                className="btn-lg btn-big w-100 ml-3"
                                variant="outlined"
                                onClick={() => context.setisHeaderFooterShow(true)}
                                >
                                Cancel
                                </Button>
                            </Link>
                            </div>

                    </div>
                    </div>
                    

                   <p>Account Created?<Link to="/signIn" className="border-effect cursor mb-3 ml-2">Sign In</Link></p>

                   <h6 className="mt-3 text-center font-weight-bold">Or continue with your social account</h6>
                    <Button className="loginWithGoogle mt-2 mb-3" variant="outlined"><img src={googleImg} alt="Google"/>Sign In with Google</Button>
                </form>
                
                
            </div>
        </div>
      </section>
    )

}
export default SignUp