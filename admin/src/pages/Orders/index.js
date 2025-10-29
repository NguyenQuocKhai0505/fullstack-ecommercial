
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import axios from "axios";
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// Dialogs nếu muốn xác nhận đổi trạng thái
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const Orders = () => {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Sửa thành số order/trang bạn muốn
  const [totalPages, setTotalPages] = useState(1);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get(`/api/orders?page=${page}&perPage=${pageSize}`,{
        headers:token?{"Authorization" : `Bearer ${token}` } : {},
      }
      );
      // Log response để debug lỗi map
      console.log('[DEBUG] Orders API response:', res.data);
      // Xử lý trường hợp trả về object hoặc array
      let ordersData = [];
      if (Array.isArray(res.data.orders)) {
        ordersData = res.data.orders;
      } else if (Array.isArray(res.data)) {
        ordersData = res.data;
      } else {
        ordersData = [];
      }
      setOrders(ordersData);
      setTotalPages(res.data.totalPages || 1);
      // Báo lỗi nếu dữ liệu không phải array
      if (!Array.isArray(ordersData)) {
        context.showSnackbar('Dữ liệu đơn hàng trả về sai định dạng!', 'error');
      }
    } catch (err) {
      context.showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openStatusDialog = (order, currentStatus) => {
    setSelectedOrder(order);
    setSelectedNewStatus(currentStatus);
    setStatusDialogOpen(true);
  };
  const closeStatusDialog = () => {
    setStatusDialogOpen(false);
    setSelectedOrder(null);
    setSelectedNewStatus("");
  };
  const handleUpdateStatus = async () => {
    if (!selectedOrder || !selectedNewStatus) return;
    try {
      await axios.patch(`/api/orders/${selectedOrder._id}/status`, { status: selectedNewStatus });
      context.showSnackbar('Order status updated', 'success');
      fetchOrders();
    } catch (err) {
      context.showSnackbar('Failed to update status', 'error');
    } finally {
      closeStatusDialog();
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const orderStatusList = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 p-3 mt-4">
        <div className="hd">Order Management</div>
        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align">
            <thead>
              <tr style={{ backgroundColor: '#4285f4', color: 'white' }}>
                <th>ORDER ID</th>
                <th>CUSTOMER</th>
                <th>EMAIL</th>
                <th>TOTAL</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {!loading && Array.isArray(orders) && orders.length > 0 ? orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.shipping?.name}</td>
                  <td>{order.shipping?.email}</td>
                  <td>{order.total}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : (order.createAt ? new Date(order.createAt).toLocaleString() : '')}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      color="primary"
                      onClick={() => openStatusDialog(order, order.status)}
                    >
                      Change Status
                    </Button>
                  </td>
                </tr>
              )) : <tr><td colSpan={7}>No orders found or data error.</td></tr>}
            </tbody>
          </table>
          {/* PAGINATION FOOTER */}
          <div className="d-flex justify-content-between align-items-center tableFooter" style={{marginTop: '20px', padding: '10px 0'}}>
            <Pagination 
              count={totalPages} 
              color="primary" 
              className="pagination"
              showFirstButton 
              showLastButton
              size="small"
              style={{margin: '0'}}
              page={page}
              onChange={handleChangePage}
            />
          </div>
        </div>
      </div>
      {/* STATUS UPDATE DIALOG */}
      <Dialog open={statusDialogOpen} onClose={closeStatusDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Change Order Status</DialogTitle>
        <DialogContent>
          <Select
            value={selectedNewStatus}
            onChange={e => setSelectedNewStatus(e.target.value)}
            fullWidth
          >
            {orderStatusList.map(st => (
              <MenuItem key={st} value={st}>{st}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStatusDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdateStatus} variant="contained" color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default Orders;
