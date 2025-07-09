import {useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import React from "react";
import { IoEyeSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { Link, Links } from 'react-router-dom';
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// Thêm Dialog xác nhận delete
import { 
    Dialog as ConfirmDialog, 
    DialogTitle as ConfirmDialogTitle, 
    DialogContent as ConfirmDialogContent, 
    DialogActions as ConfirmDialogActions,
    DialogContentText as ConfirmDialogContentText 
} from '@mui/material';

const Category = () => {
    const[openSnackbar, setOpenSnackbar] = useState(false);
    const [catData,setCatData] = useState([])
    const context = useContext(MyContext)
    const [open, setOpen] = React.useState(false);
    const [page,setpage] = useState(1)
    const [editFields, setEditFields] = useState({
        name: '',
        images: [],
        color: ''
    })

    const [editID, setEditID] = useState(null)
    const [loading, setLoading] = useState(false)
    
    // Thêm state cho delete confirmation dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const editCategory = (id) =>{
       setOpen(true)
       setEditID(id)
       fetchDataFromApi(`/api/category/${id}`).then(res=>{
            console.log('API Response:', res)
            // Kiểm tra cấu trúc response
            const categoryData = res.data || res;
            
            setEditFields({
                name: categoryData.name || '',
                images: categoryData.images || [],
                color: categoryData.color || ''
            })
            console.log('Category Data:', categoryData)
        }).catch(error => {
            console.error('Error fetching category:', error);
            // Show error snackbar
            context.showSnackbar('Failed to fetch category data', 'error');
        })
    }

    const handleClose = () => {
        setOpen(false);
        setEditID(null);
        // Reset form khi đóng
        setEditFields({
            name: '',
            images: [],
            color: ''
        })
    };

    // Hàm xử lý thay đổi input
    const handleInputChange = (field) => (event) => {
        if (field === 'images') {
            // Chuyển string thành array, tách bằng dấu phẩy
            const imageArray = event.target.value.split(',').map(img => img.trim()).filter(img => img !== '');
            setEditFields(prev => ({
                ...prev,
                [field]: imageArray
            }))
        } else {
            setEditFields(prev => ({
                ...prev,
                [field]: event.target.value
            }))
        }
    }

    
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false)
        window.scroll(0, 0)
        fetchDataFromApi("/api/category").then(res=>{
            setCatData(res)
            console.log(res)
        }).catch(error => {
            console.error('Error fetching categories:', error);
            context.showSnackbar('Failed to load categories', 'error');
        })
    }, [])
    

    // Sửa lại hàm submit với snackbar
    const categoryEditFun = async (e) => {
        e.preventDefault()
        
        if (!editID) {
            console.error('No category ID to edit');
            context.showSnackbar('No category selected for editing', 'error');
            return;
        }

        // Validate required fields
        if (!editFields.name.trim()) {
            context.showSnackbar('Category name is required', 'warning');
            return;
        }

        setLoading(true);
        
        try {
            const updateData = {
                name: editFields.name.trim(),
                images: editFields.images,
                color: editFields.color
            };
            
            console.log('=== CATEGORY UPDATE ===');
            console.log('Edit ID:', editID);
            console.log('Update data:', updateData);
            console.log('======================');
            
            const response = await editData(`/api/category/${editID}`, updateData);
            
            console.log('✅ Update successful:', response);
            
            // Refresh category list
            const updatedCategories = await fetchDataFromApi("/api/category");
            setCatData(updatedCategories);
            
            // Close dialog
            handleClose();
            
            // Success snackbar
            context.showSnackbar('Category updated successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Update failed:', error);
            
            // Show user-friendly error message với snackbar
            let errorMessage = 'Failed to update category. ';
            
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage += 'Category not found.';
            } else if (error.response?.status === 400) {
                errorMessage += 'Invalid data provided.';
            } else if (error.response?.status >= 500) {
                errorMessage += 'Server error. Please try again later.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            context.showSnackbar(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
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

    // Sửa lại hàm delete với snackbar và confirmation
    const deleteCat = async () => {
        if (!deleteID) {
            context.showSnackbar('No category selected for deletion', 'error');
            return;
        }

        setDeleteLoading(true);
        
        try {
            await deleteData(`/api/category/${deleteID}`);
            
            // Refresh category list
            const updatedCategories = await fetchDataFromApi(`/api/category`);
            setCatData(updatedCategories);
            
            // Close dialog
            closeDeleteDialog();
            
            // Success snackbar
            context.showSnackbar('Category deleted successfully!', 'success');
            
        } catch (error) {
            console.error('❌ Delete failed:', error);
            
            // Error snackbar
            let errorMessage = 'Failed to delete category. ';
            
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage += 'Category not found.';
            } else if (error.response?.status === 400) {
                errorMessage += 'Cannot delete this category.';
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

    // Pagnination
    const handleChange = (event,value) =>{
        fetchDataFromApi(`/api/category?page=${value}`).then((res)=>{
            setCatData(res)
        }).catch(error => {
            console.error('Error fetching page:', error);
            context.showSnackbar('Failed to load page', 'error');
        })
    }

    return (
       
        <>
            <div className="right-content w-100">
              
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Category List</h5>
                    <Link to="/category/add"><Button className="ml-3 btn-big btn-blue btn-round">Add New Category</Button></Link>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="#" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <span>Category</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                {/* CATEGORY TABLE */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="hd">Category List</div>

                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align category-table">
                            {/* HEADER */}
                            <thead>
                                <tr style={{backgroundColor: '#4285f4', color: 'white'}}>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>UID</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>CATEGORY</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>IMAGE</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>COLOR</th>
                                    <th style={{backgroundColor: '#4285f4', color: 'white', fontWeight: 'bold', padding: '15px'}}>ACTION</th>
                                </tr>
                            </thead>
                            
                            {/* BODY */}
                            <tbody>
                                {  catData?.categoryList?.length !==0 && catData?.categoryList?.map((item,index) => (
                                    <tr key={item.id} >
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
                                        
                                        {/* CATEGORY COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <span style={{color: '#666', fontSize: '14px'}}>{item.name}</span>
                                        </td>
                                        
                                        {/* IMAGE COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="d-flex align-items-center productBox">
                                                <div className="imgWrapper" style={{marginRight: '15px'}}>
                                                    <div className="img" style={{width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden'}}>
                                                        <img 
                                                            src={Array.isArray(item.images) ? item.images[0] : item.images} 
                                                            className="w-100 h-100" 
                                                            alt={item.name}
                                                            style={{objectFit: 'cover'}}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* COLOR COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <span className="dot" style={{background:item.color}}></span>
                                        </td>
                                        
                                        {/* ACTION COLUMN */}
                                        <td style={{padding: '15px', verticalAlign: 'middle'}}>
                                            <div className="actions d-flex align-items-center">
                                                <Button 
                                                    className="success mr-1" 
                                                    color="success"
                                                    size="small"
                                                    style={{minWidth: '35px', padding: '6px', marginRight: '5px'}}
                                                    onClick={()=>editCategory(item.id)}
                                                >
                                                    <MdEdit size={16} />
                                                </Button>
                                                <Button 
                                                    className="error" 
                                                    color="error"
                                                    size="small"
                                                    style={{minWidth: '35px', padding: '6px'}}
                                                    onClick={()=>openDeleteDialog(item.id)}
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
                                showing <b>{page}</b> of <b>{catData?.length}</b> results
                            </p>
                            <Pagination 
                                count={catData?.totalPages} 
                                color="primary" 
                                className="pagination"
                                showFirstButton 
                                showLastButton
                                size="small"
                                style={{margin: '0'}}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
   
            {/* EDIT DIALOG */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <form onSubmit={categoryEditFun}>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Update the category information below and click "Save" to confirm.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Category Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editFields.name}
                            onChange={handleInputChange('name')}
                        />
                         <TextField
                            required
                            margin="dense"
                            id="images"
                            name="images"
                            label="Category Images (separate with commas)"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={Array.isArray(editFields.images) ? editFields.images.join(', ') : editFields.images}
                            onChange={handleInputChange('images')}
                            helperText="Enter image URLs separated by commas"
                            multiline
                            rows={3}
                        />
                         <TextField
                            required
                            margin="dense"
                            id="color"
                            name="color"
                            label="Category Color"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={editFields.color}
                            onChange={handleInputChange('color')}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleClose} 
                            variant="outlined" 
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

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
                        Are you sure you want to delete this category? This action cannot be undone.
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
                        onClick={deleteCat} 
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

export default Category