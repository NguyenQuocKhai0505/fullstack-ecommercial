

import React, { useState } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/navigation"
import { Navigation, Autoplay } from 'swiper/modules' // thêm Autoplay
import { useEffect } from 'react';

const HomeCat=(props)=>{
        
    const [catData, setCatData] = useState([])
    useEffect(()=>{
        setCatData(props.category)
    },[])

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
                    catData?.map((item,index)=>{
                        return(
                        <SwiperSlide>
                            <div className='item text-center'
                            style={{background:item.color}}>
                            <img src={item.images[0]}/>
                            <h6>{item.name}</h6>
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