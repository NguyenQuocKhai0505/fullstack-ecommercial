import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';
import ProductItem from "../../Components/ProductItem/index" // gợi ý nếu có sẵn!

function useQuery()
{
    return new URLSearchParams(useLocation().search)
}
const SearchPage = () =>{
    const query = useQuery();
    const key = query.get('key') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const doSearch = async ()=>{
            setLoading(true)
            const res = await fetchDataFromApi(`/api/producs/search?name=${encodeURIComponent(key)}`)
            setProducts(res.products || [])
            setLoading(false)
        }
        if(key.trim()) doSearch()
    },[key])
    return (
        <div className="container mt-4">
            <h3>Search results for "{key}"</h3>
            {loading && <p>Loading...</p>}
            {!loading && products.length === 0 && <p>No products found.</p>}
            <div className="row">
                {products.map(prod => (
                    <div key={prod._id} className="col-md-3 mb-4">
                        <ProductItem product={prod} />
                    </div>
                ))}
            </div>
        </div>
    );
}
export default SearchPage;