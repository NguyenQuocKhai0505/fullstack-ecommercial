import { useContext, useEffect, useState } from "react"
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App"
import { Link, useNavigate } from 'react-router-dom';
import { postData, fetchDataFromApi } from "../../utils/api";

import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const AddSubCategory = () => {
    // State để lưu dữ liệu
    const [categories, setCategories] = useState([])
    const context = useContext(MyContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    
    // State cho form fields
    const [formFields, setFormFields] = useState({
        category: '',
        subCategory: ''
    })

    // useEffect để load dữ liệu khi component mount
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false)
        window.scroll(0, 0)
        fetchCategories();
    }, [context, fetchCategories]);

    // Hàm lấy danh sách categories
    const fetchCategories = async () => {
        try {
            const res = await fetchDataFromApi(`/api/category?all=true`)
            setCategories(res.categoryList || [])
        } catch (error) {
            context.showSnackbar('Failed to load categories', 'error');
        }
    }

    // Hàm xử lý thay đổi input
    const handleInputChange = (field) => (event) => {
        setFormFields(prev => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    // Hàm submit thêm mới
    const addSubCategory = async (e) => {
        e.preventDefault()
        
        // Validate required fields
        if (!formFields.category.trim()) {
            context.showSnackbar('Category is required', 'warning');
            return;
        }

        if (!formFields.subCategory.trim()) {
            context.showSnackbar('Subcategory name is required', 'warning');
            return;
        }

        setLoading(true);
        
        try {
            const newSubCategory = {
                category: formFields.category,
                subCategory: formFields.subCategory.trim()
            };
            
            const response = await postData(`/api/subcat/create`, newSubCategory);
            
            if (response.success) {
                context.showSnackbar('Subcategory added successfully!', 'success');
                setTimeout(() => {
                    navigate('/subcat');
                }, 1000);
            } else {
                context.showSnackbar('Failed to add subcategory', 'error');
            }
            
        } catch (error) {
            console.error('❌ Add failed:', error);
            
            let errorMessage = 'Failed to add subcategory. ';
            
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
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

    return (
        <>
            <div className="right-content w-100">
              
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Add New Sub Category</h5>
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
                            <span>Add Sub Category</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

                {/* ADD FORM */}
                <div className="card shadow border-0 p-4">
                    <div className="hd mb-4">Add New Sub Category</div>
                    
                    <form onSubmit={addSubCategory}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <h6>CATEGORY</h6>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-label">Select Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            value={formFields.category}
                                            onChange={handleInputChange('category')}
                                            label="Select Category"
                                            required
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            {categories?.map((cat) => (
                                                <MenuItem value={cat._id} key={cat._id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                            
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <h6>SUB CATEGORY NAME</h6>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Enter sub category name"
                                        value={formFields.subCategory}
                                        onChange={handleInputChange('subCategory')}
                                        required
                                        helperText="Enter the name for the new sub category"
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
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Sub Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AddSubCategory