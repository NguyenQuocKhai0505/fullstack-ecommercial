
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { Chip, Box, Typography, Paper } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Optional for title

// Mapping trạng thái đơn hàng với màu sắc
const statusColorMap = {
  pending: { label: 'Chờ xử lý', color: 'warning' },
  processing: { label: 'Đang xử lý', color: 'info' },
  shipped: { label: 'Đã giao', color: 'primary' },
  completed: { label: 'Hoàn thành', color: 'success' },
  cancelled: { label: 'Đã hủy', color: 'error' },
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
      const res = await axios.get(`/api/orders/my-orders?page=${page}&perPage=${pageSize}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      setSnackbarMsg('Không thể tải đơn hàng. Vui lòng đăng nhập hoặc thử lại sau.');
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
        Theo dõi đơn hàng của bạn
      </Typography>
      <Paper elevation={3} sx={{ p: { xs: 0.5, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
        <div className="table-responsive">
          <table className="table table-hover table-borderless align-middle" style={{ minWidth: 680 }}>
            <thead style={{ background: '#1e88e5' }}>
              <tr style={{ color: '#fff', fontWeight: 600 }}>
                <th>MÃ ĐƠN</th>
                <th>NGÀY ĐẶT</th>
                <th>TỔNG TIỀN</th>
                <th>PHƯƠNG THỨC</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}><Box display="flex" justifyContent="center"><CircularProgress /></Box></td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order._id}>
                    <td>
                      <Typography fontWeight="bold" color="primary">{order._id.slice(-6).toUpperCase()}</Typography>
                    </td>
                    <td>{order.createAt ? new Date(order.createAt).toLocaleString() : ''}</td>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', opacity: 0.7 }}>Không có đơn hàng nào.</td>
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