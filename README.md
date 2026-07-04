---

🛠️ GR-Connect: Sistem Manajemen Bengkel Utama

GR-Connect adalah aplikasi web berbasis Client-Server RESTful API yang dirancang untuk mendigitalkan dan mengoptimalkan alur kerja operasional bengkel otomotif. Sistem ini mencakup pendaftaran Work Order, estimasi mekanik, sistem audit oleh Customer Advisor (CA), manajemen inventaris gudang, hingga cetak nota fisik dengan otorisasi 3 pihak.

Proyek ini dikembangkan sebagai pemenuhan tugas mata kuliah Rekayasa Perangkat Lunak, Program Studi Teknik Informatika, UPN "Veteran" Yogyakarta.

---

## 🚀 Live Demo & Akses UAT
Aplikasi ini sudah di-deploy dan dapat diakses secara live melalui tautan berikut:
**🔗 [GR-Connect Live Web / API](https://grconnect-api.kesug.com)**

Untuk keperluan *User Acceptance Testing* (UAT) dan pengujian alur bisnis, silakan gunakan kredensial berikut pada halaman login:

| Role / Posisi | Username | Password | Deskripsi Hak Akses |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager01` | `password` | *Full Control*, manajemen user, laporan global. |
| **Customer Advisor** | `ca01` | `password` | Membuat WO, **Audit Estimasi (Approve/Reject)**, Cetak Nota. |
| **Mekanik** | `mekanik01` | `password` | Input kerusakan aktual & estimasi (hanya WO miliknya). |
| **Kasir** | `kasir01` | `password` | Proses pelunasan dan penutupan transaksi. |
| **Gudang** | `sparepart01` | `password` | Manajemen inventaris suku cadang (stok & harga). |

---

## ✨ Fitur Unggulan (Core Features)

1. **Role-Based Access Control (RBAC):** Isolasi data yang ketat. Mekanik hanya dapat melihat tugasnya sendiri, Kasir hanya fokus pada pembayaran, dan Gudang fokus pada inventaris.
2. **Work Order Audit Flow:** Alur *approval* berlapis. Mekanik tidak dapat mengeksekusi perbaikan sebelum estimasi biaya & *sparepart* disetujui (Audit) oleh CA, meminimalisir manipulasi *budget*.
3. **Auto-Deduct Inventory:** Stok *sparepart* otomatis berkurang secara *real-time* ketika Kasir menyelesaikan pembayaran transaksi.
4. **Price Snapshot Validation:** Mengunci harga *sparepart* pada saat transaksi terjadi (`harga_satuan_snapshot`), menjaga integritas data riwayat keuangan meskipun harga *master* berubah.
5. **Operational Audit Trail:** Setiap transaksi terekam utuh pada tabel `audit_logs` (Fitur bawaan yang melacak siapa dan apa yang diubah).
6. **3-Party Signature Print:** Format cetak nota berbasis CSS Print Media untuk *Customer*, *Service Advisor*, dan *Kasir* sebagai standar operasional anti-fraud bengkel.

---

## 💻 Arsitektur & Tech Stack

Proyek ini dipisahkan secara logis antara antarmuka pengguna (*Client*) dan pemrosesan data (*Server*).

### Backend (Server-Side)
* **Framework:** Laravel 11 (PHP 8.2+)
* **Database:** MySQL
* **Arsitektur:** RESTful API
* **Highlight:** Penggunaan *Eloquent ORM*, *Middleware Routing*, dan *Form Request Validation*.

### Frontend (Client-Side)
* **Teknologi:** Vanilla JavaScript (ES6+), HTML5, CSS3
* **Desain:** Tema "NASCAR" (High Contrast, Rigid UI) tanpa library eksternal.
* **Highlight:** *Fetch API* untuk komunikasi asinkron dengan server, *Local Storage* untuk penanganan Token JWT/Auth.

---

## 📂 Struktur Direktori Repositori

```text
GR-Connect-Project/
│
├── backend/                  # Source code API Laravel 11
│   ├── app/Http/             # Controllers, Middleware, Requests
│   ├── database/             # Migrations & Seeders
│   └── routes/               # API & Web routes
│
└── gr-connect-frontend/      # Source code antarmuka pengguna (UI)
    ├── css/                  # File styling utama
    ├── js/                   # Logika aplikasi (Auth, API Handler)
    └── *.html                # Halaman view (Dashboard, Login, WO)

```

## Daftar Akun :
| Role / Departemen | Username | Password | Deskripsi Hak Akses |
| :--- | :--- | :--- | :--- |
| **Manager** | `manager01` | `password123` | *Full Control*, manajemen user, laporan global. |
| **Customer Advisor (CA)** | `ca01`, `ca02`, `ca03` | `password123` | Membuat WO, **Audit Estimasi (Approve/Reject)**, Cetak Nota. |
| **Kasir** | `kasir01`, `kasir02` | `password123` | Proses pelunasan dan penutupan transaksi. |
| **Sparepart (Gudang)** | `sparepart01`, `sparepart02`, `sparepart03` | `password123` | Manajemen inventaris suku cadang (stok & harga). |
| **Mekanik** | `mekanik01` s/d `mekanik10` | `password123` | Input kerusakan aktual & estimasi (hanya WO miliknya). |

---

## 👨‍💻 Pengembang

**Filipus Satrio Dewaki Tyasing Suryo (Dewa)** Mahasiswa Teknik Informatika
**Nabil Priyanka Pasuhuk (Nabil)** Mahasiswa Teknik Informatika

UPN "Veteran" Yogyakarta

*(2026)*

```
