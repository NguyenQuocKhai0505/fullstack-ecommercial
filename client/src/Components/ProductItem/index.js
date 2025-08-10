import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button"
import { CiHeart } from "react-icons/ci";
import { useContext, useState, useRef } from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

const ProductItem = (props) => {
    const context = useContext(MyContext)
    const product = props.product || {}
    const [isHover, setIsHover] = useState(false)
    const sliderRef = useRef()
    const settings = {
        dots: true,
        infinite: product.images && product.images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: isHover,
        autoplaySpeed: 2000,
        pauseOnHover: false,
        adaptiveHeight: true,
        fade: false,
        cssEase: 'linear',
        appendDots: dots => (
            <div style={{ position: 'absolute', bottom: 10, width: '100%' }}>
                <ul style={{ margin: 0, padding: 0, display: 'flex', justifyContent: 'center' }}>{dots}</ul>
            </div>
        ),
    };
    const viewProductDetails = (id) => {
        context.setisOpenProductModal(true)
    }
    const handleMouseEnter = () =>{
        if(product.images && product.images.length > 1) {
            setIsHover(true)
        }
    }
    const handleMouseLeave = () =>{
        setIsHover(false)
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
            <div 
                className={`productItem ${props.itemView}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="imgWrapper" style={{ position: 'relative' }}>
                    <div style={{ 
                        width: '100%', 
                        height: 250, 
                        overflow: 'hidden', 
                        borderRadius: 8,
                        position: 'relative'
                    }}>
                        <Link to={`/product/${product._id}`}>
                            {product.images && product.images.length > 1 ? (
                                <div style={{ display: isHover ? 'block' : 'none' }}>
                                    <Slider {...settings} ref={sliderRef}>
                                        {product.images.map((img, idx) => (
                                            <div key={idx}>
                                                <img
                                                    src={img}
                                                    className="w-100"
                                                    alt={product.name || 'Product'}
                                                    loading="lazy"
                                                    style={{ height: 250, objectFit: 'cover', borderRadius: 8 }}
                                                />
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            ) : null}
                            <img
                                src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300x300?text=No+Image'}
                                className="w-100"
                                alt={product.name || 'Product'}
                                loading="lazy"
                                style={{ 
                                    height: 250, 
                                    objectFit: 'cover', 
                                    borderRadius: 8,
                                    display: (isHover && product.images && product.images.length > 1) ? 'none' : 'block'
                                }}
                            />
                        </Link>
                    </div>
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