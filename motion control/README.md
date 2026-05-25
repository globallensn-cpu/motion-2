# Motion Control — Kling v3 AI Motion Transfer

Aplikasi web interaktif premium untuk mentransfer pola gerakan dari video referensi ke foto karakter menggunakan **Magnific Kling v3 Motion Control API**.

Proyek ini telah dikembangkan dengan arsitektur **Hybrid Static & Serverless** untuk memastikan aplikasi **100% sukses di-deploy ke Vercel** tanpa risiko kegagalan build, sekaligus dapat dijalankan langsung di komputer lokal tanpa runtime Node.js!

---

## ✨ Fitur Utama

- **Premium Dark Mode & Glassmorphic UI**: Antarmuka interaktif yang indah dengan animasi transisi yang mulus.
- **Dual Mode Execution**:
  - **Local Mode**: Jalankan instan secara offline dengan membuka file `index.html` (menggunakan *CORS Proxy* untuk request API).
  - **Production Mode**: Jalankan di Vercel menggunakan *Vercel Serverless Functions* sebagai secure proxy.
- **Multi-API Key Manager**: CRUD, test validitas key, backup/restore key dengan JSON, dan rotasi key aktif secara lokal.
- **Dua Metode Upload**:
  - **Direct Upload**: Unggah file gambar dan video lokal secara instan ke `tmpfiles.org` dengan indikator *progress bar* real-time.
  - **Paste URL**: Masukkan langsung URL gambar atau video publik yang sudah di-host di server lain.
- **Real-Time Polling & Gallery**: Status video di-update otomatis di background setiap 8 detik (disertai notifikasi toast & play video saat hover).

---

## 🚀 Cara Menjalankan

### Cara 1: Jalankan Lokal (Tanpa Node.js)
1. Buka folder proyek `motion control`.
2. Klik dua kali (double-click) pada file **`index.html`**.
3. Aplikasi akan terbuka di browser Anda secara instan!
4. Pergi ke menu **Settings**, masukkan API Key Magnific Anda, lalu mulailah memproses video di menu **Generator**.

### Cara 2: Deploy ke Vercel (Production)
1. Unggah seluruh file proyek ini ke repositori **GitHub** Anda.
   *(Abaikan file Next.js lama seperti folder `src`, `package.json`, dan `tsconfig.json` karena Vercel hanya akan membaca `index.html` dan `/api`)*.
2. Buka dashboard Vercel, klik **Add New Project**, lalu sambungkan ke repositori GitHub tersebut.
3. Vercel akan otomatis mendeteksi konfigurasi static site di `vercel.json` dan men-deploy proyek dalam waktu beberapa detik saja.
4. Buka tautan hasil deploy Vercel Anda, dan aplikasi siap digunakan dengan performa optimal!

---

## 📁 Struktur File Proyek

```
motion-control/
├── index.html            # Frontend SPA Utama (HTML, CSS, JS)
├── vercel.json           # Konfigurasi Vercel Routing & Settings
├── README.md             # Dokumentasi panduan ini
└── api/                  # Node.js Serverless Functions (Backend Proxy)
    ├── generate.js       # Proxy POST request generate video
    ├── task.js           # Proxy GET check status task
    └── validate-key.js   # Proxy GET validasi API key
```

---

## 🔒 Privasi & Keamanan Data
- Seluruh API Key Anda disimpan dengan aman hanya di dalam **localStorage** browser Anda sendiri.
- Saat dijalankan di Vercel, API Key dikirimkan melalui serverless backend proxy (`/api`) sehingga tidak terekspos langsung di tab network browser client.
- File lokal yang diunggah dikirim secara aman menggunakan koneksi HTTPS ke layanan hosting sementara `tmpfiles.org`.
