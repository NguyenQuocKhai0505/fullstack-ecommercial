import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/index"
import Home from "./Pages/Home/index"
import CheckoutPage from "./Pages/Checkout";
import Listing from "./Pages/Listing"
import ProductDetails from "./Pages/ProductDetails"
import { createContext, useState,useEffect } from "react";
import axios from "axios"
import Footer from "./Components/Footer/index"
import ProductModal from "./Components/Product Modal";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import ScrollToTop from "./Components/ScrollToTop";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {ToastContainer} from "react-toastify"
import Verify from "./Pages/Auth/verify";
import { getCartAPI } from "./utils/api";
import { WishlistProvider } from "./contexts/WishlistContext";
import WishlistPage from "./Pages/Wishlist";
import MyOrders from "./Pages/Orders/index"
import ThankYou from "./Pages/ThankYou/index"
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import {GoogleOAuthProvider} from "@react-oauth/google"
import SearchPage from "./Pages/Search";
const MyContext = createContext();

function App() {
  const [countryList,setCountryList] = useState([]);
  const [selectedCountry,setselectedCountry] = useState('')
  const [isOpenProductModal, setisOpenProductModal] = useState(false)
  const [selectedProductID,setSelectedProductID]= useState(null)
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const [cartCount, setCartCount] = useState(0);
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  useEffect(()=>{
    getCountry("https://countriesnow.space/api/v0.1/countries/")
  },[])

  // Giữ trạng thái đăng nhập sau khi reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      // Lấy cart từ backend để cập nhật số lượng sản phẩm
      getCartAPI(token).then(cart => setCartCount(cart.items ? cart.items.length : 0));
    }
  }, []);
  
  const getCountry= async (url)=>{
    await axios.get(url).then((res)=>{
      setCountryList(res.data.data)
    })
  }
  const values={
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    selectedProductID,        // Thêm dòng này
    setSelectedProductID,     // Thêm dòng này
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    cartCount, // Truyền cartCount vào context
    setCartCount // Để cập nhật khi thêm vào cart
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <>
      <BrowserRouter>
        <WishlistProvider>
          <MyContext.Provider value ={values}>
            <ScrollToTop />
            {
              isHeaderFooterShow === true && <Header />
            }
            <Routes>
              <Route path="/" exact={true} element={<Home />} />
              <Route path="/cat/:id" exact={true} element={<Listing />} />
              <Route exact={true} path="/product/:id" element={<ProductDetails/>}/>
              <Route exact={true} path="/cart" element={<Cart/>}/>
              <Route exact={true} path="/signIn" element={<SignIn/>}/>
              <Route exact={true} path="/signUp" element={<SignUp/>}/>
              <Route exact={true} path="/verify/:token" element={<Verify/>}/>
              <Route exact={true} path="/wishlist" element={<WishlistPage />} />
              <Route exact={true} path="/checkout" element={<CheckoutPage/>}/>
              <Route exact={true} path="/orders" element={<MyOrders/>}/>
              <Route exact={true} path="/thank-you" element={<ThankYou/>}/>
              <Route exact={true} path="/forgot-password" element={<ForgotPassword/>}/>
              <Route exact={true} path="/reset-password" element={<ResetPassword/>}/>
            </Routes>
            {isOpenProductModal === true && <ProductModal />}
            {
              isHeaderFooterShow === true && <Footer/>
            }
          </MyContext.Provider>
        </WishlistProvider>
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={4000}/>
    </>
    </GoogleOAuthProvider>
  );
}

export default App;
export {MyContext};
