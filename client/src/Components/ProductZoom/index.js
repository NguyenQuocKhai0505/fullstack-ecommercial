
import {Swiper, SwiperSlide} from "swiper/react"
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';
import item1 from "../../assets/images/itemDetails1.png";
import item2 from "../../assets/images/itemDetails2.png";
import item3 from "../../assets/images/itemDetails3.webp";
import item4 from "../../assets/images/itemDetails4.webp";
import item5 from "../../assets/images/itemDetails5.webp";
import item6 from "../../assets/images/itemDetails6.webp";
import { useContext, useState } from "react";
const ProductZoom =(props)=>{
    const [slideIndex, setSlideIndex] = useState(0);
    const [zoomSlider, setZoomSlider] = useState(null);
    const [zoomSliderBig, setZoomSliderBig] = useState(null);
    const productData = props.product || {}
    const images = productData.images || []
    
    const goto = (index) => {
        setSlideIndex(index);
        zoomSlider?.slideTo(index);
        zoomSliderBig?.slideTo(index);
    };
    
    // Calculate discount percentage
    const calculateDiscount = () => {
        if (productData.oldPrice && productData.price && productData.oldPrice > productData.price) {
            return Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100)
        }
        return 0
    }

    const discount = calculateDiscount()
    return(
            <div className="productZoom">
             <div className="productZoom position-relative">
            <div className="badge badge-primary">{discount}%</div>
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              navigation={false}
              modules={[Navigation]}
              className="zoomSliderBig"
              onSwiper={setZoomSliderBig}
            >
              {images.length > 0 ? images.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="item">
                    <InnerImageZoom zoomType="hover" zoomScale={1.5} src={img} />
                  </div>
                </SwiperSlide>
              )) : (
                <SwiperSlide>
                  <div className="item">
                    <InnerImageZoom zoomType="hover" zoomScale={1.5} src="https://via.placeholder.com/400x400?text=No+Image" />
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
          </div>
          <Swiper              
          slidesPerView={4}               
          spaceBetween={5}               
          navigation={true}               
          modules={[Navigation]}               
          loop={false}               
          watchOverflow={true}
          className="zoomSlider"               
          onSwiper={setZoomSlider}           
      >             
          {images.length > 0 ? images.map((img, i) => (               
              <SwiperSlide key={i}>                 
                  <div className={`item ${slideIndex === i ? "item_active" : ""}`}>                   
                      <img 
                          src={img} 
                          className="w-100" 
                          onClick={() => goto(i)} 
                          alt={`thumb-${i}`} 
                      />                 
                  </div>               
              </SwiperSlide>             
          )) : (
              <SwiperSlide>                 
                  <div className="item item_active">                   
                      <img 
                          src="https://via.placeholder.com/100x100?text=No+Image" 
                          className="w-100" 
                          alt="No image" 
                      />                 
                  </div>               
              </SwiperSlide>
          )}           
</Swiper>
            </div>
    )
}
export default ProductZoom