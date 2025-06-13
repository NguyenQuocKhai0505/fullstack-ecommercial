
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


                    <div className="row">
                        <div className="col mt-3">
                            <h6>SHOW BY</h6>
                        </div>
                    </div>
             </div>
          </div>
        </>
    )

}
export default Dashboard