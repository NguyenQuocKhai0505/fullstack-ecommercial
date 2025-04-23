import { FaAngleDown } from "react-icons/fa6";
import Button from '@mui/material/Button';
const CountryDropDown =()=>{
    return(
        <>
        <Button className="countryDrop">
                                <div className="info d-flex flex-column">
                                    <span className="label">You Location</span>
                                    <span className="name">Viet Nam</span>
                                </div>
                                <span className="ml-auto"><FaAngleDown/></span>
                            </Button>        
        </>
    )


}
export default CountryDropDown