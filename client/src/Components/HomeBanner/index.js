
import Slider from "react-slick";
import React from "react";
// import picture1 from "../../assets/images/picture1.jpg";
// import picture2 from "../../assets/images/picture1.jpg";
// import picture3 from "../../assets/images/picture1.jpg";
const HomeBanner =()=>{
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay:true
  }
    return(
   <div className="homeBannerSection">
      <Slider {...settings}>
        <div className="item">
          <img
            src="https://api.spicezgold.com/download/file_1734525002307_1723967638078_slideBanner1.6bbeed1a0c8ffb494f7c.jpg"
            alt="Banner1"
            className="w-10"
          />
        </div>
        <div className="item ">
          <img
            src="https://api.spicezgold.com/download/file_1734524930884_NewProject(6).jpg"
            alt="Banner2"
            className="w-10"
           
          />
        </div>
        <div className="item">
          <img
            src="https://api.spicezgold.com/download/file_1734524971122_NewProject(8).jpg"
            alt="Banner3"
            className="w-10"
            
          />
        </div>
      </Slider>
    </div>
    )
}
export default HomeBanner