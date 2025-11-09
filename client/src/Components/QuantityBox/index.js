
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useState } from "react";
const QuantityBox =({value, setValue})=>{
    const[inputVal, setInputVal] = useState(1)
    const current = typeof value === "number" ? value : inputVal;
    const onChange = setValue || setInputVal;

    const minus =()=>{
       if (current > 0 && current !== 1) {
        onChange(current - 1);
        }
    }
    const plus=()=>{
        onChange(current + 1)
    }
    return(
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minus}><FaMinus /></Button>
            <input type="text" value={current} onChange={e => {
                const v = Number(e.target.value) || 1;
                onChange(Math.max(1, v));
            }} />
            <Button onClick={plus}><FaPlus /></Button>
         </div>
    )
}
export default QuantityBox