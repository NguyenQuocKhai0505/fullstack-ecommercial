
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import { IoIosCart } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { IoNotificationsCircle } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { SlLogout } from "react-icons/sl";
import { MyContext } from '../../App';
import { MdCategory } from "react-icons/md";
import { DiSublime } from "react-icons/di";
const Sidebar = () =>{

    const [activeTab,setActiveTab] = useState(0)
    const [isToggleSubmenu,setisToggleSubmenu] = useState(false)
    const isOpenSubmenu=(index)=>{
        setActiveTab(index)
        setisToggleSubmenu(!isToggleSubmenu)
    }
    const context = useContext(MyContext)
    return(
        <>
        <div className="sidebar">
            {/* Dashboard */}
            
            <ul>
               <li>
                <Link to="/">
                    <Button className={`w-100 ${activeTab===0  ? "active":' '}`} onClick={()=>isOpenSubmenu(0)}>
                    <span className='icon'><MdDashboard /></span>Dashboard 
                    <span className='arrow'><FaAngleRight /></span>
                    </Button>
               </Link>
               </li> 
            </ul>
            {/* Products */}
              <ul>
               <li>
                    <Button className={`w-100 ${activeTab===1  ? "active":' '}`}onClick={()=>isOpenSubmenu(1)}>
                    <span className='icon'><FaProductHunt /></span>Products 
                    <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    {/* Product Menu */}
                    <div className={`submenuWrapper ${activeTab===1 && isToggleSubmenu==true ? "colapse":"colapsed"}`}>
                    <ul className='submenu'>
                        <li><Link to="/products">Product List</Link></li>
                        <li><Link to="/products/upload">Product Upload</Link></li>
                    </ul>
                    </div>
               </li> 
            </ul>
              {/* Category */}
              <ul>
               <li>
                    <Button className={`w-100 ${activeTab===2  ? "active":' '}`}onClick={()=>isOpenSubmenu(2)}>
                    <span className='icon'><MdCategory /></span>Category 
                    <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    {/* Product Menu */}
                    <div className={`submenuWrapper ${activeTab===2 && isToggleSubmenu==true ? "colapse":"colapsed"}`}>
                    <ul className='submenu'>
                        <li><Link to="/category">Category List</Link></li>
                        <li><Link to="/category/add">Add A Category</Link></li>
                    </ul>
                    </div>
               </li> 
            </ul>
            {/* Sub category */}
            <ul>
               <li>
                    <Button className={`w-100 ${activeTab===3  ? "active":' '}`}onClick={()=>isOpenSubmenu(3)}>
                    <span className='icon'><DiSublime /></span>Sub Category 
                    <span className='arrow'><FaAngleRight /></span>
                    </Button>
                    {/* Product Menu */}
                    <div className={`submenuWrapper ${activeTab===3 && isToggleSubmenu==true ? "colapse":"colapsed"}`}>
                    <ul className='submenu'>
                        <li><Link to="/subcat">S-Category List</Link></li>
                        <li><Link to="/subcat/create">Add S-Category</Link></li>
                    </ul>
                    </div>
               </li> 
            </ul>
            <br/>
            {/* Logout Button */}
            <div className='logoutWrapper'>
               <div className='logoutBox'>
                 <Button variant="contained"><SlLogout/>Logout</Button>
               </div>
            </div>

        </div>
        </>
    )
}
export default Sidebar