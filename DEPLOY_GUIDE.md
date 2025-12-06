# Panduan Deploy ke aaPanel

## Langkah-langkah Deployment:

### 1. Build Aplikasi untuk Production

Jalankan perintah berikut di local untuk build:
```bash
npm run build
```

Ini akan menghasilkan folder `dist` yang berisi file production-ready.

### 2. Upload File ke Server

Upload **SEMUA** file berikut ke `/www/wwwroot/todo.ambaritek.com`:
- Folder `dist/` (hasil build)
- File `package.json`
- File `package-lock.json`
- File `.htaccess` (untuk routing)
- File `ecosystem.config.js` (untuk PM2)

### 3. Konfigurasi di aaPanel

#### A. Jika Menggunakan Static Site (Recommended):

1. **Buka Website Settings** → **Site Directory**
2. Set **Running Directory** ke: `/www/wwwroot/todo.ambaritek.com/dist`
3. **Enable** "Enable Prevent Cross-site Access"
4. **Save**

5. **Buka Website Settings** → **URL Rewrite**
6. Pilih template: **Other** atau **Custom**
7. Paste konfigurasi berikut:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
8. **Save**

9. **Restart Nginx/Apache**

#### B. Jika Menggunakan Node Project:

1. **Install dependencies di server:**
```bash
cd /www/wwwroot/todo.ambaritek.com
npm install
npm run build
```

2. **Konfigurasi Node Project di aaPanel:**
   - **Path**: `/www/wwwroot/todo.ambaritek.com`
   - **Name**: `todo`
   - **Run opt**: `Custom Command` (bukan dev!)
   - **Custom Start Command**: `npx vite preview --host 0.0.0.0 --port 3000`
   - **Port**: `3000`
   - **User**: `www`
   - **Node version**: `v24.11.1` (atau versi terbaru yang tersedia)
   - **Boot**: ✅ Centang "Follow the system to start the service"

3. **Konfigurasi Reverse Proxy:**
   - Buka **Website Settings** → **Reverse Proxy**
   - Add Proxy:
     - **Proxy Name**: `todo-app`
     - **Target URL**: `http://127.0.0.1:3000`
     - **Enable**: ✅
     - **Send Domain**: ✅
   - **Save**

4. **Start Node Project:**
   - Kembali ke **PHP Project** → **Node Project**
   - Klik tombol **Start** pada project `todo`

### 4. Troubleshooting ERR_TOO_MANY_REDIRECTS

Jika masih ada error redirect:

1. **Clear Browser Cache** atau buka di Incognito mode baru
2. **Periksa SSL Settings:**
   - Buka **Website Settings** → **SSL**
   - Jika menggunakan HTTPS, pastikan "Force HTTPS" tidak konflik dengan reverse proxy
3. **Periksa .htaccess:**
   - Pastikan tidak ada redirect loop
   - Hapus sementara file `.htaccess` untuk testing
4. **Periksa Nginx/Apache Config:**
   - Pastikan tidak ada duplicate rewrite rules

### 5. Verifikasi

1. Buka browser (Incognito mode)
2. Akses: `http://todo.ambaritek.com` atau `https://todo.ambaritek.com`
3. Aplikasi seharusnya berjalan dengan baik

### 6. Monitoring

- **Project Log**: Lihat di aaPanel → PHP Project → Node Project → Project log
- **Website Log**: Lihat di Website Settings → Website log
- **Service Status**: Pastikan status "Running" (hijau)

## Rekomendasi Deployment (Cara Paling Mudah)

Untuk update otomatis yang stabil:

1. **Commit & Push** perubahan ini ke repository git Anda.
2. Di **aaPanel**, buka **Git Manager** -> **Script**.
3. **Copy-Paste** isi file `aapanel_deploy.sh` ke dalam kotak script.
4. Klik **Save**.
5. Klik **Manual Exec** sekali untuk memastikan build pertama berhasil.
6. Pastikan (di Website Settings -> Site Directory), Running Directory mengarah ke `/www/wwwroot/todo.ambaritek.com/dist`.

Dengan cara ini, setiap kali Anda push ke Git, Webhook akan otomatis menjalankan `npm run build` dan website akan terupdate.

## Catatan Penting:
- **JANGAN gunakan `npm run dev`** untuk production!
- **Selalu pastikan folder `dist` ada** setelah script berjalan.
- **Backup** konfigurasi sebelum mengubah settings.
