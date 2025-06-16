
import DashboardBox from "./components/dashboardBox"
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoTimeOutline } from "react-icons/io5";
import {Chart} from "react-google-charts"

import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
const options = [
  "Last Day",
  "Last Week",
  "Last Month",
  "Last Year"
];
export const data =[
    ["Year","Sales","Expenses"],
    ["2013",1000,400],
    ["2014",1170,460],
    ["2015",1170,460],
    ["2016",1170,460],
]
export const colorOption={
    "backgroundColor":"transparent",
    "chartArea": {"width":"100%","height":"80%"}
}


const ITEM_HEIGHT = 48;
const Dashboard = () =>{
    
    const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setshowBy] = useState('');
     const [CatBy, setCatBy] = useState('');
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return(
        <>
          <div className="right-content w-100">
            {/* DASHBOARD DESIGN */}
             <div className="row dashboardBoxWrapperRow">
                <div className="col-md-8">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={["#1da256","#48d483"]} icon={<FaUserCircle/>} grow={true}/>
                        <DashboardBox color={["#c012e2","#eb64fe"]} icon={<FaShoppingCart/>} grow={false}/>
                        <DashboardBox color={["#2c78e5","#60aff5"]} icon={<FaShoppingBag/>} grow={true}/>
                        <DashboardBox color={["#e1950e","#f3cd29"]} icon={<FaStar />} grow={false}/>
                    </div>
                </div>

                <div className="col-md-4 pl-0">
                    <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h4 className="text-white mb-0 mt-0">Total Sales</h4>
                                <div className="ml-auto">
                                    <Button className="ml-auto toggleIcon"
                                    onClick={handleClick}
                                    ><BsThreeDotsVertical/></Button>
                                    {/* Menu */}
                                    <Menu
                                        className="dropdown_menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        slotProps={{
                                        paper: {
                                            style: {
                                            maxHeight: ITEM_HEIGHT * 4.5,
                                            width: '20ch',
                                            },
                                        },
                                        list: {
                                            'aria-labelledby': 'long-button',
                                        },
                                        }}
                                    >
                                    {options.map((option) => (
                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                        <IoTimeOutline className="mr-2"/>{option}
                                    </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                        <h2 className="text-white font-weight-bold pt-2">$3,344,653.00</h2>
                        <p>$2,433,646.00 in last month</p>
                        <Chart
                        chartType="PieChart"
                        width = "100%"
                        height = "200px"
                        data={data}
                        options={colorOption}
                        />
                    </div>
                </div>
             </div>

             <div className="card shadow border-0 p-3 mt-4">
                    <div className="hd">Best Selling Products</div>


                    <div className="row cardFilters">
                        {/* SHOW BY */}
                        <div className=" col col-md-3 mt-3">
                        
                            <h6>SHOW BY</h6>
                             <FormControl size="small" className="w-100">
                                <Select
                                value={showBy}
                                onChange={(e)=>setshowBy(e.target.value)}
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
                        <div className=" col col-md-3 mt-3">
                            <h6>CATEGORY BY</h6>
                             <FormControl size="small" className="w-100">
                                <Select
                                value={CatBy}
                                onChange={(e)=>setCatBy(e.target.value)}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                labelId="demo-select-small-label"
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
                    
                    <div className="table-responsiv mt-3">
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
                                    <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>

                                     <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    
                                     <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>

                                     <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>

                                        <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>

                                        <tr>
                                        <td>#1</td>
                                        <td>
                                           <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp"
                                                        className="w-100"/>
                                                    </div>
                                                </div>
                                                <div className="info pl-0">
                                                     <h6>Tops and skirt set for Female</h6>
                                                    <p>Women's exclusive summer Tops and Skirts set for Female Tops and Skirt set</p>
                                                </div>
                                           </div>
                                        </td>
                                        <td>womans</td>
                                        <td>richman</td>
                                        <td>
                                            <span className="oldPrice">$32.00</span>
                                            <span className="newPrice">$21.00</span>
                                        </td>
                                        <td>30</td>
                                        <td>4.9(16)</td>
                                        <td>380</td>
                                        <td>$38k</td>
                                        <td>
                                            <div className="actions d-flex align-items-center"> 
                                                    <Button className="secondary" color="secondary"><IoEyeSharp/></Button>
                                                    <Button className="success" color="success"><MdEdit/></Button>
                                                    <Button className="error" color="error"><MdDelete/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                        </table>
                        {/* PAGNIGATION */}
                        <div className="d-flex tableFooter">
                            <p>Showing <b>10</b> of <b>50</b> products</p>
                             <Pagination count={50} color="primary" className="pagination"
                             showFirstButton showLastButton />
                        </div>
                       
                    </div>

             </div>
          </div>
        </>
    )

}
export default Dashboard