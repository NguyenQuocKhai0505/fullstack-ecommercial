import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

// GET request function
export const fetchDataFromApi = async(url) => {
    try {
        const {data} = await axios.get(API_URL + url)
        return data
    } catch(error) {
        return error
    }
}

// POST request function
export const postData = async (url, formData) => {
    try {
        const {data} = await axios.post(API_URL + url, formData)
        return data
    } catch(error) {
        return error
    }
}

// PUT edit data
export const editData = async(url,updateData) =>{
     try {
        const {data} = await axios.put(API_URL + url, updateData)
        return data
    } catch(error) {
        throw error
    }
}
// DELETE
export const deleteData = async (url)=>{
     try {
       const {data} = await axios.delete(`${API_URL}${url}`)
        return data
    } catch(error) {
        throw error
    }
}
//ADD PRODUCT IN CART 
export const addToCartAPI = async (productId, quantity, token, option) => {
  return fetch(`${API_URL}/api/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ productId, quantity, option })
  }).then(res => res.json());
};
//REMOVE PRODUCTS FROM CART
export const removeFromCartAPI = async (productId, token, option) => {
    return fetch(`${API_URL}/api/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productId, option })
    }).then(res => res.json());
  };
//GET CART OF USER 
  export const getCartAPI = async (token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/api/cart`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(res => res.json());
  };