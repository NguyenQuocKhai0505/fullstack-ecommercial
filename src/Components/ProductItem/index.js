import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button"
import { CiHeart } from "react-icons/ci";
import { useContext, useState } from 'react';
import product from "../../assets/images/iphone16.jpg"
import { MyContext } from '../../App';
const ProductItem =(props)=>{
    
  const context = useContext(MyContext)


    const viewProductDetails =(id)=>{
        context.setisOpenProductModal(true)
    }
   
    
   

    return(
         <>
         <div className={`productItem ${props.itemView}`}>
            <div className="imgWrapper">
                <img src={product}
                className="w-100"></img>
                    <h4>iPhone 16 Pro Max 256GB | Chính hãng VN/A</h4>
                        <span className="badge badge-primary">28%</span>
                            <div className="actions">
                                <Button onClick={()=>viewProductDetails()}><TfiFullscreen /></Button>
                                <Button><CiHeart /></Button>
                            </div>
                                    <span className="text-success d-block">In Stock</span>
                                    <Rating className="mt-2 mb-2" name="read-only" value={5} readOnly  size="small" precision={0.5}/>
                            <div className="d-flex">
                                    <span className="oldPrice">$20.000</span>
                                        <span className="newPrice text-danger ml-3">$16.000</span>
                            </div>
                </div>
         </div>
        
       
         </>
    )


}
export default ProductItem