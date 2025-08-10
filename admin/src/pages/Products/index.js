import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { Link } from 'react-router-dom';
import DeleteConfirmDialog from "../../helpers/DeleteConfirmDialog";
const Products = () => {
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
    // State để lấy subCategory
    const [allSubCategories, setAllSubCategories] = useState([]);
    //State cho xác nhận xóa 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)


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
    useEffect(()=>{
        fetchDataFromApi(`/api/subcat`).then(res=>{
            setAllSubCategories(res.subcats ||[])
            // console.log('All subcategories:', res.subcats); // kiểm tra dữ liệu
        })
    })

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
            console.log('Deleting product with ID:', deleteID);
            await deleteData(`/api/products/${deleteID}`) //Gọi API xóa sản phẩm 
            //Cập nhật lại danh sách sản phẩm
            const updatedProducts = await fetchDataFromApi(`/api/products?page=${page}`);
            if (updatedProducts.data.length === 0) {
              setProductList([]);
              setPage(1);
              context.showSnackbar("All products have been deleted.", "info");
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
    
    return (
        <>
            <div className="right-content w-100">
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Product List</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="#" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <span>Products</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                {/* STATS BOXES */}
                <div className="row dashboardBoxWrapperRow mb-4">
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #1da256, #48d483)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaUserCircle size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #c012e2, #eb64fe)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaShoppingCart size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="dashboardBox" style={{background: 'linear-gradient(135deg, #2c78e5, #60aff5)'}}>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <p className="text-white mb-1">Total Users</p>
                                    <h2 className="text-white mb-0 font-weight-bold">277</h2>
                                </div>
                                <div className="ml-auto">
                                    <FaShoppingBag size={48} style={{color: 'rgba(255,255,255,0.3)'}} />
                                </div>
                            </div>
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
                                    <th>PRODUCT</th>
                                    <th>CATEGORY</th>
                                    <th>SUBCATEGORY</th>
                                    <th>CAPACITY</th>
                                    <th>BRAND</th>
                                    <th>PRICE</th>
                                    <th>RATING</th>
                                    <th>STOCK</th>
                                    <th>ACTION</th>                                  
                                </tr>
                            </thead>
                            
                            {/* BODY */}
                            <tbody>
                                {productList?.length!==0 && productList?.map((product, index) => (
                                    <tr key={product._id}>
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
                                        <td>
                                            {(() => {
                                                if (Array.isArray(product.subCat)) {
                                                  return product.subCat.map((subId, idx) => {
                                                    const sub = allSubCategories.find(s => s._id === subId);
                                                    
                                                    return (
                                                      <span key={idx} style={{
                                                        display: 'inline-block',
                                                        background: '#e3f2fd',
                                                        color: '#1976d2',
                                                        borderRadius: '16px',
                                                        padding: '4px 16px',
                                                        fontSize: '15px',
                                                        marginRight: 8,
                                                        marginBottom: 2,
                                                        fontWeight: 500
                                                      }}>
                                                        {sub ? sub.subCategory : product.subCat}
                                                      </span>
                                                    );
                                                  });
                                                } else {
                                                  const sub = allSubCategories.find(s => s._id === product.subCat);
                                                  return sub ? sub.subCategory : <span>—</span>;
                                                }
                                              })()}
                                        </td>
                                        <td>
                                            <div className="capacity-specs">
                                                {/* Render productRam */}
                                                {product.productRam && product.productRam.length > 0 && (
                                                    <div className="spec-item">
                                                        <span className="spec-label">RAM:</span>
                                                        <div className="spec-values">
                                                            {product.productRam.map((ram, idx) => (
                                                                <span key={idx} className="spec-tag ram-tag">
                                                                    {ram}GB
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Render productSize */}
                                                {product.productSize && product.productSize.length > 0 && (
                                                    <div className="spec-item">
                                                        <span className="spec-label">Size:</span>
                                                        <div className="spec-values">
                                                            {product.productSize.map((size, idx) => (
                                                                <span key={idx} className="spec-tag size-tag">
                                                                    {size}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Render productWeight */}
                                                {product.productWeight && product.productWeight.length > 0 && (
                                                    <div className="spec-item">
                                                        <span className="spec-label">Weight:</span>
                                                        <div className="spec-values">
                                                            {product.productWeight.map((weight, idx) => (
                                                                <span key={idx} className="spec-tag weight-tag">
                                                                    {weight}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hiển thị "—" nếu không có dữ liệu nào */}
                                                {(!product.productRam || product.productRam.length === 0) &&
                                                 (!product.productSize || product.productSize.length === 0) &&
                                                 (!product.productWeight || product.productWeight.length === 0) && (
                                                    <span className="no-data">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{product.brand}</td>
                                        <td>
                                            <span className="oldPrice">${product.oldPrice}</span>
                                            <span className="newPrice">${product.price}</span>
                                        </td>
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
            
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={deleteProduct}
                loading={deleteLoading}
                title="Confirm Delete"
                content="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
            </>
    )}
export default Products