

import { useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App"
import { Link, useParams, useNavigate } from 'react-router-dom';
import { editData, fetchDataFromApi } from "../../utils/api";

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const EditSubCategory = () => {
    // State để lưu dữ liệu
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const context = useContext(MyContext)
    const navigate = useNavigate()
    const { id } = useParams() // Lấy ID từ URL params
    const [loading, setLoading] = useState(false)
    
    // State cho form fields - category sẽ được fix cứng
    const [editFields, setEditFields] = useState({
        category: '',
        subCategory: ''
    })

    // State cho selected subcategory trong dropdown
    const [selectedSubCat, setSelectedSubCat] = useState('')
    
    // State để lưu tên category cha (chỉ để hiển thị)
    const [parentCategoryName, setParentCategoryName] = useState('')
    const [editingSubCatId, setEditingSubCatId] = useState('');
    //Load categories trước
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false)
        window.scroll(0, 0)
        fetchCategories();
    }, []);
    //Khi categories load xong và có id lấy subcategories của category đó
    useEffect(() => {
        if (categories.length > 0 && id) {
            fetchSubCategoryData();
        }
    }, [categories, id]);

    // Hàm lấy danh sách categories
    const fetchCategories = async () => {
        try {
            const res = await fetchDataFromApi(`/api/category?all=true`)
            setCategories(res.categoryList || [])
        } catch (error) {
            context.showSnackbar('Failed to load categories', 'error');
        }
    }

    // Hàm lấy dữ liệu subcategory cần edit
    const fetchSubCategoryData = async () => {
        try{
            const parentCat = categories.find(cat => cat._id ===id)
            if(parentCat){
                setParentCategoryName(parentCat.name)
                setEditFields(prev=>({
                    ...prev,
                    category:id
                }))
                fetchSubCategoriesByCategory(id)
            }else{
                context.showSnackbar('Parent category not found', 'error');
            }

        }catch(error){
            context.showSnackbar('Failed to load subcategory data', 'error');
        }
    }
    //Hàm lấy subcategories của category đó
    const fetchSubCategoriesByCategory = async (categoryId) => {
        try {
            const res = await fetchDataFromApi(`/api/subcat?category=${categoryId}`);
            setSubCategories(res.subcats || []);
        } catch (error) {
            context.showSnackbar('Failed to load subcategories', 'error');
        }
    };

    // Hàm xử lý thay đổi subcategory từ dropdown
   const handleSubCategoryChange = (e) => {
    const subCatId = e.target.value
    const selectedSubCatObj = subCategories.find(subCat => subCat._id === subCatId)
    if(selectedSubCatObj){
        setSelectedSubCat(subCatId)
        setEditingSubCatId(subCatId)
        setEditFields(prev=>({
            ...prev,
            subCategory: selectedSubCatObj.subCategory
        }))
    }
   }

   //Khi sửa tên subCat
    const handleInputChange = (e) => {
        setEditFields(prev => ({
            ...prev,
            subCategory: e.target.value
        }));
    }

    // Hàm submit edit
   const subCategoryEditFun = async(e)=>{
    e.preventDefault()
    if (!editingSubCatId) {
        context.showSnackbar('Please select a subcategory to edit', 'warning');
        return;
    }
    if (!editFields.category.trim()) {
        context.showSnackbar('Category is required', 'warning');
        return;
    }
    if (!editFields.subCategory.trim()) {
        context.showSnackbar('Subcategory name is required', 'warning');
        return;
    }
    setLoading(true);
    try{
        const updateData = {
            category: editFields.category,
            subCategory: editFields.subCategory.trim()
        }
        const response = await editData(`/api/subcat/${editingSubCatId}`, updateData)
        if (response.success) {
            context.showSnackbar('Subcategory updated successfully!', 'success');
            setTimeout(() => {
                navigate('/subcat');
            }, 1000);
        } else {
            context.showSnackbar('Failed to update subcategory', 'error');
        }
    }catch(error){
        let errorMessage = 'Failed to update subcategory. ';
        if (error.response?.data?.message) {
            errorMessage += error.response.data.message;
        } else if (error.response?.status === 404) {
            errorMessage += 'Subcategory not found.';
        } else if (error.response?.status === 400) {
            errorMessage += 'Invalid data provided.';
        } else if (error.response?.status >= 500) {
            errorMessage += 'Server error. Please try again later.';
        } else {
            errorMessage += 'Please try again.';
        }
        context.showSnackbar(errorMessage, 'error');
    }finally{
        setLoading(false);
    }
   }
   return (
    <>
        <div className="right-content w-100">
            {/* BREADCRUMB */}
            <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                <h5 className="mb-0">Edit Sub Category</h5>
                <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                    <div className="breadcrumb-item">
                        <IoHomeSharp className="breadcrumb-icon" />
                        <Link to="/dashboard" className="breadcrumb-link">Dashboard</Link>
                    </div>
                    <div className="breadcrumb-item">
                        <Link to="/subcategory" className="breadcrumb-link">Sub Category</Link>
                        <MdExpandMore className="breadcrumb-icon-expand" />
                    </div>
                    <div className="breadcrumb-item current">
                        <span>Edit Sub Category</span>
                        <MdExpandMore className="breadcrumb-icon-expand" />
                    </div>
                </Breadcrumbs>
            </div>

            {/* EDIT FORM */}
            <div className="card shadow border-0 p-4">
                <div className="hd mb-4">Edit Sub Category</div>
                <form onSubmit={subCategoryEditFun}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <h6>PARENT CATEGORY</h6>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={parentCategoryName}
                                    disabled
                                    helperText="Parent category (cannot be changed)"
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group mb-3">
                                <h6>SELECT SUB CATEGORY TO EDIT</h6>
                                <FormControl fullWidth>
                                    <InputLabel id="subcategory-label">Select Sub Category</InputLabel>
                                    <Select
                                        labelId="subcategory-label"
                                        value={selectedSubCat}
                                        onChange={handleSubCategoryChange}
                                        label="Select Sub Category"
                                        disabled={!editFields.category || subCategories.length === 0}
                                    >
                                        <MenuItem value="">
                                            <em>Select a subcategory to edit</em>
                                        </MenuItem>
                                        {subCategories?.map((subCat) => (
                                            <MenuItem value={subCat._id} key={subCat._id}>
                                                {subCat.subCategory}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group mb-3">
                                <h6>NEW SUB CATEGORY NAME</h6>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Enter new sub category name"
                                    value={editFields.subCategory}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!selectedSubCat}
                                    helperText={selectedSubCat ? "Enter the new name for the selected sub category" : "Please select a subcategory first"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-actions mt-4">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate('/subcat')}
                            style={{ marginRight: '10px' }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !selectedSubCat}
                        >
                            {loading ? 'Updating...' : 'Update Sub Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </>
);
}
export default EditSubCategory 
