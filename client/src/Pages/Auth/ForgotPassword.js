import React, { useState, useContext, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MyContext } from "../../App";

const ForgotPassword = () =>{
    const [email,setEmail] = useState("")
    const [loading,setLoading] = useState(false)
    const context = useContext(MyContext)
    const navigate = useNavigate()
    useEffect(() => {
        context.setisHeaderFooterShow(false);
      }, [context]);

    const { postData } = require("../../utils/api");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await postData("/api/auth/forgot-password", { email });
            if(res.success){
                toast.info(res.message || "If the email exists, please check your inbox!");
            }else{
                toast.error(res.message || "An error occurred!");
            }
        }catch(err){
            toast.error("An error occurred!");
        }
        setLoading(false);
    }
    return (
        <section className="section signInPage">
          <div className="shape-bottom">
            {/* Có thể tận dụng SVG từ SignIn */}
          </div>
          <div className="container">
            <div className="box card p-3 shadow border-0">
              <div className="text-center">
                <img src={Logo} className="banner" style={{ width: "100px", height: "100px" }} alt="Logo" />
              </div>
              <form className="mt-3" onSubmit={handleSubmit}>
                <h2>Forgot Password?</h2>
                <div className="form-group">
                  <TextField
                    id="forgot-password-email"
                    label="Email"
                    variant="standard"
                    required
                    type="email"
                    className="w-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="d-flex gap-3 mt-3 mb-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-blue col btn-lg btn-big"
                  >
                    {loading ? "Sending..." : "Send email to verify"}
                  </Button>
                  <Button
                    className="btn-lg btn-big"
                    variant="outlined"
                    onClick={() => navigate("/signIn")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      );
}
export default ForgotPassword