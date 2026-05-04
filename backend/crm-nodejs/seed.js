require('dotenv').config();
const sequelize = require('./src/config/database');
const { User, Company, Customer, Product, Order, OrderDetail, CartItem } = require('./src/models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối DB thành công');
    await sequelize.sync({ alter: true });
    console.log('✅ Sync xong');

    // 1. Companies
    const [techCorp] = await Company.findOrCreate({
      where: { email: 'contact@techcorp.vn' },
      defaults: { name: 'TechCorp Việt Nam', address: '123 Nguyễn Huệ, Q1, TP.HCM', phone: '0282123456', email: 'contact@techcorp.vn' },
    });
    const [startup] = await Company.findOrCreate({
      where: { email: 'info@startup.io' },
      defaults: { name: 'StartUp Long An', address: '45 Hùng Vương, Tân An, Long An', phone: '0723456789', email: 'info@startup.io' },
    });
    console.log('✅ Tạo companies xong');

    // 2. Users
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@crm.vn' },
      defaults: { name: 'Admin CRM', email: 'admin@crm.vn', password: 'Admin@123', role: 'ADMIN', phone: '0900000001', provider: 'local' },
    });
    const [manager] = await User.findOrCreate({
      where: { email: 'manager@crm.vn' },
      defaults: { name: 'Nguyễn Quản Lý', email: 'manager@crm.vn', password: 'Manager@123', role: 'MANAGER', phone: '0900000002', provider: 'local' },
    });
    const [cust1] = await User.findOrCreate({
      where: { email: 'khach1@techcorp.vn' },
      defaults: { name: 'Trần Văn Bình', email: 'khach1@techcorp.vn', password: 'Customer@123', role: 'CUSTOMER', phone: '0901234567', address: '123 Nguyễn Huệ, Q1, TP.HCM', provider: 'local' },
    });
    const [cust2] = await User.findOrCreate({
      where: { email: 'khach2@gmail.com' },
      defaults: { name: 'Lê Thị Hoa', email: 'khach2@gmail.com', password: 'Customer@123', role: 'CUSTOMER', phone: '0912345678', address: '45 Hùng Vương, Tân An', provider: 'local' },
    });
    console.log('✅ Tạo users xong');

    // 3. Customer profiles
    await Customer.findOrCreate({
      where: { user_id: cust1.id },
      defaults: { user_id: cust1.id, company_id: techCorp.id, type: 'company_customer' },
    });
    await Customer.findOrCreate({
      where: { user_id: cust2.id },
      defaults: { user_id: cust2.id, company_id: null, type: 'individual_customer' },
    });
    console.log('✅ Tạo customer profiles xong');

    // 4. Products
    const products = [
      { product_code: 'SP001', name: 'Phần mềm CRM Enterprise', description: 'Hệ thống quản lý khách hàng doanh nghiệp', price: 15000000, stock: 50 },
      { product_code: 'SP002', name: 'Phần mềm ERP Basic', description: 'Quản trị tổng thể doanh nghiệp nhỏ', price: 25000000, stock: 30 },
      { product_code: 'SP003', name: 'Dịch vụ tư vấn IT', description: 'Tư vấn chuyển đổi số cho doanh nghiệp', price: 5000000, stock: 100 },
      { product_code: 'SP004', name: 'Bảo trì hệ thống / năm', description: 'Gói bảo trì và hỗ trợ kỹ thuật', price: 3000000, stock: 200 },
      { product_code: 'SP005', name: 'Thiết kế website', description: 'Website doanh nghiệp chuẩn SEO', price: 8000000, stock: 20 },
    ];

    const createdProducts = [];
    for (const p of products) {
      const [prod] = await Product.findOrCreate({ where: { product_code: p.product_code }, defaults: p });
      createdProducts.push(prod);
    }
    console.log('✅ Tạo products xong');

    // 5. Orders
    const [order1] = await Order.findOrCreate({
      where: { order_code: 'ORD-20260501-001' },
      defaults: { order_code: 'ORD-20260501-001', customer_id: cust1.id, total_price: 23000000, status: 'completed' },
    });
    await OrderDetail.findOrCreate({
      where: { order_id: order1.id, product_id: createdProducts[0].id },
      defaults: { order_id: order1.id, product_id: createdProducts[0].id, quantity: 1, price: 15000000 },
    });
    await OrderDetail.findOrCreate({
      where: { order_id: order1.id, product_id: createdProducts[2].id },
      defaults: { order_id: order1.id, product_id: createdProducts[2].id, quantity: 1, price: 5000000 },
    });
    await OrderDetail.findOrCreate({
      where: { order_id: order1.id, product_id: createdProducts[3].id },
      defaults: { order_id: order1.id, product_id: createdProducts[3].id, quantity: 1, price: 3000000 },
    });

    const [order2] = await Order.findOrCreate({
      where: { order_code: 'ORD-20260502-001' },
      defaults: { order_code: 'ORD-20260502-001', customer_id: cust2.id, total_price: 8000000, status: 'pending' },
    });
    await OrderDetail.findOrCreate({
      where: { order_id: order2.id, product_id: createdProducts[4].id },
      defaults: { order_id: order2.id, product_id: createdProducts[4].id, quantity: 1, price: 8000000 },
    });

    const [order3] = await Order.findOrCreate({
      where: { order_code: 'ORD-20260503-001' },
      defaults: { order_code: 'ORD-20260503-001', customer_id: cust1.id, total_price: 25000000, status: 'completed' },
    });
    await OrderDetail.findOrCreate({
      where: { order_id: order3.id, product_id: createdProducts[1].id },
      defaults: { order_id: order3.id, product_id: createdProducts[1].id, quantity: 1, price: 25000000 },
    });

    console.log('✅ Tạo orders xong');
    console.log('\n========== SEED HOÀN TẤT ==========');
    console.log('Tài khoản mẫu:');
    console.log('  ADMIN    → admin@crm.vn        / Admin@123');
    console.log('  MANAGER  → manager@crm.vn      / Manager@123');
    console.log('  CUSTOMER → khach1@techcorp.vn  / Customer@123');
    console.log('  CUSTOMER → khach2@gmail.com    / Customer@123');
    console.log('=====================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed thất bại:', err.message);
    process.exit(1);
  }
};

seed();
