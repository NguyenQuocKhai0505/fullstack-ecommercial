import { IoMenu } from "react-icons/io5";
import Button from '@mui/material/Button';
import { FaAnglesDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa";

const Navigation =()=>
{
    return(
        <nav>
        <div className="container">
            <div className ="row">
                <div className ="col-sm-3 navPart1">
                    <Button className="allCatTab align-items-center">
                    <span className="icon1 mr-2"><IoMenu/></span>
                    <span class="text">ALL CATEGORIES</span>
                    <span className="icon2 ml-2"><FaAnglesDown/></span>
                    </Button>
                    
                </div>

                <div className ="col-sm-9 navPart2 d-flex align-items-center ">
                    <ul className="list list-inline ml-auto">
                        <li className="list-inline-item"><Link to="/"> <FaHome/> &nbsp; Home</Link></li>
                        <li className="list-inline-item"><Link to="/">Fashion</Link></li>
                        <li className="list-inline-item"><Link to="/">Electronic</Link></li>
                        <li className="list-inline-item"><Link to="/">Bakery</Link></li>
                        <li className="list-inline-item"><Link to="/">Grocery</Link></li>
                        <li className="list-inline-item"><Link to="/">Blog</Link></li>
                        <li className="list-inline-item"><Link to="/">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    )
}
export default Navigation