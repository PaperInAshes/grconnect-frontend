// ─────────────────────────────────────────────────────────────
// config.js — Konfigurasi global aplikasi GR-Connect
// ─────────────────────────────────────────────────────────────

const CONFIG = {
  // URL backend Laravel (sesuaikan jika port berbeda)
  API_BASE_URL: 'https://grconnect-api.kesug.com/api',

  // Nama key di localStorage
  TOKEN_KEY: 'gr_token',
  USER_KEY: 'gr_user',

  // Timeout request (ms)
  REQUEST_TIMEOUT: 15000,
};

// Freeze config agar tidak bisa diubah secara tidak sengaja
Object.freeze(CONFIG);
