import Sidebar from "../../Components/Sidebar"
import banner from "../../assets/images/banner5.png"
import Button from '@mui/material/Button';
import { IoMdMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
// import { PiDotsSixVerticalBold } from "react-icons/pi";
// import { IoGrid } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState,useEffect,useMemo } from "react";
import ProductItem from "../../Components/ProductItem";
import Pagination from '@mui/material/Pagination';
import { useParams, useSearchParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";

// import Stack from '@mui/material/Stack';
const Listing = ()=>{
            const [anchorEl, setAnchorEl] = useState(null)
            const [productView, setProductView] = useState('four')
            const openDropDown = Boolean(anchorEl);
            const handleClick = (event) => {
                setAnchorEl(event.currentTarget);
            };
            const handleClose = () => {
                setAnchorEl(null);
            };
            const {id:categoryId} = useParams()
            const [searchParams] = useSearchParams();
            const subcatParam = searchParams.get("subcat")
            const brandsParam = searchParams.get("brands"); // add this
            const [products,setProducts] = useState([])
            const [loading,setLoading]= useState(false)
            const [error,setError] = useState(null)
            const [page,setPage]= useState(1)
            const [perPage,setPerPage]= useState(12)
            const [totalPages,setTotalPages]= useState(1)
        
            useEffect(() => {
                const load = async () => {
                  try {
                    setLoading(true);
                    setError(null);
              
                    let url = `/api/products?page=${page}&perPage=${perPage}`;
                    if (categoryId) url += `&category=${categoryId}`;
                    if (subcatParam) url += `&subCat=${encodeURIComponent(subcatParam)}`;
                    if (brandsParam) url += `&brands=${encodeURIComponent(brandsParam)}`; // add this
              
                    const res = await fetchDataFromApi(url);
                    if (res && res.success && Array.isArray(res.data)) {
                      setProducts(res.data);
                      setTotalPages(res.totalPages || 1);
                    } else {
                      setProducts([]);
                      setTotalPages(1);
                    }
                  } catch (e) {
                    setError(e?.message || "Failed to load products");
                    setProducts([]);
                    setTotalPages(1);
                  } finally {
                    setLoading(false);
                  }
                };
                load();
              }, [categoryId, subcatParam, brandsParam, page, perPage]);

    return(
        <>
        <section className="product_Listing_Page">
            <div className="container">
                <div className="listingLayout d-flex">
                    <Sidebar/>

                    <div className="content_right">
                       <img src={banner} className="w-100" style={{borderRadius:"8px"}} alt="Listing banner"/>
                       <div className="showBy mt-3 mb-3 d-flex align-items-center">
                            <div className="d-flex btnWrapper">
                                <Button className={productView ==='one'   && 'act'} onClick={()=>setProductView('one')}><IoMdMenu/></Button>
                                <Button className={productView ==="three" && "act"}  onClick={()=>setProductView('three')}><CgMenuGridR/></Button>
                                <Button className={productView ==="four"  && "act"}  onClick={()=>setProductView('four')}><PiDotsNineBold/></Button>
                            </div>
                            <div className="ml-auto showByFilter">
                            <Button onClick={handleClick}>Show {perPage} <FaAngleDown /></Button>
                            <Menu
                                className="w-100 showPerPageDropdown"
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openDropDown}
                                onClose={handleClose}
                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}
                            >
                                {[12, 24, 36].map(n => (
                                <MenuItem key={n} onClick={() => { setPerPage(n); setPage(1); handleClose(); }}>
                                    {n}
                                </MenuItem>
                                ))}
                            </Menu>
                            </div>
                       </div>  
                       <div className={`productListing ${productView}`}>
                        {loading && <div className="p-4">Loading...</div>}
                        {error && <div className="p-4 text-danger">{error}</div>}
                        {!loading && !error && products.map(p => (
                            <ProductItem key={p._id} product={p} itemView={productView} />
                        ))}
                        </div>
                        {/*PAGINATIONS*/}
                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <Pagination 
                            page={page}
                            count={totalPages}
                            color="primary"
                            onChange={(_,value)=>setPage(value)}
                            ></Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )

}
export default Listing