import ProductZoom from "../../Components/ProductZoom"
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';
import {useWishlist} from "../../contexts/WishlistContext"
import { getWishlistAPI, addToWishlistAPI, removeFromWishlistAPI } from "../../utils/api.js";
import RelatedProducts from "./RelatedProducts/index"
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { addToCartAPI } from "../../utils/api";
import { toast } from "react-toastify";
import { MyContext } from "../../App";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomerReview from "../../Components/Customer Review/index"
const ProductDetails =()=>{
    const [activeTabs, setActiveTabs] = useState(null)
    const [activeRam, setActiveRam] = useState(null)
    const [activeWeight, setActiveWeight] = useState(null)
    const {id} = useParams()
    const [productData, setProductData] = useState([])
    const context = useContext(MyContext)
    const navigate = useNavigate()
    useEffect(()=>{
        fetchDataFromApi(`/api/products/${id}`).then(res=>{
            setProductData(res)
        })
    },[id])
    useEffect(()=>{
        if(!productData._id) return 
        let viewed = JSON.parse(localStorage.getItem("recentlyViewed")|| "[]")
        //Xoa neu da co
        viewed = viewed.filter(id=>id !== productData._id)
        //Them moi nhat len tren dau
        viewed.unshift(productData._id)
        //Gioi han so luong
        if(viewed.length > 10) viewed = viewed.slice(0,10)
        localStorage.setItem("recentlyViewed",JSON.stringify(viewed))
    },[productData._id])
    const isActiveRam = (index) => {
        setActiveRam(index)
    }
    const isActiveWeight = (index) => {
        setActiveWeight(index)
    }
    const [quantity, setQuantity] = useState(1); // Thêm state quản lý số lượng
    const [selectedSize, setSelectedSize] = useState(null);
    const handleAddToCart = async()=>{
        //Kiem tra dang nhap
        if(!context.isLogin){
            toast.error("You need to login first!")
            navigate("/signIn")
            return
        }
    let option = null
    if(productData.productSize && selectedSize) option = selectedSize
    else if (productData.productRam && activeRam !== null) option = productData.productRam[activeRam]
    else if (productData.productWeight && activeWeight !== null) option = productData.productWeight[activeWeight]

  // Gọi API, truyền thêm các thuộc tính nếu backend hỗ trợ
        const token = localStorage.getItem("token")
        // Gọi API backend với số lượng và size đã chọn
        const res = await addToCartAPI(productData._id, quantity, token, option)
        if(res.message){
            toast.error(res.message)
        }else{
            toast.success("You added this product to cart successfully")
        }
    }
    const {wishlist,setWishlist} = useWishlist()
    const isWishlisted = wishlist.some(p => p._id === productData._id)
    const handleWishlist = async()=>{
        const token = localStorage.getItem("token")
        if(!token){
            toast.error("You need to login first!")
            return
        }
        if(isWishlisted){
            await removeFromWishlistAPI(productData._id,token)
            const updated = await getWishlistAPI(token)
            setWishlist(updated || [])
            toast.info("Removed from wishlist!")
        }else{
            await addToWishlistAPI(productData._id,token)
            const updated = await getWishlistAPI(token)
            setWishlist(updated || [])
            toast.info("Added to wishlist!")
        }
    }
    return(
        <>
           <section className="productDetails section">
            <div className="container">
                <div className="row">
                
                {/* Cột bên trái: ảnh sản phẩm */}
                <div className="col-md-4 pl-5">
                    <ProductZoom product={productData} />
                </div>

                {/* Cột bên phải: thông tin sản phẩm */}
                <div className="col-md-7 pl-5 pr-5">
                    <h2 className="hd text-capitalize">{productData.name}</h2>
                    <ul className="list list-inline d-flex align-items-center">
                    <li className="list-inline-item">
                        <div className="d-flex align-items-center ml-3">
                        <span className="text-light mr-2">Brands:</span>
                        <span>{productData.brand}</span>
                        </div>
                    </li>

                    <li className="list-inline-item d-flex align-items-center">
                      <Rating  name="read-only" value={Number(productData.rating)} precision={0.5} size="small" readOnly />
                     </li>
                    </ul>

                    <div className="d-flex info ml-3 mb-4">
                        <span className="oldPrice">${productData.oldPrice}</span>
                        <span className="newPrice text-danger ml-2">${productData.price}</span>
                    </div>

                    <span className="badge btn-success ml-3 mb-3">{productData.countInStock > 0 ? "IN STOCK" : "OUT STOCK"}</span>
                    <p className="mt-2 ml-3 mb-3" style={{fontWeight:"600", fontSize:"16px", color:"#333"}}>{productData.description}</p>
                    {/* Render product RAM */}
                    {productData.productRam && productData.productRam.length > 0 && (
                        <div className="productSize d-flex align-items-center ml-3 mb-3">
                            <span className="spec-label mr-3">RAM:</span>
                            <ul className="list list-inline mb-0">
                                {productData.productRam.map((ram, idx) => (
                                    <li className="list-inline-item" key={idx}>
                                        <button 
                                            className={`tag ${activeRam === idx ? "active" : ""}`} 
                                            onClick={() => isActiveRam(idx)}
                                            type="button"
                                        >
                                            {ram}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Render product Size */}
                    {productData.productSize && productData.productSize.length > 0 && (
                        <div className="productSize d-flex align-items-center ml-3 mb-3">
                            <span className="spec-label mr-3">Size:</span>
                            <ul className="list list-inline mb-0">
                                {productData.productSize.map((size, idx) => (
                                    <li className="list-inline-item" key={idx}>
                                        <button 
                                            className={`tag ${selectedSize === size ? "active" : ""}`} 
                                            onClick={() => setSelectedSize(size)}
                                            type="button"
                                        >
                                            {size}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Render product Weight */}
                    {productData.productWeight && productData.productWeight.length > 0 && (
                        <div className="productSize d-flex align-items-center ml-3 mb-3">
                            <span className="spec-label mr-3">Weight:</span>
                            <ul className="list list-inline mb-0">
                                {productData.productWeight.map((weight, idx) => (
                                    <li className="list-inline-item" key={idx}>
                                        <button 
                                            className={`tag ${activeWeight === idx ? "active" : ""}`} 
                                            onClick={() => isActiveWeight(idx)}
                                            type="button"
                                        >
                                            {weight}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )} 
                    
                    <div className="d-flex align-items-center ml-3 mt-3">
                        {/* QuantityBox truyền value và onChange để điều khiển số lượng */}
                        <div className="quantityDrop d-flex align-items-center">
                            <Button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</Button>
                            <input
                                type="text"
                                value={quantity}
                                style={{ width: 40, textAlign: "center" }}
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <Button onClick={() => setQuantity(q => q + 1)}>+</Button>
                        </div>
                        {/* Nút Add to cart gọi handleAddToCart khi click vào Button */}
                        <Button className="btn-blue btn-lg btn-big btn-round mr-3 ml-2" onClick={handleAddToCart}>
                            <FaShoppingCart/>&nbsp; Add to cart
                        </Button>
                        <Tooltip title="Add to WishList" placement="top">
                            <Button className="btn-circle" onClick={handleWishlist}><FaHeart color={isWishlisted ? "red" : "gray"}/></Button>
                        </Tooltip>
                        <Tooltip title="Compare Product" placement="top">
                            <Button className="btn-circle ml-3"><IoMdGitCompare /></Button>
                        </Tooltip>
                    </div>


                </div>
                </div>
            <br/>
            <div className="card mt-5 p-5 detailsPageTabs">
                <div className="customTabs">
                    <ul className="list list-inline">
                        <li className="list-inline-item">
                            <Button className={`${activeTabs === 0 && 'active'}`}
                            onClick={()=>{
                                setActiveTabs(0)
                            }}
                            >Description</Button>
                        </li>
                        <li className="list-inline-item">
                            <Button className={`${activeTabs === 1 && "active"}`}
                            onClick={()=>{
                                setActiveTabs(1)
                            }}
                            >Reviews</Button>
                        </li>
                    </ul>
                    <br/>
                    {
                        activeTabs === 0 &&
                        <div className="tabContent">
                            <p>{productData.description} </p>
                         </div>   
                    }
                   

                    {
                        activeTabs === 1 &&
                        <div className="tabContent">
                            <div className="row">
                                <div className="col-md-8">
                                    <h3>Customer questions & answers</h3>
                                    <br/>
                                     <CustomerReview productId={productData?._id}/>
                                    
                                    <br className="res-hide"/>
                                    <br className="res-hide"/>

                                    <form className="reviewForm">
                                        <h4> Add a review</h4>
                                        <div className="form-group">
                                            <textarea className="form-control"
                                            placeholder="Write a review" name="review">
                                            </textarea>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="text" className="form-control"
                                                    placeholder="Name"
                                                    name="userName"/>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <Rating name="rating" value={4.5} precision={0.5} />
                                                </div>
                                            </div>
                                        </div>

                                        <br/>
                                        <div className="form-group">
                                            <Button type="submit" className="btn-g btn-lg btn-big btn-round" style={{fontSize:"15px",color:"black",fontWeight:"700"}}>Submit Review</Button>
                                        </div>

                                    </form>
                                </div>
                               

                            </div>
                        </div>
                    }
                </div>
            </div>

            <br/>
            {productData && (
                <RelatedProducts 
                  title ="RELATED PRODUCTS"
                  categoryId = {productData.category?._id}
                  subcatId = {productData.subCat}
                  excludeId ={productData._id}
                />
            )}
           <RelatedProducts 
                ids = {JSON.parse(localStorage.getItem("recentlyViewed") || "[]")}
                title="RECENTLY VIEWED PRODUCTS"
           />

            </div>
            </section>



        </>
    )

}
export default ProductDetails