import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, Button, Radio, RadioGroup, FormControlLabel, Snackbar, Alert, Paper, Typography, Divider } from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy danh sách key sản phẩm đã chọn từ query string
  const selectedKeys = (() => {
    try {

      const params = new URLSearchParams(location.search);
      const keys = JSON.parse(decodeURIComponent(params.get("items") || "[]"));
      console.log('[DEBUG] selectedKeys from query:', keys);
      return keys;
    } catch {
      return [];
    }
  })();

  // Lấy cartItems từ localStorage (hoặc context/API)
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  console.log('[DEBUG] cartItems from localStorage:', cartItems);
  // Sửa: ép option về string khi tạo key để so sánh đúng
  const selectedProducts = cartItems.filter(item => {
    const key = item.product._id + '-' + String(item.option || '');
    console.log('[DEBUG] CartItem key:', key);
    return selectedKeys.includes(key);
  });
  console.log('[DEBUG] selectedProducts for checkout:', selectedProducts);

  // State cho form
  const [shipping, setShipping] = useState({ name: "", phone: "", address: "", email: "" });
  const [payment, setPayment] = useState("cod");
  const [discount, setDiscount] = useState(0);
  const [shippingFee] = useState(20.12);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const subtotal = selectedProducts.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const total = subtotal + shippingFee - discount;

  // Xác thực user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signIn");
  }, [navigate]);

  // Stripe payment
  const handleStripePayment = async () => {
    setLoading(true);
    const res = await fetch("/api/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: selectedProducts.map(item => ({
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        })),
        shipping,
        email: shipping.email
      })
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url; // Redirect sang Stripe
    } else {
      setSnackbar({ open: true, message: "Thanh toán Stripe thất bại!", severity: "error" });
    }
  };

  // Đặt hàng COD hoặc sau khi thanh toán PayPal thành công
  const handleOrder = async () => {
    if (!shipping.name || !shipping.phone || !shipping.address || !shipping.email) {
      setSnackbar({ open: true, message: "Vui lòng điền đầy đủ thông tin giao hàng!", severity: "error" });
      return;
    }
    if (payment === "stripe") {
      await handleStripePayment();
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
      setSnackbar({ open: true, message: "Đặt hàng thành công!", severity: "success" });
      localStorage.removeItem("cartItems");
      setTimeout(() => {
        navigate("/order-success");
      }, 1000);
    } else {
      setSnackbar({ open: true, message: data.error || "Có lỗi xảy ra!", severity: "error" });
    }
  };

  return (
    <div className="checkout-container">
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Paper elevation={3} className="checkout-block">
        <Typography variant="h6">Product</Typography>
        <Divider className="checkout-divider" />
        {selectedProducts.length === 0 ? (
          <Typography>No product selected.</Typography>
        ) : (
          selectedProducts.map(item => (
            <div className="checkout-product-row" key={item.product._id + '-' + (item.option || '')}>
              <img className="checkout-product-img" src={item.product.images?.[0] || "/default-image.png"} alt={item.product.name} />
              <div className="checkout-product-info">
                <Typography>{item.product.name} {item.option && <span>({item.option})</span>}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
              </div>
              <Typography className="checkout-product-price">{(item.product.price * item.quantity).toFixed(2)}$</Typography>
            </div>
          ))
        )}
      </Paper>
      <Paper elevation={3} className="checkout-block">
        <Typography variant="h6">Your shipping information</Typography>
        <Divider className="checkout-divider" />
        <form className="checkout-form">
          <TextField label="Full name" fullWidth required value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
          <TextField label="Phone number" fullWidth required value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
          <TextField label="Address" fullWidth required value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
          <TextField label="Email" fullWidth required value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} />
        </form>
      </Paper>
      <Paper elevation={3} className="checkout-block">
        <Typography variant="h6">Payment method</Typography>
        <Divider className="checkout-divider" />
        <RadioGroup row value={payment} onChange={e => setPayment(e.target.value)}>
          <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery (COD)" />
          <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
          <FormControlLabel value="stripe" control={<Radio />} label="International Card (Stripe)" />
        </RadioGroup>
      </Paper>
      {payment === "paypal" && (
        <Paper elevation={3} className="checkout-block">
          <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
            <PayPalButtons
              style={{ layout: "horizontal" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: total.toFixed(2) }
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                await actions.order.capture();
                setSnackbar({ open: true, message: "Your payment is successful!", severity: "success" });
                // Lưu đơn hàng vào database
                await handleOrder();
              }}
            />
          </PayPalScriptProvider>
        </Paper>
      )}
      <Paper elevation={3} className="checkout-block">
        <Typography variant="h6">Your order summary</Typography>
        <Divider className="checkout-divider" />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)}$</span>
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
      {payment !== "paypal" && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          onClick={handleOrder}
          className="checkout-btn"
        >
          {loading ? "Processing..." : "Your order is accepted/ Payment"}
        </Button>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
}
