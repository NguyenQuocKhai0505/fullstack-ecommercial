import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { IoIosSearch, IoMdSearch } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import React from "react";
import Slide from "@mui/material/Slide";
import { MyContext } from "../../App";
const Transition = React.forwardRef(function Transition(props, ref){
    return <Slide direction="up" ref={ref} {...props}/>
})
const CountryDropDown =()=>{
    const [isOpenModal,setisOpenModal] = useState(false)
    const [selectedTab, setselectedTab] = useState(null)
    const [countryList,setcountryList] = useState([])


    const context = useContext(MyContext)

    const selectCountry = (index,country)=>{
        setselectedTab(index)
        setisOpenModal(false)
        context.setselectedCountry(country)
    }
    useEffect(() =>{
        setcountryList(context.countryList || []);
    }, [context.countryList])
    
    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        if(keyword!==""){
            const list = context.countryList.filter((item) => {
                return item.country.toLowerCase().includes(keyword);
            });
            setcountryList(list);
        } else{
            setcountryList(context.countryList)
        }        
    };
    

    return(
        <>
        <Button className="countryDrop" onClick ={() => setisOpenModal(true)}>
                                <div className="info d-flex flex-column">
                                    <span className="label">Your Location</span>
                                    
                                    <span className="name">
                                        {
                                            context.selectedCountry !== ""
                                            ? context.selectedCountry.length > 10
                                                ? context.selectedCountry.substring(0, 10) + "..."
                                                : context.selectedCountry
                                            : "Select a location"
                                        }
                                    </span>

                                </div>
                                <span className="ml-auto"><FaAngleDown/></span>
        </Button> 

        <Dialog open={isOpenModal} onClose={()=>setisOpenModal(false)} className="locationModal" TransitionComponent={Transition}>
            <h4 className="mb-0">Choose Your Delevery Location</h4>
            <p>Enter you address and we will specify the offer for your area</p>
            <Button className="close_" onClick={()=>setisOpenModal(false)}><IoClose/></Button>
            <div className="headerSearch w-100">
             <input type="text" placeholder="Searching for your location...." onChange={filterList}/>
             <Button><IoIosSearch/></Button>
             </div>
        <ul className="countryList mt-3">
            {
               countryList?.length !==0 && countryList?.map((item,index)=>{
                    return(
                        <li key={index}><Button onClick={() => selectCountry(index,item.country)}
                        className={`${selectedTab===index ?'active':''}`}

                        >{item.country}</Button></li>
                    )
                })
            }
        

             </ul>
        </Dialog>  
        </>
    )


}
export default CountryDropDown