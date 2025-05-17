import { IoMenu } from "react-icons/io5";
import Button from '@mui/material/Button';
import { FaAnglesDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { FaAngleRight } from "react-icons/fa";

const Navigation =()=>
{
    const [isopenSidebarVal,setisopenSidebarVal] = useState(true)

    return(
        <nav>
        <div className="container">
            <div className ="row">
                <div className ="col-sm-10 navPart1">
                    <div className="catWrapper">
                        <Button className="allCatTab align-items-center mt-2" 
                        onClick={()=>setisopenSidebarVal(!isopenSidebarVal)}
                            >
                        <span className="icon1 mr-2"><IoMenu/></span>
                        <span class="text">ALL CATEGORIES</span>
                        <span className="icon2 ml-2"><FaAnglesDown/></span>
                        </Button>
                        <div className={`sidebarNav ${isopenSidebarVal===true ? 'open':''}`}>
                               <ul>
                                <li><Link to="/"><Button>Men<FaAngleRight className="ml-auto"/></Button></Link>

                                 <div className="submenu">
                                        <Link to="/"><Button>Clothing</Button></Link>
                                        <Link to="/"><Button>Footwear</Button></Link>
                                        <Link to="/"><Button>Watches</Button></Link>
                                        <Link to="/"><Button>Shirts</Button></Link>
                                        <Link to="/"><Button>Trousers</Button></Link>
                                 </div>

                                </li>
                                <li><Link to="/"><Button>Woman<FaAngleRight className="ml-auto"/></Button></Link>

                                  <div className="submenu">
                                        <Link to="/"><Button>Clothing</Button></Link>
                                        <Link to="/"><Button>Footwear</Button></Link>
                                        <Link to="/"><Button>Watches</Button></Link>
                                        <Link to="/"><Button>Shirts</Button></Link>
                                        <Link to="/"><Button>Trousers</Button></Link>
                                 </div>

                                </li>
                                <li><Link to="/"><Button>Beauty</Button></Link></li>
                                <li><Link to="/"><Button>Watches</Button></Link></li>
                                <li><Link to="/"><Button>Kids</Button></Link></li>
                                <li><Link to="/"><Button>Gifts</Button></Link></li>
                               </ul>
                        </div>
                    </div>
                    
                </div>

                <div className ="col-sm-10 navPart2 d-flex align-items-center ">
                    <ul className="list list-inline ml-1">
                        <li className="list-inline-item"><Link to="/"><Button>Home</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Men</Button></Link>
                            <div className="submenu shadow">
                                <Link to="/"><Button>Clothing</Button></Link>
                                <Link to="/"><Button>Footwear</Button></Link>
                                <Link to="/"><Button>Watches</Button></Link>
                                <Link to="/"><Button>Shirts</Button></Link>
                                <Link to="/"><Button>Trousers</Button></Link>
                        
                            </div>
                        </li>
                        <li className="list-inline-item"><Link to="/"><Button>Women</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Beauty</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Watches</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Kids</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Gifts</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Blog</Button></Link></li>
                        <li className="list-inline-item"><Link to="/"><Button>Contact</Button></Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    )
}
export default Navigation