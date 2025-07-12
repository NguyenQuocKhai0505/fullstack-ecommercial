import Chip from "@mui/material/Chip";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { decomposeColor, emphasize, styled } from "@mui/material/styles";
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState, useRef, useContext } from "react";
import Rating from '@mui/material/Rating';
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";
import { MyContext } from "../../App";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress  from "@mui/material/CircularProgress";
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
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const [catData,setCatData] = useState([])
  const [brandsVal, setbrandsVal] = useState('');
  const [isLoading,setIsLoading]=  useState(false)
  const [formFields,setFormFields] = useState({
    name:"",
    description:"",
    images:[],
    category:"",
    brand:"",
    price:0,
    oldPrice:0,
    isFeatured:"",
    countInStock:"",
    rating:0,
  })
  const context = useContext(MyContext)

  useEffect (() => {
    context.setisHiddenSidebarAndHeader(false)
    window.scroll(0, 0)
    fetchDataFromApi("/api/category?all=true").then(res=>{
        if (res && Array.isArray(res.categoryList)) {
          setCatData(res.categoryList);
        } else {
          setCatData([]);
        }
    }).catch(error => {
        console.error('Error fetching categories:', error);
        context.showSnackbar('Failed to load categories', 'error');
    })
  }, [])

  const handleChangeFeaturedVal = (event) => {
    setfeaturedVal(event.target.value);
    setFormFields(fields => ({
      ...fields,
      isFeatured: event.target.value
    }));
  };

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(fields => ({
      ...fields,
      category: event.target.value
    }));
  };
  

  const handleChangeBrands = (event) => {
    setbrandsVal(event.target.value);
  };
  
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => {
          const newImages = [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file
          }];
          setFormFields(fields => ({
            ...fields,
            images: newImages.map(img => img.url)
          }));
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (imageUrl && imageUrl.trim() !== "") {
      setUploadedImages(prev => {
        const newImages = [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: imageUrl,
            file: null
          }
        ];
        setFormFields(fields => ({
          ...fields,
          images: newImages.map(img => img.url)
        }));
        return newImages;
      });
      setImageUrl("");
    }
  };

  const removeImage = (id) => {
    setUploadedImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      setFormFields(fields => ({
        ...fields,
        images: newImages.map(img => img.url)
      }));
      return newImages;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const inputChange = (e) => {
    setFormFields(()=>({
      ...formFields,
      [e.target.name]:e.target.value
    }))
  }

  const addProduct = (e) => {
     e.preventDefault()
     // Validate các trường bắt buộc
     if (!formFields.name || !formFields.description || !formFields.price || !formFields.category || !formFields.brand ||
       !formFields.countInStock || !formFields.rating || !formFields.isFeatured || !formFields.images || !formFields.oldPrice) {
       context.showSnackbar("Please fill in all required fields ", "error");
       return;
     }
     setIsLoading(true)
     console.log(formFields)
     postData("/api/products/create",formFields).then((res)=>{
      setIsLoading(false);
      if(res.success){
        context.showSnackbar("Product added successfully", "success")
      }else{
        context.showSnackbar("Product added failed", "error")
      }
     }).catch((err)=>{
      setIsLoading(false);
      context.showSnackbar("Product added failed", "error")
  })
}

  
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

            <form className="form" onSubmit={addProduct}>
            <div className="row">
                <div className="col-sm-12">
                    {/* TITLE AND DESCRIPTION */}
                    <div className="card p-4">
                        <h5 className="mb-4">Basic Information</h5>
                        <div className="form-group">
                            <h6>PRODUCT NAME</h6>
                            <input type="text" placeholder="Type here" name="name" onChange={inputChange} />
                        </div>
                        <div className="form-group">
                            <h6>PRODUCT DESCRIPTION</h6>
                            <textarea rows={5} cols={10} placeholder="Type here" name="description" onChange={inputChange}/>
                        </div>
                        {/* CATEGORY */}
                         <div className="row">
                            <div className="col">
                                <div className="form-group">
                                <h6>CATEGORY</h6>
                                <Select
                                    value={categoryVal}
                                    onChange={handleChangeCategory}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label', name: 'category' }}
                                    className="w-100"
                                    
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {catData?.length !== 0 && catData?.map((cat) => (
                                      <MenuItem value={cat._id} key={cat._id}>{cat.name}</MenuItem>
                                    ))}
                                  
                                </Select>
                                </div>
                        </div>
                        {/* BRANDS */}
                          <div className="col">
                            <div className="form-group">
                                <h6>BRANDS</h6>
                                <input type="text" placeholder="Type here" name="brand" onChange={inputChange}/>
                              </div>
                        </div>
                        {/* PRICE */}
                          <div className="col">
                            <div className="form-group">
                                <h6>PRICE</h6>
                                <input type="text" placeholder="Type here" name="price" onChange={inputChange}/>
                              </div>
                        </div>

                        </div>
                         {/* OLD PRICE */}
                         <div className="row">
                            <div className="col">
                              <div className="form-group">
                              <h6>OLD PRICE</h6>
                              <input type="text" placeholder="Type here" name="oldPrice" onChange={inputChange}/>
                             </div>
                        </div>
                        {/* IS FEATURED */}
                          <div className="col">
                            <div className="form-group">
                                <h6>IS FEATURED</h6>
                                <Select
                                    value={featuredVal}
                                    onChange={handleChangeFeaturedVal}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label', name: 'isFeatured' }}
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
                        {/* PRODUCT STOCK */}
                          <div className="col">
                            <div className="form-group">
                                <h6>PRODUCT STOCK</h6>
                                <input type="text" placeholder="Type here" name="countInStock" onChange={inputChange}/>
                              </div>
                        </div>
                        </div>

                       <div className="row">
                           {/* RATINGS */}
                          <div className="col">
                            <div className="form-group">
                              <h6>RATINGS</h6>
                             <Rating
                              name="rating"
                              value={ratingsValue}
                              precision={0.5}
                              onChange={(event, newValue) => {
                                setRatingsValue(newValue);
                                setFormFields(prev => ({
                                  ...prev,
                                  rating: newValue
                                }));
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


                              <div className="form-group pb-3">
                                <h6>IMGAGES URL</h6>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <input
                                    type="text"
                                    placeholder="Enter URL"
                                    value={imageUrl}
                                    onChange={e => setImageUrl(e.target.value)}
                                    style={{ flex: 1 }}
                                  />
                                  <Button
                                    variant="outlined"
                                    onClick={handleAddImageUrl}
                                    disabled={!imageUrl.trim()}
                                  >
                                    <span>ADD IMGAGES</span>
                                  </Button>
                                </div>
                              </div>

                                  
                                  <div className="uploaded-images">
                                    {uploadedImages.map((image, index) => (
                                      <div key={image.id} className="uploaded-image-item">
                                        <img src={image.url} alt={`Upload ${index + 1}`} />
                                        <button 
                                          type="button" 
                                          className="remove-image-btn btn-round"
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
                                    type="submit"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? 'Loading...' : 'PUBLISH AND VIEW'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                </div>
                  
                <div className="col-sm-3">
                    <div className="imgGrid d-flex">
                         
                    </div>
                </div>
                </div>
            </form>
        </div>
        </>
    )
}
export default ProductUpload