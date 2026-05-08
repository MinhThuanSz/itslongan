const fs = require('fs');

// Helper to generate IDs
const generateId = (prefix, num) => `${prefix}-${String(num).padStart(4, '0')}`;

const productCategories = ['Camera', 'Solar', 'Projector', 'Network', 'Timekeeper', 'SmartHome'];
const productsData = [
  { name: 'Camera IP Hồng Ngoại Hikvision 2MP DS-2CD2021G1-I', category: 'Camera', price: 1250000 },
  { name: 'Camera Dome Hikvision 4MP DS-2CD2143G0-I', category: 'Camera', price: 1850000 },
  { name: 'Camera PTZ Speed Dome Hikvision 2MP DS-2DE4225IW-DE', category: 'Camera', price: 7500000 },
  { name: 'Camera Thân Dahua 2MP DH-HAC-HFW1200SP', category: 'Camera', price: 550000 },
  { name: 'Camera IP Wifi Ezviz C6N 1080P', category: 'Camera', price: 590000 },
  { name: 'Camera KBVision KX-A2011C4 2.0 Megapixel', category: 'Camera', price: 450000 },
  { name: 'Đèn đường năng lượng mặt trời Jindian JD-Z200 (200W)', category: 'Solar', price: 1850000 },
  { name: 'Đèn pha năng lượng mặt trời Sokoyo 100W', category: 'Solar', price: 2100000 },
  { name: 'Đèn năng lượng mặt trời liền thể 300W', category: 'Solar', price: 1450000 },
  { name: 'Máy chiếu Epson EB-E01 (XGA, 3300 Ansi)', category: 'Projector', price: 9500000 },
  { name: 'Máy chiếu Sony VPL-EX430 (XGA, 3200 Ansi)', category: 'Projector', price: 12500000 },
  { name: 'Máy chiếu Panasonic PT-LB386 (XGA, 3800 Ansi)', category: 'Projector', price: 14200000 },
  { name: 'Router Wifi 6 TP-Link Archer AX53 (AX3000)', category: 'Network', price: 1550000 },
  { name: 'Router ASUS RT-AX55 Chuẩn AX1800', category: 'Network', price: 1890000 },
  { name: 'Bộ chia mạng Switch Cisco CBS110-8T-D 8 Port', category: 'Network', price: 1150000 },
  { name: 'Switch POE Dahua PFS3005-4ET-60 4 Port', category: 'Network', price: 750000 },
  { name: 'Cáp mạng UTP Cat6 Dintek (Cuộn 305m)', category: 'Network', price: 2500000 },
  { name: 'Máy chấm công vân tay Ronald Jack X628-C', category: 'Timekeeper', price: 2850000 },
  { name: 'Máy chấm công khuôn mặt ZKTeco MB20', category: 'Timekeeper', price: 3200000 },
  { name: 'Máy chấm công vân tay MITA F108', category: 'Timekeeper', price: 2600000 },
  { name: 'Chuông cửa màn hình Panasonic VL-SW274VN', category: 'SmartHome', price: 6500000 },
  { name: 'Khóa cửa vân tay thông minh Xiaomi Smart Door Lock', category: 'SmartHome', price: 4500000 },
  { name: 'Bộ báo trộm trung tâm không dây Kawa KW-260', category: 'SmartHome', price: 1250000 },
  { name: 'Ổ cứng HDD WD Purple 2TB chuyên dụng camera', category: 'Camera', price: 1450000 },
  { name: 'Tủ mạng Rack 6U D400 (Treo tường)', category: 'Network', price: 650000 },
  { name: 'Nguồn camera 12V-2A (Loại tốt)', category: 'Camera', price: 50000 },
];

const products = productsData.map((p, index) => ({
  id: generateId('PRD', index + 1),
  name: p.name,
  code: `${p.category.toUpperCase().substring(0,3)}-${String(index+1).padStart(3, '0')}`,
  price: p.price,
  category: p.category,
  description: `Sản phẩm ${p.name} chính hãng. Bảo hành 24 tháng theo tiêu chuẩn nhà sản xuất. Hỗ trợ kỹ thuật trọn đời.`,
  stock: Math.floor(Math.random() * 50) + 10
}));

const companyNames = [
  "Công ty TNHH Công Nghệ Kỹ Thuật Viễn Thông Sao Mai",
  "Công ty CP Xây Dựng và Thương Mại Hòa Bình",
  "Công ty TNHH Giải Pháp Phần Mềm Tinh Hoa",
  "Công ty Cổ phần Đầu Tư Bất Động Sản Hưng Thịnh",
  "Công ty TNHH Sản Xuất và Thương Mại Minh Phát",
  "Công ty CP Tập Đoàn Công Nghệ CMC",
  "Công ty TNHH Dịch Vụ Bảo Vệ Thăng Long",
  "Công ty Cổ phần Xây Lắp Điện 1",
  "Công ty TNHH Thương Mại Dịch Vụ An Phú",
  "Công ty TNHH Kỹ Thuật Cơ Điện Lạnh Bách Khoa",
  "Công ty CP Đầu Tư và Phát Triển Giáo Dục Phương Nam",
  "Công ty TNHH Kiến Trúc và Nội Thất Xanh",
  "Công ty Cổ phần Dược Phẩm ECO",
  "Công ty TNHH Vận Tải và Giao Nhận Toàn Cầu",
  "Công ty CP Công Nghiệp Cao Su Miền Nam",
  "Công ty TNHH Thiết Bị Y Tế Tâm Đức",
  "Công ty Cổ phần Du Lịch và Dịch Vụ Vietravel",
  "Công ty TNHH Nông Nghiệp Sạch VinEco",
  "Công ty CP Truyền Thông và Giải Trí Điền Quân",
  "Công ty TNHH Chế Biến Thực Phẩm Vissan",
  "Công ty Cổ phần Nhựa Bình Minh",
  "Công ty TNHH Xây Dựng Cầu Đường Thăng Long"
];

const addresses = [
  "123 Nguyễn Thị Minh Khai, Phường 5, Quận 3, TP.HCM",
  "45 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM",
  "89 Cộng Hòa, Phường 4, Tân Bình, TP.HCM",
  "12 Khuất Duy Tiến, Thanh Xuân, Hà Nội",
  "56 Trần Phú, Hải Châu, Đà Nẵng",
  "234 Phạm Văn Đồng, Thủ Đức, TP.HCM",
  "78 Nguyễn Văn Linh, Quận 7, TP.HCM",
  "90 Tôn Đức Thắng, Đống Đa, Hà Nội",
  "112 Võ Văn Kiệt, Quận 1, TP.HCM",
  "44 Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM"
];

const companies = companyNames.map((name, index) => {
  const shortName = name.toLowerCase()
    .replace(/công ty tnhh |công ty cp |cổ phần |tập đoàn | /g, '')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return {
    id: generateId('COM', index + 1),
    name: name,
    phone: `028${Math.floor(1000000 + Math.random() * 9000000)}`,
    email: `contact@${shortName}.vn`,
    address: addresses[index % addresses.length]
  };
});

const firstNames = ["Lê", "Trần", "Nguyễn", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const middleNames = ["Minh", "Thị", "Văn", "Đức", "Hữu", "Thanh", "Ngọc", "Hoàng", "Xuân", "Thu", "Hải", "Tuấn", "Quốc", "Gia", "Bảo", "Đình", "Nhật", "Cẩm"];
const lastNames = ["Tuấn", "Lan", "Hải", "Sơn", "Linh", "Hùng", "Cường", "Trang", "Phương", "Anh", "Khang", "Nam", "Long", "Bình", "Khoa", "Nhi", "Hân", "Quân", "Phúc", "Đạt"];

const generateName = () => {
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

const customers = [];
let customerCounter = 1;

companies.forEach(company => {
  // 1 to 4 customers per company
  const numCustomers = Math.floor(Math.random() * 4) + 1;
  for(let i=0; i<numCustomers; i++) {
    const name = generateName();
    customers.push({
      id: generateId('CUS', customerCounter++),
      fullName: name,
      email: `${name.toLowerCase().replace(/ /g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@gmail.com`,
      phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
      role: "customer",
      companyId: company.id
    });
  }
});

// Add 8 freelance customers (without company)
for(let i=0; i<8; i++) {
  const name = generateName();
  customers.push({
    id: generateId('CUS', customerCounter++),
    fullName: name,
    email: `${name.toLowerCase().replace(/ /g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@gmail.com`,
    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: "customer",
    companyId: null
  });
}

const statuses = ["draft", "sent", "approved", "rejected", "pending"];
const quotations = [];
let quotationCounter = 1;

customers.forEach(customer => {
  // 2 to 6 quotes per customer
  const numQuotes = Math.floor(Math.random() * 5) + 2;
  
  for(let i=0; i<numQuotes; i++) {
    // Generate items
    const numItems = Math.floor(Math.random() * 12) + 2; // 2 to 13 items for varied sizes
    const items = [];
    let subTotal = 0;
    
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, numItems);
    
    selectedProducts.forEach(product => {
      const quantity = Math.floor(Math.random() * 15) + 1;
      const price = product.price;
      const total = quantity * price;
      
      items.push({
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        price: price,
        total: total
      });
      subTotal += total;
    });
    
    const discountPercent = Math.random() > 0.6 ? (Math.floor(Math.random() * 3) + 1) * 5 : 0; // 0%, 5%, 10%, 15%
    const discount = (subTotal * discountPercent) / 100;
    const vat = (subTotal - discount) * 0.1;
    const totalAmount = subTotal - discount + vat;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180)); // past 6 months
    
    quotations.push({
      id: generateId('QUO', quotationCounter++),
      code: `BQ-${String(quotationCounter-1).padStart(4, '0')}`,
      customerId: customer.id,
      companyId: customer.companyId,
      createdAt: date.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      note: "Báo giá có giá trị trong vòng 30 ngày. Thanh toán 50% tạm ứng sau khi ký hợp đồng, 50% còn lại sau khi bàn giao nghiệm thu. Giá trên đã bao gồm VAT.",
      items: items,
      subTotal: subTotal,
      discount: discount,
      vat: vat,
      totalAmount: totalAmount
    });
  }
});

const output = {
  products,
  companies,
  customers,
  quotations
};

fs.writeFileSync('seed-data.json', JSON.stringify(output, null, 2));
console.log('Successfully generated seed-data.json');
console.log(`- Products: ${products.length}`);
console.log(`- Companies: ${companies.length}`);
console.log(`- Customers: ${customers.length}`);
console.log(`- Quotations: ${quotations.length}`);
