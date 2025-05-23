import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header/index"
import Home from "./Pages/Home/index"
import Listing from "./Components/Listing"
import { createContext, useState,useEffect } from "react";
import axios from "axios"
import Footer from "./Components/Footer/index"
import ProductModal from "./Components/Product Modal";
const MyContext = createContext();

function App() {
  const [countryList,setCountryList] = useState([]);
  const [selectedCountry,setselectedCountry] = useState('')
      const [isOpenProductModal, setisOpenProductModal] = useState(false)
  useEffect(()=>{
    getCountry("https://countriesnow.space/api/v0.1/countries/")
  },[])
  
  const getCountry= async (url)=>{
    const responsive = await axios.get(url).then((res)=>{
      setCountryList(res.data.data)
      // console.log(res.data.data)
    })
  }

  const values={
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal
  }

  return (
    <>
      <BrowserRouter>
      <MyContext.Provider value ={values}>
        <Header />
        <Routes>
           <Route path="/" exact={true} element={<Home />} />
           <Route path="/cat/:id" exact={true} element={<Listing />} />
        </Routes>
         {
            isOpenProductModal ===true && <ProductModal/>
         }
         <Footer/>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
export {MyContext};
