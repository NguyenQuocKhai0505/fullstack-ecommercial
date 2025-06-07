import { Link } from "react-router-dom"
import cartItem1 from "../../assets/images/cartItem1.webp"
import cartItem2 from "../../assets/images/cartItem2.webp"
import cartItem3 from "../../assets/images/cartItem3.webp"
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox"
import { IoClose } from "react-icons/io5";
import Button from '@mui/material/Button';
import { FaShoppingCart } from "react-icons/fa"
import { IoBagCheckOutline } from "react-icons/io5";
const Cart = () => {
    return (
        <>
            <section className="section mr-2 cartPage">
                <div className="container">
                    <h2 className="hd mb-3">Your Cart</h2>
                    <p>There are <b className="text-red">3</b> products in you cart</p>
                    <div className="row">
                        <div className="col-md-9 pr-5">
                            <div className="table-responsive">
                                <table className="table table-striped ">
                                    <thead>
                                        <tr>
                                            <th width="40%">Product</th>
                                            <th width="15%" className="text-center">Unit Price</th>
                                            <th width="20%" className="text-center">Quantity</th>
                                            <th width="15%" className="text-center">Subtotal</th>
                                            <th width="10%" className="text-center">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td width="40%" className="align-middle">
                                                <Link to="/product/1">
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={cartItem1} className="w-100"/>
                                                        </div>
                                                        <div className="info px-30 ml-3">
                                                            <h6>Xiaomi 14T Pro 12GB 512GB</h6>
                                                            <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly></Rating>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="20%" className="text-center align-middle">
                                                <QuantityBox/>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="10%" className="text-center align-middle"><span className="remove"><IoClose /></span></td>
                                        </tr>
                                          <tr>
                                            <td width="40%" className="align-middle">
                                                <Link to="/product/1">
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={cartItem1} className="w-100"/>
                                                        </div>
                                                        <div className="info px-30 ml-3">
                                                            <h6>Xiaomi 14T Pro 12GB 512GB</h6>
                                                            <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly></Rating>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="20%" className="text-center align-middle">
                                                <QuantityBox/>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="10%" className="text-center align-middle"><span className="remove"><IoClose /></span></td>
                                        </tr>
                                          <tr>
                                            <td width="40%" className="align-middle">
                                                <Link to="/product/1">
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={cartItem1} className="w-100"/>
                                                        </div>
                                                        <div className="info px-30 ml-3">
                                                            <h6>Xiaomi 14T Pro 12GB 512GB</h6>
                                                            <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly></Rating>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="20%" className="text-center align-middle">
                                                <QuantityBox/>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="10%" className="text-center align-middle"><span className="remove"><IoClose /></span></td>
                                        </tr>
                                                           <tr>
                                            <td width="40%" className="align-middle">
                                                <Link to="/product/1">
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={cartItem1} className="w-100"/>
                                                        </div>
                                                        <div className="info px-30 ml-3">
                                                            <h6>Xiaomi 14T Pro 12GB 512GB</h6>
                                                            <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly></Rating>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="20%" className="text-center align-middle">
                                                <QuantityBox/>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="10%" className="text-center align-middle"><span className="remove"><IoClose /></span></td>
                                        </tr>
                                                           <tr>
                                            <td width="40%" className="align-middle">
                                                <Link to="/product/1">
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={cartItem1} className="w-100"/>
                                                        </div>
                                                        <div className="info px-30 ml-3">
                                                            <h6>Xiaomi 14T Pro 12GB 512GB</h6>
                                                            <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly></Rating>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="20%" className="text-center align-middle">
                                                <QuantityBox/>
                                            </td>
                                            <td width="15%" className="text-center align-middle">250$</td>
                                            <td width="10%" className="text-center align-middle"><span className="remove"><IoClose /></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="col-md-3">
                            <div className="card shadow p-3 cartDetails">
                                <h4>CART TOTALS</h4>

                                <div className="d-flex align-items-center mb-3">
                                    <span>Subtotal</span>
                                    <span className="ml-auto text-red">$1000</span>
                                </div>

                                  <div className="d-flex align-items-center mb-3">
                                    <span>Shipping</span>
                                    <span className="ml-auto">$20.12</span>
                                </div>

                                  <div className="d-flex align-items-center mb-3">
                                    <span>Estimate for</span>
                                    <span className="ml-auto"><b>Vietnam</b></span>
                                </div>

                                  <div className="d-flex align-items-center mb-3">
                                    <span>Total</span>
                                    <span className="ml-auto text-red">$1020.12</span>
                                </div>
                                
                                <br/>
                                <Button className="btn-blue bg-red btn-lg btn-big btn-round ml-2"><IoBagCheckOutline />&nbsp; Proceed to Checkout</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Cart