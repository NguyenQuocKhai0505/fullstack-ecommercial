import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import LogIn from './pages/LogIn';
import ProductDetails from './pages/Products/ProductDetails';
import Products from './pages/Products';
import Category from './pages/Category';
import { SnackbarProvider, useSnackbar } from 'notistack';
// Sửa import - dùng Alert từ Material-UI thay vì Bootstrap
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // Sửa import này
import AddCategory from './pages/Category/AddCategory';
import EditCategory from './pages/Category/EditCategory';
import AddProducts from './pages/Products/AddProducts';
import EditProducts from './pages/Products/EditProducts';
import AddSubCategory from "./pages/SubCategory/addSubCategory"
import SubCategory from './pages/SubCategory/index';
import EditSubCategory from '../src/pages/SubCategory/EditSubCategory';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
const MyContext = createContext()
function App() {
  const [isToggleSidebar,setisToggleSidebar] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isHiddenSidebarAndHeader, setisHiddenSidebarAndHeader] = useState(false)
  const [themeMode, setThemeMode] = useState(true)
  const [open, setOpen] = useState(false);

   // Thêm state cho message và severity
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

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
  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      setIsLogin(true)
    }
  })
 
   const handleClose = (event,reason)=>{
    if(reason ==="clickaway"){
        return
    }
        setOpen(false)
   }
   // Thêm function để show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpen(true);
  }
   
  const values={
    isToggleSidebar,
    setisToggleSidebar,
    isLogin,
    setIsLogin,
    isHiddenSidebarAndHeader,
    setisHiddenSidebarAndHeader,
    themeMode,
    setThemeMode,
    showSnackbar,
  }
  return (
      <BrowserRouter>
      <MyContext.Provider value={values}>
       <Snackbar 
          open={open} 
          autoHideDuration={6000} 
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
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
                <Route path ="/" exact={true} element={
                  <ProtectedRoutes>
                    <Dashboard/>
                  </ProtectedRoutes>
                }/>
                <Route path ="/dashboard" exact={true} element={
                  <ProtectedRoutes>
                    <Dashboard/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/signIn" element={<LogIn/>}/>
                {/* <Route exact={true} path="/signUp" element={<SignUp/>}/> */}
                <Route exact={true} path="/products" element={
                  <ProtectedRoutes>
                    <Products/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/products/details/:id" element={
                  <ProtectedRoutes>
                    <ProductDetails/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/products/upload" element={
                  <ProtectedRoutes>
                    <AddProducts/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/products/edit/:id" element={
                  <ProtectedRoutes>
                    <EditProducts/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/category" element={
                  <ProtectedRoutes>
                    <Category/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/category/add" element={
                  <ProtectedRoutes>
                    <AddCategory/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/category/edit/:id" element={
                  <ProtectedRoutes>
                    <EditCategory/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/subcat" element={
                  <ProtectedRoutes>
                    <SubCategory/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/subcat/create" element={
                  <ProtectedRoutes>
                    <AddSubCategory/>
                  </ProtectedRoutes>
                }/>
                <Route exact={true} path="/subcat/edit/:id" element={
                  <ProtectedRoutes>
                    <EditSubCategory/>
                  </ProtectedRoutes>
                }/>
             </Routes>
            </div>
          </div>
      </MyContext.Provider>
      </BrowserRouter>
  );
}

export default App;
export  {MyContext}
