require('dotenv').config();
const sequelize = require('./src/config/database');
const { User, Company, Customer, Product, Order, OrderDetail, CartItem } = require('./src/models');

const reset = async () => {
  try {
    await sequelize.authenticate();
    
    // Tắt check khóa ngoại để có thể truncate bảng
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Xóa sạch dữ liệu
    await OrderDetail.destroy({ truncate: true });
    await CartItem.destroy({ truncate: true });
    await Order.destroy({ truncate: true });
    await Product.destroy({ truncate: true });
    await Customer.destroy({ truncate: true });
    await Company.destroy({ truncate: true });
    await User.destroy({ truncate: true });
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Khởi tạo lại 1 tài khoản Admin duy nhất để tránh bị khóa ngoài hệ thống
    await User.create({
      name: 'Quản Trị Viên',
      email: 'admin@crm.vn',
      password: 'Admin@123',
      role: 'ADMIN',
      phone: '0999999999',
      provider: 'local'
    });

    console.log('✅ Đã xóa sạch toàn bộ User, Sản phẩm, Đơn hàng, Công ty...');
    console.log('✅ Đã tạo lại 1 tài khoản Admin gốc duy nhất để đăng nhập:');
    console.log('   -> Email: admin@crm.vn');
    console.log('   -> Pass: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi xóa dữ liệu:', err);
    process.exit(1);
  }
};

reset();
