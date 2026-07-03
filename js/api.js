// ─────────────────────────────────────────────────────────────
// api.js — HTTP Client terpusat untuk semua request ke backend
// ─────────────────────────────────────────────────────────────

const API = {
  /**
   * Method dasar untuk semua request
   */
  async request(method, endpoint, data = null, options = {}) {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
      signal: AbortSignal.timeout(CONFIG.REQUEST_TIMEOUT),
      ...options,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    let url = `${CONFIG.API_BASE_URL}${endpoint}`;
    if (data && method === 'GET') {
      const params = new URLSearchParams(data);
      url += `?${params}`;
    }

    try {
      const response = await fetch(url, config);
      const json = await response.json();

      // Jika 401, token expired → redirect ke login
      if (response.status === 401) {
        Auth.clearSession();
        window.location.href = '/index.html';
        return;
      }

      return { ok: response.ok, status: response.status, data: json };

    } catch (error) {
      if (error.name === 'TimeoutError') {
        return { ok: false, status: 0, data: { message: 'Request timeout. Periksa koneksi ke server.' } };
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { ok: false, status: 0, data: { message: 'Tidak bisa terhubung ke server. Pastikan backend Laravel sudah berjalan di https://grconnect-api.kesug.com/api' } };
      }
      return { ok: false, status: 0, data: { message: error.message } };
    }
  },

  // ── Shorthand methods ──
  get(endpoint, params) { return this.request('GET', endpoint, params); },
  post(endpoint, data) { return this.request('POST', endpoint, data); },
  patch(endpoint, data) { return this.request('PATCH', endpoint, data); },
  put(endpoint, data) { return this.request('PUT', endpoint, data); },
  delete(endpoint) { return this.request('DELETE', endpoint); },

  // ── API Endpoints ──

  // Auth
  login: (data) => API.post('/auth/login', data),
  logout: () => API.post('/auth/logout'),
  me: () => API.get('/auth/me'),

  // Work Orders
  getWorkOrders: (params) => API.get('/work-orders', params),
  getWorkOrder: (id) => API.get(`/work-orders/${id}`),
  createWorkOrder: (data) => API.post('/work-orders', data),
  updateProgress: (id, data) => API.patch(`/work-orders/${id}/progress`, data),
  ajukanEstimasi: (id, data) => API.patch(`/work-orders/${id}/estimasi`, data),
  auditCA:        (id, data) => API.patch(`/work-orders/${id}/audit-ca`, data),
  processPayment: (id, data) => API.post(`/work-orders/${id}/payment`, data),
  getWOBill: (id) => API.get(`/work-orders/${id}/bill`),
  deductSparepart: (id, data) => API.post(`/work-orders/${id}/deduct-sparepart`, data),
  // SOP Baru: Mekanik ajukan request (tidak langsung potong stok)
  requestPart: (woId, data) => API.post(`/work-orders/${woId}/request-part`, data),

  // SOP Baru: Gudang melihat antrean request (default: status=pending)
  getPartRequests: (params) => API.get('/detail-parts', params),
  // SOP Baru: Gudang ACC permintaan mekanik (potong stok sekarang)
  approvePartRequest: (detailPartId, data) => API.post(`/detail-parts/${detailPartId}/approve`, data),
  // SOP Baru: Gudang tolak permintaan mekanik
  rejectPartRequest: (detailPartId) => API.post(`/detail-parts/${detailPartId}/reject`),

  assignMechanic:  (id, data) => API.patch(`/work-orders/${id}/assign-mekanik`, data),

  // Service History
  serviceHistory: (platNomor) => API.get(`/vehicles/${encodeURIComponent(platNomor)}/service-history`),

  // Spareparts
  getSpareparts:    (params) => API.get('/spareparts', params),
  getSparepart:     (id)     => API.get(`/spareparts/${id}`),
  createSparepart:  (data)   => API.post('/spareparts', data),
  updateSparepart:  (id, d)  => API.put(`/spareparts/${id}`, d),
  restockSparepart: (id, d)  => API.patch(`/spareparts/${id}/restock`, d),
  deleteSparepart:  (id)     => API.delete(`/spareparts/${id}`),

  // Users
  getUsers: (params) => API.get('/users', params),
  getMechanics: () => API.get('/users/mechanics'),
  createUser: (data) => API.post('/users', data),
  updateUser: (id, d) => API.patch(`/users/${id}`, d),
  deleteUser: (id) => API.delete(`/users/${id}`),
};
