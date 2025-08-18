import HomeBanner from "../../Components/HomeBanner"
import Button from "@mui/material/Button"
import { IoIosArrowRoundForward } from "react-icons/io";
import Slider from "react-slick";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import coupon from "../../assets/images/banner3.png"
import { IoMdMail } from "react-icons/io";
import { useState, useMemo, useContext } from "react";
import { useEffect } from "react";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from '@mui/material/Pagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MyContext } from "../../App";

const Home = () => {
    const context = useContext(MyContext);
    
    // State cho Tabs
    const [tabValue, setTabValue] = useState(0);
    
    // Function xử lý thay đổi tab
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const productSliderOptions = useMemo(() => ({
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
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
    }), [])
    
    const [catData, setCatData] = useState([])
    const [loading, setLoading] = useState(true)
    const [productsLoading, setProductsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isFeaturedProduct, setIsFeaturedProduct] =useState([])
    //Phân trang
    const [currentPage, setCurrentPage]= useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const productPerPage = 12
    const [allProducts,setAllProducts] = useState([])
    //State cho filtered products 
    const [filteredProducts,setFilteredProducts] = useState([])
    const [filteredProductsLoading,setFilteredProductsLoading] = useState(false)
    //Tính toán số lượng phân bo
    const indexOfLastProduct = currentPage * productPerPage
    const indexOfFirstProduct = indexOfLastProduct - productPerPage
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetchDataFromApi("/api/category?all=true")
                if (res && Array.isArray(res.categoryList)) {
                    setCatData(res.categoryList)
                    console.log('Fetched categories:', res.categoryList)
                } else {
                    setCatData([])
                    console.log('No categories found or invalid response')
                }
            } catch (err) {
                console.error('Error fetching categories:', err)
                setError('Failed to load categories')
                setCatData([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Fetch featured products
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const res = await fetchDataFromApi("/api/products?isFeatured=true")
                if (res && res.success && Array.isArray(res.data)) {
                    setIsFeaturedProduct(res.data)
                    console.log('Fetched featured products:', res.data)
                } else {
                    setIsFeaturedProduct([])
                    console.log('No featured products found or invalid response')
                }
            } catch (err) {
                console.error('Error fetching featured products:', err)
                setIsFeaturedProduct([])
            }
        }

        fetchFeaturedProducts()
    }, []) 
    // Fetch all products

    useEffect(()=>{
        const fetchAllProducts = async ()=>{
            try{
                setProductsLoading(true)
                setError(null)
                console.log(`Fetching products: page=${currentPage}, perPage=${productPerPage}`)
                const res = await fetchDataFromApi(`/api/products?page=${currentPage}&perPage=${productPerPage}`)
                console.log('API Response:', res)
                
                if(res && res.success && Array.isArray(res.data)){
                    setAllProducts(res.data)
                    setTotalPages(res.totalPages || 1);
                    console.log('Fetched all products:', res.data)
                }else{
                    setAllProducts([])
                    setError('No products found or invalid API response')
                    console.log('No all products found or invalid response:', res)
                }
            }catch(err){
                console.error('Error fetching all products:', err)
                setError('Failed to load products: ' + (err.message || 'Unknown error'))
                setAllProducts([])
            } finally {
                setProductsLoading(false)
            }
        }
        fetchAllProducts()
    },[currentPage,productPerPage])
    //Filter Product by Category 
    useEffect(()=>{
        const fetchProductsByCategory = async ()=>{
            if(catData.length===0) return 
            try{
                setFilteredProductsLoading(true)
                setError(null)
                
                // Nếu tabValue = 0 (tab đầu tiên), hiển thị tất cả featured products
                if(tabValue === 0) {
                    const res = await fetchDataFromApi("/api/products?isFeatured=true&perPage=1000")
                    if(res && res.success && Array.isArray(res.data)){
                        setFilteredProducts(res.data)
                        console.log('Fetched all featured products:', res.data.length);
                    }else{
                        setFilteredProducts([])
                    }
                } else {
                    // Lấy products theo category được chọn
                    const selectedCategory = catData[tabValue]
                    if(!selectedCategory) return 
                    console.log(`Fetching products for category: ${selectedCategory.name} (${selectedCategory._id})`);
                    const res = await fetchDataFromApi(`/api/products?category=${selectedCategory._id}&isFeatured=true&perPage=1000`)
                    if(res && res.success && Array.isArray(res.data)){
                        setFilteredProducts(res.data)
                        console.log(`Fetched ${res.data.length} products for category: ${selectedCategory.name}`);
                    }else{
                        setFilteredProducts([])
                        console.log(`No products found for category: ${selectedCategory.name}`);
                    }
                }
            }catch(error){
                console.error('Error fetching products by category:', error);
                setError('Failed to load products for this category');
                setFilteredProducts([]);
            }finally{
                setFilteredProductsLoading(false)
            }
        }
        fetchProductsByCategory()
    },[tabValue,catData])
    return (
        <>
            <HomeBanner />
            {
                catData.length !== 0 &&  <HomeCat category={catData}/>
            }
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
                                    alt="Promotional banner"
                                    loading="lazy"/>
                            </div>
                            <div className="banner mt-4">
                                <img
                                    src="https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/a8/9f/a89f043284f6f9bd6791afb78bf5f154.png"
                                    className="cursor"
                                    alt="Special offer banner"
                                    loading="lazy"/>
                            </div>
                           </div>
                        </div>

                        {/* Cột bên phải: Best Sellers + New Products */}
                        <div className="col-md-9">
                            {/* BEST SELLERS */}
                            <div className="productRow">
                                <div className="d-flex align-items-center shift-content-right">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">Popular Products</h3>
                                    </div>
                                    <div className="ml-auto">
                                        <Tabs
                                            value={tabValue}
                                            onChange={handleTabChange}
                                            variant="scrollable"
                                            scrollButtons="auto">
                                            {
                                                catData?.map((item,idx) => {
                                                    return(
                                                        <Tab 
                                                            key={item._id}
                                                            label={item.name}
                                                            value={idx}
                                                        />
                                                    )
                                                })
                                            }
                                        </Tabs>
                                    </div>
                                </div>

                                <div className="product-row w-100 mt-2">
                                    {
                                        filteredProductsLoading ? (
                                            <div className="text-center">
                                                <p>Loading products...</p>
                                            </div>
                                        ): error ?(
                                            <div className="text-center text-danger">
                                                <p>{error}</p>
                                            </div>
                                        ): filteredProducts.length > 0 ? (
                                            <Slider {...productSliderOptions} className="bestSellerSlider">
                                                {filteredProducts.map((product)=>(
                                                    <ProductItem key={product._id} product={product}/>
                                                ))}
                                            </Slider>
                                        ):(
                                            <div className="text-center">
                                                <p>No products available for this category</p>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>

                            {/* ALL PRODUCTS */}
                            <div className="productRow shift-content-right mt-5 ">
                                <div className="d-flex align-items-center">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">ALL PRODUCTS</h3>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">
                                        View All<IoIosArrowRoundForward />
                                    </Button>
                                </div>

                                <div className="product-row w-100 mt-2 allProductsGrid">
                                    {productsLoading ? (
                                        <div className="text-center">
                                            <p>Loading all products...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="text-center text-danger">
                                            <p>{error}</p>
                                        </div>
                                    ) : currentProducts.length > 0 ? (
                                        <div className="row">
                                            {currentProducts.map((product) => (
                                                <div className="col-md-3 col-sm-6 mb-3" key={product._id}>
                                                    <ProductItem product={product} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p>No products available</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Phân trang */}
                                <div className="d-flex justify-content-center mt-4 pagination-container">
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={(event, value) => setCurrentPage(value)}
                                        color="primary"
                                        shape="rounded"
                                        showFirstButton
                                        showLastButton
                                    />
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
                            <img src={coupon} alt="Coupon banner"></img>
                        </div>


                    </div>
                </div>
            </section>

     


        </>
    );
};

export default Home;