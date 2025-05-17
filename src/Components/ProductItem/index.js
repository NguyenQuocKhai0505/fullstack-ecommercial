import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button"
import { CiHeart } from "react-icons/ci";
const ProductItem =()=>{
    return(
         <div className="item productItem">
            <div className="imgWrapper">
                <img src="https://media.gucci.com/style/DarkGray_Center_0_0_1200x1200/1741684531/833312_Z7AQM_6066_002_100_0000_Light-Printed-GG-cotton-jacquard-shirt.jpg"
                className="w-100"></img>
                    <h4>Printed GG shirt</h4>
                        <span className="badge badge-primary">28%</span>
                            <div className="actions">
                                <Button><TfiFullscreen /></Button>
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
    )


}
export default ProductItem