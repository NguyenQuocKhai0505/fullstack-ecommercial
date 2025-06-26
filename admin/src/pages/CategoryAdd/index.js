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

const CategoryAdd = () =>{
  const [isLoading,setIsLoading]=  useState(false)
  const history = useNavigate()
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
    setIsLoading(true)
    postData("/api/category/create",formFields).then(res =>{
      setIsLoading(false)
      history("/category")
    })

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

  

