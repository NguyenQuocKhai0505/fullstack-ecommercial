import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button"
import { CiHeart } from "react-icons/ci";
import { useContext, useState } from 'react';
import { MyContext } from '../../App';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductItem = (props) => {
    const context = useContext(MyContext)
    const product = props.product || {}

    const viewProductDetails = (id) => {
        context.setisOpenProductModal(true)
    }

    // Calculate discount percentage
    const calculateDiscount = () => {
        if (product.oldPrice && product.price && product.oldPrice > product.price) {
            return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        }
        return 0
    }

    const discount = calculateDiscount()

    return (
        <>
            <div className={`productItem ${props.itemView}`}>
                <div className="imgWrapper">
                <Link to={`/product/${product._id}`}>
                    <img 
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x300?text=No+Image'} 
                        className="w-100"
                        alt={product.name || 'Product'}
                        loading="lazy"
                    />
                </Link>
                    <Link to={`/product/${product._id}`}><h4>{product.name || 'Product Name'}</h4></Link>
                    {discount > 0 && <span className="badge badge-primary">{discount}%</span>}
                    <div className="actions">
                        <Button onClick={() => viewProductDetails(product._id)}>
                            <TfiFullscreen />
                        </Button>
                        <Button>
                            <CiHeart />
                        </Button>
                    </div>
                    <span className={`d-block ${product.countInStock > 0 ? 'text-success' : 'text-danger'}`}>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <Rating 
                        className="mt-2 mb-2" 
                        name="read-only" 
                        value={product.rating || 0} 
                        readOnly 
                        size="small" 
                        precision={0.5}
                    />
                    <div className="d-flex">
                        {product.oldPrice && product.oldPrice > product.price && (
                            <span className="oldPrice">${product.oldPrice}</span>
                        )}
                        <span className={`${product.oldPrice && product.oldPrice > product.price ? 'newPrice text-danger ml-3' : 'newPrice'}`}>
                            ${product.price || 0}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductItem