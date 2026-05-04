require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./src/config/passport');
const sequelize = require('./src/config/database');

// Import models để sync
require('./src/models/index');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const revenueRoutes = require('./src/routes/revenueRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) { callback(null, true); },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/revenue', revenueRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'CRM API đang hoạt động ✅', version: '1.0.0' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} không tồn tại` }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Lỗi server', error: err.message });
});

// Sync DB và khởi động server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database quotation_system thành công');

    // alter:true để thêm cột mới vào bảng cũ mà không xóa dữ liệu
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ models thành công');

    app.listen(PORT, () => {
      console.log(`🚀 CRM Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Không thể kết nối database:', err.message);
    process.exit(1);
  }
})();
