import React, { useState, useEffect, useContext } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AddSubCategory = () => {
  const context = useContext(MyContext);
  const [categoryVal, setCategoryVal] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCat, setSubCat] = useState('');
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Category from API
  useEffect(() => {
    context.setisHiddenSidebarAndHeader(false);
    window.scroll(0, 0);
    fetchDataFromApi("/api/category?all=true").then(res => {
      if (res && Array.isArray(res.categoryList)) {
        setCategories(res.categoryList);
      } else {
        setCategories([]);
      }
    }).catch(error => {
      console.error('Error fetching categories:', error);
      context.showSnackbar('Failed to load categories', 'error');
    });
  }, []);

  // Handle Submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryVal || !subCat) {
      context.showSnackbar("Please fill all the fields", "warning");
      return;
    }
    setIsLoading(true);
    try {
      const res = await postData("/api/subCategory/create", { category: categoryVal, subCategory: subCat });
      if (res.success) {
        setIsLoading(false);
        context.showSnackbar("Sub Category created successfully!", "success");
        setTimeout(() => history("/category"), 1000);
      } else {
        setIsLoading(false);
        context.showSnackbar("Failed to create sub category. Please try again.", "error");
      }
    } catch (err) {
      setIsLoading(false);
      context.showSnackbar("Failed to create sub category. Please try again.", "error");
    }
  };

  return (
    <div className="right-content w-100">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <h6>CATEGORY</h6>
          <Select
            value={categoryVal}
            onChange={e => setCategoryVal(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label', name: 'category' }}
            className="w-100"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem value={cat._id} key={cat._id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </div>
        <div className="form-group">
          <h6>SUB CATEGORY NAME</h6>
          <input
            type="text"
            placeholder="Type subcategory name"
            value={subCat}
            onChange={e => setSubCat(e.target.value)}
            className="w-100"
          />
        </div>
        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress color="inherit" size={24} /> : "PUBLISH AND VIEW"}
        </Button>
      </form>
    </div>
  );
};

export default AddSubCategory;