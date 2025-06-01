
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
const ProductZoom =()=>{
    const [slideIndex, setSlideIndex] = useState(0);
    const [zoomSlider, setZoomSlider] = useState(null);
    const [zoomSliderBig, setZoomSliderBig] = useState(null);
    const goto = (index) => {
    setSlideIndex(index);
    zoomSlider?.slideTo(index);
    zoomSliderBig?.slideTo(index);
  };

    const images = [item1, item2, item3, item4, item5, item6];
    return(
            <div className="productZoom">
             <div className="productZoom position-relative">
            <div className="badge badge-primary">23%</div>
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
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
          spaceBetween={5}               
          navigation={true}               
          modules={[Navigation]}               
          loop={false}               
          watchOverflow={true}
          className="zoomSlider"               
          onSwiper={setZoomSlider}           
      >             
          {images.map((img, i) => (               
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
          ))}           
</Swiper>
            </div>
    )
}
export default ProductZoom