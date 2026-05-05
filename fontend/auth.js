/**
 * auth.js — ITS Long An CRM
 * Handles: Login, Register, Social OAuth, Show/Hide PW,
 *          Password strength, Page transition animations
 * API Base: http://localhost:5000
 */

const API = 'http://localhost:5000';

/* ================================================
   PAGE TRANSITION HELPERS
   ================================================ */
function navigateTo(url) {
  document.body.classList.add('page-exit');
  setTimeout(() => { window.location.href = url; }, 310);
}

// Trigger enter animation on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter');

  /* ── LOGIN PAGE ── */
  if (document.getElementById('loginForm'))   initLogin();

  /* ── REGISTER PAGE ── */
  if (document.getElementById('registerForm')) initRegister();
});

/* ================================================
   UTILITIES
   ================================================ */
function showAlert(id, msgId, message, type = 'error') {
  const box = document.getElementById(id);
  const msg = document.getElementById(msgId);
  if (!box || !msg) return;
  box.className = `alert alert-${type}`;
  msg.textContent = message;
  box.style.display = 'flex';
  box.style.animation = 'none';
  requestAnimationFrame(() => { box.style.animation = ''; });
}

function hideAlert(id) {
  const box = document.getElementById(id);
  if (box) box.style.display = 'none';
}

function setLoading(btnId, loading) {
  const btn  = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (text)   text.style.display = loading ? 'none' : 'flex';
  if (loader) loader.style.display = loading ? 'flex' : 'none';
}

function setFieldError(errorId, message) {
  const el = document.getElementById(errorId);
  if (!el) return;
  el.textContent = message;
}
function clearFieldErrors(...ids) {
  ids.forEach(id => setFieldError(id, ''));
}

function markInputError(inputId, hasError) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.toggle('input-error', hasError);
}

/* ================================================
   TOGGLE PASSWORD VISIBILITY
   ================================================ */
function initTogglePw(btnId, inputId, iconId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    if (icon) icon.setAttribute('name', isHidden ? 'eye-off-outline' : 'eye-outline');
  });
}

/* ================================================
   PASSWORD STRENGTH METER
   ================================================ */
function checkPasswordStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

function updateStrengthUI(pw) {
  const bar  = document.getElementById('pwStrengthBar');
  const text = document.getElementById('pwStrengthText');
  if (!bar || !text) return;
  if (!pw) { bar.style.width = '0'; text.textContent = ''; return; }

  const score = checkPasswordStrength(pw);
  const levels = [
    { pct: '20%', color: '#ef4444', label: 'Rất yếu' },
    { pct: '40%', color: '#f97316', label: 'Yếu' },
    { pct: '60%', color: '#eab308', label: 'Trung bình' },
    { pct: '80%', color: '#22c55e', label: 'Mạnh' },
    { pct: '100%',color: '#16a34a', label: 'Rất mạnh' },
  ];
  const lvl = levels[Math.min(score - 1, 4)] || levels[0];
  bar.style.width    = score ? lvl.pct : '0';
  bar.style.background = score ? lvl.color : 'transparent';
  text.textContent   = score ? lvl.label : '';
  text.style.color   = score ? lvl.color : '';
}

/* ================================================
   LOGIN — Init
   ================================================ */
function initLogin() {
  initTogglePw('togglePw', 'loginPassword', 'pwEyeIcon');

  // Intercept anchor links for smooth transition
  document.querySelectorAll('a[href="register.html"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo('register.html');
    });
  });

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  hideAlert('loginAlert');
  clearFieldErrors('emailError', 'passwordError');

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('rememberMe')?.checked;

  /* Client-side validation */
  let hasError = false;
  if (!email) {
    setFieldError('emailError', 'Vui lòng nhập email');
    markInputError('loginEmail', true);
    hasError = true;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('emailError', 'Email không hợp lệ');
    markInputError('loginEmail', true);
    hasError = true;
  } else {
    markInputError('loginEmail', false);
  }

  if (!password) {
    setFieldError('passwordError', 'Vui lòng nhập mật khẩu');
    markInputError('loginPassword', true);
    hasError = true;
  } else {
    markInputError('loginPassword', false);
  }
  if (hasError) return;

  setLoading('loginSubmit', true);

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('loginAlert', 'loginAlertMsg', data.message || 'Đăng nhập thất bại');
      setLoading('loginSubmit', false);
      return;
    }

    /* Success */
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    if (remember) {
      localStorage.setItem('crm_remember_email', email);
    } else {
      localStorage.removeItem('crm_remember_email');
    }

    // Brief success state before redirect
    showAlert('loginAlert', 'loginAlertMsg', '✅ Đăng nhập thành công! Đang chuyển hướng...', 'success');
    setTimeout(() => {
      if (data.user.role === 'CUSTOMER') {
        navigateTo('index.html');
      } else {
        navigateTo('dashboard.html');
      }
    }, 800);

  } catch (err) {
    showAlert('loginAlert', 'loginAlertMsg', 'Không thể kết nối server. Vui lòng kiểm tra backend.');
    setLoading('loginSubmit', false);
  }
}

/* ================================================
   REGISTER — Init
   ================================================ */
function initRegister() {
  initTogglePw('toggleRegPw', 'regPassword', 'regPwEyeIcon');

  // Password strength live update
  document.getElementById('regPassword')?.addEventListener('input', e => {
    updateStrengthUI(e.target.value);
  });

  // Intercept anchor links for smooth transition
  document.querySelectorAll('a[href="login.html"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigateTo('login.html');
    });
  });

  document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

async function handleRegister(e) {
  e.preventDefault();
  hideAlert('regAlert');
  hideAlert('regSuccess');
  clearFieldErrors('nameError', 'regEmailError', 'regPasswordError', 'phoneError');

  const name     = document.getElementById('regName').value.trim();
  const email    = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const phone    = document.getElementById('regPhone').value.trim();
  const address  = document.getElementById('regAddress').value.trim();

  /* Validation */
  let hasError = false;

  if (!name) {
    setFieldError('nameError', 'Vui lòng nhập họ và tên');
    markInputError('regName', true);
    hasError = true;
  } else {
    markInputError('regName', false);
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError('regEmailError', 'Email không hợp lệ');
    markInputError('regEmail', true);
    hasError = true;
  } else {
    markInputError('regEmail', false);
  }

  if (password.length < 6) {
    setFieldError('regPasswordError', 'Mật khẩu cần tối thiểu 6 ký tự');
    markInputError('regPassword', true);
    hasError = true;
  } else {
    markInputError('regPassword', false);
  }

  if (phone && !/^[0-9\s\-+()]{8,15}$/.test(phone)) {
    setFieldError('phoneError', 'Số điện thoại không hợp lệ');
    markInputError('regPhone', true);
    hasError = true;
  } else {
    markInputError('regPhone', false);
  }

  if (hasError) return;

  setLoading('regSubmit', true);

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, address }),
    });
    const data = await res.json();

    if (!res.ok) {
      showAlert('regAlert', 'regAlertMsg', data.message || 'Đăng ký thất bại');
      setLoading('regSubmit', false);
      return;
    }

    /* Success — save token and redirect */
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));

    document.getElementById('regSuccess').style.display = 'flex';
    document.getElementById('regSuccessMsg').textContent = '🎉 Đăng ký thành công! Đang chuyển hướng...';
    setTimeout(() => {
      if (data.user.role === 'CUSTOMER') {
        navigateTo('index.html');
      } else {
        navigateTo('dashboard.html');
      }
    }, 1200);

  } catch (err) {
    showAlert('regAlert', 'regAlertMsg', 'Không thể kết nối server. Vui lòng kiểm tra backend.');
    setLoading('regSubmit', false);
  }
}

/* ================================================
   PREVENT BROWSER AUTOFILL on login page
   ================================================ */
window.addEventListener('DOMContentLoaded', () => {
  const emailInput    = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  if (!emailInput || !passwordInput) return;

  // Clear immediately
  emailInput.value    = '';
  passwordInput.value = '';

  // Some browsers auto-fill after a short delay — clear again
  setTimeout(() => {
    emailInput.value    = '';
    passwordInput.value = '';
  }, 100);

  setTimeout(() => {
    emailInput.value    = '';
    passwordInput.value = '';
  }, 500);
});
