import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/index"
import Home from "./Pages/Home/index"
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
const MyContext = createContext();

function App() {
  const [countryList,setCountryList] = useState([]);
  const [selectedCountry,setselectedCountry] = useState('')
  const [isOpenProductModal, setisOpenProductModal] = useState(false)
  const [selectedProductID,setSelectedProductID]= useState(null)
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  useEffect(()=>{
    getCountry("https://countriesnow.space/api/v0.1/countries/")
  },[])
  
  const getCountry= async (url)=>{
    await axios.get(url).then((res)=>{
      setCountryList(res.data.data)
      // console.log(res.data.data)
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
    setIsLogin
  }
  return (
    <>
      <BrowserRouter>
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
        </Routes>
         
        {isOpenProductModal === true && <ProductModal />}
         
        {
          isHeaderFooterShow === true && <Footer/>
        }
        </MyContext.Provider>
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={4000}/>
    </>
  );
}

export default App;
export {MyContext};
