// quotation.js

// --- STATE MANAGEMENT (Local Storage) ---
let quotes = JSON.parse(localStorage.getItem('crm_quotes')) || [];
let currentQuoteId = null;

// Helpers
function formatMoney(amount) {
  if (!amount) return '0';
  return parseFloat(amount).toLocaleString('vi-VN');
}

function parseMoney(str) {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/\./g, '').replace(/,/g, '')) || 0;
}

function generateQuoteCode() {
  const d = new Date();
  const dateStr = `${d.getDate().toString().padStart(2, '0')}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getFullYear().toString().slice(-2)}`;
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BG-ITS-${dateStr}-${randomStr}`;
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 3000);
}

// --- NAVIGATION ---
function showList() {
  document.getElementById('view-form').classList.remove('active');
  document.getElementById('view-list').classList.add('active');
  renderList();
}

function showCreateForm() {
  document.getElementById('view-list').classList.remove('active');
  document.getElementById('view-form').classList.add('active');
  
  // Reset form
  document.getElementById('quoteForm').reset();
  document.getElementById('q_date').valueAsDate = new Date();
  currentQuoteId = generateQuoteCode();
  document.getElementById('form-title').textContent = `Tạo Báo giá mới (${currentQuoteId})`;
  
  // Default 1 empty row
  document.getElementById('items-body').innerHTML = '';
  addBlankRow();
  calcTotal();
}

// --- DYNAMIC TABLE ---
function addBlankRow(name='', content='', unit='Cái', qty=1, price=0) {
  const tbody = document.getElementById('items-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="i-name" placeholder="Tên SP..." value="${name}"></td>
    <td><input type="text" class="i-content" placeholder="Mô tả..." value="${content}"></td>
    <td><input type="text" class="i-unit" placeholder="ĐVT" value="${unit}" style="text-align:center"></td>
    <td><input type="number" class="i-qty" min="1" value="${qty}" oninput="calcRow(this)"></td>
    <td><input type="text" class="i-price" value="${formatMoney(price)}" oninput="formatInputMoney(this); calcRow(this)"></td>
    <td><input type="text" class="i-total" value="${formatMoney(qty * price)}" readonly style="color:var(--success); font-weight:bold;"></td>
    <td style="text-align:center"><button type="button" class="btn-icon danger" onclick="removeRow(this)">🗑️</button></td>
  `;
  tbody.appendChild(tr);
}

function removeRow(btn) {
  btn.closest('tr').remove();
  calcTotal();
}

function formatInputMoney(input) {
  // Allow typing numbers, format on the fly
  let val = input.value.replace(/[^0-9]/g, '');
  if (val) {
    input.value = parseFloat(val).toLocaleString('vi-VN');
  } else {
    input.value = '';
  }
}

function calcRow(el) {
  const tr = el.closest('tr');
  const qty = parseFloat(tr.querySelector('.i-qty').value) || 0;
  const priceStr = tr.querySelector('.i-price').value;
  const price = parseMoney(priceStr);
  
  const total = qty * price;
  tr.querySelector('.i-total').value = formatMoney(total);
  calcTotal();
}

function calcTotal() {
  let sum = 0;
  document.querySelectorAll('.i-total').forEach(input => {
    sum += parseMoney(input.value);
  });
  document.getElementById('q_total_display').textContent = formatMoney(sum);
  return sum;
}

// --- SAVE & RENDER LIST ---
function saveQuote() {
  const customer = document.getElementById('q_customer').value.trim();
  if (!customer) {
    showToast('Vui lòng nhập tên Khách hàng', 'error');
    return;
  }

  const items = [];
  document.querySelectorAll('#items-body tr').forEach(tr => {
    const name = tr.querySelector('.i-name').value.trim();
    if (name) {
      items.push({
        name: name,
        content: tr.querySelector('.i-content').value.trim(),
        unit: tr.querySelector('.i-unit').value.trim(),
        qty: parseFloat(tr.querySelector('.i-qty').value) || 0,
        price: parseMoney(tr.querySelector('.i-price').value),
        total: parseMoney(tr.querySelector('.i-total').value)
      });
    }
  });

  if (items.length === 0) {
    showToast('Vui lòng nhập ít nhất 1 sản phẩm', 'error');
    return;
  }

  const quoteData = {
    id: currentQuoteId,
    customer: customer,
    receiver: document.getElementById('q_receiver').value.trim(),
    address: document.getElementById('q_address').value.trim(),
    phone: document.getElementById('q_phone').value.trim(),
    date: document.getElementById('q_date').value,
    terms: document.getElementById('q_terms').value,
    items: items,
    totalAmount: calcTotal()
  };

  // Cập nhật hoặc Thêm mới
  const existingIdx = quotes.findIndex(q => q.id === currentQuoteId);
  if (existingIdx >= 0) {
    quotes[existingIdx] = quoteData;
  } else {
    quotes.unshift(quoteData); // Thêm lên đầu
  }

  localStorage.setItem('crm_quotes', JSON.stringify(quotes));
  showToast('Lưu Báo giá thành công!');
  showList();
}

function renderList() {
  const tbody = document.getElementById('quote-list-body');
  if (quotes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted)">Chưa có báo giá nào</td></tr>';
    return;
  }

  tbody.innerHTML = quotes.map(q => `
    <tr>
      <td><strong>${q.id}</strong></td>
      <td>${q.customer}</td>
      <td>${new Date(q.date).toLocaleDateString('vi-VN')}</td>
      <td style="color:var(--success); font-weight:bold">${formatMoney(q.totalAmount)} đ</td>
      <td>
        <button class="btn-icon" onclick="editQuote('${q.id}')" title="Sửa">✏️</button>
        <button class="btn-icon danger" onclick="deleteQuote('${q.id}')" title="Xóa">🗑️</button>
      </td>
    </tr>
  `).join('');
}

function editQuote(id) {
  const q = quotes.find(x => x.id === id);
  if(!q) return;

  currentQuoteId = q.id;
  document.getElementById('view-list').classList.remove('active');
  document.getElementById('view-form').classList.add('active');
  document.getElementById('form-title').textContent = `Sửa Báo giá (${currentQuoteId})`;

  document.getElementById('q_customer').value = q.customer || '';
  document.getElementById('q_receiver').value = q.receiver || '';
  document.getElementById('q_address').value = q.address || '';
  document.getElementById('q_phone').value = q.phone || '';
  document.getElementById('q_date').value = q.date || '';
  document.getElementById('q_terms').value = q.terms || '';

  const tbody = document.getElementById('items-body');
  tbody.innerHTML = '';
  q.items.forEach(item => {
    addBlankRow(item.name, item.content, item.unit, item.qty, item.price);
  });
  calcTotal();
}

function deleteQuote(id) {
  if (confirm(`Bạn có chắc muốn xóa báo giá ${id}?`)) {
    quotes = quotes.filter(q => q.id !== id);
    localStorage.setItem('crm_quotes', JSON.stringify(quotes));
    renderList();
    showToast('Đã xóa thành công');
  }
}

// --- PREVIEW & EXPORT ---
function previewQuote() {
  const customer = document.getElementById('q_customer').value.trim();
  if(!customer) {
    showToast('Cần điền Khách hàng trước khi xem trước', 'error');
    return;
  }

  // Map data to A4
  document.getElementById('p_customer').textContent = customer;
  document.getElementById('p_address').textContent = document.getElementById('q_address').value;
  document.getElementById('p_receiver').textContent = document.getElementById('q_receiver').value;
  document.getElementById('p_phone').textContent = document.getElementById('q_phone').value;
  
  document.getElementById('p_code').textContent = currentQuoteId;
  const dateParts = document.getElementById('q_date').value.split('-');
  document.getElementById('p_date').textContent = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : '';
  
  document.getElementById('p_terms').textContent = document.getElementById('q_terms').value;
  
  // Map table
  const pBody = document.getElementById('p_table_body');
  pBody.innerHTML = '';
  let sum = 0;
  
  let stt = 1;
  document.querySelectorAll('#items-body tr').forEach(tr => {
    const name = tr.querySelector('.i-name').value.trim();
    if (name) {
      const content = tr.querySelector('.i-content').value.trim();
      const unit = tr.querySelector('.i-unit').value.trim();
      const qty = parseFloat(tr.querySelector('.i-qty').value) || 0;
      const price = parseMoney(tr.querySelector('.i-price').value);
      const total = qty * price;
      sum += total;
      
      pBody.innerHTML += `
        <tr>
          <td class="text-center">${stt++}</td>
          <td>
            <strong>${name}</strong>
            ${content ? `<br><span style="font-size:0.9em;color:#555">- ${content}</span>` : ''}
          </td>
          <td class="text-center">${unit}</td>
          <td class="text-center">${qty}</td>
          <td class="text-right">${formatMoney(price)}</td>
          <td class="text-right">${formatMoney(total)}</td>
        </tr>
      `;
    }
  });

  document.getElementById('p_total').textContent = formatMoney(sum);
  
  // Show Modal
  document.getElementById('preview-modal').classList.add('show');
}

function closePreview() {
  document.getElementById('preview-modal').classList.remove('show');
}

function exportPDF() {
  const element = document.getElementById('a4-content');
  const opt = {
    margin:       0,
    filename:     `${currentQuoteId}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save().then(() => {
    showToast('Xuất PDF thành công!');
  });
}

function exportExcel() {
  // Tạo mảng dữ liệu cho Excel
  const data = [
    ["BẢNG BÁO GIÁ CUNG CẤP THIẾT BỊ DỊCH VỤ"],
    [],
    ["Kính gửi:", document.getElementById('p_customer').textContent, "", "Báo giá số:", currentQuoteId],
    ["Địa chỉ:", document.getElementById('p_address').textContent, "", "Ngày:", document.getElementById('p_date').textContent],
    ["Người nhận:", document.getElementById('p_receiver').textContent],
    ["Điện thoại:", document.getElementById('p_phone').textContent],
    [],
    ["STT", "Tên Sản phẩm", "Nội dung", "ĐVT", "Số lượng", "Đơn giá (VNĐ)", "Thành tiền (VNĐ)"]
  ];

  let stt = 1;
  document.querySelectorAll('#items-body tr').forEach(tr => {
    const name = tr.querySelector('.i-name').value.trim();
    if(name) {
      data.push([
        stt++,
        name,
        tr.querySelector('.i-content').value.trim(),
        tr.querySelector('.i-unit').value.trim(),
        parseFloat(tr.querySelector('.i-qty').value) || 0,
        parseMoney(tr.querySelector('.i-price').value),
        parseMoney(tr.querySelector('.i-total').value)
      ]);
    }
  });

  data.push(["", "", "", "", "", "Tổng cộng:", parseMoney(document.getElementById('q_total_display').textContent)]);

  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Canh chỉnh chiều rộng cột
  ws['!cols'] = [{wch:5}, {wch:30}, {wch:40}, {wch:8}, {wch:10}, {wch:15}, {wch:15}];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "BaoGia");
  
  XLSX.writeFile(wb, `${currentQuoteId}.xlsx`);
  showToast('Xuất Excel thành công!');
}

// Khởi tạo ban đầu
renderList();
