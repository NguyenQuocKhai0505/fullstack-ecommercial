import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Radio, RadioGroup, FormControlLabel, Snackbar, Alert, Paper, Typography, Divider } from "@mui/material";

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    // Lấy danh sách key sản phẩm đã chọn từ query string 
    const selectedKeys = (() => {
        try {
            const params = new URLSearchParams(location.search);
            return JSON.parse(decodeURIComponent(params.get("items") || "[]"));
        } catch {
            return [];
        }
    })();
    // Lấy cartItems từ localStorage (hoặc context/API)
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    // Lọc ra sản phẩm đã chọn
    const selectedProducts = cartItems.filter(item =>
        selectedKeys.includes(item.product._id + "-" + (item.option || ""))
    );
    // State cho giao hàng
    const [shipping, setShipping] = useState({ name: "", phone: "", address: "", email: "" });
    // State cho phương thức thanh toán
    const [payment, setPayment] = useState("cod");
    // State cho giảm giá, phí ship, loading, snackbar
    const [discount, setDiscount] = useState(0);
    const [shippingFee] = useState(20.12);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    // Tính tổng tiền
    const subTotal = selectedProducts.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const total = subTotal + shippingFee - discount;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/signIn");
    }, [navigate]);

    // Hàm xử lí đặt hàng
    const handleOrder = async () => {
        if (!shipping.name || !shipping.phone || !shipping.address || !shipping.email) {
            setSnackbar({ open: true, message: "Please fill delivery information fields!", severity: "error" });
            return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const orderData = {
            shipping,
            items: selectedProducts.map(item => ({
                product: item.product._id,
                name: item.product.name,
                option: item.option,
                quantity: item.quantity,
                price: item.product.price
            })),
            paymentMethod: payment,
            discount,
            shippingFee,
            total
        };
        const res = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            setSnackbar({ open: true, message: "You ordered successfully!", severity: "success" });
            localStorage.removeItem("cartItems"); // xóa giỏ hàng
            setTimeout(() => {
                navigate("/order-success"); // Chuyển sang trang cảm ơn
            }, 1000);
        } else {
            setSnackbar({ open: true, message: data.error || "There are some errors", severity: "error" });
        }
    };

    return (
        <div className="checkout-container">
            <Typography variant="h4" gutterBottom>Checkout</Typography>
            <Paper elevation={3} className="checkout-block">
                <Typography variant="h6">Products</Typography>
                <Divider className="checkout-divider" />
                {selectedProducts.length === 0 ? (
                    <Typography>No products selected.</Typography>
                ) : (
                    selectedProducts.map(item => (
                        <div className="checkout-product-row" key={item.product._id + '-' + (item.option || '')} style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
                            <img className="checkout-product-img" src={item.product.images?.[0] || "/default-image.png"} alt={item.product.name} style={{ width: 60, height: 60, objectFit: "cover", marginRight: 16 }} />
                            <div className="checkout-product-info" style={{ flex: 1 }}>
                                <Typography>{item.product.name} {item.option && <span>({item.option})</span>}</Typography>
                                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                            </div>
                            <Typography className="checkout-product-price">{(item.product.price * item.quantity).toFixed(2)}$</Typography>
                        </div>
                    ))
                )}
            </Paper>
            <Paper elevation={3} className="checkout-block">
                <Typography variant="h6">Delivery Information</Typography>
                <Divider className="checkout-divider" />
                <form className="checkout-form" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    <TextField label="Full Name" fullWidth required value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
                    <TextField label="Phone" fullWidth required value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                    <TextField label="Address" fullWidth required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                    <TextField label="Email" fullWidth required value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} />
                </form>
            </Paper>
            <Paper elevation={3} className="checkout-block">
                <Typography variant="h6">Payment Method</Typography>
                <Divider className="checkout-divider" />
                <RadioGroup row value={payment} onChange={e => setPayment(e.target.value)}>
                    <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                    <FormControlLabel value="stripe" control={<Radio />} label="Stripe" />
                </RadioGroup>
            </Paper>
            <Paper elevation={3} className="checkout-block">
                <Typography variant="h6">Order Summary</Typography>
                <Divider className="checkout-divider" />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span>
                    <span>{subTotal.toFixed(2)}$</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Shipping Fee:</span>
                    <span>{shippingFee.toFixed(2)}$</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", marginTop: 8 }}>
                    <span>Total:</span>
                    <span>{total.toFixed(2)}$</span>
                </div>
            </Paper>
            <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                onClick={handleOrder}
            >
                {loading ? "Processing..." : "Place Order / Pay"}
            </Button>
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </div>
    );
}