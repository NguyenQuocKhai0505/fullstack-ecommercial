import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IoClose } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { useContext, useEffect, useState} from "react";
import QuantityBox from "../QuantityBox";
import { FaHeart } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";
import { MyContext } from "../../App";
import ProductZoom from "../ProductZoom";
import { fetchDataFromApi } from "../../utils/api";

const ProductModal = () => {

  const [products,setProducts]= useState(null)
  const [loading,setLoading] = useState(true)
  const context = useContext(MyContext);
  const [activeSize, setActiveSize] = useState(null)
  const [activeRam, setActiveRam] = useState(null)
  const [activeWeight, setActiveWeight] = useState(null)
  const isActive = (index) => {
    setActiveSize(index)
}
const isActiveRam = (index) => {
    setActiveRam(index)
}
const isActiveWeight = (index) => {
    setActiveWeight(index)
}
  useEffect(()=>{
    if(context.selectedProductID){
      fetchProduct()
    }
  },[context.selectedProductID])
  const fetchProduct = async ()=>{
    try{
      setLoading(true)
      const response = await fetchDataFromApi(`/api/products/${context.selectedProductID}`)
      setProducts(response)
    }catch(err){
      console.log("Error fetching product",err)
    }finally{
      setLoading(false)
    }
  }

  // Hiển thị loading khi đang fetch
  if (loading) {
    return (
      <Dialog open={true} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
        <div className="text-center p-4">Loading...</div>
      </Dialog>
    );
  }

  // Hiển thị modal với data
  return (
    <Dialog open={true} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
      <Button className="close_" onClick={() => context.setisOpenProductModal(false)}>
        <IoClose />
      </Button>
      <h4 className="mb-3 font-weight-bold">{products?.name || 'Loading...'}</h4>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span>Brands:</span>
          <span className="ml-2"><b>{products?.brand || 'N/A'}</b></span>
        </div>
        <Rating name="read-only" value={products?.rating || 0} size="small" precision={0.5} readOnly />
      </div>
      <hr />
      <div className="row mt-2 productDetailModal">
        <div className="col-md-5">

          <ProductZoom images={products?.images}/>

        </div>

        <div className="col-md-7">
          <div className="d-flex info align-items-center mb-3">
            {products?.oldPrice && products.oldPrice > products.price && (
              <span className="oldPrice lg mr-2">${products.oldPrice}</span>
            )}
            <span className={`${products?.oldPrice && products.oldPrice > products.price ? 'newPrice text-danger lg' : 'newPrice lg'}`}>
              ${products?.price || 0}
            </span>
            {products?.oldPrice && products.oldPrice > products.price && (
              <span className="badge badge-primary ml-2">
                {Math.round(((products.oldPrice - products.price) / products.oldPrice) * 100)}% OFF
              </span>
            )}
          </div>
          <span className={`badge ${products?.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
            {products?.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
          </span>
          <p className="mt-3">
            {products?.description || 'No description available'}
          </p>
            {/* Render Product RAM*/}
            {products?.productRam && products.productRam?.length > 0 && (
             <div className="productSize d-flex align-items-center ml-3 mb-3">
               <span className="spec-label mr-3">RAM:</span>
               <ul className="list list-inline mb-0">
                 {products.productRam.map((ram, idx) => (
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
                   {/* Render productSize*/}
           {products?.productSize && products.productSize?.length > 0 && (
            <div className="productSize d-flex align-items-center ml-3 mb-3">
              <span className="spec-label mr-3">SIZE:</span>
              <ul className="list list-inline mb-0">
                {products.productSize.map((size, idx) => (
                  <li className="list-inline-item" key={idx}>
                    <button 
                      className={`tag ${activeSize === idx ? "active" : ""}`}
                      onClick={() => isActive(idx)}
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
             {products?.productWeight && products.productWeight?.length > 0 && (
                        <div className="productSize d-flex align-items-center ml-3 mb-3">
                            <span className="spec-label mr-3">Weight:</span>
                            <ul className="list list-inline mb-0">
                                {products.productWeight.map((weight, idx) => (
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
                            </ul>d
                        </div>
                    )} 
          <div className="d-flex align-items-center">
            <QuantityBox />
            <Button 
              className="btn-blue btn-lg -btn-big btn-round ml-3"
              disabled={!products?.countInStock || products.countInStock === 0}
            >
              Add to Cart
            </Button>
          </div>
          <div className="d-flex align-items-center mt-5 actions">
            <Button className="btn-round btn-sml" variant="outlined">
              <FaHeart /> &nbsp; ADD TO WISHLIST
            </Button>
            <Button className="btn-round btn-sml ml-3" variant="outlined">
              <IoGitCompare /> &nbsp; COMPARE
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductModal;
