import logo from "../../assets/images/logo.png"
import { Link } from 'react-router-dom';
import React from 'react';
import CountryDropDown from "../ContryDropDown";
import Button from '@mui/material/Button';
import { FaUserCircle } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";


const Header =()=>
{
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
                        <div className="logoWrapper d-flex align-items-center col-sm-2">
                            <Link to={'/'}><img src={logo} alt='Logo'/></Link>
                        </div>
                        <div className="col-sm-10 d-flex align-items-center part2">
                            <CountryDropDown/>

                           <SearchBox/>


                            <div className="part3 d-flex align-items-center ml-auto">
                                <Button className="circle mr-3"><FaUserCircle/></Button>
                                <div className="ml-auto cartTab">
                                    <span className="price">$3.29</span>
                                    <Button className="circle ml-2"><FaCartPlus/></Button>
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