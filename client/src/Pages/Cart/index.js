import { Link } from "react-router-dom"
import cartItem1 from "../../assets/images/cartItem1.webp"
// import cartItem2 from "../../assets/images/cartItem2.webp"
// import cartItem3 from "../../assets/images/cartItem3.webp"
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox"
import { IoClose } from "react-icons/io5";
import Button from '@mui/material/Button';
// import { FaShoppingCart } from "react-icons/fa"
import { IoBagCheckOutline } from "react-icons/io5";
import { useState } from "react";
import { getCartAPI, addToCartAPI, removeFromCartAPI } from "../../utils/api";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useContext } from "react";
import { MyContext } from "../../App";
const Cart = () => {
    const [cart,setCart] = useState({items:[]})
    const context = useContext(MyContext);
    //Lay cart tu backend khi load trang
    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token){
            getCartAPI(token).then(cart => {
                setCart(cart);
                if (context.setCartCount) context.setCartCount(cart.items ? cart.items.length : 0);
            })
        }
    },[])
    //Tang giam so luong
    const updateQuantity = async(productId,newQuantity) =>{
        const token = localStorage.getItem("token")
        if(newQuantity < 1) return 
        const res = await addToCartAPI(productId,newQuantity,token)
        if(res.message){
            toast.error(res.message)
        }else{
            setCart(res)
            if (context.setCartCount) context.setCartCount(res.items ? res.items.length : 0);
        }
    }
    //Xoa san pham
    const removeFromCart = async(productId) =>{
        const token = localStorage.getItem("token")
        const res = await removeFromCartAPI(productId,token)
        setCart(res)
        if (context.setCartCount) context.setCartCount(res.items ? res.items.length : 0);
    }
    //Tinh tong tien
    const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shipping = 20.12
    const total = subtotal + shipping
    return (
        <section className="section mr-2 cartPage">
          <div className="container">
            <h2 className="hd mb-3">Your Cart</h2>
            <p>There are <b className="text-red">{cart.items.length}</b> products in your cart</p>
            <div className="row">
              <div className="col-md-9 pr-5">
                <div className="table-responsive">
                  <table className="table table-striped ">
                    <thead>
                      <tr>
                        <th width="40%">Product</th>
                        <th width="10%" className="text-center">Size</th>
                        <th width="15%" className="text-center">Unit Price</th>

                        <th width="20%" className="text-center">Quantity</th>
                        <th width="15%" className="text-center">Subtotal</th>
                        <th width="10%" className="text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.items.map(item => (
                        <tr key={item.product._id + '-' + (item.size || '')}>
                          <td width="40%" className="align-middle">
                            <div className="d-flex align-items-center cartItemimgWrapper">
                              <div className="imgWrapper">
                                <img
                                  src={item.product.images && item.product.images[0] ? item.product.images[0] : "/default-image.png"}
                                  className="w-100"
                                  alt="Cart item"
                                  style={{ width: 60, height: 60, objectFit: "cover" }}
                                />
                              </div>
                              <div className="info px-30 ml-3">
                                <h6>{item.product.name}</h6>
                              </div>
                            </div>
                          </td>
                          <td width="10%" className="text-center align-middle">{item.size || '-'}</td>
                          <td width="15%" className="text-center align-middle">{item.product.price}$</td>
                          <td width="20%" className="text-center align-middle">
                            <div className="quantityDrop d-flex align-items-center">
                              <Button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</Button>
                              <input
                                type="text"
                                value={item.quantity}
                                style={{ width: 40, textAlign: "center" }}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 1;
                                  updateQuantity(item.product._id, val);
                                }}
                              />
                              <Button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</Button>
                            </div>
                          </td>
                          <td width="15%" className="text-center align-middle">{item.product.price * item.quantity}$</td>
                          <td width="10%" className="text-center align-middle">
                            <span className="remove" onClick={() => removeFromCart(item.product._id)}>
                              <IoClose />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow p-3 cartDetails">
                  <h4>CART TOTALS</h4>
                  <div className="d-flex align-items-center mb-3">
                    <span>Subtotal</span>
                    <span className="ml-auto text-red">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span>Shipping</span>
                    <span className="ml-auto">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span>Estimate for</span>
                    <span className="ml-auto"><b>Vietnam</b></span>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <span>Total</span>
                    <span className="ml-auto text-red">${total.toFixed(2)}</span>
                  </div>
                  <br/>
                  <Button className="btn-blue bg-red btn-lg btn-big btn-round ml-2">
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    };
export default Cart