import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, CircularProgress } from "@mui/material";

export default function StripeElementForm({ shipping, selectedProducts, total, shippingFee, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [localLoading, setLocalLoading] = useState(false);

  const handleStripePay = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    // Call BE tạo PaymentIntent → trả về clientSecret
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payment/stripe-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipping,
        items: selectedProducts.map(i=>({ name: i.product.name, price: i.product.price, quantity: i.quantity })),
        total
      })
    });
    const { clientSecret } = await res.json();
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });
    setLocalLoading(false);
    if(result.paymentIntent && result.paymentIntent.status === "succeeded") {
      onSuccess && onSuccess();
    }
  }

  return (
    <form onSubmit={handleStripePay} style={{marginTop:16}}>
      <CardElement />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={localLoading || !stripe} sx={{mt:2}}>
        {localLoading ? <CircularProgress size={22} color="inherit" /> : "Pay with card"}
      </Button>
    </form>
  );
}
