import Sidebar from "../../Components/Sidebar"
import banner from "../../assets/images/banner5.png"
import { IoMdMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
// import { PiDotsSixVerticalBold } from "react-icons/pi";
// import { IoGrid } from "react-icons/io5";
import { PiDotsNineBold } from "react-icons/pi";
import { FaAngleDown } from "react-icons/fa";
import { useState,useEffect } from "react";
import ProductItem from "../../Components/ProductItem";
import Pagination from '@mui/material/Pagination';
import { useParams, useSearchParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { MdArrowDropDown, MdArrowDropUp, MdAccessTime, MdArrowUpward, MdArrowDownward, MdStar } from "react-icons/md";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";
// import Stack from '@mui/material/Stack';
const Listing = ()=>{
            const [anchorEl, setAnchorEl] = useState(null); // Cho menu Show Per Page
            const [productView, setProductView] = useState('four')
            const openDropDown = Boolean(anchorEl);
            const [sortBy,setSortBy] = useState("newest")
            const openSort = Boolean(anchorElSort); // Cho menu Sort By
            const [showFilter,setShowFilter] = useState(true)

            const handleClick = (event) => {
                setAnchorEl(event.currentTarget);
            };
            const handleClose = () => {
                setAnchorEl(null);
            };
            const handleClickSort = (event) => {
                setAnchorElSort(event.currentTarget);
              };
              const handleCloseSort = () => {
                setAnchorElSort(null);
              };
            const handleSort = (value) => {
              setSortBy(value);
              setAnchorElSort(null);
            };
            const {id:categoryId} = useParams()
            const [searchParams] = useSearchParams();
            const subcatParam = searchParams.get("subcat")
            const brandsParam = searchParams.get("brands"); // add this
            const minPrice = searchParams.get("minPrice")
            const maxPrice = searchParams.get("maxPrice")
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
                    if (categoryId)  url += `&category=${categoryId}`;
                    if (subcatParam) url += `&subCat=${encodeURIComponent(subcatParam)}`;
                    if (brandsParam) url += `&brands=${encodeURIComponent(brandsParam)}`; // add this
                    if (minPrice)    url += `&minPrice=${minPrice}`;
                    if (maxPrice)    url += `&maxPrice=${maxPrice}`;
                    if (sortBy)      url += `&sortBy=${sortBy}`
              
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
              }, [categoryId, subcatParam, brandsParam, page, perPage,minPrice,maxPrice,sortBy]);

    return(
        <>
        <section className="product_Listing_Page">
            <div className="container">
                <div className="listingLayout d-flex">
                    {/* Hiệu ứng backdrop và sidebar filter */}
                    {showFilter && <div className="sidebar-backdrop" onClick={() => setShowFilter(false)} />}
                    <Sidebar showFilter={showFilter} />

                    <div className="content_right">
                       <img src={banner} className="w-100" style={{borderRadius:"8px"}} alt="Listing banner"/>
                       <div className="showBy mt-3 mb-3 d-flex align-items-center">
                            <div className="d-flex btnWrapper">
                                <Button className={`showByBtn${productView ==='one' ? ' act' : ''}`} onClick={()=>setProductView('one')}><IoMdMenu/></Button>
                                <Button className={`showByBtn${productView ==='three' ? ' act' : ''}`} onClick={()=>setProductView('three')}><CgMenuGridR/></Button>
                                <Button className={`showByBtn${productView ==='four' ? ' act' : ''}`} onClick={()=>setProductView('four')}><PiDotsNineBold/></Button>
                                {/* Filter product By Price and Date */}
                               <Button
                               className="sortByBtn"
                               variant="text"
                               onClick={handleClickSort}
                               endIcon={openSort ? <MdArrowDropUp/> : <MdArrowDropDown/>}
                               sx={{fontWeight:600,fontSize:16,ml:2}}
                               >Sort By
                               </Button>
                               <Menu
                                anchorEl={anchorElSort}
                                open={openSort}
                                onClose={handleCloseSort}
                                PaperProps={{
                                sx: { borderRadius: 3, minWidth: 180, p: 1 }
                                }}
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                transformOrigin={{ vertical: "top", horizontal: "left" }}
                            >
                                <MenuItem selected={sortBy === "featured"} onClick={() => handleSort("featured")}>
                                <ListItemIcon><MdStar /></ListItemIcon>
                                <ListItemText>Featured</ListItemText>
                                </MenuItem>
                                <MenuItem selected={sortBy === "newest"} onClick={() => handleSort("newest")}>
                                <ListItemIcon><MdAccessTime /></ListItemIcon>
                                <ListItemText>Newest</ListItemText>
                                </MenuItem>
                                <MenuItem selected={sortBy === "desc"} onClick={() => handleSort("desc")}>
                                <ListItemIcon><MdArrowDownward /></ListItemIcon>
                                <ListItemText>Price: High-Low</ListItemText>
                                </MenuItem>
                                <MenuItem selected={sortBy === "asc"} onClick={() => handleSort("asc")}>
                                <ListItemIcon><MdArrowUpward /></ListItemIcon>
                                <ListItemText>Price: Low-High</ListItemText>
                                </MenuItem>
                            </Menu>
                            <Button
                                className="toggle-filter-btn"
                                onClick={()=>setShowFilter((prev)=>!prev)}
                            >
                                {showFilter ? (
                                <>Hide Filter <FaToggleOff className="mr-5 ml-2"/></>
                                ) : (
                                <>Show Filter <FaToggleOn className="mr-5 ml-2"/></>
                                )}
                            </Button>
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