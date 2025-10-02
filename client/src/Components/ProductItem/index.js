import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button"
import { CiHeart } from "react-icons/ci";
import { useContext, useState, useRef } from 'react';
import { MyContext } from '../../App';
import { Link, useFetcher } from 'react-router-dom';
import Slider from 'react-slick';
import {useWishlist} from "../../contexts/WishlistContext"
import {addToWishlistAPI,removeFromWishlistAPI} from "../../utils/api"
import {toast} from "react-toastify"
const ProductItem = (props) => {
    const context = useContext(MyContext)
    const {wishlist,setWishlist} = useWishlist()
    const product = props.product || {}
    const isListView = props.itemView === 'one'
    const [isHover, setIsHover] = useState(false)
    const sliderRef = useRef()
    const settings = {
        dots: true,
        infinite: product.images && product.images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: isHover && !isListView,
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
        context.setSelectedProductID(id)  
        context.setisOpenProductModal(true)
    }
    const handleMouseEnter = () =>{
        if(!isListView && product.images && product.images.length > 1) {
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

    const truncateText = (text, maxLen = 180) => {
        if (!text) return ''
        if (text.length <= maxLen) return text
        return text.slice(0, maxLen).trim() + '...'
    }
    //Kiem tra san pham xem co wishlist hay chua
    const isWishlisted = wishlist.some(p => p._id === product._id)
    //Ham nhan nut wishlist 
    const handleWishlist = async ()=>{
        const token = localStorage.getItem("token")
        if(!token){
            toast.error("You need to login first!")
            return
        }
        if(isWishlisted){
            await removeFromWishlistAPI(product._id,token)
            const updated = await getWishlistAPI(token)
            setWishlist(updated || [])
            toast.info("Removed from wishlist!")
        }else{
            await addToWishlistAPI(product._id,token)
            const updated = await getWishlistAPI(token)
            setWishlist(updated || [])
            toast.info("Added to wishlist!")
        }
    }
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
                            {!isListView && product.images && product.images.length > 1 ? (
                                <div style={{ 
                                    position: 'absolute', inset: 0, 
                                    opacity: isHover ? 1 : 0, 
                                    transition: 'opacity .2s ease',
                                    pointerEvents: 'none'
                                }}>
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
                                    /* luôn render ảnh nền; slider phủ lên bằng opacity để tránh layout nhấp nháy */
                                    display: 'block'
                                }}
                            />
                        </Link>
                        {isListView && discount > 0 && (
                            <span style={{
                                position: 'absolute', top: 10, left: 10,
                                background: '#1976d2', color: '#fff',
                                padding: '6px 10px', borderRadius: 8,
                                fontWeight: 600, fontSize: 14,
                                pointerEvents: 'none'
                            }}>{discount}%</span>
                        )}
                    </div>
                    <div className={isListView ? 'infoCol' : undefined}>
                        <Link to={`/product/${product._id}`}><h4>{product.name || 'Product Name'}</h4></Link>
                        {isListView && product.description && (
                            <p className="productDesc mb-2" style={{ color: '#555', marginTop: 6 }}>
                                {truncateText(product.description, 220)}
                            </p>
                        )}
                        {!isListView && discount > 0 && <span className="badge badge-primary">{discount}%</span>}
                        <div className="actions">
                        <Button onClick={() => viewProductDetails(product._id)}>
                            <TfiFullscreen />
                        </Button>
                        <Button onClick={handleWishlist}>
                            <CiHeart color={isWishlisted ? 'red' : 'gray'} />
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
                        {isListView && Array.isArray(product.productSize) && product.productSize.length > 0 && (
                            <div className="sizeRow" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '6px 0 10px' }}>
                                <strong style={{ marginRight: 8, color: '#333' }}>Size:</strong>
                                {product.productSize.map((s, idx) => (
                                    <span key={idx} style={{ border: '1px solid #e0e0e0', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: '#555', background: '#fafafa' }}>{s}</span>
                                ))}
                            </div>
                        )}
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
            </div>
        </>
    )
}

export default ProductItem