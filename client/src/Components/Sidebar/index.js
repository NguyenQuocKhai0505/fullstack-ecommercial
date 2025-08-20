import Checkbox from '@mui/material/Checkbox';
// import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RangeSlider from "react-range-slider-input"
import "react-range-slider-input/dist/style.css"
import React from 'react';
import {useState,useEffect} from "react"
import { useParams,useSearchParams } from 'react-router-dom';
import {fetchDataFromApi} from "../../utils/api"

const Sidebar = () => {
     const [value,setValue] = useState([0,10000])
     const [categories,setCategories]= useState([])
     const statusProduct = []
     const brandProduct =[]
     const {id: categoryId} = useParams()
     const [searchParams,setSearchParams] = useSearchParams()
     const selectedSubcats = (searchParams.get("subcat") || "").split(",").filter(Boolean)
     const selectedBrands = (searchParams.get("brands") || "").split(",").filter(Boolean)

     const [subcats,setSubcats] = useState([])
     const [brands, setBrands] = useState([]);

     useEffect(() => {
      if (!categoryId) { 
        setSubcats([]);
        setBrands([])
        return;
       }
      (async () => {
           //Fetch cả subcategory và brands theo category
           try{
             const [subRes,brandsRes]= await Promise.all([
              fetchDataFromApi(`/api/subcat?category=${categoryId}`),
              fetchDataFromApi(`/api/products/brands?category=${categoryId}`)
             ])
             setSubcats(subRes?.subcats || [])
             setBrands(brandsRes?.brands || [])
           }catch(error){
            console.log("Error fetching data",error)
           }
      })();
    }, [categoryId]);
    //Filter By Price
    useEffect(()=>{
      const min = Number(searchParams.get("minPrice")) || 0
      const max = Number(searchParams.get("maxPrice")) || 10000
      setValue([min,max])
     },[searchParams])
     //Change Subcategory
     const onToggleSubcat = (id) => {
      const next = new URLSearchParams(searchParams);
      const setIds = new Set(selectedSubcats);
      if (setIds.has(id)) setIds.delete(id); else setIds.add(id);
      const value = Array.from(setIds).join(",");
      if (value) next.set("subcat", value); else next.delete("subcat");
      next.set("page", "1");
      setSearchParams(next);
    };
    //Change Brand
    const onToggleBrand = (brandname) =>{
      const next = new URLSearchParams(searchParams)
      const setBrands = new Set(selectedBrands)
      if(setBrands.has(brandname)){
        setBrands.delete(brandname)
      }else{
        setBrands.add(brandname)
      }
      const value = Array.from(setBrands).join(",")
      if(value){
        next.set("brands",value)
      }else{
        next.delete("brands");
      }
      next.set("page","1")
      setSearchParams(next)
    }
    //Change Price
   const onChangePriceValue = (newValue)=>{
    setValue(newValue)
    const next = new URLSearchParams(searchParams)
    next.set("minPrice",newValue[0])
    next.set("maxPrice",newValue[1])
    next.set("page","1")
    setSearchParams(next)
   }
  return (

    <div className="sidebar">
      <div className="filterBox">
        <h6>CATEGORY</h6>
      {/* Scroll */}
      </div>
      <div className="scroll">
        <ul style={{paddingLeft: '0px', marginTop: '0px'}}>
          {subcats.map(s=>{
            const checked = selectedSubcats.includes(s._id)
            return(
              <li key={s._id} style={{listStyle:"none"}}>
                <FormControlLabel
                control={
                  <Checkbox
                  checked={checked}
                  onChange={()=>onToggleSubcat(s._id)}
                  sx={{ p: 0.5, '& .MuiSvgIcon-root': { fontSize: 18 } }}
                  />
                }
                label={s.subCategory || s.name}
                sx={{ width: "100%", '& .MuiFormControlLabel-label': { fontSize: 14 } }}
                />
              </li>
            )
          })}
          
        </ul>
      </div>
       {/* Filter Product By Price */}
      <div className="filterBox">
        <h6>FILTER BY PRICE</h6>
        <RangeSlider value={value} onInput={onChangePriceValue} min={0} max={10000}></RangeSlider>
        <div className='d-flex pt-2 pb-2 priceRange'>
          <span>From: <strong className='text-dark'>${value[0]}</strong></span>
          <span className='ml-auto'>From: <strong className='text-dark'>${value[1]}</strong></span>
        </div>
      </div>
       {/*Product Status */}
      <div className="filterBox">
      <h6 style={{ marginBottom: '10px' }}>PRODUCT RATING</h6>

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
        {brands.map((brand, index) => {
          const checked = selectedBrands.includes(brand);
          return (
            <li key={index} style={{ listStyle: 'none', marginTop: '0px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => onToggleBrand(brand)}
                    sx={{
                      p: 0.5,
                      pl: 1,
                      pb: 0.1,
                      '& .MuiSvgIcon-root': { fontSize: 20 }
                    }}
                  />
                }
                label={brand}
                sx={{
                  width: '100%',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '16px',
                  }
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
      </div>
  );
};

export default Sidebar;
