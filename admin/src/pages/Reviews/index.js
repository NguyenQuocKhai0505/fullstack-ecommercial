import {useContext, useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore, MdDelete, MdCheckCircle } from "react-icons/md";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

const Reviews = ()=>{
  const context = useContext(MyContext);
  const [reviews, setReviews] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
    //Lay danh sach cac cmt dang cho duyet 
    const fetchReviews = async()=>{
        try{
            const res = await fetchDataFromApi("/api/reviews/pending")
            setReviews(Array.isArray(res) ? res : []) // Đảm bảo luôn là array
        }catch(error){
            context.showSnackbar("Error to take reviews","eror")
        }
    }
    useEffect(() => {
        context.setisHiddenSidebarAndHeader(false);
        window.scroll(0, 0);
        fetchReviews();
      }, []);
      //Mo dialog xax nhan xoa 
      const openDeleteDialog = (id)=>{
        setSelectedID(id)
        setDeleteDialogOpen(true)
      }
      const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedID(null);
      };
     //Mo dialog xac nhan duyet 
     const openApproveDialog = (id)=>{
        setSelectedID(id)
        setApproveDialogOpen(true)
     }
     const closeApprovedDialog = (id)=>{
      setApproveDialogOpen(false)
      setSelectedID(null)
   }
   //Xoa review 
   const handleDelete = async()=>{
      setDeleteLoading(true)
      try{
        await deleteData(`api/reviews/${selectedID}`)
        setReviews(reviews.filter(r => r._id !== selectedID))
        context.showSnackbar("Delete this reviews successfully !")
        closeDeleteDialog()
      }catch(error){
        context.showSnackbar("Failed to delete this reviews","error")
      }finally{
        setDeleteLoading(false)
      }
   }
   //Duyet review
   const handleApprove = async()=>{
      setApproveLoading(true)
    try{
        await fetchDataFromApi(`/api/reviews/approve/${selectedID}`,"PATCH")
        setReviews(reviews.filter(r=>r._id !== selectedID))
        context.showSnackbar("Prove this reviews successfully !")
        closeApprovedDialog()
    }catch(error){
      context.showSnackbar("Failed to approve this reviews","error")
    }finally{
      setApproveLoading(false)
    }
   }
   return(
    <>
    <div className="right-content w-100">
      {/* BREADCRUMB */}
      <div className="card shadow border-0 w-100 flex-row p-4 mb-3 breadcrumb-container">
        <h5 className="mb-0">REVIEWS PENDING</h5>
        <Breadcrumbs className="ml-auto breadscrumbs" aria-label="breadscumb">
            <div className="breadcrumb-item">
              <IoHomeSharp className="breadscrumb-icon"/>
              <a href="/dashboard" className="breadscrumb-link">Dashboard</a>
            </div>
            <div className="breadcrumb-item current">
              <span>Reviews</span>
              <MdExpandMore className="breadscrumb-icon current"/>
            </div>
        </Breadcrumbs>
      </div>
      {/* REVIEW TABLE */}
      <div className="card shadow border-0 p-3 mt-4">
        <div className="hd">Reviews Pending List</div>
        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Name</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Created at</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.length ===0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">There is no review in pending list.</td>
                  </tr>
                ) : (
                  reviews?.map(r => (
                    <tr key={r._id}>
                      <td>{r.product?.name || r.product}</td>
                      <td>{r.name}</td>
                      <td>{r.comment}</td>
                      <td>{r.rating}</td>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                      <td>
                        <Button
                          color="success"
                          variant="contained"
                          size="small"
                          style={{ minWidth: 35, marginRight: 8 }}
                          onClick={() => openApproveDialog(r._id)}
                          startIcon={<MdCheckCircle />}
                        >
                          Approve
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          size="small"
                          style={{ minWidth: 35 }}
                          onClick={() => openDeleteDialog(r._id)}
                          startIcon={<MdDelete />}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
   )
}
export default Reviews;

