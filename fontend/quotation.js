// quotation.js
const API = 'http://localhost:5000';
const token = localStorage.getItem('crm_token');

// State
let companies = [];
let customers = [];
let products = [];
let quotations = [];
let currentId = null;

// Headers
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  if (!token) {
    window.location.href = 'login.html';
    return;
  }
  fetchInitialData();
  renderList();
});

async function fetchInitialData() {
  try {
    const [compRes, custRes, prodRes] = await Promise.all([
      fetch(`${API}/companies`, { headers }),
      fetch(`${API}/users`, { headers }), // Fetching all users, will filter for customers
      fetch(`${API}/products`, { headers })
    ]);

    companies = await compRes.json();
    const allUsers = await custRes.json();
    customers = allUsers.filter(u => u.role === 'CUSTOMER');
    products = await prodRes.json();

    // Populate selects
    const compSelect = document.getElementById('q_company_select');
    companies.forEach(c => {
      compSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });

    const custSelect = document.getElementById('q_customer_select');
    customers.forEach(c => {
      custSelect.innerHTML += `<option value="${c.id}">${c.name} (${c.email})</option>`;
    });

    const prodSelect = document.getElementById('q_product_select');
    products.forEach(p => {
      prodSelect.innerHTML += `<option value="${p.id}">${p.name} - ${formatMoney(p.price)}</option>`;
    });

  } catch (err) {
    console.error('Error fetching data:', err);
    showToast('Lỗi khi tải dữ liệu khởi tạo', 'error');
  }
}

// --- HELPERS ---
function formatMoney(amount) {
  if (!amount) return '0';
  return parseFloat(amount).toLocaleString('en-US'); // User asked for comma separator: 1,000,000
}

function parseMoney(str) {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/,/g, '')) || 0;
}

function generateQuoteCode() {
  const d = new Date();
  const dateStr = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
  const randomStr = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BG-${dateStr}-${randomStr}`;
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 3000);
}

// --- FORM LOGIC ---
function fillCompanyInfo(id) {
  const comp = companies.find(c => c.id == id);
  if (!comp) return;
  document.getElementById('q_customer').value = comp.name;
  document.getElementById('q_address').value = comp.address || '';
  document.getElementById('q_phone').value = comp.phone || '';
  document.getElementById('q_email').value = comp.email || '';
}

function fillCustomerInfo(id) {
  const cust = customers.find(c => c.id == id);
  if (!cust) return;
  document.getElementById('q_customer').value = cust.name;
  document.getElementById('q_address').value = cust.address || '';
  document.getElementById('q_phone').value = cust.phone || '';
  document.getElementById('q_email').value = cust.email || '';
}

function addProductFromSelect(id) {
  const prod = products.find(p => p.id == id);
  if (!prod) return;
  addBlankRow(prod.name, prod.description, 1, prod.price);
  document.getElementById('q_product_select').value = ''; // Reset
}

function addBlankRow(name = '', desc = '', qty = 1, price = 0) {
  const tbody = document.getElementById('items-body');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="i-name" value="${name}" placeholder="Tên SP..."></td>
    <td><input type="text" class="i-desc" value="${desc}" placeholder="Mô tả..."></td>
    <td><input type="number" class="i-qty" value="${qty}" min="1" oninput="calcRow(this)"></td>
    <td><input type="text" class="i-price" value="${formatMoney(price)}" oninput="formatInputMoney(this); calcRow(this)"></td>
    <td><input type="text" class="i-total" value="${formatMoney(qty * price)}" readonly style="color:var(--success); font-weight:bold;"></td>
    <td style="text-align:center"><button type="button" class="btn-icon danger" onclick="removeRow(this)">🗑️</button></td>
  `;
  tbody.appendChild(tr);
  calcTotal();
}

function removeRow(btn) {
  btn.closest('tr').remove();
  calcTotal();
}

function formatInputMoney(input) {
  let val = input.value.replace(/[^0-9]/g, '');
  if (val) {
    input.value = parseFloat(val).toLocaleString('en-US');
  } else {
    input.value = '';
  }
}

function calcRow(el) {
  const tr = el.closest('tr');
  const qty = parseFloat(tr.querySelector('.i-qty').value) || 0;
  const price = parseMoney(tr.querySelector('.i-price').value);
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

// --- CRUD ---
async function renderList() {
  try {
    const res = await fetch(`${API}/quotations`, { headers });
    quotations = await res.json();
    
    const tbody = document.getElementById('quote-list-body');
    if (quotations.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--text-muted)">Chưa có báo giá nào</td></tr>';
      return;
    }

    tbody.innerHTML = quotations.map(q => `
      <tr>
        <td><strong>${q.quote_code}</strong></td>
        <td>${q.customer ? q.customer.user.name : (q.company ? q.company.name : 'Vãng lai')}</td>
        <td>${new Date(q.created_at).toLocaleDateString('vi-VN')}</td>
        <td style="color:var(--success); font-weight:bold">${formatMoney(q.total_amount)} đ</td>
        <td>
          <button class="btn-icon" onclick="editQuote(${q.id})" title="Sửa">✏️</button>
          <button class="btn-icon danger" title="Xóa" disabled>🗑️</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Error rendering list:', err);
  }
}

function showList() {
  document.getElementById('view-form').classList.remove('active');
  document.getElementById('view-list').classList.add('active');
  renderList();
}

function showCreateForm() {
  currentId = null;
  document.getElementById('view-list').classList.remove('active');
  document.getElementById('view-form').classList.add('active');
  document.getElementById('quoteForm').reset();
  document.getElementById('form-title').textContent = 'Tạo Báo giá mới';
  document.getElementById('q_date').valueAsDate = new Date();
  document.getElementById('q_code').value = generateQuoteCode();
  document.getElementById('items-body').innerHTML = '';
  addBlankRow();
  calcTotal();
}

async function handleSave() {
  const quote_code = document.getElementById('q_code').value;
  const company_id = document.getElementById('q_company_select').value || null;
  const customer_id = document.getElementById('q_customer_select').value || null;
  const note = document.getElementById('q_note').value;
  const total_amount = calcTotal();

  const items = [];
  document.querySelectorAll('#items-body tr').forEach(tr => {
    const name = tr.querySelector('.i-name').value.trim();
    if (name) {
      items.push({
        product_name: name,
        description: tr.querySelector('.i-desc').value.trim(),
        quantity: parseFloat(tr.querySelector('.i-qty').value) || 0,
        unit_price: parseMoney(tr.querySelector('.i-price').value),
        total_price: parseMoney(tr.querySelector('.i-total').value)
      });
    }
  });

  if (items.length === 0) {
    showToast('Vui lòng thêm ít nhất 1 sản phẩm', 'error');
    return;
  }

  const payload = { quote_code, company_id, customer_id, total_amount, note, items };

  try {
    const url = currentId ? `${API}/quotations/${currentId}` : `${API}/quotations`;
    const method = currentId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      showToast(currentId ? 'Cập nhật thành công' : 'Tạo mới thành công');
      showList();
    } else {
      const error = await res.json();
      showToast(error.message || 'Lỗi khi lưu báo giá', 'error');
    }
  } catch (err) {
    console.error('Error saving quote:', err);
    showToast('Lỗi server', 'error');
  }
}

async function editQuote(id) {
  try {
    const res = await fetch(`${API}/quotations/${id}`, { headers });
    const q = await res.json();
    currentId = q.id;

    document.getElementById('view-list').classList.remove('active');
    document.getElementById('view-form').classList.add('active');
    document.getElementById('form-title').textContent = `Sửa Báo giá #${q.quote_code}`;

    document.getElementById('q_code').value = q.quote_code;
    document.getElementById('q_company_select').value = q.company_id || '';
    document.getElementById('q_customer_select').value = q.customer_id || '';
    document.getElementById('q_customer').value = q.customer ? q.customer.user.name : (q.company ? q.company.name : '');
    document.getElementById('q_address').value = q.customer ? q.customer.user.address : (q.company ? q.company.address : '');
    document.getElementById('q_phone').value = q.customer ? q.customer.user.phone : (q.company ? q.company.phone : '');
    document.getElementById('q_email').value = q.customer ? q.customer.user.email : (q.company ? q.company.email : '');
    document.getElementById('q_date').value = q.created_at.split('T')[0];
    document.getElementById('q_note').value = q.note || '';

    const tbody = document.getElementById('items-body');
    tbody.innerHTML = '';
    q.items.forEach(item => {
      addBlankRow(item.product_name, item.description, item.quantity, item.unit_price);
    });
    calcTotal();
  } catch (err) {
    console.error('Error fetching quote for edit:', err);
  }
}

// --- PREVIEW ---
function previewQuote() {
  const customerName = document.getElementById('q_customer').value;
  if (!customerName) {
    showToast('Vui lòng điền thông tin khách hàng', 'error');
    return;
  }

  document.getElementById('p_customer').textContent = customerName;
  document.getElementById('p_company_name').textContent = document.getElementById('q_company_select').options[document.getElementById('q_company_select').selectedIndex]?.text || '';
  document.getElementById('p_phone').textContent = document.getElementById('q_phone').value;
  document.getElementById('p_address').textContent = document.getElementById('q_address').value;
  document.getElementById('p_date').textContent = new Date(document.getElementById('q_date').value).toLocaleDateString('vi-VN');
  document.getElementById('p_code').textContent = document.getElementById('q_code').value;
  document.getElementById('p_note').textContent = document.getElementById('q_note').value || 'N/A';

  const tbody = document.getElementById('p_table_body');
  tbody.innerHTML = '';
  let stt = 1;
  document.querySelectorAll('#items-body tr').forEach(tr => {
    const name = tr.querySelector('.i-name').value;
    if (name) {
      const desc = tr.querySelector('.i-desc').value;
      const qty = tr.querySelector('.i-qty').value;
      const price = tr.querySelector('.i-price').value;
      const total = tr.querySelector('.i-total').value;

      tbody.innerHTML += `
        <tr>
          <td style="text-align:center">${stt++}</td>
          <td>
            <strong>${name}</strong><br>
            <small>${desc}</small>
          </td>
          <td style="text-align:center">${qty}</td>
          <td style="text-align:right">${price}</td>
          <td style="text-align:right; font-weight:bold">${total}</td>
        </tr>
      `;
    }
  });

  document.getElementById('p_total').textContent = document.getElementById('q_total_display').textContent + ' VNĐ';
  document.getElementById('preview-modal').classList.add('show');
}

function closePreview() {
  document.getElementById('preview-modal').classList.remove('show');
}

function exportPDF() {
  const element = document.getElementById('a4-content');
  const opt = {
    margin: 0,
    filename: `BAO_GIA_${document.getElementById('q_code').value}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

// Global functions for HTML calls
window.showCreateForm = showCreateForm;
window.showList = showList;
window.addBlankRow = addBlankRow;
window.removeRow = removeRow;
window.calcRow = calcRow;
window.formatInputMoney = formatInputMoney;
window.handleSave = handleSave;
window.editQuote = editQuote;
window.previewQuote = previewQuote;
window.closePreview = closePreview;
window.exportPDF = exportPDF;
window.fillCompanyInfo = fillCompanyInfo;
window.fillCustomerInfo = fillCustomerInfo;
window.addProductFromSelect = addProductFromSelect;
