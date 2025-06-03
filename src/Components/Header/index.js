import logo from "../../assets/images/logo.png"
import { Link } from 'react-router-dom';
import React, { useContext } from 'react';
import CountryDropDown from "../ContryDropDown";
import Button from '@mui/material/Button';
import { FaUserCircle } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
import SearchBox from "./SearchBox";
import Navigation from "./Navigation";
import { MyContext } from "../../App";


const Header =()=>
{
    const context = useContext(MyContext);

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
                                    :<Button className="circle mr-3"><FaUserCircle/></Button>
                                }
                                <div className="ml-auto cartTab">
                                    <span className="price ml-3">$3.29</span>
                                    <Button className="circle ml-3"><FaCartPlus/></Button>
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