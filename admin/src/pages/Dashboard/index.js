
import DashboardBox from "./components/dashboardBox"
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react"
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IoTimeOutline } from "react-icons/io5";
import {Chart} from "react-google-charts"
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import { deleteData,  fetchDataFromApi } from "../../utils/api";
import { Link } from 'react-router-dom';
const options = [
  "Last Day",
  "Last Week",
  "Last Month",
  "Last Year"
];
export const data =[
    ["Year","Sales","Expenses"],
    ["2013",1000,400],
    ["2014",1170,460],
    ["2015",1170,460],
    ["2016",1170,460],
]
export const colorOption={
    "backgroundColor":"transparent",
    "chartArea": {"width":"100%","height":"80%"}
}


const ITEM_HEIGHT = 48;

const Dashboard = () =>{
    const context = useContext(MyContext)
    const [showBy, setShowBy] = useState(''); // số sản phẩm/trang
    const [CatBy, setCatBy] = useState('');   // id category
    const [products, setProductsData] = useState([])
    const [productList, setProductList] = useState([])
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(1)
    //State để lấy Category
    const [categoryList, setCategoryList] = useState([])
    const [categories, setCategories] = useState([]);


    //State cho xác nhận xóa 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    useEffect(()=>{
    context.setisHiddenSidebarAndHeader(false)
    window.scroll(0,0)
    },[])
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false)
        window.scroll(0, 0)

        fetchDataFromApi("/api/products").then((res)=>{
            setProductsData(res)
            // console.log(res)
        }).catch((error)=>{
            // console.error('Error fetching products:', error);
            context.showSnackbar('Failed to load products', 'error');
        })
    }, [])
    useEffect(() => {
        let url = `/api/products?page=${page}`;
        if (showBy) url += `&perPage=${showBy}`;
        if (CatBy) url += `&category=${CatBy}`;
        fetchDataFromApi(url).then((res) => {
          setProductList(res.data || []);
        //   console.log(res.data)
          setTotalPages(res.totalPages || 1);
        }).catch((error) => {
          context.showSnackbar('Failed to load products', 'error');
        });
      }, [page, showBy, CatBy]);
      const handleChange = (event, value) => {
        setPage(value); // chỉ cần đổi page, useEffect sẽ tự động gọi API
      };
    

    const openDeleteDialog = (id) =>{
        setDeleteID(id)
        setDeleteDialogOpen(true)
    }
    const closeDeleteDialog = () =>{
        setDeleteDialogOpen(false)
        setDeleteID(null)
    }
    //Hàm xóa sản phẩm
    const deleteProduct = async () =>{
        if(!deleteID){
            context.showSnackbar("No product selected for deletion", "warning")
            return
        }
        setDeleteLoading(true)
        try{
            await deleteData(`/api/products/${deleteID}`) //Gọi API xóa sản phẩm 
            //Cập nhật lại danh sách sản phẩm
            const updatedProducts = await fetchDataFromApi(`/api/products?page=${page}`);
            if (updatedProducts.data.length === 0 && page > 1) {
              const prevPage = page - 1;
              const prevProducts = await fetchDataFromApi(`/api/products?page=${prevPage}`);
              setProductList(prevProducts.data);
              setPage(prevPage);
            } else {
              setProductList(updatedProducts.data);
            }
            //Đóng dialog
            closeDeleteDialog()
            context.showSnackbar("Product deleted successfully", "success")
        }catch(error){
            let errorMessage = 'Failed to delete product. ';
            //Xử lílet errorMessage = 'Failed to delete product. ';
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage += 'Product not found.';
            } else if (error.response?.status === 400) {
                errorMessage += 'Cannot delete this product.';
            } else if (error.response?.status >= 500) {
                errorMessage += 'Server error. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            context.showSnackbar(errorMessage, 'error'); 
        }finally{
            setDeleteLoading(false) //tắt loading
        }
    }
    //Lấy danh sách Category
    useEffect(() => {
        fetchDataFromApi(`/api/category?all=true`).then((res)=>{
            setCategoryList(res.categoryList || [])
        }).catch((error)=>{
            context.showSnackbar('Failed to load categories', 'error');
        })
    }, [])

    useEffect(() => {
      fetchDataFromApi("/api/category?all=true").then(res => {
        setCategories(res.categoryList || []);
      }).catch(() => {
        context.showSnackbar('Failed to load categories', 'error');
      });
    }, []);
    
    //Lọc theo Category
    useEffect(()=>{
        let url = `/api/products?page=${page}`
        if(CatBy){
            url+= `&category=${CatBy}`
        }
        if(showBy){
            url+= `&perPage=${showBy}`
        }
        fetchDataFromApi(url).then((res)=>{
            setProductList(res.data || [])
            setTotalPages(res.totalPages || 1)
        }).catch((error)=>{
            context.showSnackbar('Failed to load products', 'error');
        })
    }, [CatBy, page, showBy])
    return(
        <>
          <div className="right-content w-100">
            {/* DASHBOARD DESIGN */}
             <div className="row dashboardBoxWrapperRow">
                <div className="col-md-8">
                    <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color={["#1da256","#48d483"]} icon={<FaUserCircle/>} grow={true}/>
                        <DashboardBox color={["#c012e2","#eb64fe"]} icon={<FaShoppingCart/>} grow={false}/>
                        <DashboardBox color={["#2c78e5","#60aff5"]} icon={<FaShoppingBag/>} grow={true}/>
                        <DashboardBox color={["#e1950e","#f3cd29"]} icon={<FaStar />} grow={false}/>
                    </div>
                </div>

                <div className="col-md-4 pl-0">
                    <div className="box graphBox">
                            <div className="d-flex align-items-center w-100 bottomEle">
                                <h4 className="text-white mb-0 mt-0">Total Sales</h4>
                                <div className="ml-auto">
                                    <Button className="ml-auto toggleIcon"
                                    onClick={handleClick}
                                    ><BsThreeDotsVertical/></Button>
                                    {/* Menu */}
                                    <Menu
                                        className="dropdown_menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        slotProps={{
                                        paper: {
                                            style: {
                                            maxHeight: ITEM_HEIGHT * 4.5,
                                            width: '20ch',
                                            },
                                        },
                                        list: {
                                            'aria-labelledby': 'long-button',
                                        },
                                        }}
                                    >
                                    {options.map((option) => (
                                    <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                        <IoTimeOutline className="mr-2"/>{option}
                                    </MenuItem>
                                    ))}
                                </Menu>
                            </div>
                        </div>
                        <h2 className="text-white font-weight-bold pt-2">$3,344,653.00</h2>
                        <p>$2,433,646.00 in last month</p>
                        <Chart
                        chartType="PieChart"
                        width = "100%"
                        height = "200px"
                        data={data}
                        options={colorOption}
                        />
                    </div>
                </div>
             </div>

                {/* PRODUCTS TABLE */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="hd">Best Selling Products</div>

                    <div className="row cardFilters">
                        {/* SHOW BY */}
                        <div className="col col-md-3 mt-3">
                            <h6>SHOW BY</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={showBy}
                                    onChange={(e) => setShowBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        
                        {/* CATEGORY BY */}
                        <div className="col col-md-3 mt-3">
                            <h6>CATEGORY BY</h6>
                            <FormControl size="small" className="w-100">
                                <Select
                                    value={CatBy}
                                    onChange={(e) => setCatBy(e.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {categories.map(cat => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                        </MenuItem>
                                    ))}
                                    </Select>
                            </FormControl>
                        </div>
                    </div>
                    
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            {/* HEADER */}
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>IS FEATURED</th>
                                    <th>RATING</th>
                                    <th>STOCK</th>
                                    <th>ACTION</th>
                                    <th>DATE CREATED</th>
                                  
                                </tr>
                            </thead>
                            
                            {/* BODY */}
                            <tbody>
                                {productList?.length!==0 && productList?.map((product, index) => (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <input type="checkbox" className="mr-2" />
                                                #{index+1}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                        <img src={product.images[0]} className="w-100" alt={product.name} />
                                                    </div>
                                                </div>
                                                <div className="info pl-3 product-info">
                                                    <h6>{product.name}</h6>
                                                    <p>{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{product.category?.name}</td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <span className="oldPrice">{product.oldPrice}</span>
                                            <span className="newPrice">{product.price}</span>
                                        </td>
                                        <td className="d-flex align-items-center justify-content-center">{product.isFeatured ? "Yes" : "No"} </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="rating-stars">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < product.rating ? "star filled" : "star"}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="d-flex align-items-center justify-content-center">{product.countInStock}</td>
                                        
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                            <Link to={`/products/details/${product._id}`}>
                                            <Button className="secondary mr-1" color="secondary">
                                                <IoEyeSharp />
                                            </Button>
                                            </Link>
                                               <Link to = {`/products/edit/${product._id}`}>
                                               <Button 
                                                className="success mr-1" 
                                                color="success"
                                                >
                                                    <MdEdit />
                                                </Button>
                                                </Link>
                                                <Button 
                                                className="error" 
                                                color="error"
                                                onClick={()=>openDeleteDialog(product._id)}

                                                >
                                                    <MdDelete />
                                                </Button>
                                            </div>
                                            
                                        </td>
                                        <td>
                                        {product.dateCreated
                                            ? new Date(product.dateCreated).toLocaleDateString('vi-VN')
                                            : ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* PAGINATION */}
                        <div className="d-flex tableFooter">

                            <Pagination 
                                count={totalPages} 
                                page={page}
                                onChange={(event,value)=>handleChange(event,value)}
                                color="primary" 
                                className="pagination ml-auto"
                                showFirstButton 
                                showLastButton 

                            />
                        </div>
                    </div>
                </div>
          </div>
        </>
    )

}
export default Dashboard