
import Slider from "react-slick";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState } from "react";

const ProductZoom = (props) => {
    const images = props.images || props.product?.images || [];
    const [slideIndex, setSlideIndex] = useState(0);

    // Tính discount nếu có product data
    const calculateDiscount = () => {
        if (props.product?.oldPrice && props.product?.price && props.product.oldPrice > props.product.price) {
            return Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100)
        }
        return 0
    }
    const discount = calculateDiscount();

    const settingsBig = {
        dots: false,
        arrows: false,
        infinite: images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (oldIdx, newIdx) => setSlideIndex(newIdx),
        initialSlide: slideIndex
    };
    const settingsThumb = {
        dots: false,
        arrows: true,
        infinite: images.length > 4,
        speed: 500,
        slidesToShow: Math.min(4, images.length),
        slidesToScroll: 1,
        focusOnSelect: true,
        beforeChange: (oldIdx, newIdx) => setSlideIndex(newIdx),
        initialSlide: slideIndex
    };

    return (
        <div className="productZoom">
            <div className="productZoom position-relative">
                {discount > 0 && <div className="badge badge-primary">{discount}%</div>}
                <Slider {...settingsBig} afterChange={setSlideIndex} asNavFor={null}>
                    {images.length > 0 ? images.map((img, i) => (
                        <div className="item" key={i}>
                            <Zoom>
                                <img src={img} alt={`product-zoom-${i}`} style={{width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8}} />
                            </Zoom>
                        </div>
                    )) : (
                        <div className="item">
                            <Zoom>
                                <img src="https://via.placeholder.com/400x400?text=No+Image" alt="No Image" style={{width: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8}} />
                            </Zoom>
                        </div>
                    )}
                </Slider>
            </div>
            <div style={{marginTop: 16}}>
                <Slider {...settingsThumb} asNavFor={null} afterChange={setSlideIndex}>
                    {images.length > 0 ? images.map((img, i) => (
                        <div className={`item ${slideIndex === i ? "item_active" : ""}`} key={i}>
                            <img
                                src={img}
                                className="w-100"
                                style={{border: slideIndex === i ? '2px solid #007bff' : 'none', cursor: 'pointer', maxHeight: 80, objectFit: 'contain'}}
                                onClick={() => setSlideIndex(i)}
                                alt={`thumb-${i}`}
                            />
                        </div>
                    )) : (
                        <div className="item item_active">
                            <img
                                src="https://via.placeholder.com/100x100?text=No+Image"
                                className="w-100"
                                alt="Product placeholder"
                            />
                        </div>
                    )}
                </Slider>
            </div>
        </div>
    );
}
export default ProductZoom