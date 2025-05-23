import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { IoClose } from "react-icons/io5";
import Rating from "@mui/material/Rating";
import { useContext, useState } from "react";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import item1 from "../../assets/images/itemDetails1.png";
import item2 from "../../assets/images/itemDetails2.png";
import item3 from "../../assets/images/itemDetails3.webp";
import item4 from "../../assets/images/itemDetails4.webp";
import QuantityBox from "../QuantityBox";
import { FaHeart } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";
import { MyContext } from "../../App";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductModal = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [zoomSlider, setZoomSlider] = useState(null);
  const [zoomSliderBig, setZoomSliderBig] = useState(null);
  const context = useContext(MyContext);

  const images = [item1, item2, item3, item4];

  const goto = (index) => {
    setSlideIndex(index);
    zoomSlider?.slideTo(index);
    zoomSliderBig?.slideTo(index);
  };

  return (
    <Dialog open={true} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
      <Button className="close_" onClick={() => context.setisOpenProductModal(false)}>
        <IoClose />
      </Button>
      <h4 className="mb-3 font-weight-bold">iPhone 16 Pro</h4>
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center mr-4">
          <span>Brands:</span>
          <span className="ml-2"><b>Apple</b></span>
        </div>
        <Rating name="read-only" value={5} size="small" precision={0.5} readOnly />
      </div>
      <hr />
      <div className="row mt-2 productDetailModal">
        <div className="col-md-5">
          <div className="productZoom position-relative">
            <div className="badge badge-primary">23%</div>
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              navigation={false}
              modules={[Navigation]}
              className="zoomSliderBig"
              onSwiper={setZoomSliderBig}
            >
              {images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="item">
                    <InnerImageZoom zoomType="hover" zoomScale={2} src={img} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            navigation={true}
            modules={[Navigation]}
            className="zoomSlider"
            onSwiper={setZoomSlider}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className={`item ${slideIndex === i ? "item_active" : ""}`}>
                  <img src={img} className="w-100" onClick={() => goto(i)} alt={`thumb-${i}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="col-md-7">
          <div className="d-flex info align-items-center mb-3">
            <span className="oldPrice lg mr-2">$1000</span>
            <span className="newPrice text-danger lg">$949</span>
          </div>
          <span className="badge bg-success">IN STOCK</span>
          <p className="mt-3">
            The iPhone 16 Pro Max features a 6.9-inch Super Retina XDR OLED display with ProMotion technology,
            delivering a smooth and sharp display experience, ideal for entertainment and work.
          </p>
          <div className="d-flex align-items-center">
            <QuantityBox />
            <Button className="btn-blue btn-lg -btn-big btn-round ml-3">Add to Cart</Button>
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
