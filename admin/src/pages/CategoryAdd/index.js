import Chip from "@mui/material/Chip";
import CircularProgress  from "@mui/material/CircularProgress";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import Button from "@mui/material/Button";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useState } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { useContext } from "react";
const CategoryAdd = () =>{
  const [isLoading,setIsLoading]=  useState(false)
  const context = useContext(MyContext)
  const history = useNavigate()
  const [error_,setError] = useState(false)
  const [formFields,setFormFields] = useState({
    name: "",
    images:[],
    color:""
  })
 
  const changeInput = (e)=>{
      setFormFields(()=>(
        {
          ...formFields,
          [e.target.name]:e.target.value
        }
      ))
  }
  const addImgUrl = (e) =>{
    const arr =[]
    arr.push(e.target.value)
     setFormFields(()=>(
        {
          ...formFields,
          [e.target.name]:arr
        }
      ))
  }
  const addCategory = (e) =>{
    e.preventDefault()
     // Sửa điều kiện validation
    if (formFields.name !== "" && formFields.images.length !== 0 && formFields.color !== "") {
      setIsLoading(true)
      setError(false) // Reset error state
      
      postData("/api/category/create", formFields).then(res => {
        setIsLoading(false)
        
        // Sử dụng showSnackbar từ context
        context.showSnackbar("Category created successfully!", "success");
        
        // Delay navigation để user có thể thấy snackbar
        setTimeout(() => {
          history("/category")
        }, 1000);
        
      }).catch(error => {
        setIsLoading(false)
        // Show error snackbar
        context.showSnackbar("Failed to create category. Please try again.", "error");
      })
    } else {
      setError(true)
      // Show validation error snackbar
      context.showSnackbar("Please fill all the fields", "warning");
    }
  }  
    return(
      
        <>
         <div className="right-content w-100">
                {/* BREADCRUMB */}
                <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
                    <h5 className="mb-0">Add Category</h5>
                    <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                        <div className="breadcrumb-item">
                            <IoHomeSharp className="breadcrumb-icon" />
                            <a href="/dashboard" className="breadcrumb-link">Dashboard</a>
                        </div>
                        <div className="breadcrumb-item current">
                            <a href="#" className="breadcrumb-link">Category</a>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                        <div className="breadcrumb-item current">
                           <span>Add A Category</span>
                            <MdExpandMore className="breadcrumb-icon-expand" />
                        </div>
                    </Breadcrumbs>
                </div>

            <form className="form" onSubmit={addCategory}>
            <div className="row">
                <div className="col-sm-12">
                    {/* Title va Description */}
                    <div className="card p-4">
                        {
                          error_ === true && <p className="text-danger">PLEASE FILL ALLL THE FIELDS</p>
                        }
                        <div className="form-group">
                            <h6>CATEGORY NAME</h6>
                            <input type="text" placeholder="Type here" name="name" onChange={changeInput}/>
                        </div>
                        <div className="form-group">
                            <h6>IMAGE URL</h6>
                            <input type="text" placeholder="Type here" name="images" onChange={addImgUrl}/>
                        </div>
                         <div className="form-group">
                            <h6>COLOR</h6>
                            <input type="text" placeholder="Type here" name="color" onChange={changeInput}/>
                        </div>
                        </div>
        
                        <br/>
                                <div className="publish-section">
                                  <Button 
                                    variant="contained" 
                                    className="publish-btn"
                                    startIcon={<FaCloudUploadAlt />}
                                    type="submit"
                                  >
                                    {isLoading ? (
                                      <CircularProgress color="inherit" className="loader" size={24} />
                                    ) : (
                                      "PUBLISH AND VIEW"
                                    )}
                                  </Button>
                                </div>
                      </div>
                   </div>
            </form>
        </div>
        </>
    )
}
export default CategoryAdd

  

