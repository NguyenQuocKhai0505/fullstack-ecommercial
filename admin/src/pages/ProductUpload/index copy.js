import Chip from "@mui/material/Chip";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { emphasize, styled } from "@mui/material/styles";
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useRef } from "react";
import Rating from '@mui/material/Rating';
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import { MdClose } from "react-icons/md";

// Breadcrumb styled component
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = 
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});
const ProductUpload = () =>{
  const [categoryVal, setcategoryVal] = useState('');
  const [ratingsValue, setRatingsValue] = useState(1)
  const [featuredVal, setfeaturedVal] = useState("")
  const [gamVal, setgamVal] = useState("")
  const [uploadedImages, setUploadedImages] = useState([]);
  const fileInputRef = useRef(null);



    const handleChangeGamVal = (event) => {
    setgamVal(event.target.value);
  };
  const handleChangeFeaturedVal = (event) => {
    setfeaturedVal(event.target.value);
  };

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
  };
    const [brandsVal, setbrandsVal] = useState('');

  const handleChangeBrands = (event) => {
    setbrandsVal(event.target.value);
  };
  
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  
    return(
      
        <>
         <div className="right-content w-100">
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Product Upload</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <a href="/products" className="breadcrumb-link">Products</a>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                        <div className="breadcrumb-item current">
                           <span>Products Upload</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

            <form className="form">
            <div className="row">
                <div className="col-sm-12">
                    {/* Title va Description */}
                    <div className="card p-4">
                        <h5 className="mb-4">Basic Information</h5>
                        <div className="form-group">
                            <h6>PRODUCT NAME</h6>
                            <input type="text" placeholder="Type here" name="name"/>
                        </div>
                        <div className="form-group">
                            <h6>DESCRIPTION</h6>
                            <textarea rows={5} cols={10} placeholder="Type here"/>
                        </div>
                        {/* Category */}
                         <div className="row">
                            <div className="col">
                                <div className="form-group">
                                <h6>CATEGORY</h6>
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Men</MenuItem>
                                    <MenuItem value={20}>Women</MenuItem>
                                    <MenuItem value={30}>Kids</MenuItem>
                                </Select>
                                </div>
                        </div>
                        {/* Sub Category */}
                          <div className="col">
                            <div className="form-group">
                                <h6>SUB CATEGORY</h6>
                                <Select
                                    value={brandsVal}
                                    onChange={handleChangeBrands}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem >Jeans</MenuItem>
                                    <MenuItem >Shirts</MenuItem>
                                </Select>
                              </div>
                        </div>
                        {/* Price */}
                          <div className="col">
                            <div className="form-group">
                                <h6>PRICE</h6>
                                <input type="text" placeholder="Type here"/>
                              </div>
                        </div>

                        </div>
                         {/* Category */}
                         <div className="row">
                            <div className="col">
                                <div className="form-group">
                                <h6>OLD PRICE</h6>
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={10}>Men</MenuItem>
                                    <MenuItem value={20}>Women</MenuItem>
                                    <MenuItem value={30}>Kids</MenuItem>
                                </Select>
                                </div>
                        </div>
                        {/* Is Featured */}
                          <div className="col">
                            <div className="form-group">
                                <h6>IS FEATURED</h6>
                                <Select
                                    value={featuredVal}
                                    onChange={handleChangeFeaturedVal}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={true}>True</MenuItem>
                                    <MenuItem value={false}>False</MenuItem>
                                </Select>
                              </div>
                        </div>
                        {/* Price */}
                          <div className="col">
                            <div className="form-group">
                                <h6>PRODUCT STOCK</h6>
                                <input type="text" placeholder="Type here"/>
                              </div>
                        </div>
                        </div>

                            
                        <div className="row">
                           {/* BRAND */}
                          <div className="col">
                             <div className="form-group">
                                <h6>BRANDS</h6>
                                <input type="text" placeholder="Type here"/>
                              </div>
                          </div>

                          {/* Discount Price */}
                          <div className="col">
                            <div className="form-group">
                              <h6>DISCOUNT</h6>
                              <input type="text" placeholder="Type here"/>
                            </div>
                          </div>
                            {/* Product  Ram */}
                          <div className="col">
                            <div className="form-group">
                              <h6>PRODUCT RAMS</h6>
                              <Select
                                    value={gamVal}
                                    onChange={handleChangeGamVal}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    className="w-100"
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={4}>4GB</MenuItem>
                                    <MenuItem value={8}>8GB</MenuItem>
                                    <MenuItem value={10}>10GB</MenuItem>
                                    <MenuItem value={12}>GB</MenuItem>
                                </Select>
                            </div>
                          </div>
                       </div>
                       <div className="row">
                           {/* Ratings */}
                          <div className="col">
                            <div className="form-group">
                              <h6>RATINGS</h6>
                             <Rating
                              name="simple-controlled"
                              value={ratingsValue}
                              onChange={(event, newValue) => {
                                setRatingsValue(newValue);
                              }}
                            />
                            </div>
                          </div>
                          </div>

                        <br/>
                             {/* Media And Published Section */}
                              <div className="card p-4">
                                <h5 className="mb-4">Media And Published</h5>
                                
                                <div className="upload-section">
                                  <div className="uploaded-images">
                                    {uploadedImages.map((image, index) => (
                                      <div key={image.id} className="uploaded-image-item">
                                        <img src={image.url} alt={`Upload ${index + 1}`} />
                                        <button 
                                          type="button" 
                                          className="remove-image-btn"
                                          onClick={() => removeImage(image.id)}
                                        >
                                          <MdClose />
                                        </button>
                                      </div>
                                    ))}
                                    
                                    <div className="upload-placeholder" onClick={triggerFileInput}>
                                      <MdImage className="upload-icon" />
                                      <span>image upload</span>
                                    </div>
                                  </div>
                                  
                                  <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                  />
                                </div>

                                <div className="publish-section">
                                  <Button 
                                    variant="contained" 
                                    className="publish-btn"
                                    startIcon={<FaCloudUploadAlt />}
                                  >
                                    PUBLISH AND VIEW
                                  </Button>
                                </div>
                              </div>
                            </div>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}
export default ProductUpload

  

