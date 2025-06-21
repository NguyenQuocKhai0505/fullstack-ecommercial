import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { Link } from 'react-router-dom';
const Products = () => {
    const context = useContext(MyContext)
    
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false)
        window.scroll(0, 0)
    }, [])
    
    const [showBy, setshowBy] = useState('');
    const [CatBy, setCatBy] = useState('');

    // Sample products data
    const products = [
        {
            id: 1,
            name: "Tops and skirt set for ...",
            description: "Women's exclusive sum...",
            category: "womans",
            brand: "richman",
            oldPrice: "$21.00",
            newPrice: "$21.00",
            stock: 380,
            rating: "4.9(16)",
            sales: "$38k",
            image: "https://mironcoder-hotash.netlify.app/images/product/01.webp"
        },
        {
            id: 2,
            name: "Tops and skirt set for ...",
            description: "Women's exclusive sum...",
            category: "womans", 
            brand: "richman",
            oldPrice: "$21.00",
            newPrice: "$21.00",
            stock: 380,
            rating: "4.9(16)",
            sales: "$38k",
            image: "https://mironcoder-hotash.netlify.app/images/product/01.webp"
        },
        {
            id: 3,
            name: "Tops and skirt set for ...",
            description: "Women's exclusive sum...",
            category: "womans",
            brand: "richman", 
            oldPrice: "$21.00",
            newPrice: "$21.00",
            stock: 380,
            rating: "4.9(16)",
            sales: "$38k",
            image: "https://mironcoder-hotash.netlify.app/images/product/01.webp"
        },
        {
            id: 4,
            name: "Tops and skirt set for ...",
            description: "Women's exclusive sum...",
            category: "womans",
            brand: "richman",
            oldPrice: "$21.00", 
            newPrice: "$21.00",
            stock: 380,
            rating: "4.9(16)",
            sales: "$38k",
            image: "https://mironcoder-hotash.netlify.app/images/product/01.webp"
        }
    ];

    return (
        <>
            <div className="right-content w-100">
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Product List</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="#" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <span>Products</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                {/* STATS BOXES */}
                <div className="row dashboardBoxWrapperRow mb-4">
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #1da256, #48d483)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaUserCircle size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #c012e2, #eb64fe)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaShoppingCart size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #2c78e5, #60aff5)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaShoppingBag size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCTS TABLE */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="hd">Best Selling Products</div>

                    <div className="row cardFilters">
                        {/* SHOW BY */}
                        <div className="col col-md-3 mt-3">
                            <h6>SHOW BY</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => setshowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        
                        {/* CATEGORY BY */}
                        <div className="col col-md-3 mt-3">
                            <h6>CATEGORY BY</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={CatBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Ten</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            {/* HEADER */}
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>STOCK</th>
                                    <th>RATING</th>
                                    <th>ORDER</th>
                                    <th>SALES</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            
                            {/* BODY */}
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <input type="checkbox" className="mr-2" />
                                                #{product.id}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src={product.image} className="w-100" alt={product.name} />
                                                    </div>
                                                </div>
                                                <div className="info pl-3">
                                                    <h6>{product.name}</h6>
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <span className="oldPrice">{product.oldPrice}</span>
                                            <span className="newPrice">{product.newPrice}</span>
                                        </td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="rating-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < 4 ? "star filled" : "star"}>★</span>
                                                    ))}
                                                </div>
                                                <span className="ml-2">{product.rating}</span>
                                            </div>
                                        </td>
                                        <td>{product.stock}</td>
                                        <td>{product.sales}</td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                                <Link to="/products/details">
                                                 <Button className="secondary mr-1" color="secondary">
                                                    <IoEyeSharp />
                                                </Button>
                                                </Link>
                                                <Button className="success mr-1" color="success">
                                                    <MdEdit />
                                                </Button>
                                                <Button className="error" color="error">
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* PAGINATION */}
                        <div className="d-flex tableFooter">
                            <p>Showing <b>4</b> of <b>50</b> products</p>
                            <Pagination 
                                count={50} 
                                color="primary" 
                                className="pagination ml-auto"
                                showFirstButton 
                                showLastButton 
                            />
                        </div>
                    </div>
                </div>
            </div>
            </>
    )}
export default Products