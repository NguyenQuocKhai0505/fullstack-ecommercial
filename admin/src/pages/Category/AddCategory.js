import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { MdImage, MdClose } from "react-icons/md";


const AddCategory = () => {
    const [isLoading,setIsLoading] = useState(false);
    const context = useContext(MyContext);
    const history = useNavigate();
    const [error_, setError] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        images: [],
        subCat:"",
        color: ""
    });
    const [uploadedImages, setUploadedImages] = useState([]);
    const fileInputRef = useRef(null);
    const [imageUrl, setImageUrl] = useState("");

    const changeInput =(e)=>{
        setFormFields({
            ...formFields,
            [e.target.name]: e.target.value
        })
    }
    //Thêm ảnh từ URL
    const handleAddImageUrl = ()=>{
        if (imageUrl && imageUrl.trim() !== "") {
            setUploadedImages(prev=>{
                const newImages = [
                    ...prev,
                    {
                        id:Date.now() + Math.random(),
                        url: imageUrl,
                        file:null
                    }
                ]
                setFormFields(fields=>({
                    ...fields,
                    images: newImages.map(img=>img.url)
                }))
                return newImages;
            })
            setImageUrl("");
        }
    }
 // Upload ảnh từ máy
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
  // Xóa ảnh
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
   // Mở file input
   const triggerFileInput = () => {
    fileInputRef.current.click();
  };
   // Submit
   const addCategory = async (e) => {
    e.preventDefault();
    if (!formFields.name || uploadedImages.length === 0 || !formFields.color || !formFields.subCat) {
      setError(true);
      context.showSnackbar("Please fill all the fields", "warning");
      return;
    }
    setIsLoading(true);
    setError(false);
    
    try {
      // Tách subCat thành mảng
      const subCatArr = formFields.subCat
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const categoryData = {
        name: formFields.name,
        color: formFields.color,
        subCat: subCatArr, // Gửi lên là mảng
        images: uploadedImages.map(img => img.url)
      };
        
        const response = await postData("/api/category/create", categoryData);
        
        if (response.success) {
            setIsLoading(false);
            context.showSnackbar("Category created successfully!", "success");
            setTimeout(() => history("/category"), 1000);
        } else {
            setIsLoading(false);
            context.showSnackbar("Failed to create category. Please try again.", "error");
        }
    } catch (err) {
        setIsLoading(false);
        context.showSnackbar("Failed to create category. Please try again.", "error");
        console.error("Error creating category:", err);
    }
  };

  return (
    <div className="right-content w-100">
      <form className="form" onSubmit={addCategory}>
        <div className="form-group">
          <h6>CATEGORY NAME</h6>
          <input type="text" placeholder="Type here" name="name" onChange={changeInput} />
        </div>
        <div className="form-group">
          <h6>SUB CATEGORY</h6>
          <input type="text" placeholder="Type here" name="subCat" onChange={changeInput} />
        </div>
        <div className="form-group pb-3">
          <h6>IMAGES</h6>
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
              <span>ADD IMAGE</span>
            </Button>
          </div>
        </div>
        <div className="uploaded-images">
          {uploadedImages.map((image, index) => (
            <div key={image.id} className="uploaded-image-item">
              <img src={image.url} alt={`Upload ${index + 1}`} style={{ maxWidth: 100, maxHeight: 100 }} />
              <button
                type="button"
                className="remove-image-btn btn-round"
                onClick={() => removeImage(image.id)}
              >
                <MdClose />
              </button>
            </div>
          ))}
          <div className="upload-placeholder" onClick={triggerFileInput} style={{ cursor: 'pointer', display: 'inline-block', padding: 8 }}>
            <MdImage className="upload-icon" />
            <span>image upload</span>
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
        <div className="form-group">
          <h6>COLOR</h6>
          <input type="text" placeholder="Type here" name="color" onChange={changeInput} />
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
export default AddCategory;