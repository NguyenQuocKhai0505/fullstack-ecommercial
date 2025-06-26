import axios from "axios"
import { MdUpdate } from "react-icons/md"



// GET request function
export const fetchDataFromApi = async(url) => {
    try {
        const {data} = await axios.get("http://localhost:4000" + url)
        return data
    } catch(error) {
        console.log(error)
        return error
    }
}

// POST request function - ĐÃ SỬA LỖI
export const postData = async (url, formData) => {
    try {
        const {data} = await axios.post("http://localhost:4000" + url, formData)
        return data
    } catch(error) {
        console.log(error)
        return error
    }
}

//PUT edit data
export const editData = async(url,updateData) =>{
     try {
        const {data} = await axios.put("http://localhost:4000" + url, updateData)
        return data
    } catch(error) {
        console.log(error)
        throw error
    }
}
//DELETE
export const deleteData = async (url)=>{
     try {
       const {data} = await axios.delete(`http://localhost:4000${url}`)
        return data
    } catch(error) {
        console.log(error)
        throw error
    }
    
}
