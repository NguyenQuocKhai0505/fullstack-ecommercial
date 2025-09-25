import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// GET request function
export const fetchDataFromApi = async(url) => {
    try {
        const {data} = await axios.get(API_URL + url)
        return data
    } catch(error) {
        console.log(error)
        return error
    }
}

// POST request function
export const postData = async (url, formData) => {
    try {
        const {data} = await axios.post(API_URL + url, formData)
        return data
    } catch(error) {
        console.log(error)
        return error
    }
}

// PUT edit data
export const editData = async(url,updateData) =>{
     try {
        const {data} = await axios.put(API_URL + url, updateData)
        return data
    } catch(error) {
        console.log(error)
        throw error
    }
}
// DELETE
export const deleteData = async (url)=>{
     try {
       const {data} = await axios.delete(`${API_URL}${url}`)
        return data
    } catch(error) {
        console.log(error)
        throw error
    }
}
//PATH
export const patchData = async(url,updateData = {}) =>{
    try{
        const {data} = await axios.patch(API_URL + url,updateData)
        return data
    }catch(error){
        console.log(error)
        throw error
    }
}