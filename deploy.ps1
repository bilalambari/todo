# Deploy Script untuk aaPanel (Windows PowerShell)

Write-Host "===================================" -ForegroundColor Cyan
Write-Host "Deploy Script untuk aaPanel" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Cek folder dist
Write-Host "Langkah 1: Memeriksa build..." -ForegroundColor Yellow
if (-Not (Test-Path "dist")) {
    Write-Host "Error: Folder dist tidak ditemukan!" -ForegroundColor Red
    Write-Host "Jalankan: npm run build" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Folder dist ditemukan" -ForegroundColor Green
Write-Host ""

Write-Host "Langkah 2: File yang perlu di-upload ke server:" -ForegroundColor Yellow
Write-Host "  1. Folder dist/ (semua isi)"
Write-Host "  2. File package.json"
Write-Host "  3. File package-lock.json"
Write-Host "  4. File .htaccess"
Write-Host "  5. File ecosystem.config.js (opsional)"
Write-Host ""

Write-Host "Langkah 3: Lokasi upload di server:" -ForegroundColor Yellow
Write-Host "  /www/wwwroot/todo.ambaritek.com/" -ForegroundColor White
Write-Host ""

Write-Host "Langkah 4: Konfigurasi aaPanel" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== OPSI A: Static Site (RECOMMENDED) ===" -ForegroundColor Green
Write-Host "1. Website Settings → Site Directory"
Write-Host "   - Running Directory: /www/wwwroot/todo.ambaritek.com/dist"
Write-Host ""
Write-Host "2. Website Settings → URL Rewrite"
Write-Host "   - Pilih template: Other/Custom"
Write-Host "   - Paste:"
Write-Host "     location / {" -ForegroundColor Gray
Write-Host "         try_files" '$uri $uri/ /index.html;' -ForegroundColor Gray
Write-Host "     }" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Restart Nginx/Apache"
Write-Host ""
Write-Host "=== OPSI B: Node Project ===" -ForegroundColor Cyan
Write-Host "1. SSH ke server dan jalankan:"
Write-Host "   cd /www/wwwroot/todo.ambaritek.com"
Write-Host "   npm install"
Write-Host "   npm run build"
Write-Host ""
Write-Host "2. aaPanel → PHP Project → Node Project:"
Write-Host "   - Path: /www/wwwroot/todo.ambaritek.com"
Write-Host "   - Run opt: Custom Command"
Write-Host "   - Command: npx vite preview --host 0.0.0.0 --port 3000"
Write-Host "   - Port: 3000"
Write-Host ""
Write-Host "3. Website Settings → Reverse Proxy:"
Write-Host "   - Target URL: http://127.0.0.1:3000"
Write-Host ""

Write-Host "===================================" -ForegroundColor Green
Write-Host "Baca DEPLOY_GUIDE.md untuk detail lengkap" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Tanya apakah ingin membuka folder dist
$response = Read-Host "Apakah Anda ingin membuka folder dist? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    explorer.exe "dist"
}
