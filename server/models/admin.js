const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
  // Thêm các trường khác nếu cần
});
module.exports = mongoose.model('Admin', adminSchema);