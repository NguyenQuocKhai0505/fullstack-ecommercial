import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css"
import Sidebar from './components/Sidebar';
import { createContext, useEffect, useState } from 'react';
import LogIn from './pages/LogIn';

const MyContext = createContext()
function App() {

  const [isToggleSidebar,setisToggleSidebar] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isHiddenSidebarAndHeader, setisHiddenSidebarAndHeader] = useState(false)

  const values={
    isToggleSidebar,
    setisToggleSidebar,
    isLogin,
    setIsLogin,
    isHiddenSidebarAndHeader,
    setisHiddenSidebarAndHeader
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
             </Routes>
            </div>
          </div>
      </MyContext.Provider>
      </BrowserRouter>
  );
}

export default App;
export  {MyContext}
