import { Link } from "react-router-dom"
import Logo from "../../assets/images/Logo.png"
import Button from '@mui/material/Button';
import { RiMenuFoldFill } from "react-icons/ri";
import SearchBox from "../SearchBox";
import { IoMdSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import Admin from "../../assets/images/admin.png"
import React, { useContext } from "react";
import { useState, useRef } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import { LuShieldAlert } from "react-icons/lu";
import { FaUser } from "react-icons/fa";
import Divider from '@mui/material/Divider';
import { MyContext } from "../../App";
import { IoMenu } from "react-icons/io5";
import UserAvatarImgComponent from "../userAvatarImg";

const Header = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationAnchor, setNotificationAnchor] = useState(null);
    const openMyAcc = Boolean(anchorEl);
    const openNotifications = Boolean(notificationAnchor);
    const context = useContext(MyContext)


    const handleOpenMyAccDrop = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleCloseMyAccDrop = () => {
        setAnchorEl(null);
    };
    
    const handleOpenNotificationsDrop = (event) => {
        setNotificationAnchor(event.currentTarget);
    };
    
    const handleCloseNotificationsDrop = () => {
        setNotificationAnchor(null);
    };

    return (
        <>
            <header className="d-flex align-items-center">
                <div className="container-fluid w-100">
                    <div className="row d-flex align-items-center w-100">
                        {/* Logo Wrapper */}
                        <div className="col-sm-2 part1">
                            <Link to={"/"} className="d-flex align-items-center logo">
                                <img src={Logo} className="mr-2" alt="Logo"/>
                                <span>Kmarket</span>
                            </Link>
                        </div>
                        
                        {/* Tab Menu And Search Box */}
                        <div className="col-sm-3 d-flex align-items-center  part2">
                            <Button className="rounded-circle mr-3"
                            onClick={()=>context.setisToggleSidebar(!context.isToggleSidebar)}>
                                {
                                    context.isToggleSidebar ===false ? <RiMenuFoldFill/> : <IoMenu />
                                }
                            </Button>
                            <SearchBox/>
                        </div>
                        
                        {/* Other Categories */}
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">
                            <Button className="rounded-circle mr-3" onClick={()=>context.setThemeMode(!context.themeMode)}>
                                <IoMdSunny />
                            </Button>
                            <Button className="rounded-circle mr-3">
                                <FaShoppingCart />
                            </Button>
                            <Button className="rounded-circle mr-3">
                                <IoMdMail />
                            </Button>
                            
                            {/* Notifications */}
                            <div className="dropdownWrapper position-relative ">
                                <Button 
                                    className="rounded-circle mr-3" 
                                    onClick={handleOpenNotificationsDrop}
                                >
                                    <FaBell />
                                </Button>
                                
                                {/* Notification Menu */}
                                <Menu
                                    anchorEl={notificationAnchor}
                                    className="notifications dropdown_list"
                                    id="notifications"
                                    open={openNotifications}
                                    onClose={handleCloseNotificationsDrop}
                                    onClick={handleCloseNotificationsDrop}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <div className="head pl-3 pb-0">
                                        <h4>Notifications</h4>
                                    </div>
                                    <Divider className="mb-1"/>
                                    <div className="scroll">
                                        <MenuItem onClick={handleCloseNotificationsDrop}  className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseNotificationsDrop} className="mb-1">
                                        <div className="d-flex align-items-start">
                                            <UserAvatarImgComponent img={Admin}/>
                                            <div className="dropDownInfo">
                                                <h4>
                                                <span>
                                                    <b>Quoc Khai</b>added to his favorite list{' '}
                                                    <b>Leather belt Steve Madden</b>
                                                </span>
                                                </h4>
                                                <p className="text-sky">few seconds ago</p>
                                            </div>
                                            </div>
                                        </MenuItem>
                                    </div>
                                    <div className="pl-3 pr-3 w-100">
                                          <Button className="btn-blue w-100">View all notifications</Button>
                                    </div>
                                </Menu>
                            </div>
                            
                            {/* Fixed conditional rendering */}
                            {context.isLogin !== true ? 
                                <Link to="/signIn"><Button className="btn-blue btn-lg btn-round">Sign in</Button></Link>
                             : 
                                <div className="myAccWrapper">
                                    <Button 
                                        className="myAcc d-flex align-items-center"
                                        onClick={handleOpenMyAccDrop}
                                    >
                                        <div className="userImg">
                                            <span className="rounded-circle" style={{ fontSize: 32, background: "#eee", padding: 8 }}>
                                                <FaUser />
                                            </span>
                                        </div>
                                        
                                        {/* User Information */}
                                        <div className="userInfo">
                                            <h4 style={{ marginBottom: 0 }}>{(JSON.parse(localStorage.getItem("adminInfo"))?.name) || "Admin"}</h4>
                                            <p className="mb-0" style={{ fontSize: 12, color: "#888" }}>
                                                {(() => {
                                                    const email = (JSON.parse(localStorage.getItem("adminInfo"))?.email) || "admin@example.com";
                                                    return email.length > 20 ? email.slice(0, 20) + "..." : email;
                                                })()}
                                            </p>
                                        </div>
                                    </Button>
                                    
                                    {/* Account Menu */}
                                    <Menu
                                        anchorEl={anchorEl}
                                        id="account-menu"
                                        open={openMyAcc}
                                        onClose={handleCloseMyAccDrop}
                                        onClick={handleCloseMyAccDrop}
                                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    >
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <FaUser fontSize="small" />
                                            </ListItemIcon>
                                            My Account
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <LuShieldAlert fontSize="small" />
                                            </ListItemIcon>
                                            Reset Password
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseMyAccDrop}>
                                            <ListItemIcon>
                                                <Logout fontSize="small" />
                                            </ListItemIcon>
                                            Logout
                                        </MenuItem>
                                    </Menu>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header