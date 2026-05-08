const fs = require('fs');

const path = 'c:/Users/ACER/Desktop/itslongan/fontend/dashboard.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Add CSS for hover
if (!html.includes('.custom-role-option')) {
  html = html.replace(/<style>/, '<style>\n    .custom-role-option:hover { background: #f1f5f9; }\n    .custom-role-option.disabled:hover { background: transparent; }');
}

// 2. Replace the select HTML with custom dropdown logic
const oldSelectStart = html.indexOf('<div class="form-group"><label>Vai trò</label>');
const oldSelectEnd = html.indexOf('</div>', html.indexOf('</select>', oldSelectStart)) + 6;

const newSelectHtml = `
          <div class="form-group" style="position:relative;">
            <label>Vai trò *</label>
            <input type="hidden" id="m_role" value="">
            
            <div id="custom-role-display" style="padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; background: var(--bg-secondary); min-height: 42px;" onclick="document.getElementById('custom-role-dropdown').style.display = document.getElementById('custom-role-dropdown').style.display === 'none' ? 'block' : 'none'">
               <div id="custom-role-badge"></div>
               <i data-lucide="chevron-down" style="width: 16px; height: 16px; color: var(--text-secondary);"></i>
            </div>
            
            <div id="custom-role-dropdown" style="display: none; position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid var(--border); border-radius: 8px; margin-top: 4px; padding: 6px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 100;">
            </div>
            <span class="error-msg"></span>
          </div>
`;

if (oldSelectStart !== -1 && html.includes('<select id="m_role"')) {
  html = html.substring(0, oldSelectStart) + newSelectHtml + html.substring(oldSelectEnd);
}

// 3. Inject JS initialization inside openCrudModal
const initLogic = `
      if (currentModule === 'users' || currentModule === 'customers') {
        let defaultRole = currentModule === 'customers' ? 'CUSTOMER' : 'STAFF';
        if (id) defaultRole = item.role || defaultRole;

        const roleConfig = [
          { value: 'ADMIN', label: 'Quản trị (ADMIN)', color: '#1e3a8a', bg: '#dbeafe' },
          { value: 'MANAGER', label: 'Quản lý (MANAGER)', color: '#0284c7', bg: '#e0f2fe' },
          { value: 'STAFF', label: 'Nhân viên ITS (STAFF)', color: '#7c3aed', bg: '#ede9fe' },
          { value: 'CUSTOMER', label: 'Khách hàng (CUSTOMER)', color: '#4b5563', bg: '#f3f4f6' }
        ];

        let roleOptionsHtml = '';
        roleConfig.forEach(r => {
          let disabled = false;
          let tooltip = '';
          if (user.role === 'MANAGER' && r.value === 'ADMIN') {
            disabled = true;
            tooltip = 'Bạn không có quyền chọn vai trò này';
          }
          if (currentModule === 'customers' && r.value !== 'CUSTOMER') {
            disabled = true;
            tooltip = 'Chỉ được chọn Khách hàng';
          }

          roleOptionsHtml += \`
            <div class="custom-role-option \${disabled ? 'disabled' : ''}" 
                 style="padding: 10px 12px; display: flex; align-items: center; border-radius: 6px; margin-bottom: 2px; transition: background 0.2s; 
                 \${disabled ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;'}"
                 title="\${tooltip}"
                 \${!disabled ? \`onclick="selectCustomRole('\${r.value}')"\` : ''}>
              <span style="background: \${r.bg}; color: \${r.color}; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">\${r.label}</span>
            </div>
          \`;
        });
        
        setTimeout(() => {
          const dd = document.getElementById('custom-role-dropdown');
          if (dd) dd.innerHTML = roleOptionsHtml;
          window.selectCustomRole(defaultRole);
          lucide.createIcons();
        }, 50);
        
        window.selectCustomRole = (val) => {
           const conf = roleConfig.find(x => x.value === val);
           document.getElementById('m_role').value = val;
           document.getElementById('custom-role-badge').innerHTML = \`<span style="background: \${conf.bg}; color: \${conf.color}; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">\${conf.label}</span>\`;
           document.getElementById('custom-role-dropdown').style.display = 'none';
        };
        
        // Hide dropdown on click outside
        document.addEventListener('click', function(e) {
          const display = document.getElementById('custom-role-display');
          const dropdown = document.getElementById('custom-role-dropdown');
          if (display && dropdown && !display.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
          }
        });
      }
`;

// Insert the initLogic right after "html = `..." assignment where it sets up title
const insertPos = html.indexOf("title.textContent = id ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới';");
if (insertPos !== -1 && !html.includes("roleConfig = [")) {
  html = html.substring(0, insertPos) + "title.textContent = id ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới';\n" + initLogic + html.substring(insertPos + 71);
}

// 4. Update the openCrudModal restrictions:
// "ROLE = STAFF: không được tạo user -> disable dropdown hoặc ẩn luôn" (Actually they can't even open the modal)
// We already replaced user.role === 'MANAGER' with ['MANAGER', 'STAFF'].includes(user.role) earlier.
// But now MANAGER is allowed to create users. So we must change it to ONLY block STAFF!
html = html.replace(/if \(\['MANAGER', 'STAFF'\].includes\(user.role\)\) \{\s*return showToast\('Bạn chỉ có quyền xem', 'error'\);\s*\}/g, "if (user.role === 'STAFF') { return showToast('Bạn chỉ có quyền xem', 'error'); }");

fs.writeFileSync(path, html);
