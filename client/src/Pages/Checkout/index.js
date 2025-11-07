import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField, Button, Snackbar, Alert, Grid, Box, Paper
} from "@mui/material";
import { Modal, Typography } from "@mui/material";
import {loadStripe} from "@stripe/stripe-js"
import {Elements} from "@stripe/react-stripe-js"
import {PayPalScriptProvider,PayPalButtons} from "@paypal/react-paypal-js"
import StripeElementForm from "./StripeElementForm";
import StripeLogo from "../../assets/images/stripe.png";    // Cần tải logo stripe vào đúng path này
import PaypalLogo from "../../assets/images/paypal.png";    // Tải logo paypal
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openPayment,setOpenPayment] = useState(false)
  const [paymentType,setPaymentType] = useState("")

  // Lấy danh sách key sản phẩm đã chọn (từ query string do cart truyền sang)
  const selectedKeys = (() => {
    try {
      const params = new URLSearchParams(location.search);
      const keys = JSON.parse(decodeURIComponent(params.get("items") || "[]"));
      return keys;
    } catch {
      return [];
    }
  })();

  // Lấy cartItems từ localStorage (cập nhật sau khi thao tác ở cart)
  const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  // Chỉ lấy các item có key nằm trong selectedKeys
  const selectedProducts = cartItems.filter(item => {
    const key = item.product._id + '-' + String(item.option || '');
    return selectedKeys.includes(key);
  });

  // State cho form shipping
  const [shipping, setShipping] = useState({
    name: "", country: "", address: "", address2: "", city: "", state: "", zip: "", phone: "", email: ""
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Tính giá
  const subtotal = selectedProducts.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const shippingFee = 20.12; // tuỳ chỉnh nếu có shipping động
  const total = subtotal + shippingFee;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signIn");
  }, [navigate]);

  // Xử lý đặt hàng (dùng selectedProducts, shipping)
  const handleOrder = async (e) => {
    e.preventDefault();
    const required = ["name", "country", "address", "city", "state", "zip", "phone", "email"];
    if (required.some(f=>!shipping[f])) {
      setSnackbar({ open: true, message: "Please fill all required information!", severity: "error" });
      return;
    }
    if (selectedProducts.length === 0) {
      setSnackbar({ open: true, message: "No products selected!", severity: "error" });
      return;
    }
    setOpenPayment(true);
  };

  const afterOrderSuccess = () => {
    localStorage.removeItem("cartItems");
    setOpenPayment(false);
    setSnackbar({open:true, severity:"success", message:"Order success!"});
    setTimeout(() => navigate("/thank-you"), 1200);
  };

  return (
    <section className="section py-4 checkoutPage" style={{background:"#fafbfc"}}>
      <div className="container" style={{maxWidth:1200}}>
        <form onSubmit={handleOrder}>
          <div className="row">
            {/* FORM SHIPPING - TRÁI */}
            <div className="col-md-7">
              <h4 className="mb-4">BILLING DETAILS</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <TextField className="mb-3" label="Full Name*" name="name" required size="small" fullWidth value={shipping.name} onChange={e=>setShipping({...shipping,name:e.target.value})} />
                </div>
                <div className="col-md-6">
                  <TextField className="mb-3" label="Country*" name="country" required size="small" fullWidth value={shipping.country} onChange={e=>setShipping({...shipping,country:e.target.value})} />
                </div>
                <div className="col-12">
                  <TextField className="mb-3" label="Street address*" name="address" required size="small" fullWidth value={shipping.address} onChange={e=>setShipping({...shipping,address:e.target.value})} helperText="House number and street name"/>
                </div>
                <div className="col-12">
                  <TextField className="mb-3" label="Apartment, suite, unit, etc. (optional)" name="address2" size="small" fullWidth value={shipping.address2} onChange={e=>setShipping({...shipping,address2:e.target.value})}/>
                </div>
                <div className="col-md-6">
                  <TextField className="mb-3" label="Town / City*" name="city" required size="small" fullWidth value={shipping.city} onChange={e=>setShipping({...shipping,city:e.target.value})}/>
                </div>
                <div className="col-md-6">
                  <TextField className="mb-3" label="State / County*" name="state" required size="small" fullWidth value={shipping.state} onChange={e=>setShipping({...shipping,state:e.target.value})}/>
                </div>
                <div className="col-md-4">
                  <TextField className="mb-3" label="Postcode / ZIP*" name="zip" required size="small" fullWidth value={shipping.zip} onChange={e=>setShipping({...shipping,zip:e.target.value})} helperText="ZIP Code"/>
                </div>
                <div className="col-md-4">
                  <TextField className="mb-3" label="Phone Number*" name="phone" required size="small" fullWidth value={shipping.phone} onChange={e=>setShipping({...shipping,phone:e.target.value})}/>
                </div>
                <div className="col-md-4">
                  <TextField className="mb-3" label="Email Address*" name="email" required size="small" fullWidth value={shipping.email} onChange={e=>setShipping({...shipping,email:e.target.value})}/>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY - PHẢI */}
            <div className="col-md-5">
              <div className="card p-3" style={{borderRadius: "12px"}}>
                <h5 className="mb-3" style={{fontWeight:700}}>YOUR ORDER</h5>
                {/* Danh sách sản phẩm */}
                {selectedProducts.map(item => (
                  <div key={item.product._id + '-' + (item.option || '')} className="d-flex align-items-center mb-2">
                    <img src={item.product.images?.[0] || "/default-image.png"} alt={item.product.name} style={{width:48, height:48, borderRadius:8, objectFit:"cover", marginRight:12}}/>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight:600, lineHeight:1.1}}>{item.product.name}{item.option && ` (${item.option})`}</div>
                      <small style={{color:"#555"}}>x{item.quantity}</small>
                    </div>
                    <b style={{whiteSpace:"nowrap"}}>{(item.product.price * item.quantity).toLocaleString()}₫</b>
                  </div>
                ))}
                <hr/>
                <div className="d-flex justify-content-between"><span>Subtotal</span><span>{subtotal.toLocaleString()}₫</span></div>
                <div className="d-flex justify-content-between"><span>Shipping Fee</span><span>{shippingFee.toLocaleString()}₫</span></div>
                <div className="d-flex justify-content-between fw-bold my-2" style={{fontSize:18}}><span>Total</span><span>{total.toLocaleString()}₫</span></div>
                <Button type="submit" variant="contained" color="primary" size="large" className="mt-3 fw-bold" fullWidth disabled={loading}>
                  {loading ? "Processing..." : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
        </form>
            <Button
            variant="contained"
        <Modal
          open={openPayment}
          onClose={() => {setOpenPayment(false); setPaymentType("")}}
          sx={{
            '& .MuiBackdrop-root': {
              opacity: 0.24,
              zIndex: 2000,
              background: '#101828', // overlay nhẹ
            },
            '& .MuiPaper-root, & .MuiBox-root': {zIndex:2100},
          }}
          disableAutoFocus
          disableEnforceFocus
        >
          <Box sx={{width: 380, mx: 'auto', mt: '10vh', bgcolor:'white', p:3, borderRadius:3, boxShadow:3, maxWidth:'calc(100vw - 24px)'}}>
            {!paymentType && (
              <>
                <Typography variant="h6" fontWeight={700} mb={2}>Choose Payment Method</Typography>

                <Button
                  variant="outlined"
                  onClick={()=>setPaymentType("stripe")}
                  fullWidth sx={{ mb:2, justifyContent:'flex-start', pl:3, py:1.5, fontWeight:600, fontSize:17 }}
                >
                  <img src={StripeLogo} alt="stripe" style={{height:28, marginRight:16}}/>
                  Pay with Stripe
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=>setPaymentType("paypal")}
                  fullWidth sx={{ mb:2, justifyContent:'flex-start', pl:3, py:1.5, fontWeight:600, fontSize:17, bgcolor:'#0070ba', '&:hover': {bgcolor:'#005ea6'} }}
                >
                  <img src={PaypalLogo} alt="paypal" style={{height:28, marginRight:16}}/>
                  Pay with PayPal
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  onClick={async()=>{
                    setLoading(true)
                    //API tao don Shipcod
                    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`,{
                      method:"POST",
                      headers:{"Content-Type":"application/json","Authorization":`Bearer ${localStorage.getItem("token")}`},
                      body:JSON.stringify({
                        shipping,
                        items:selectedProducts.map(item=>({
                          product: item.product._id,
                          name:item.product.name,
                          option: item.option,
                          quantity: item.quantity,
                          price: item.product.price
                        })),
                        paymentMethod:"cod",
                        total,
                        shippingFee,
                        discount:0
                      })
                    })
                    setLoading(false)
                    if(res.ok){
                      afterOrderSuccess()
                    }else{
                      setSnackbar({open:true,severity:"error",message:"Create order failed"})
                    }
                  }}
                  disabled={loading}
                  fullWidth sx={{ justifyContent:'flex-start', pl:3, py:1.5, fontWeight:600, fontSize:17, bgcolor:'#5bb85d', '&:hover':{bgcolor:'#388e3c'} }}
                >
                  <AttachMoneyIcon sx={{fontSize:28, mr:1.5}} />
                  Cash on Delivery (Shipcod)
                </Button>
              </>
            )}
            {/* Stripe*/}
            {paymentType === "stripe" && (
              <Elements stripe={stripePromise}>
                  <StripeElementForm
                  shipping={shipping}
                  selectedProducts={selectedProducts}
                  total={total}
                  shippingFee={shippingFee}
                  onSuccess={()=>{
                    afterOrderSuccess()
                  }}/>
              </Elements>
            )}
            {/* Paypal */}
            {paymentType==="paypal" &&(
              <PayPalScriptProvider options={{"client-id":process.env.REACT_APP_PAYPAL_CLIENT_ID}}>
                <PayPalButtons
                style={{layout:"vertical"}}
                createOrder={(data,actions) => actions.order.create({
                  purchase_units:[{
                    amount:{value:total.toFixed(2)}
                  }]
                })}
                onApprove={async(data,actions)=>{
                  const details = await actions.order.capture()
                  //Tao don da thanh toan voi paypal
                  await fetch(`${process.env.REACT_APP_API_URL}/api/orders`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json", Authorization:"Bearer " + localStorage.getItem("token")},
                    body:JSON.stringify({
                      shipping,
                      items: selectedProducts.map(item =>({
                        product: item.product._id || item.product.id,
                        name: item.product.name,
                        option: item.option,
                        quantity: item.quantity,
                        price: item.product.price
                      })),
                      paymentMethod:"paypal",
                      paid:true,
                      total,
                      shippingFee,
                      paymentId: data.orderID,
                      paymentResult:details,
                      discount:0
                    })
                  })
                  afterOrderSuccess()
                }}
                >

                </PayPalButtons>
              </PayPalScriptProvider>
            )}
          </Box>
        </Modal>
        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={()=>setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </div>
    </section>
  );
}
