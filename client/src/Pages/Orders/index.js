
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Chip, Box, Typography, Paper, Button } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Optional for title

// Mapping order status to English labels
const statusColorMap = {
  pending: { label: 'Pending', color: 'warning' },
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const MyOrders = () => {
  // State quản lý danh sách đơn, phân trang và thông báo
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  
  // Fetch data khi vào trang hoặc đổi page
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page]);

  // Gọi API lấy đơn hàng, truyền token nếu có
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/my-orders?page=${page}&perPage=${pageSize}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      // ĐẢM BẢO fixes lỗi .map is not a function
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
    } catch (error) {
      setSnackbarMsg('Không thể tải đơn hàng. Vui lòng đăng nhập hoặc thử lại sau.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel order (translate confirm and messages)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `/api/orders/${orderId}/status`,
        { status: 'cancelled' },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSnackbarMsg('Order cancelled successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      fetchOrders();
    } catch (err) {
      setSnackbarMsg('Failed to cancel the order. Please try again!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Đổi trang
  const handleChangePage = (_, value) => setPage(value);

  // Đóng snackbar
  const handleSnackbarClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, maxWidth: 1000, margin: '0 auto' }}>
      <Typography variant="h4" mb={2} sx={{ fontWeight: 700, letterSpacing: 1 }}>
        {/* <ShoppingCartIcon fontSize="large" sx={{ mr: 1, color: '#1976d2' }} /> */}
        Your Orders
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 0.5, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
        <div className="table-responsive">
          <table className="table table-hover table-borderless align-middle" style={{ minWidth: 680 }}>
            <thead style={{ background: '#1e88e5' }}>
              <tr style={{ color: '#fff', fontWeight: 600 }}>
                <th>ORDER ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAYMENT METHOD</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}><Box display="flex" justifyContent="center"><CircularProgress /></Box></td>
                </tr>
              ) : Array.isArray(orders) && orders.length > 0 ? (
                orders.map(order => (
                  <React.Fragment key={order._id}>
                    {/* Order summary row */}
                    <tr>
                      <td>
                        <Typography fontWeight="bold" color="primary">{order._id.slice(-6).toUpperCase()}</Typography>
                      </td>
                      <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : (order.createAt ? new Date(order.createAt).toLocaleString() : '')}</td>
                      <td>
                        <b style={{ color: '#388e3c' }}>{order.total?.toLocaleString()} đ</b>
                      </td>
                      <td>
                        <Chip label={order.paymentMethod} color="secondary" variant="outlined" size="small" sx={{ fontSize: 13 }} />
                      </td>
                      <td>
                        <Chip
                          label={statusColorMap[order.status]?.label || order.status}
                          color={statusColorMap[order.status]?.color || 'default'}
                          variant="filled"
                          sx={{ fontWeight: 700, letterSpacing: 1, fontSize: 14 }}
                        />
                      </td>
                      <td>
                        {order.status === 'pending' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                    {/* Product list row */}
                    <tr>
                      <td colSpan={6} style={{ background: '#fafcff', borderTop: '0px' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 1 }}>
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <Box key={idx} sx={{ mr: 4, minWidth: 220, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img src={item.product && item.product.image ? item.product.image : '/no-image.png'} alt={item.product && item.product.name ? item.product.name : item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, marginRight: 12, border: '1px solid #eee', background: '#fff' }} />
                                <div>
                                  <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{item.product && item.product.name ? item.product.name : item.name}</Typography>
                                  <Typography variant="body2" sx={{ color: '#555' }}>Qty: {item.quantity}</Typography>
                                  {item.option && <Typography variant="body2">Option: {item.option}</Typography>}
                                </div>
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">No products</Typography>
                          )}
                        </Box>
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', opacity: 0.7 }}>No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Pagination
            count={totalPages}
            color="primary"
            variant="outlined"
            page={page}
            onChange={handleChangePage}
            showFirstButton
            showLastButton
            siblingCount={0}
          />
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={snackbarSeverity} onClose={handleSnackbarClose}>{snackbarMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default MyOrders;