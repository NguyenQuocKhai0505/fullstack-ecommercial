import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import banner from "../../assets/images/banner4.png"

const Sidebar = () => {
     const [value,setValue] = useState([100,60000])
     const [value2,setValue2] = useState(0)
     const categories = ["Men", "Women", "Beauty", "Kids", "Gifts","Men", "Women", "Beauty", "Kids", "Gifts"];
     const statusProduct = ["In Stock", "On Sale"]
     const brandProduct =["iPhone", "SamSung","Huawei","Xiaomi", "Nokia", "Oppo"]
  return (

    <div className="sidebar">
      <div className="filterBox">
        <h6>PRODUCT CATEGORIES</h6>
      {/* Scroll */}
      </div>
      <div className="scroll">
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    sx={{
                      p: 0.1, // padding nhỏ
                      '& .MuiSvgIcon-root': { fontSize: 16,} // chỉnh kích thước ô checkbox
                    }}
                  />
                }
                label={category}
                sx={{
                  width: '100%',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '14px',
                  },
                }}
              />
            </li>
          ))}
        </ul>
      </div>
       {/* Filter Product By Price */}
      <div className="filterBox">
        <h6>FILTER BY PRICE</h6>
        <RangeSlider value={value} onInput={setValue} min={100} max={60000}></RangeSlider>
        <div className='d-flex pt-2 pb-2 priceRange'>
          <span>From: <strong className='text-dark'>Rs: {value[0]}</strong></span>
          <span className='ml-auto'>From: <strong className='text-dark'>Rs: {value[1]}</strong></span>
        </div>
      </div>
       {/*Product Status */}
      <div className="filterBox">
      <h6 style={{ marginBottom: '10px' }}>PRODUCT STATUS</h6>

      <ul style={{ paddingLeft: '0px', marginTop: '0px' }}>
        {statusProduct.map((status, index) => (
          <li key={index} style={{ listStyle: 'none', marginTop: '0px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    p: 0.5,
                    pl: 1,
                    pb: 0.1,
                    '& .MuiSvgIcon-root': { fontSize: 20 }
                  }}
                />
              }
              label={status}
              sx={{
                width: '100%',
                '& .MuiFormControlLabel-label': {
                  fontSize: '16px',
                }
              }}
            />
          </li>
        ))}
      </ul>
      </div>
        {/*Products' Brands*/}
      <div className="filterBox">
      <h6 style={{ marginBottom: '10px' }}>BRANDS</h6>

      <ul style={{ paddingLeft: '0px', marginTop: '0px' }}>
        {brandProduct.map((brands, index) => (
          <li key={index} style={{ listStyle: 'none', marginTop: '0px' }}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    p: 0.5,
                    pl: 1,
                    pb: 0.1,
                    '& .MuiSvgIcon-root': { fontSize: 20 }
                  }}
                />
              }
              label={brands}
              sx={{
                width: '100%',
                '& .MuiFormControlLabel-label': {
                  fontSize: '16px',
                }
              }}
            />
          </li>
        ))}
      </ul>
    </div>
      {/*Banner*/}
      <Link><img src={banner} className='w-100'/></Link>
      
      </div>
  );
};

export default Sidebar;
