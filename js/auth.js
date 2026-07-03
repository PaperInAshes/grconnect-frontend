// auth.js — Manajemen sesi autentikasi

const Auth = {
  getToken()  { return localStorage.getItem(CONFIG.TOKEN_KEY); },
  getUser()   {
    try { return JSON.parse(localStorage.getItem(CONFIG.USER_KEY)); }
    catch { return null; }
  },
  isLoggedIn(){ return !!this.getToken(); },

  setSession(token, user) {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
  },

  hasRole(...roles) {
    const user = this.getUser();
    return user && roles.includes(user.role);
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  },

  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = 'dashboard.html';
    }
  },
};

// ── Toast notification helper ──
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 3500) {
    this.init();
    const prefixes = { success: '[OK]', error: '[ERR]', warning: '[!]' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = `${prefixes[type] || ''} ${message}`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, duration);
  },

  success: (msg) => Toast.show(msg, 'success'),
  error:   (msg) => Toast.show(msg, 'error'),
  warning: (msg) => Toast.show(msg, 'warning'),
};

// ── Login Form Handler (hanya di halaman index.html) ──
if (document.getElementById('loginForm')) {
  Auth.redirectIfLoggedIn();

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = document.getElementById('loginBtn');
    const errDiv = document.getElementById('login-error');
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    btn.disabled = true;
    btn.querySelector('.btn-text').style.display   = 'none';
    btn.querySelector('.btn-loader').style.display = 'flex';
    errDiv.style.display = 'none';

    const result = await API.login({ username, password });

    btn.disabled = false;
    btn.querySelector('.btn-text').style.display   = 'inline';
    btn.querySelector('.btn-loader').style.display = 'none';

    if (result && result.ok && result.data.status) {
      const { access_token, user } = result.data.data;
      Auth.setSession(access_token, user);
      window.location.href = 'dashboard.html';
    } else {
      const msg = result?.data?.message || 'Login gagal. Periksa username dan password.';
      errDiv.textContent   = msg;
      errDiv.style.display = 'block';
    }
  });
}
