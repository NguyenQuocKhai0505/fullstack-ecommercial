import HomeBanner from "../../Components/HomeBanner"
import Button from "@mui/material/Button"
import { IoIosArrowRoundForward } from "react-icons/io";
import Slider from "react-slick";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";

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
                                    src="https://scj.vn/modules/floattopbanner/img/fee39a70d6ff225c53068ba9c5bf3dfa.png"
                                    className="cursor"
                                    alt="banner"/>
                            </div>
                           </div>
                        </div>

                        {/* Cột bên phải: Best Sellers + New Products */}
                        <div className="col-md-9">
                            {/* BEST SELLERS */}
                            <div className="productRow">
                                <div className="d-flex align-items-center">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">BEST SELLERS</h3>
                                        <p className="text-light text-sml mb-0">
                                            Do not miss the current offers until the end of December
                                        </p>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">
                                        View All<IoIosArrowRoundForward />
                                    </Button>
                                </div>

                                <div className="product-row w-100">
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
                            <div className="productRow mt-5">
                                <div className="d-flex align-items-center">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                        <p className="text-light text-sml mb-0">
                                           New products with updated stocks
                                        </p>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">
                                        View All<IoIosArrowRoundForward />
                                    </Button>
                                </div>

                                <div className="product-row productRow2 w-100 mt-4 d-flex">
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
        </>
    );
};

export default Home;
