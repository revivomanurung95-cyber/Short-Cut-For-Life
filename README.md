# Lamaran Tracker v3

Pelacak lamaran kerja + keuangan harian + produktivitas + belajar, dalam satu situs statis (GitHub Pages). Tanpa server dan tanpa login. Data tiap pengguna tersimpan di **browser masing-masing**.

## Isi
- **Mode Cepat (HP):** layar catat transaksi satu tangan (jumlah, kategori, dompet, catatan, Simpan), plus Hari ini dan Transfer data.
- **Mode Lengkap (laptop):** semua fitur. Mode dipilih otomatis dari lebar layar, bisa diganti di Pengaturan atau lewat tombol "Mode cepat" / "Lengkap".
- **Keuangan:** Catat, Cashflow (per bulan, filter, ekspor CSV), Rekap (harian, bulanan, tahunan, prakiraan akhir bulan, cetak/PDF), Rencana (anggaran per kategori, tujuan tabungan, tagihan rutin), Dompet (saldo, transfer antar dompet, rekonsiliasi saldo).
- **Pintar:** kategori ditebak dari catatan ("grab" menjadi Transport), favorit satu ketukan, kategori otomatis belajar dari riwayat.
- **Produktif:** Hari ini, Kebiasaan (streak), Tugas dan catatan cepat, Fokus (Pomodoro), Kunci PIN.
- **Lamaran kerja, Analisis, Materi harian, Modul karier, Belajar pajak** seperti sebelumnya.

## Memperbarui situs yang sudah ada di GitHub
1. Ekstrak ZIP ini.
2. Di repositori: **Add file → Upload files**.
3. Pilih semua file hasil ekstrak (Ctrl+A) lalu seret ke halaman unggah. File bernama sama akan ditimpa dan file baru (`keuangan.js`, `produktif.js`) ditambahkan.
4. **Commit changes**, tunggu 1–2 menit, buka situsmu, tekan **Ctrl+F5**.

Data yang sudah ada di browsermu **tidak hilang** karena disimpan terpisah dari kode.

## Memindahkan catatan dari HP ke laptop
Data hidup di tiap perangkat. Transfer memakai kode (atau file) yang **menggabungkan** data, bukan menimpanya:
1. Di HP: menu **Transfer** → **Salin kode data baru** → kirim ke WhatsApp sendiri.
2. Di laptop: buka WhatsApp Web, salin kode, lalu **Transfer data → Terima di perangkat ini → Gabungkan data**.

Tiap transaksi punya nomor unik dan waktu perubahan, jadi menggabungkan berkali-kali tidak membuat data ganda. Perubahan dan penghapusan ikut terbawa. Bila yang terbaru ada di dua perangkat, yang waktunya lebih baru menang. Data lamaran kerja tidak ikut transfer ini, gunakan cadangan di Pengaturan.

## Cadangan
Pengaturan → **Unduh cadangan (.json)** memuat lamaran, keuangan, dan data harian. Datang dari perangkat lama: pulihkan lewat **Impor / pulihkan file…** (mengganti seluruh data di perangkat itu).

## Kunci PIN
Pengaturan → **Kunci PIN**. Ini **pengaman tampilan**, bukan enkripsi: data tetap tersimpan biasa di browser, jadi orang yang menguasai perangkat dan paham teknis masih bisa membukanya. Gunakan juga kunci layar HP-mu. PIN tidak ikut cadangan dan transfer. Lupa PIN? Hapus data situs browser (data akan hilang, jadi simpan cadangan).

## Peta kode
| File | Fungsi |
|---|---|
| `index.html` | Kerangka halaman |
| `style.css` | Warna (`--c1`…`--c8` di bagian atas), font, tata letak |
| `storage.js` | Penyimpanan lamaran, impor CSV, cadangan |
| `app.js` | Inti: navigasi, mode cepat/lengkap, tracker lamaran, analisis, pengaturan |
| `keuangan.js` | Dompet, cashflow, rekap, anggaran, tabungan, tagihan, transfer data |
| `produktif.js` | Hari ini, kebiasaan, tugas, catatan, fokus, kunci PIN |
| `belajar.js` | Tampilan materi harian, modul, belajar pajak |
| `data-*.js` | Isi materi, modul, topik pajak, glosarium, kalkulator |
| `sw.js`, `manifest.webmanifest` | Agar bisa dipasang sebagai aplikasi dan dibuka tanpa internet |

Untuk mengubah kategori bawaan keuangan: `keuangan.js`, array `DEF_CATS`. Kata kunci tebakan kategori: objek `KW`.

## Jika ada masalah
- **Tampilan polos atau tulisan "Memuat…" terus:** ada file yang belum terunggah. Pastikan semua file ada di daftar paling atas repositori.
- **Masih tampil versi lama:** tekan Ctrl+F5.
- **Data tidak muncul:** kamu membuka browser atau alamat berbeda. Data terpisah per browser dan per alamat. Pulihkan dari cadangan atau transfer.
- **Pasang di HP:** Chrome Android → menu ⋮ → Tambahkan ke layar utama. iPhone: Bagikan → Tambah ke Layar Utama.

## Rencana berikutnya
Utang/piutang dan cicilan, pencatat penghasilan untuk estimasi PPh dan SPT, patungan, dana talangan, dan (opsional) sinkron Google Drive.
