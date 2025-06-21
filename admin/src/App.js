import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';

const MyContext = createContext()
function App() {

  const [isToggleSidebar,setisToggleSidebar] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isHiddenSidebarAndHeader, setisHiddenSidebarAndHeader] = useState(false)
  const [themeMode, setThemeMode] = useState(true)
  // Chế độ light/dark mode
  useEffect(() => {
    if (themeMode === true) {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      localStorage.setItem("themeMode", "light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      localStorage.setItem("themeMode", "dark");
    }
    
  }, [themeMode])
  

  const values={
    isToggleSidebar,
    setisToggleSidebar,
    isLogin,
    setIsLogin,
    isHiddenSidebarAndHeader,
    setisHiddenSidebarAndHeader,
    themeMode,
    setThemeMode
  }
  return (
      <BrowserRouter>
      <MyContext.Provider value={values}>
           {/* Hidden Header*/}
        {
          isHiddenSidebarAndHeader !==true &&
          <Header/>
        }
    
          <div className='main d-flex'>
            {/* Hidden Sidebar*/}
           {
            isHiddenSidebarAndHeader !==true &&
            <div className={`sidebarWrapper ${isToggleSidebar === true ? "toggle" : "" }`}>
                <Sidebar/>
            </div>
           }
            <div className={`content ${isHiddenSidebarAndHeader===true && "full"} ${isToggleSidebar === true ? "toggle":""}`}>
              <Routes>
                <Route path ="/"exact={true} element={<Dashboard/>}/>
                <Route path ="/dashboard"exact={true} element={<Dashboard/>}/>
                <Route exact={true} path="/login" element={<LogIn/>}/>
                <Route exact={true} path="/signUp" element={<SignUp/>}/>
                <Route exact={true} path="/products" element={<Products/>}/>
                <Route exact={true} path="/products/details" element={<ProductDetails/>}/>
             </Routes>
            </div>
          </div>
      </MyContext.Provider>
      </BrowserRouter>
  );
}

export default App;
export  {MyContext}
