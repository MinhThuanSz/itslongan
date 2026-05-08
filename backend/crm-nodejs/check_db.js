require('dotenv').config();
const { Order } = require('./src/models');

const check = async () => {
  const orders = await Order.findAll();
  console.log('--- DANH SÁCH ĐƠN HÀNG HIỆN TẠI ---');
  orders.forEach(o => {
    console.log(`ID: ${o.id}, CODE: ${o.order_code}`);
  });
  console.log('------------------------------------');
  process.exit(0);
};

check();
