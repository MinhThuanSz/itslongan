require('dotenv').config();
const sequelize = require('./src/config/database');
const { Order, OrderDetail } = require('./src/models');

const clear = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await OrderDetail.destroy({ where: {}, truncate: true });
    await Order.destroy({ where: {}, truncate: true });
    
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Đã xóa sạch toàn bộ danh sách Đơn hàng.');
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err);
    process.exit(1);
  }
};

clear();
