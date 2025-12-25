import React, { useState, useContext, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const context = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postData("/api/auth/forgot-password", { email });
      if (res.success) {
        toast.info(res.message || "If email exists, we have sent reset instructions to your inbox!");
      } else {
        toast.error(res.message || "An error occurred!");
      }
    } catch (err) {
      toast.error("An error occurred!");
    }
    setLoading(false);
  };

  return (
    <section 
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7474BF 0%, #348AC7 100%)",
      }}
    >
      <div
        className="card p-4 shadow"
        style={{
          minWidth: 350,
          maxWidth: 380,
          borderRadius: 16,
          margin: "auto",
        }}
      >
        <div className="text-center">
          <img src={Logo} alt="Logo" style={{ width: 70, marginBottom: 10 }} />
          <h3 className="mb-2" style={{ fontWeight: 700, letterSpacing: 1 }}>Forgot Password?</h3>
          <p className="mb-3" style={{ color: "#888" }}>
            Enter your email. We’ll send you a link to reset your password.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            type="email"
            label="Email"
            variant="standard"
            required
            fullWidth
            className="mb-3"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button
            variant="text"
            fullWidth
            style={{ marginTop: 10, color: "#555" }}
            onClick={() => navigate("/signIn")}
          >
            Cancel
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
