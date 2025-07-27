import { useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import React from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App"
import { Link, useNavigate } from 'react-router-dom';
import { deleteData, fetchDataFromApi } from "../../utils/api";

// Import Dialog components cho delete confirmation
import { 
    Dialog as ConfirmDialog, 
    DialogTitle as ConfirmDialogTitle, 
    DialogContent as ConfirmDialogContent, 
    DialogActions as ConfirmDialogActions,
    DialogContentText as ConfirmDialogContentText 
} from '@mui/material';

const SubCategory = () => {
    // State để lưu dữ liệu
    const [subCatData, setSubCatData] = useState([])
    const [categories, setCategories] = useState([])
    const context = useContext(MyContext)
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    
    // State cho delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // useEffect để load dữ liệu khi component mount
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false);
        window.scroll(0, 0);
        fetchSubCategories();
        fetchCategories();
    }, [])

    // Hàm lấy danh sách SubCategory từ API
    const fetchSubCategories = async() => {
        try {
            const res = await fetchDataFromApi(`/api/subcat`)
            setSubCatData(res.subcats || [])
        } catch (error) {
            context.showSnackbar('Failed to load subcategories', 'error');
        }
    }   
    
    // Hàm lấy danh sách Categories từ API
    const fetchCategories = async() => {
        try {
            const res = await fetchDataFromApi(`/api/category?all=true`)
            setCategories(res.categoryList || [])
        } catch (error) {
            context.showSnackbar('Failed to load categories', 'error');
        }
    }

    // Hàm nhóm subcategories theo category cha
    const groupSubCategoriesByCategory = () => {
        const grouped = {};
        
        subCatData.forEach(subCat => {
            const categoryId = subCat.category?._id || subCat.category;
            const categoryName = subCat.category?.name || getCategoryName(subCat.category);
            
            if (!grouped[categoryId]) {
                grouped[categoryId] = {
                    categoryId: categoryId,
                    categoryName: categoryName,
                    categoryImage: subCat.category?.images?.[0] || getCategoryImage(subCat.category),
                    subCategories: []
                };
            }
            
            grouped[categoryId].subCategories.push(subCat);
        });
        
        return Object.values(grouped);
    }

    // Hàm mở dialog xác nhận delete
    const openDeleteDialog = (id) => {
        setDeleteID(id);
        setDeleteDialogOpen(true);
    }

    // Hàm đóng dialog xác nhận delete
    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setDeleteID(null);
    }

    // Hàm delete subcategory
    const deleteSubCat = async () => {
        if (!deleteID) {
            context.showSnackbar('No subcategory selected for deletion', 'error');
            return;
        }

        setDeleteLoading(true);
        
        try {
            await deleteData(`/api/subcat/${deleteID}`);
            
            // Refresh subcategory list
            await fetchSubCategories();
            
            // Close dialog
            closeDeleteDialog();
            
            // Success snackbar
            context.showSnackbar('Subcategory deleted successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Delete failed:', error);
            
            // Error snackbar
            let errorMessage = 'Failed to delete subcategory. ';
            
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage += 'Subcategory not found.';
            } else if (error.response?.status === 400) {
                errorMessage += 'Cannot delete this subcategory.';
            } else if (error.response?.status >= 500) {
                errorMessage += 'Server error. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            context.showSnackbar(errorMessage, 'error');
        } finally {
            setDeleteLoading(false);
        }
    }

    // Hàm edit subcategory - navigate to edit page
    const editSubCategory = (categoryId) => {
        navigate(`/subcat/edit/${categoryId}`);
    }

    // Hàm lấy tên category từ categoryId
    const getCategoryName = (category) => {
        // Nếu category là object (đã populate)
        if (category && typeof category === 'object' && category.name) {
            return category.name;
        }
        // Nếu category là ID, tìm trong categories array
        const categoryObj = categories.find(cat => cat._id === category);
        return categoryObj ? categoryObj.name : 'Unknown Category';
    }

    // Hàm lấy ảnh category từ categoryId
    const getCategoryImage = (category) => {
        // Nếu category là object (đã populate)
        if (category && typeof category === 'object' && category.images && category.images.length > 0) {
            return category.images[0];
        }
        // Nếu category là ID, tìm trong categories array
        const categoryObj = categories.find(cat => cat._id === category);
        return categoryObj && categoryObj.images && categoryObj.images.length > 0 
            ? categoryObj.images[0] 
            : '/default-category-image.jpg';
    }

    // Lấy dữ liệu đã nhóm
    const groupedData = groupSubCategoriesByCategory();

    return (
        <>
            <div className="right-content w-100">
              
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Sub Category List</h5>
                    <Link to="/subcategory/add">
                        <Button className="ml-3 btn-big btn-blue btn-round">
                            Add New Sub Category
                        </Button>
                    </Link>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="#" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <span>Sub Category</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                {/* SUBCATEGORY TABLE */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="hd">Sub Category List</div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align subcategory-table">
                            {/* HEADER */}
                            <thead>
                                <tr style={{backgroundColor: '#4285f4', color: 'white'}}>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>UID</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>CATEGORY IMAGE</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>PARENT CATEGORY</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>SUB CATEGORIES</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>ACTION</th>
                                </tr>
                            </thead>
                            
                            {/* BODY */}
                            <tbody>
                                {groupedData?.length !== 0 && groupedData?.map((group, index) => (
                                    <tr key={group.categoryId}>
                                        {/* UID COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="d-flex align-items-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="mr-2" 
                                                    style={{marginRight: '8px'}}
                                                />
                                                <span style={{fontWeight: 'bold'}}>#{index + 1}</span>
                                            </div>
                                        </td>
                                        
                                        {/* CATEGORY IMAGE COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper" style={{marginRight: '15px'}}>
                                                    <div className="img" style={{width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden'}}>
                                                        <img 
                                                            src={group.categoryImage} 
                                                            className="w-100 h-100" 
                                                            alt={group.categoryName}
                                                            style={{objectFit: 'cover'}}
                                                            onError={(e) => {
                                                                e.target.src = '/default-category-image.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* PARENT CATEGORY COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <span style={{color: '#333', fontSize: '16px', fontWeight: '600'}}>
                                                {group.categoryName}
                                            </span>
                                        </td>
                                        
                                        {/* SUB CATEGORIES COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="subcategories-list">
                                                {group.subCategories.map((subCat, subIndex) => (
                                                    <div 
                                                        key={subCat._id} 
                                                        className="subcategory-item"
                                                        style={{
                                                            display: 'inline-block',
                                                            backgroundColor: '#f8f9fa',
                                                            padding: '6px 12px',
                                                            margin: '2px',
                                                            borderRadius: '20px',
                                                            fontSize: '14px',
                                                            color: '#495057',
                                                            border: '1px solid #dee2e6'
                                                        }}
                                                    >
                                                        {subCat.subCategory}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        
                                        {/* ACTION COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="actions d-flex align-items-center">
                                                <Button 
                                                    className="success mr-1" 
                                                    color="success"
                                                    size="small"
                                                    style={{minWidth: '35px', padding: '6px', marginRight: '5px'}}
                                                    onClick={() => editSubCategory(group.categoryId)}
                                                >
                                                    <MdEdit size={16} />
                                                </Button>
                                                <Button 
                                                    className="error" 
                                                    color="error"
                                                    size="small"
                                                    style={{minWidth: '35px', padding: '6px'}}
                                                    onClick={() => openDeleteDialog(group.categoryId)}
                                                >
                                                    <MdDelete size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* PAGINATION FOOTER */}
                        <div className="d-flex justify-content-between align-items-center tableFooter" style={{marginTop: '20px', padding: '10px 0'}}>
                            <p style={{margin: '0', color: '#666', fontSize: '14px'}}>
                                showing <b>{page}</b> of <b>{groupedData?.length || 0}</b> categories
                            </p>
                        </div>
                    </div>
                </div>
            </div>
   
            {/* DELETE CONFIRMATION DIALOG */}
            <ConfirmDialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                maxWidth="xs"
                fullWidth
            >
                <ConfirmDialogTitle>
                    Confirm Delete
                </ConfirmDialogTitle>
                <ConfirmDialogContent>
                    <ConfirmDialogContentText>
                        Are you sure you want to delete this category and all its subcategories? This action cannot be undone.
                    </ConfirmDialogContentText>
                </ConfirmDialogContent>
                <ConfirmDialogActions>
                    <Button 
                        onClick={closeDeleteDialog} 
                        variant="outlined"
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={deleteSubCat} 
                        color="error" 
                        variant="contained"
                        disabled={deleteLoading}
                        autoFocus
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </ConfirmDialogActions>
            </ConfirmDialog>
        </>
    )
}

export default SubCategory