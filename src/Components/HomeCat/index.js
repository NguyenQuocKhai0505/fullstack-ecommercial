
import React, { useState } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/navigation"
import { Navigation, Autoplay } from 'swiper/modules' // thêm Autoplay

const HomeCat=()=>{
    const [itemBg, setItemBg] = useState([
  '#fffceb',
  '#ecffec',
  '#feefea',
  '#fff3eb',
  '#fff3ff',
  '#f2fce4',
  '#feefea',
  '#fffceb',
  '#feefea',
  '#ecffec',
  '#e3f2fd',
  '#fce4ec',
  '#e8f5e9',
  '#ede7f6',
  '#f3e5f5',
  '#e1f5fe',
  '#f9fbe7',
  '#fbe9e7',
  '#f0f4c3',
  '#e0f2f1',
]);

        return(
        <section className="homeCat"> 
                <div className="container">
                <h3 className='mb-4 hd'>Featured Categories</h3>
                   <Swiper
                   slidesPerView="auto"
                   spaceBetween={20}
                   navigation={true}
                   slidesPerGroup={5}
                   modules={[Navigation]}
                   >
                   {
                    itemBg?.map((item,index)=>{
                        return(
                        <SwiperSlide>
                            <div className='item text-center'
                            style={{background:item}}>
                            <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-9.png"/>
                            <h6>Red Apple</h6>
                        </div>
                    </SwiperSlide>
                        )
                    })
                   }
                   </Swiper>
                </div>
            </section>

        
        )
}
export default HomeCat