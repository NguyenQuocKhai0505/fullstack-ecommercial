import { createContext, useContext, useState, useEffect } from "react";
import { getWishlistAPI } from "../utils/api";

export const WishlistContext = createContext();
export const WishlistProvider = ({children}) => {
    const [wishlist, setWishlist] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) getWishlistAPI(token).then(setWishlist);
    }, []);
    return (
        <WishlistContext.Provider value={{ wishlist, setWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
export const useWishlist = () => useContext(WishlistContext);