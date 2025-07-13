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
import EditProductDialog from "../../helpers/EditProductDialog";
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


    //State cho xác nhận xóa 
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    //Thêm State cho Edit Products
    const [editProductID, setEditProductID] = useState(null);
    const [editProductLoading, setEditProductLoading] = useState(false);
    const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
    const [editProductFields, setEditProductFields] = useState({
        name: '',
        description: '',
        brand: '',
        category: '',
        price: '',
        oldPrice: '',
        countInStock: '',
        rating: '',
        isFeatured: false,
        images: []
    });

    //Hàm để mở edit dialog
    const editProduct =(id)=>{
        setEditProductID(id)
        setEditProductDialogOpen(true)
        fetchDataFromApi(`/api/products/${id}`).then((res)=>{
            const productData = res.data || res
          
            setEditProductFields({
                name: productData.name||"",
                description: productData.description||"",
                brand: productData.brand||"",
                category: productData.category||"",
                price: productData.price||"",
                oldPrice: productData.oldPrice||"",
                countInStock: productData.countInStock||"",
                rating: productData.rating||"",
                isFeatured: productData.isFeatured||false,
                images: Array.isArray(productData.images) ? productData.images : []
            })
        }).catch((error)=>{
            context.showSnackbar('Failed to fetch product data', 'error');
        })
    }
    //Hàm để đóng Edit Dialog
    const handleCloseEditDialog = () =>{
        setEditProductID(null)
        setEditProductDialogOpen(false)
        setEditProductFields({
            name: '',
            description: '',
            brand: '',
            category: '',
            price: '',
            oldPrice: '',
            countInStock: '',
            rating: '',
            isFeatured: false,
            images: []
        })
    }
    //Hàm xử lí thay đổi Input
    const handleEditProductInputChange = (field) => (event) =>{
        if(field === 'images'){
            //Chuyển đổi ảnh sang Array
            const imageArray = event.target.value.split(",").map(img=>img.trim())
            setEditProductFields(prev=>({
                ...prev,
                [field]: imageArray
            }))
        }else if(field==="isFeatured"){
            setEditProductFields(prev=>({
                ...prev,
                [field]: event.target.checked
            }))
        }else{
            setEditProductFields(prev=>({
                ...prev,
                [field]: event.target.value
            }))
        }
    }
    //Hàm submit Edit Product
    const handleEditProductSubmit = async (e) =>{
        e.preventDefault()
        if(!editProductID){
            context.showSnackbar('No product selected for editing', 'warning')
            return
        }

        //Validate required fields
        if(!editProductFields.name.trim()){
            context.showSnackbar("Product is required", "warning")
            return
        }
        setEditProductLoading(true)
        try{
            const updateData = {
                name: editProductFields.name.trim(),
                description: editProductFields.description.trim(),
                brand: editProductFields.brand.trim(),
                category: editProductFields.category,
                price: parseFloat(editProductFields.price) || 0,
                oldPrice: parseFloat(editProductFields.oldPrice) || 0,
                countInStock: parseInt(editProductFields.countInStock) || 0,
                rating: parseFloat(editProductFields.rating) || 0,
                isFeatured: editProductFields.isFeatured,
                images: editProductFields.images
            }
            console.log('=== PRODUCT UPDATE ===');
            console.log('Edit ID:', editProductID);
            console.log('Update data:', updateData);
            console.log('======================');
            const response = await editData(`/api/products/${editProductID}`, updateData)
            console.log('✅ Update successful:', response);

            //Refresh danh sách sản phẩm
            const updatedProducts = await fetchDataFromApi(`/api/products?page=${page}`);
            setProductList(updatedProducts.data)

            //Đóng dialog
            handleCloseEditDialog()

            //Success Snackbar
            context.showSnackbar("Product updated successfully", "success")

        }catch (error) {
        console.error('❌ Update failed:', error);
        
        let errorMessage = 'Failed to update product. ';
        
        if (error.response?.data?.message) {
            errorMessage += error.response.data.message;
        } else if (error.response?.status === 404) {
            errorMessage += 'Product not found.';
        } else if (error.response?.status === 400) {
            errorMessage += 'Invalid data provided.';
        } else if (error.response?.status >= 500) {
            errorMessage += 'Server error. Please try again later.';
        } else {
            errorMessage += 'Please try again.';
        }
        
        context.showSnackbar(errorMessage, 'error');
    } finally {
        setEditProductLoading(false);
    }}

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
                                                <Button 
                                                className="success mr-1" 
                                                color="success"
                                                onClick={() => editProduct(product._id)}
                                                >
                                                    <MdEdit />
                                                </Button>
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
            <EditProductDialog
                open={editProductDialogOpen}
                onClose={handleCloseEditDialog}
                onSubmit={handleEditProductSubmit}
                loading={editProductLoading}
                editFields={editProductFields}
                onInputChange={handleEditProductInputChange}
                title="Edit Product"
                content="Update the product information below and click 'Save' to confirm."
                categories={categories}
            />
            </>
    )}
export default Products