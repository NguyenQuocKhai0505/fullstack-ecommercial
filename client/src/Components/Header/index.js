import logo from "../../assets/images/logo.png"
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CountryDropDown from "../ContryDropDown";
import Button from '@mui/material/Button';
import { FaUserCircle } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { MyContext } from "../../App";
import { RiResetLeftFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiLogoutBoxFill } from "react-icons/ri";
const Header =()=>
{
    const context = useContext(MyContext);
    // Lấy số lượng sản phẩm trong giỏ hàng từ context (nếu có)
    const cartCount = context.cartCount || 0;
    // Thêm state cho menu user
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleUserClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        // Xử lý logout: xóa token, update context, chuyển hướng
        localStorage.removeItem("token");
        if (context.setIsLogin) context.setIsLogin(false);
        handleClose();
        window.location.href = "/signIn";
    };
    return(
        <>
        <div className="headerWrapper">
            <div className="top-strip bg-blue">
                <div className="container">
                    <p className="m-0 mt-0 text-center">Discover a World of Quality Shopping – Only the Best for You!</p>
                </div>
            </div>
            
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="logoWrapper d-flex align-items-center justify-content-start col-sm-2" >
                            <Link to={'/'}><img src={logo} alt='Logo'/></Link>
                        </div>
                        <div className="col-sm-10 d-flex align-items-center part2">
                            {
                                context.countryList.length !==0 && <CountryDropDown/>
                            }
                           <SearchBox/>
                           
                            <div className="part3 d-flex align-items-center ml-auto">
                                {
                                    context.isLogin !==true ?<Link to="/signIn"><Button className="btn-blue btn-lg btn-big btn-round mr-2">Sign In</Button></Link>
                                    :
                                    <>
                                        <Button
                                            className="circle mr-3"
                                            onClick={handleUserClick}
                                            aria-controls={open ? 'user-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <FaUserCircle />
                                        </Button>
                                        <Menu
                                            id="user-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': 'user-button',
                                            }}
                                            >
                                            <MenuItem component={Link} to="#" onClick={handleClose}>
                                                <RiResetLeftFill />&nbsp;Reset Password
                                            </MenuItem>
                                            <MenuItem component={Link} to="/cart" onClick={handleClose}>
                                                <FaShoppingCart />&nbsp;My Cart
                                            </MenuItem>
                                            <MenuItem component={Link} to="/wishlist" onClick={handleClose}>
                                                <FaHeart />&nbsp;My Wishlist
                                            </MenuItem>
                                            <MenuItem onClick={handleLogout}>
                                                <RiLogoutBoxFill />&nbsp;Log Out
                                            </MenuItem>
                                        </Menu>
                                    </>
                                }
                                <div className="ml-auto cartTab" style={{position: 'relative'}}>
                                    {/* <span className="price ml-3">$3.29</span> */}
                                    <Button className="circle ml-3" component={Link} to="/cart">
                                        <FaCartPlus />
                                        {cartCount > 0 && (
                                            <span className="count" style={{position: 'absolute', top: -6, right: -6, background: '#ea2b0f', color: '#fff', borderRadius: '50%', fontSize: 12, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{cartCount}</span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </header>
           <Navigation/>
        </div>
        </>
    )
}
export default Header