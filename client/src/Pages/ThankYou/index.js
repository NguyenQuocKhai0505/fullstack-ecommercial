import React from 'react';
import { Button, Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from "react-router-dom";

export default function ThankYou() {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: "65vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", p: 4 }}>
      <CheckCircleOutlineIcon sx={{ fontSize: 70, color: '#1976d2', mb: 2 }} />
      <Typography variant="h4" gutterBottom fontWeight={700} mb={2} sx={{ color: "#1976d2" }}>Thank You For Your Order!</Typography>
      <Typography variant="h6" mb={3} sx={{maxWidth:400, textAlign:"center"}}>
        Your order was placed successfully. We will notify you as soon as it ships. You can check your order status from the "My Orders" page.
      </Typography>
      <Button variant="contained" color="primary" size="large" sx={{mb:1}} onClick={()=>navigate("/")}>Back to Home</Button>
      <Button color="inherit" variant="outlined" size="medium" onClick={()=>navigate("/orders")}>View My Orders</Button>
    </Box>
  );
}
