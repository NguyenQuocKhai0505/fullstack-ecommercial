import { useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from '@mui/material/Button';
import { IoIosTrendingUp } from "react-icons/io";
import { IoIosTrendingDown } from "react-icons/io";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoTimeOutline } from "react-icons/io5";
const options = [
  "Last Day",
  "Last Week",
  "Last Month",
  "Last Year"
];
const ITEM_HEIGHT = 48;
const DashboardBox =(props)=>{
    
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
         <div className="dashboardBox" style={{
            backgroundImage:`linear-gradient(to right,${props.color?.[0]},${props.color?.[1]})`
         }}>
            {
                props.grow ===true?
                <span className="chart">
                    <IoIosTrendingUp/>
                </span>
                :
                <span className="chart">
                    <IoIosTrendingDown/>
                </span>
            }
        
        
            <div className="d-flex w-100">
                <div className="col1 mb-0">
                    <h4 className="text-white">Total User</h4>
                    <span className="text-white">277</span>
                </div>
                <div className="ml-auto">
                   {
                    props.icon ? 
                    <span className="icon">
                        {props.icon ? props.icon :" "}
                    </span>
                    :
                    " "
                   }
                </div>
            </div>

        
        <div className="d-flex align-items-center w-100 bottomEle">
            <h6 className="text-white mb-0 mt-0">Last Month</h6>
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

         </div>
         </>
    )
}
export default DashboardBox