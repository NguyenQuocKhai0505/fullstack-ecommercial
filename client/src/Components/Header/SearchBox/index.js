import Button from '@mui/material/Button';
import { IoIosSearch } from "react-icons/io";
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../../utils/api';

const SearchBox = () => {
    const [key, setKey] = useState('');
    const [suggests, setSuggests] = useState([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const navigate = useNavigate();
    const timeoutRef = useRef();

    // Xử lý search mỗi khi nhập (debounce 300ms)
    const handleChange = (e) => {
        const value = e.target.value;
        setKey(value);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (value.trim().length === 0) {
            setSuggests([]);
            setShowSuggest(false);
            return;
        }
        timeoutRef.current = setTimeout(async () => {
            // Gọi API search gần đúng với name
            const result = await fetchDataFromApi(`/api/products?name=${encodeURIComponent(value)}&perPage=5`);
            setSuggests((result && result.data) ? result.data : []);
            setShowSuggest(true);
        }, 350);
    };

    // Xử lý khi bấm vào 1 sản phẩm
    const handleSelectProduct = (id) => {
        setShowSuggest(false);
        setKey(""); // Clear box (tùy thích)
        navigate(`/product/${id}`);
    };

    // Ngăn mẹ click outside sẽ bị mất suggest (có thể bổ sung)
    const handleBlur = () => {
        setTimeout(() => setShowSuggest(false), 200); // Delay để click được suggest
    };

    return (
        <div className="headerSearch ml-3 mr-3" style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder="Searching...."
                value={key}
                onChange={handleChange}
                onFocus={()=> {if(suggests.length > 0) setShowSuggest(true)}}
                onBlur={handleBlur}
                style={{ width: 180, minWidth: 140 }}
            />
            <Button type="submit" onClick={() => setShowSuggest(false)}><IoIosSearch /></Button>
            {showSuggest && suggests.length > 0 && (
                <div className="dropdown-suggest" style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    width: "100%",
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 2000,
                    borderRadius: 8,
                    maxHeight: 330,
                    overflowY: 'auto',
                }}>
                    {suggests.map(item =>
                        <div
                            key={item._id}
                            className="suggest-item"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f1f1',
                                padding: '8px 10px',
                                transition: 'background .2s'
                            }}
                            onMouseDown={() => handleSelectProduct(item._id)}
                        >
                            <img src={item.images && item.images[0]} alt={item.name} width={40} height={40} style={{ objectFit: 'cover', borderRadius: 4, marginRight: 10 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 15, fontWeight: 500 }}>{item.name}</div>
                                <div style={{ fontSize: 13, color: '#888' }}>{item.price ? `₫ ${item.price.toLocaleString()}` : ''}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default SearchBox;