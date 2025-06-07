import { IoIosArrowRoundForward } from "react-icons/io";
import Slider from "react-slick";
import ProductItem from "../../../Components/ProductItem";
import Button from "@mui/material/Button"

const RelatedProducts = (props) => {
 const productSliderOptions = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,        // Thay đổi từ 5 thành 4
    slidesToScroll: 2,      // Hoặc có thể để 1 để scroll từng item
    arrows: true,
    autoplay: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
};

    return (
        <div className="related-products-container">
            {/* RELATED PRODUCTS */}
            <div className="product-section">
                <div className="section-header">
                    <div className="section-info">
                        <h3 className="section-title">{props.title}</h3>
                    </div>
                    <Button className="view-all-btn">
                        View All<IoIosArrowRoundForward />
                    </Button>
                </div>

                <div className="products-slider-container">
                    <Slider {...productSliderOptions} className="products-slider">
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                        <ProductItem />
                    </Slider>
                </div>
            </div>
        </div>
    )
}

export default RelatedProducts;