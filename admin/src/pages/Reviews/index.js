import {useContext, useEffect, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { MdExpandMore, MdDelete, MdCheckCircle } from "react-icons/md";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { fetchDataFromApi, deleteData, patchData } from "../../utils/api";
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

  // Lấy danh sách các review chờ duyệt
  const fetchReviews = async()=>{
    try{
      const res = await fetchDataFromApi("/api/reviews/pending")
      setReviews(Array.isArray(res) ? res : [])
    }catch(error){
      context.showSnackbar("Error to take reviews","error")
    }
  }
  useEffect(() => {
    context.setisHiddenSidebarAndHeader(false);
    window.scroll(0, 0);
    fetchReviews();
  }, []);

  // Mở dialog xác nhận xóa
  const openDeleteDialog = (id)=>{
    setSelectedID(id)
    setDeleteDialogOpen(true)
  }
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedID(null);
  };
  // Mở dialog xác nhận duyệt
  const openApproveDialog = (id)=>{
    setSelectedID(id)
    setApproveDialogOpen(true)
  }
  const closeApprovedDialog = ()=>{
    setApproveDialogOpen(false)
    setSelectedID(null)
  }
  // Xóa review
  const handleDelete = async()=>{
    setDeleteLoading(true)
    try{
      await deleteData(`/api/reviews/${selectedID}`)
      setReviews(reviews.filter(r => r._id !== selectedID))
      context.showSnackbar("Delete this review successfully !")
      closeDeleteDialog()
    }catch(error){
      context.showSnackbar("Failed to delete this review","error")
    }finally{
      setDeleteLoading(false)
    }
  }
  // Duyệt review
  const handleApprove = async()=>{
    setApproveLoading(true)
    try{
      await patchData(`/api/reviews/approve/${selectedID}`)
      setReviews(reviews.filter(r=>r._id !== selectedID))
      context.showSnackbar("Approve this review successfully !")
      closeApprovedDialog()
    }catch(error){
      context.showSnackbar("Failed to approve this review","error")
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
                      <td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={r.product?.images?.[0] || "/default-image.png"}
                            alt={r.product?.name}
                            style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 6, marginRight: 8 }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{r.product?.name}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              {r.product?.description?.slice(0, 40)}...
                            </div>
                          </div>
                        </div>
                      </td>
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
    {/* Dialog xác nhận duyệt */}
    <Dialog open={approveDialogOpen} onClose={closeApprovedDialog}>
      <DialogTitle>Approve Review</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to approve this review?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeApprovedDialog}>Cancel</Button>
        <Button onClick={handleApprove} color="primary" disabled={approveLoading}>
          {approveLoading ? "Approving..." : "Approve"}
        </Button>
      </DialogActions>
    </Dialog>
    {/* Dialog xác nhận xóa */}
    <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
      <DialogTitle>Delete Review</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this review?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDeleteDialog}>Cancel</Button>
        <Button onClick={handleDelete} color="error" disabled={deleteLoading}>
          {deleteLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}
export default Reviews;

