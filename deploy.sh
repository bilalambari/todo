#!/bin/bash

# Script untuk deploy ke aaPanel
# Jalankan script ini setelah build selesai

echo "==================================="
echo "Deploy Script untuk aaPanel"
echo "==================================="
echo ""

# Warna untuk output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Langkah 1: Pastikan build sudah selesai${NC}"
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Folder dist tidak ditemukan!${NC}"
    echo "Jalankan: npm run build"
    exit 1
fi
echo -e "${GREEN}✓ Folder dist ditemukan${NC}"
echo ""

echo -e "${YELLOW}Langkah 2: File yang perlu di-upload ke server:${NC}"
echo "  1. Folder dist/ (semua isi)"
echo "  2. File package.json"
echo "  3. File package-lock.json"
echo "  4. File .htaccess"
echo "  5. File ecosystem.config.js (opsional, jika pakai PM2)"
echo ""

echo -e "${YELLOW}Langkah 3: Lokasi upload di server:${NC}"
echo "  /www/wwwroot/todo.ambaritek.com/"
echo ""

echo -e "${YELLOW}Langkah 4: Konfigurasi aaPanel${NC}"
echo ""
echo "=== OPSI A: Static Site (RECOMMENDED) ==="
echo "1. Website Settings → Site Directory"
echo "   - Running Directory: /www/wwwroot/todo.ambaritek.com/dist"
echo ""
echo "2. Website Settings → URL Rewrite"
echo "   - Pilih template: Other/Custom"
echo "   - Paste:"
echo "     location / {"
echo "         try_files \$uri \$uri/ /index.html;"
echo "     }"
echo ""
echo "3. Restart Nginx/Apache"
echo ""
echo "=== OPSI B: Node Project ==="
echo "1. SSH ke server dan jalankan:"
echo "   cd /www/wwwroot/todo.ambaritek.com"
echo "   npm install"
echo "   npm run build"
echo ""
echo "2. aaPanel → PHP Project → Node Project:"
echo "   - Path: /www/wwwroot/todo.ambaritek.com"
echo "   - Run opt: Custom Command"
echo "   - Command: npx vite preview --host 0.0.0.0 --port 3000"
echo "   - Port: 3000"
echo ""
echo "3. Website Settings → Reverse Proxy:"
echo "   - Target URL: http://127.0.0.1:3000"
echo ""

echo -e "${GREEN}==================================="
echo "Baca DEPLOY_GUIDE.md untuk detail lengkap"
echo "===================================${NC}"
