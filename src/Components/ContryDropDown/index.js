import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { IoIosSearch, IoMdSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import React from "react";
import Slide from "@mui/material/Slide";
const Transition = React.forwardRef(function Transition(props, ref){
    return <Slide direction="up" ref={ref} {...props}/>
})
const CountryDropDown =()=>{
    const [isOpenModal,setisOpenModal] = useState(false)

    return(
        <>
        <Button className="countryDrop" onClick ={() => setisOpenModal(true)}>
                                <div className="info d-flex flex-column">
                                    <span className="label">You Location</span>
                                    <span className="name">Viet Nam</span>
                                </div>
                                <span className="ml-auto"><FaAngleDown/></span>
        </Button> 

        <Dialog open={isOpenModal} onClose={()=>setisOpenModal(false)} className="locationModal" TransitionComponent={Transition}>
            <h4 className="mb-0">Choose Your Delevery Location</h4>
            <p>Enter you address and we will specify the offer for your area</p>
            <Button className="close_" onClick={()=>setisOpenModal(false)}><IoClose/></Button>
            <div className="headerSearch w-100">
             <input type="text" placeholder="Searching for your location...."/>
             <Button><IoIosSearch/></Button>
             </div>
        <ul className="countryList mt-3">
        <li><Button onClick={() => setisOpenModal(false)}>Hà Nội</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hồ Chí Minh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hải Phòng</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Đà Nẵng</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Cần Thơ</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>An Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bà Rịa - Vũng Tàu</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bắc Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bắc Kạn</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bạc Liêu</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bắc Ninh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bến Tre</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bình Định</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bình Dương</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bình Phước</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Bình Thuận</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Cà Mau</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Cao Bằng</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Đắk Lắk</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Đắk Nông</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Điện Biên</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Đồng Nai</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Đồng Tháp</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Gia Lai</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hà Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hà Nam</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hà Tĩnh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hải Dương</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hậu Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hòa Bình</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Hưng Yên</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Khánh Hòa</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Kiên Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Kon Tum</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Lai Châu</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Lâm Đồng</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Lạng Sơn</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Lào Cai</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Long An</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Nam Định</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Nghệ An</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Ninh Bình</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Ninh Thuận</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Phú Thọ</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Phú Yên</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Quảng Bình</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Quảng Nam</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Quảng Ngãi</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Quảng Ninh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Quảng Trị</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Sóc Trăng</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Sơn La</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Tây Ninh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Thái Bình</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Thái Nguyên</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Thanh Hóa</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Thừa Thiên Huế</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Tiền Giang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Trà Vinh</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Tuyên Quang</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Vĩnh Long</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Vĩnh Phúc</Button></li>
<li><Button onClick={() => setisOpenModal(false)}>Yên Bái</Button></li>
             </ul>
        </Dialog>  
        </>
    )


}
export default CountryDropDown