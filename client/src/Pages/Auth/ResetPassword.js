import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postData } from "../../utils/api";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

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
    <section className="section signInPage">
      <div className="container">
        <div className="box card p-3 shadow border-0">
          <form className="mt-3" onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <div className="form-group">
              <TextField
                label="New Password"
                variant="standard"
                type="password"
                className="w-100"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group mt-2">
              <TextField
                label="Confirm Password"
                variant="standard"
                type="password"
                className="w-100"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="d-flex gap-3 mt-3 mb-3">
              <Button
                type="submit"
                disabled={loading}
                className="btn-blue col btn-lg btn-big"
              >
                {loading ? "Resetting..." : "Reset Password"}
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
};

export default ResetPassword;

