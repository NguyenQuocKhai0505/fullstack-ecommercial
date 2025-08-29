

import React, { useState } from 'react';
import {Swiper, SwiperSlide} from 'swiper/react'
import "swiper/css"
import "swiper/css/navigation"
import { Navigation } from 'swiper/modules'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
const HomeCat=(props)=>{
        
    const [catData, setCatData] = useState([])
    useEffect(()=>{
        setCatData(props.category)
    },[props.category])

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
                         <SwiperSlide key={item._id || index}>
                            <Link to={`/cat/${item._id}`}>
                            <div className='item text-center'
                            style={{background:item.color}}>
                            <img src={item.images[0]} alt={item.name || 'Category'}/>
                            <h6>{item.name}</h6>
                        </div>
                        </Link>
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