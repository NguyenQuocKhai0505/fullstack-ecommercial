import React, { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postData } from "../../utils/api";
import Logo from "../../assets/images/logo.png";
import { MyContext } from "../../App";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const token = searchParams.get("token");

  useEffect(() => {
    context.setisHeaderFooterShow(false);
  }, [context]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await postData("/api/auth/reset-password", {
      token,
      newPassword,
    });
    if (res.success) {
      toast.success(res.message || "Password reset successfully!");
      setTimeout(() => navigate("/signIn"), 2000);
    } else {
      toast.error(res.message || "Reset password failed!");
    }
    setLoading(false);
  };

  return (
    <section 
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7474BF 0%, #348AC7 100%)"
      }}
    >
      <div className="card p-4 shadow" style={{ minWidth: 350, maxWidth: 380, borderRadius: 16 }}>
        <div className="text-center">
          <img src={Logo} alt="Logo" style={{ width: 70, marginBottom: 10 }} />
          <h3 style={{ fontWeight: 700, letterSpacing: 1 }}>Set New Password</h3>
          <p style={{ color: '#888', fontSize: 15 }}>
            Enter your new password below. After submitting, your password will be updated if your link is valid.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="standard"
            fullWidth
            required
            className="mb-3"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="standard"
            fullWidth
            required
            className="mb-3"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
