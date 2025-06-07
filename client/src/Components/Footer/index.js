
import { IoShirtOutline } from "react-icons/io5";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiDiscount1 } from "react-icons/ci";
import { BsCoin } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";

const Footer =()=>{
    return(
        <footer>
            <div className="container">
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">
                        <span><IoShirtOutline /></span>
                        <span className="ml-2">Everyday fresh products</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><CiDeliveryTruck /></span>
                        <span className="ml-2">Free delivery for order over $70</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><CiDiscount1 /></span>
                        <span className="ml-2">Daily mega discount</span>
                    </div>

                    <div className="col d-flex align-items-center">
                        <span><BsCoin /></span>
                        <span className="ml-2">Best price on the market</span>
                    </div>

                </div>

                <div className="row mt-5 linksWrap">
                    <div className="col">
                        <h5>FRUIT & VEGETABLE</h5>
                        <ul>
                           <li><Link to="#">Fresh Vegetables</Link></li> 
                           <li><Link to="#">Herbs & Seasoning</Link></li> 
                           <li><Link to="#">Fresh Fruit</Link></li> 
                           <li><Link to="#">Cuts & Sprouts</Link></li> 
                           <li><Link to="#">Exotics Fruits & Veggies</Link></li> 
                           <li><Link to="#">Packaged Produce</Link></li> 
                           <li><Link to="#">Party Trays</Link></li> 
                        </ul>
                    </div>
                     <div className="col">
                            <h5>BREAKFAST & DAIRY</h5>
                            <ul>
                            <li><Link to="#">Milk & Flavoured Milk</Link></li>
                            <li><Link to="#">Butter and Margarine</Link></li>
                            <li><Link to="#">Cheese</Link></li>
                            <li><Link to="#">Eggs Substitutes</Link></li>
                            <li><Link to="#">Honey</Link></li>
                            <li><Link to="#">Marmalades</Link></li>
                            <li><Link to="#">Sour Cream and Dips</Link></li>
                            <li><Link to="#">Yogurt</Link></li>
                            </ul>
                    </div>

                      <div className="col">
                            <h5>MEAT & SEAFOOD</h5>
                            <ul>
                            <li><Link to="#">Breakfast Sausage</Link></li>
                            <li><Link to="#">Dinner Sausage</Link></li>
                            <li><Link to="#">Beef</Link></li>
                            <li><Link to="#">Chicken</Link></li>
                            <li><Link to="#">Sliced Deli Meat</Link></li>
                            <li><Link to="#">Shrimp</Link></li>
                            <li><Link to="#">Wild Caught Fillets</Link></li>
                            <li><Link to="#">Crab and Shellfish</Link></li>
                            <li><Link to="#">Farm Raised Fillets</Link></li>
                            </ul>
                     </div>

                    <div className="col">
                        <h5>BEVERAGES</h5>
                        <ul>
                        <li><Link to="#">Water</Link></li>
                        <li><Link to="#">Sparkling Water</Link></li>
                        <li><Link to="#">Soda & Pop</Link></li>
                        <li><Link to="#">Coffee</Link></li>
                        <li><Link to="#">Milk & Plant-Based Milk</Link></li>
                        <li><Link to="#">Tea & Kombucha</Link></li>
                        <li><Link to="#">Drink Boxes & Pouches</Link></li>
                        <li><Link to="#">Craft Beer</Link></li>
                        <li><Link to="#">Wine</Link></li>
                        </ul>
                    </div>

                      <div className="col">
                        <h5>BREADS & BAKERY</h5>
                        <ul>
                        <li><Link to="#">Milk & Flavoured Milk</Link></li>
                        <li><Link to="#">Butter and Margarine</Link></li>
                        <li><Link to="#">Cheese</Link></li>
                        <li><Link to="#">Eggs Substitutes</Link></li>
                        <li><Link to="#">Honey</Link></li>
                        <li><Link to="#">Marmalades</Link></li>
                        <li><Link to="#">Sour Cream and Dips</Link></li>
                        <li><Link to="#">Yogurt</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="copyright mt-3 pb-3 pt-3 d-flex">
                    <p className="mb-0">Copyright ©2025 karket.com. Made by Nguyen Quoc Khai </p>
                    <ul className="list list-inline">
                        <li className="list-inline-item">
                            <Link to="#"><FaFacebook /></Link> 
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><SiZalo /></Link> 
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><FaInstagram /></Link>  
                        </li>
                        
                        
                    </ul>
                </div>
            </div>
        </footer>
    )
}
export default Footer