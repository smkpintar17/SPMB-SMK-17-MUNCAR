# SMK PINTAR - SMK 17 MUNCAR
## GitHub Pages Edition

Game edukasi SPMB berbasis web dengan hanya **3 elemen utama**:
- `index.html`
- `style.css`
- `script.js`

### Fitur
- Mobile-first untuk Android.
- 8 level petualangan 2D.
- Mencari buku di setiap level.
- Level 2: pengenalan AKL, BDP, PH, RPL, TO, TP.
- Level 1 dan 3–8: kuisioner/esai.
- Register dan otomatis masuk setelah membuat akun.
- Login username/password.
- Dashboard pemain.
- Dashboard monitoring lokal.
- Export CSV.
- Integrasi Google Sheets melalui Google Apps Script.
- Tidak membutuhkan library/CDN eksternal.
- Cocok untuk GitHub Pages.

## Upload ke GitHub
1. Buat repository baru, contoh: `smk-pintar-game`.
2. Upload:
   - `index.html`
   - `style.css`
   - `script.js`
3. Commit.
4. Buka **Settings > Pages**.
5. Source: **Deploy from a branch**.
6. Pilih branch `main`, folder `/root`.
7. Save.
8. Tunggu GitHub Pages menerbitkan website.

## Google Sheets
1. Buat Google Sheet.
2. Extensions > Apps Script.
3. Gunakan backend Apps Script pada bagian `google-apps-script/Code.gs` jika tersedia di paket ini.
4. Deploy sebagai Web App.
5. Salin URL Web App.
6. Buka `script.js`.
7. Cari:
   `GOOGLE_SCRIPT_URL:""`
8. Isi URL Web App:
   `GOOGLE_SCRIPT_URL:"URL_WEB_APP_ANDA"`
9. Upload ulang `script.js` ke GitHub.

## Catatan penting
Dashboard Admin pada versi browser hanya melihat data yang tersimpan di browser tersebut. Setelah Google Sheets diaktifkan, data peserta dari berbagai HP dapat dikumpulkan ke satu spreadsheet.

Untuk penggunaan sekolah nyata, jangan menaruh password admin atau kredensial rahasia di JavaScript/GitHub. Dashboard admin produksi sebaiknya menggunakan autentikasi server-side.

Nomor WhatsApp dan alamat adalah data pribadi. Batasi akses spreadsheet hanya kepada panitia yang berwenang dan gunakan data sesuai pemberitahuan kepada peserta.

## Struktur paket
```
/
├── index.html
├── style.css
├── script.js
├── README.md
└── google-apps-script/
    └── Code.gs
```
