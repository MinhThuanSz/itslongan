require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./src/config/database');
const { User, Company, Customer, Product, Quotation, QuotationItem } = require('./src/models');

const importSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối DB thành công');
    await sequelize.sync({ alter: true }); // Để cập nhật model Quotation mới

    const seedData = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf-8'));
    
    // 1. Import Products
    console.log('Đang import Products...');
    const productMap = {}; // Maps seed PRD ID to DB ID
    for (const p of seedData.products) {
      const [prod] = await Product.findOrCreate({
        where: { product_code: p.code },
        defaults: {
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock
        }
      });
      productMap[p.id] = prod.id;
    }
    console.log(`✅ Đã import xong Products`);

    // 2. Import Companies
    console.log('Đang import Companies...');
    const companyMap = {}; // Maps seed COM ID to DB ID
    for (const c of seedData.companies) {
      const [comp] = await Company.findOrCreate({
        where: { email: c.email },
        defaults: {
          name: c.name,
          phone: c.phone,
          address: c.address
        }
      });
      companyMap[c.id] = comp.id;
    }
    console.log(`✅ Đã import xong Companies`);

    // 3. Import Customers (User + Customer Profile)
    console.log('Đang import Customers...');
    const customerMap = {}; // Maps seed CUS ID to DB Customer Profile ID
    for (const cus of seedData.customers) {
      // Create User
      const [user] = await User.findOrCreate({
        where: { email: cus.email },
        defaults: {
          name: cus.fullName,
          phone: cus.phone,
          role: 'CUSTOMER',
          password: 'Customer@123',
          provider: 'local'
        }
      });
      
      // Create Customer profile
      const dbCompanyId = cus.companyId ? companyMap[cus.companyId] : null;
      const [customerProfile] = await Customer.findOrCreate({
        where: { user_id: user.id },
        defaults: {
          company_id: dbCompanyId,
          type: dbCompanyId ? 'company_customer' : 'individual_customer'
        }
      });
      
      customerMap[cus.id] = customerProfile.id;
    }
    console.log(`✅ Đã import xong Customers`);

    // 4. Import Quotations
    console.log('Đang import Quotations...');
    let quoteCount = 0;
    for (const q of seedData.quotations) {
      const [quote, created] = await Quotation.findOrCreate({
        where: { quote_code: q.code },
        defaults: {
          company_id: q.companyId ? companyMap[q.companyId] : null,
          customer_id: customerMap[q.customerId],
          sub_total: q.subTotal,
          discount: q.discount,
          vat: q.vat,
          total_amount: q.totalAmount,
          status: q.status,
          note: q.note,
          created_at: new Date(q.createdAt)
        }
      });

      if (created) {
        quoteCount++;
        // Import Quotation Items
        for (const item of q.items) {
          await QuotationItem.create({
            quotation_id: quote.id,
            product_name: item.productName,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.total
          });
        }
      }
    }
    console.log(`✅ Đã import ${quoteCount} Quotations mới`);

    console.log('\n========== IMPORT HOÀN TẤT ==========');
    process.exit(0);
  } catch (err) {
    console.error('❌ Import thất bại:', err);
    process.exit(1);
  }
};

importSeed();
