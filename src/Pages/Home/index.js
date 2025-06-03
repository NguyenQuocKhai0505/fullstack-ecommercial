import HomeBanner from "../../Components/HomeBanner"
import Button from "@mui/material/Button"
import { IoIosArrowRoundForward } from "react-icons/io";
import Slider from "react-slick";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import banner1 from "../../assets/images/banner1.png"
import banner2 from "../../assets/images/Banner2.png"
import coupon from "../../assets/images/banner3.png"
import { IoMdMail } from "react-icons/io";
import Footer from "../../Components/Footer/index"
const Home = () => {
    const productSliderOptions = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        arrows: true,
        autoplay: true,
    };

    return (
        <>
            <HomeBanner />
            <HomeCat/>


            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        {/* Cột bên trái: Banner */}
                        <div className="col-md-3">
                           <div className="sticky">
                                 <div className="banner">
                                <img
                                    src="https://cf.shopee.vn/file/vn-11134258-7ra0g-m7uqe24brygj5f"
                                    className="cursor"
                                    alt="banner"/>
                            </div>
                            <div className="banner mt-4">
                                <img
                                    src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/a8/9f/a89f043284f6f9bd6791afb78bf5f154.png"
                                    className="cursor"
                                    alt="banner"/>
                            </div>
                           </div>
                        </div>

                        {/* Cột bên phải: Best Sellers + New Products */}
                        <div className="col-md-9">
                            {/* BEST SELLERS */}
                            <div className="productRow">
                                <div className="d-flex align-items-center shift-content-right">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">BEST SELLERS</h3>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">
                                        View All<IoIosArrowRoundForward />
                                    </Button>
                                </div>

                                <div className="product-row w-100 mt-2">
                                    <Slider {...productSliderOptions} className="bestSellerSlider">
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

                            {/* NEW PRODUCTS */}
                            <div className="productRow shift-content-right mt-5 ">
                                <div className="d-flex align-items-center">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">
                                        View All<IoIosArrowRoundForward />
                                    </Button>
                                </div>

                                <div className="product-row productRow2 w-100 mt-4 d-flex ml-2">
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                      <ProductItem />
                                </div>
                              
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                <div className="container ">
                    <div className="row">
                       <div className="col-md-6">
                         <p className="text-white mb-0">$20 discount for your first order</p>
                         <h3 className="text-white">Join our  newsletter and get ....</h3>
                         <p className="text-light">Join our email subscription noew to get updates on <br/>promotions and coupons.</p>

                        <form>
                            <IoMdMail />
                            <input className="text" placeholder="Your Email Address" style={{color:"black"}}></input>
                            <Button>Subscribe</Button>
                        </form>
                       </div>
                        
                        <div className="col-md-6">
                            <img src={coupon}></img>
                        </div>


                    </div>
                </div>
            </section>

     


        </>
    );
};

export default Home;