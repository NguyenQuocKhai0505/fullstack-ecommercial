import ProductZoom from "../../Components/ProductZoom"
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox"
import Button from '@mui/material/Button';
import { FaShoppingCart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import Tooltip from '@mui/material/Tooltip';
import CustomerReview from "../../Components/Customer Review/index"
import RelatedProducts from "./RelatedProducts/index"
import { useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
const ProductDetails =()=>{
    const [activeTabs, setActiveTabs] = useState(null)
    const [activeSize, setActiveSize]= useState(null)
    const {id} = useParams()
    const [productData, setProductData] = useState([])

    useEffect(()=>{
        fetchDataFromApi(`/api/products/${id}`).then(res=>{
            setProductData(res)
        })
    })
 



    const isActive =(index)=>{
        setActiveSize(index)
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
                      <Rating  name="read-only" value={productData.rating} precision={0.5} size="small" readOnly />
                     </li>
                    </ul>

                    <div className="d-flex info ml-3 mb-4">
                        <span className="oldPrice">${productData.oldPrice}</span>
                        <span className="newPrice text-danger ml-2">${productData.price}</span>
                    </div>

                    <span className="badge btn-success ml-3 mb-3">{productData.countInStock > 0 ? "IN STOCK" : "OUT STOCK"}</span>
                    <p className="mt-2 ml-3" style={{fontWeight:"600"}}>{productData.description}</p>

                    {/* <div className="productSize d-flex align-items-center">
                        <span>RAM: </span>
                        <ul className="list list-inline mb-0 pl-4">
                            <li className="list-inline-item">
                                <a className={`tag ${activeSize ==0 ?"active":""}`} 
                                onClick={()=>isActive(0)}>256GB</a>
                            </li>
                            <li className="list-inline-item">
                                <a className={`tag ${activeSize ==1 ?"active":""}`}
                                onClick={()=>isActive(1)}>512GB</a>
                            </li>
                            <li className="list-inline-item">
                                <a className={`tag ${activeSize ==2 ?"active":""}`}
                                 onClick={()=>isActive(2)}>1TB</a>
                            </li>
                        </ul>
                    </div> */}
                    <div className="d-flex align-items-center ml-3 mt-3">
                        <QuantityBox/>
                        <Button className="btn-blue btn-lg btn-big btn-round mr-3 ml-2"><FaShoppingCart/>&nbsp; Add to cart</Button>
                        <Tooltip title="Add to WishList" placement="top">
                        <Button className="btn-circle"><FaHeart /></Button>
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
                            <Button className={`${activeTabs ==0 && 'active'}`}
                            onClick={()=>{
                                setActiveTabs(0)
                            }}
                            >Description</Button>
                        </li>
                        <li className="list-inline-item">
                            <Button className={`${activeTabs==1 && 'active'}`}
                            onClick={()=>{
                                setActiveTabs(1)
                            }}>Additional info</Button>
                        </li>
                        <li className="list-inline-item">
                            <Button className={`${activeTabs==2 && "active"}`}
                            onClick={()=>{
                                setActiveTabs(2)
                            }}
                            >Reviews(3)</Button>
                        </li>
                    </ul>
                    <br/>
                    {
                        activeTabs ==0 &&
                        <div className="tabContent">
                            <p>{productData.description} </p>
                         </div>   
                    }
                    {
                        activeTabs ==1 &&
                        <div className="tabContent"> 
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr className="stand-up">
                                            <th>Stand Up</th>
                                            <td>
                                                <p>35''L x 24''W x 37-45''H(front to back wheel)</p>
                                            </td>
                                        </tr>
                                        <tr className="folded-wo-wheels">
                                            <th>Folded (w/o wheel) </th>
                                            <td>
                                                <p>35''L x24''W x 37-45''H(front to back wheel)</p>
                                            </td>
                                        </tr>

                                        <tr className="folded-w-wheels">
                                            <th>Folded (w/wheels)</th>
                                            <td>
                                                <p>32.5''L x 24''W x 18.5''H</p>
                                            </td>
                                        </tr>
                                        <tr className="door-pass-through">
                                            <th>Door Pass Through</th>
                                            <td>
                                               <p>24</p> 
                                            </td>
                                        </tr>
                                        <tr className="frame">
                                            <th>Frame</th>
                                            <td>
                                                <p>Alumninum</p>
                                            </td>
                                        </tr>
                                        <tr className="weight-wo-wheels">
                                            <th>Weight Capacity</th>
                                            <td>
                                                <p>60 LBS</p>
                                            </td>
                                        </tr>
                                        <tr className="width">
                                            <th>Width</th>
                                            <td>
                                                <p>24''</p>
                                            </td>
                                        </tr>
                                        <tr className="handle-height-ground-to-handle">
                                            <th>Handle height(ground to handle)</th>
                                            <td>
                                                <p>337-45''</p>
                                            </td>
                                        </tr>
                                        <tr className="wheels">
                                            <th>Wheels</th>
                                            <td>
                                                <p>12'' air / wide track slick tread</p>
                                            </td>
                                        </tr>
                                        <tr className="seat-back-height">
                                            <th>Seat back height</th>
                                            <td>
                                                <p>21.5''</p>
                                            </td>
                                        </tr>
                                        <tr className="head-room-inside-canopy">
                                            <th>Head room (inside capony)</th>
                                            <td>
                                                <p>25''</p>
                                            </td>
                                        </tr>
                                        <tr className="pa_color">
                                            <th>Color</th>
                                            <td>
                                                <p>Black, Blue, Red, White</p>
                                            </td>
                                        </tr>
                                        <tr className="pa_size">
                                            <th>Size</th>
                                            <td>
                                                <p>M,S</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                    {
                        activeTabs==2 &&
                        <div className="tabContent">
                            <div className="row">
                                <div className="col-md-8">
                                    <h3>Customer questions & answers</h3>
                                    <br/>
                                     <div className="card p-4 reviewsCard flex-row">
                                        <div className="image">
                                            <div className="rounded-circle">
                                                <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png"/>
                                            </div>
                                            <span className="text-g d-block text-center font-weight-bold">Ngoc Thien</span>
                                        </div>

                                        <div className="info pl-5">
                                            <div className="d-flex align-items-center w-100">
                                                <h5 className="text-ligth">01/11/2005</h5>
                                                <div className="ml-auto">
                                                    <Rating name="half-rating-read"
                                                            value="4.5" precision={0.5} readOnly />
                                                </div>
                                            </div>
                                            <p>Máy mới 100% , chính hãng Apple Việt Nam.Kmarket.vn hiện là đại lý bán lẻ uỷ quyền iPhone chính hãng VN/A của Apple Việt Nam</p>
                                        </div>
                                     </div>
                                    
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
                                <CustomerReview/>

                            </div>
                        </div>
                    }
                </div>
            </div>

            <br/>
            <RelatedProducts title="RELATED PRODUCTS"/>
            <RelatedProducts title="RECENT VIEWED PRODUCTS"/>

            </div>
            </section>



        </>
    )

}
export default ProductDetails