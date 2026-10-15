# Lamaran Tracker (versi tanpa folder)

Semua file berada di satu tingkat, tanpa folder, supaya mudah diunggah lewat web GitHub.

## Cara mengganti file di repositori
1. Di repositori GitHub, hapus file lama yang salah (lihat langkah di pesan panduan), atau biarkan. File dengan nama sama akan ditimpa.
2. Klik **Add file → Upload files**.
3. Di komputer, buka folder hasil ekstrak, tekan **Ctrl+A** untuk memilih semua file, lalu seret ke halaman unggah.
4. Tunggu sampai ke-22 file muncul, lalu klik **Commit changes**.
5. Tunggu 1–2 menit, lalu buka situsmu dan tekan **Ctrl+F5**.

Struktur akhir di repositori: semua file (`index.html`, `style.css`, `app.js`, dan seterusnya) langsung di daftar paling atas, bersama `LICENSE`.

## Isi file
| File | Fungsi |
|---|---|
| `index.html` | Kerangka halaman |
| `style.css` | Warna, font, tata letak (warna ada di bagian atas, `--c1` sampai `--c8`) |
| `storage.js` | Penyimpanan di browser, impor CSV, cadangan |
| `app.js` | Inti: tracker, analisis, pengaturan |
| `belajar.js` | Tampilan materi harian, modul, belajar pajak |
| `data-harian.js`, `data-modul.js`, `data-pajak.js` | Isi materi, modul, topik pajak, glosarium, kalkulator |
| `main.js`, `sw.js`, `manifest.webmanifest` | Menjalankan aplikasi dan agar bisa dipasang |
| `chart.umd.js`, `*.woff2`, `icon-*.png` | Grafik, font, dan ikon |

Pindah data dari Google Sheets: File → Unduh → .csv, lalu impor lewat layar sambutan atau Pengaturan. Unduh cadangan (.json) secara berkala karena data tersimpan di browser.
