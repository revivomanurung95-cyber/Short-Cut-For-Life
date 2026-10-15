/* MATERI HARIAN — universal untuk semua bidang pekerjaan.
   Cara menambah materi: salin satu blok { ... } di DAILY, ubah id (harus unik), isinya, lalu simpan dan deploy versi baru.
   Urutan di array = urutan kemunculan. Kategori di DAILY_CATS menentukan warna.
   q = satu pertanyaan kuis: o = pilihan, a = nomor jawaban benar (mulai dari 0), e = penjelasan. */
const DAILY_UPDATED = '2026-10-12';
const DAILY_CATS = {
  prod:  { l: 'Produktivitas',      c: '--c4' },
  komun: { l: 'Komunikasi',         c: '--c2' },
  data:  { l: 'Data & Excel',       c: '--c6' },
  uang:  { l: 'Keuangan pribadi',   c: '--c3' },
  pajak: { l: 'Pajak untuk pekerja',c: '--c1' },
  hak:   { l: 'Hak & kontrak kerja',c: '--c8' },
  digi:  { l: 'Digital & AI',       c: '--c7' },
  karir: { l: 'Karier & belajar',   c: '--c5' },
  sehat: { l: 'Kesejahteraan',      c: '--teal' }
};

const DAILY = [
{ id:'d01', cat:'prod', t:'Matriks Eisenhower: pisahkan penting dari mendesak', min:3,
  h:`<p>Tidak semua yang mendesak itu penting. Bagi tugasmu ke empat kotak:</p>
  <ul><li><strong>Penting + mendesak:</strong> kerjakan sekarang.</li><li><strong>Penting + tidak mendesak:</strong> jadwalkan. Di sinilah pertumbuhanmu.</li><li><strong>Tidak penting + mendesak:</strong> delegasikan atau singkatkan.</li><li><strong>Tidak penting + tidak mendesak:</strong> hapus.</li></ul>
  <p>Kebanyakan orang menghabiskan hari di kotak ketiga karena notifikasi terasa seperti keadaan darurat.</p>`,
  act:'Tulis 5 tugasmu hari ini dan tempatkan masing-masing di salah satu kotak.',
  q:{q:'Tugas "belajar skill baru untuk karier", tidak ada tenggat dekat, masuk kotak mana?', o:['Penting + mendesak','Penting + tidak mendesak','Tidak penting + mendesak','Hapus'], a:1, e:'Penting untuk jangka panjang tetapi tidak mendesak. Jadwalkan secara khusus.'} },
{ id:'d02', cat:'komun', t:'Email profesional: satu email, satu permintaan', min:3,
  h:`<p>Email yang mudah dibalas punya tiga ciri:</p>
  <ol><li><strong>Subjek spesifik:</strong> "Permintaan persetujuan anggaran Q4, balas sebelum Jumat".</li><li><strong>Permintaan di paragraf pertama.</strong> Konteks menyusul.</li><li><strong>Satu email, satu permintaan.</strong> Banyak permintaan sering berujung sebagian dibalas.</li></ol>
  <p>Tutup dengan langkah berikutnya yang jelas, misalnya siapa melakukan apa dan kapan.</p>`,
  act:'Tulis ulang satu email lama dengan subjek yang lebih spesifik.',
  q:{q:'Bagian email yang sebaiknya paling awal adalah…', o:['Salam panjang','Latar belakang detail','Permintaan atau tujuan email','Tanda tangan'], a:2, e:'Penerima sibuk. Tujuan di awal membuat email cepat dipahami dan dibalas.'} },
{ id:'d03', cat:'uang', t:'Anggaran 50/30/20 sebagai titik awal', min:4,
  h:`<p>Aturan 50/30/20 hanyalah kerangka awal, bukan hukum. Dari penghasilan bersih bulanan:</p>
  <ul><li><strong>50% kebutuhan:</strong> sewa/cicilan rumah, makan, transport, tagihan.</li><li><strong>30% keinginan:</strong> hiburan, jajan, langganan.</li><li><strong>20% tujuan keuangan:</strong> dana darurat, menabung, investasi, pelunasan utang.</li></ul>
  <p>Di kota dengan biaya hidup tinggi, porsi kebutuhan sering lebih besar. Sesuaikan, yang penting kamu punya angka dan mencatatnya.</p>`,
  act:'Hitung pengeluaran bulan lalu dan lihat porsi kebutuhan, keinginan, dan tabungannya.',
  q:{q:'Menurut kerangka 50/30/20, porsi untuk tabungan dan tujuan keuangan adalah…', o:['10%','20%','30%','50%'], a:1, e:'Sisanya 50% kebutuhan dan 30% keinginan.'} },
{ id:'d04', cat:'pajak', t:'NIK sekarang berfungsi sebagai NPWP', min:3,
  h:`<p>Untuk wajib pajak orang pribadi dalam negeri, <strong>NIK pada KTP berfungsi sebagai NPWP</strong>. Penerapannya terintegrasi seiring sistem Coretax yang berjalan sejak awal 2025.</p>
  <ul><li>Pemberi kerja memotong PPh 21 dengan identitas NIK-mu.</li><li>Pastikan NIK-mu sudah valid di sistem DJP. Data yang tidak cocok bisa menghambat pelaporan.</li><li>Kamu bisa mengecek dan mengelola data lewat akun di coretax.pajak.go.id.</li></ul>`,
  act:'Cek apakah kamu sudah bisa masuk ke akun Coretax-mu.',
  q:{q:'Bagi WP orang pribadi dalam negeri, identitas pajak yang dipakai adalah…', o:['Nomor KK','NIK','Nomor rekening','Nomor BPJS'], a:1, e:'NIK berfungsi sebagai NPWP bagi orang pribadi dalam negeri.'} },
{ id:'d05', cat:'data', t:'Rapikan data sebelum menganalisis: aturan tabel yang baik', min:3,
  h:`<p>Sebagian besar masalah Excel berasal dari data yang berantakan. Tabel yang baik:</p>
  <ul><li>Satu baris judul, satu kolom satu jenis data.</li><li>Tidak ada sel yang digabung (merge) di dalam tabel.</li><li>Tidak ada baris atau kolom kosong di tengah.</li><li>Tanggal ditulis sebagai tanggal sungguhan, bukan teks.</li></ul>
  <p>Tekan <code>Ctrl+T</code> untuk menjadikan rentang sebagai tabel. Rumus dan pivot jadi otomatis mengikuti data baru.</p>`,
  act:'Buka satu file Excel-mu dan cek apakah ada sel yang digabung di dalam data.',
  q:{q:'Mana yang sebaiknya dihindari di dalam tabel data?', o:['Satu baris judul','Sel yang digabung','Format tanggal asli','Satu jenis data per kolom'], a:1, e:'Merge cell mengganggu filter, pivot, dan rumus.'} },
{ id:'d06', cat:'hak', t:'PKWT, PKWTT, dan magang: apa bedanya?', min:4,
  h:`<ul><li><strong>PKWT</strong> (perjanjian kerja waktu tertentu): kontrak berbatas waktu atau untuk pekerjaan tertentu.</li><li><strong>PKWTT:</strong> karyawan tetap, tanpa batas waktu tertentu.</li><li><strong>Magang:</strong> diatur perjanjian magang, bukan hubungan kerja biasa.</li></ul>
  <p>Masa percobaan umumnya hanya dikenal untuk PKWTT dan maksimal tiga bulan. Cek isi kontrakmu, dan bila ada yang tidak jelas, tanyakan secara tertulis sebelum tanda tangan.</p>
  <div class="tip">Aturan ketenagakerjaan bisa berubah. Untuk keputusan penting, rujuk dinas ketenagakerjaan atau sumber resmi.</div>`,
  act:'Cari tahu status hubunganmu sendiri atau yang ditawarkan: PKWT, PKWTT, atau magang.',
  q:{q:'Karyawan tetap tanpa batas waktu tertentu disebut…', o:['PKWT','PKWTT','Magang','Freelance'], a:1, e:'PKWTT = perjanjian kerja waktu tidak tertentu.'} },
{ id:'d07', cat:'digi', t:'Aktifkan verifikasi dua langkah (2FA) hari ini', min:3,
  h:`<p>Sandi saja tidak cukup. Dengan 2FA, penyerang yang tahu sandimu tetap butuh kode kedua.</p>
  <ul><li>Prioritaskan email utama, karena email adalah kunci pemulihan akun lain.</li><li>Pilih aplikasi autentikator atau kunci keamanan bila tersedia. Itu lebih aman daripada SMS.</li><li>Simpan kode cadangan di tempat aman, terpisah dari ponsel.</li></ul>`,
  act:'Aktifkan 2FA di akun email utamamu.',
  q:{q:'Akun mana yang paling prioritas diamankan dengan 2FA?', o:['Akun game','Email utama','Akun belanja lama','Akun forum'], a:1, e:'Email menjadi jalur pemulihan hampir semua akun lain.'} },
{ id:'d08', cat:'karir', t:'Membaca lowongan: pisahkan "wajib" dari "nilai plus"', min:3,
  h:`<p>Banyak orang tidak melamar karena merasa belum memenuhi semua poin. Lowongan biasanya memuat daftar keinginan.</p>
  <ul><li><strong>Wajib:</strong> pendidikan minimal, sertifikasi tertentu, izin yang diperlukan.</li><li><strong>Nilai plus:</strong> "diutamakan", "lebih disukai", alat tambahan.</li><li>Cocokkan 60–70% saja sudah layak dicoba, selama poin wajib terpenuhi.</li></ul>
  <p>Catat kata kunci dari lowongan untuk disesuaikan ke CV-mu.</p>`,
  act:'Ambil satu lowongan dan tandai poin wajib dengan warna berbeda dari nilai plus.',
  q:{q:'Kata "diutamakan" pada lowongan umumnya berarti…', o:['Wajib','Nilai plus','Tidak penting sama sekali','Syarat hukum'], a:1, e:'"Diutamakan" menunjukkan preferensi, bukan syarat mutlak.'} },
{ id:'d09', cat:'sehat', t:'Aturan 20-20-20 untuk mata', min:2,
  h:`<p>Menatap layar lama memicu mata lelah. Setiap <strong>20 menit</strong>, lihat sesuatu sejauh kira-kira <strong>20 kaki (±6 meter)</strong> selama <strong>20 detik</strong>.</p>
  <ul><li>Atur pengingat berulang di ponsel atau komputer.</li><li>Naikkan ukuran teks, jaga layar sedikit di bawah sejajar mata.</li><li>Sering berkedip dan minum air putih.</li></ul>`,
  act:'Pasang pengingat berulang tiap 20 menit hari ini.',
  q:{q:'Pada aturan 20-20-20, lamanya menatap jauh adalah…', o:['20 detik','2 menit','20 menit','1 jam'], a:0, e:'Tiap 20 menit, tatap objek jauh selama 20 detik.'} },
{ id:'d10', cat:'prod', t:'Time blocking: beri tugas penting tempat di kalender', min:3,
  h:`<p>Daftar tugas tanpa waktu cenderung tidak selesai. Time blocking berarti kamu menaruh blok waktu di kalender untuk pekerjaan yang membutuhkan fokus.</p>
  <ul><li>Mulai dari tugas terpenting, beri blok 60–90 menit.</li><li>Sisakan blok kosong untuk hal tak terduga.</li><li>Kelompokkan pekerjaan ringan (membalas pesan) dalam satu blok.</li></ul>`,
  act:'Pasang satu blok fokus 60 menit besok pagi.',
  q:{q:'Mengapa sebaiknya menyisakan blok kosong di kalender?', o:['Agar terlihat santai','Untuk hal tak terduga dan keterlambatan','Karena aturan perusahaan','Untuk tidur siang'], a:1, e:'Rencana yang terlalu padat mudah runtuh pada gangguan pertama.'} },
{ id:'d11', cat:'komun', t:'Etika pesan WhatsApp untuk urusan kerja', min:3,
  h:`<ul><li>Awali dengan salam dan identitas singkat bila belum saling kenal.</li><li>Tulis tujuan dalam 1–2 kalimat. Hindari mengirim satu kalimat per pesan.</li><li>Hormati jam istirahat. Kecuali mendesak, kirim di jam kerja.</li><li>Untuk keputusan penting, tegaskan ulang lewat email agar ada jejak tertulis.</li></ul>`,
  act:'Rapikan satu pesan kerja yang biasanya kamu kirim jadi satu pesan utuh.',
  q:{q:'Untuk keputusan penting yang disepakati lewat chat, sebaiknya…', o:['Dibiarkan di chat','Ditegaskan ulang lewat email','Dihapus','Disimpan di kepala'], a:1, e:'Email memberi jejak tertulis yang lebih mudah dirujuk.'} },
{ id:'d12', cat:'uang', t:'Dana darurat: berapa dan di mana menyimpannya', min:4,
  h:`<p>Dana darurat menjaga keuanganmu saat penghasilan terganggu atau ada pengeluaran mendadak.</p>
  <ul><li>Target umum: 3–6 kali pengeluaran bulanan. Orang dengan penghasilan tidak tetap sering butuh lebih.</li><li>Simpan di tempat yang mudah dicairkan dan nilainya stabil, terpisah dari rekening harian.</li><li>Mulai kecil. Menyisihkan rutin lebih penting daripada angka awal.</li></ul>
  <div class="tip">Ini informasi edukasi umum, bukan nasihat keuangan personal.</div>`,
  act:'Hitung pengeluaran bulananmu, lalu kalikan 3 untuk target awal.',
  q:{q:'Dana darurat sebaiknya disimpan…', o:['Di instrumen berisiko tinggi','Di tempat mudah dicairkan dan stabil','Dalam bentuk barang','Di rekening harian'], a:1, e:'Prioritasnya ketersediaan dan stabilitas, bukan imbal hasil.'} },
{ id:'d13', cat:'pajak', t:'PTKP: batas penghasilan yang tidak dikenai PPh', min:4,
  h:`<p>PTKP (penghasilan tidak kena pajak) mengurangi penghasilan neto setahun sebelum dihitung pajaknya. Besarannya mengacu PMK 101/2016 dan, per Oktober 2026, belum berubah:</p>
  <table><thead><tr><th>Status</th><th>PTKP setahun</th></tr></thead><tbody><tr><td>TK/0 (lajang, tanpa tanggungan)</td><td>Rp54.000.000</td></tr><tr><td>Menikah (K/0)</td><td>Rp58.500.000</td></tr><tr><td>Tambahan per tanggungan (maks. 3)</td><td>Rp4.500.000</td></tr></tbody></table>
  <p>Pemerintah dikabarkan sedang mengkaji perubahan untuk tahun-tahun mendatang. Cek pengumuman resmi DJP.</p>`,
  act:'Tentukan status PTKP-mu dan hitung totalnya.',
  q:{q:'PTKP untuk wajib pajak lajang tanpa tanggungan (TK/0) adalah…', o:['Rp48.000.000','Rp54.000.000','Rp58.500.000','Rp60.000.000'], a:1, e:'TK/0 = Rp54 juta per tahun.'} },
{ id:'d14', cat:'data', t:'SUMIFS: menjumlah dengan syarat', min:3,
  h:`<p><code>SUMIFS(kolom_dijumlah; kolom_syarat1; syarat1; ...)</code> menjumlah angka yang memenuhi satu atau banyak syarat.</p>
  <p>Contoh: <code>=SUMIFS(D:D;B:B;"Transport";C:C;"Oktober")</code> menjumlah kolom D untuk baris yang kategorinya Transport dan bulannya Oktober.</p>
  <ul><li>Kolom yang dijumlah ditulis <strong>pertama</strong>.</li><li>Di Excel dengan wilayah Indonesia, pemisah argumen adalah titik koma.</li><li>Untuk menghitung jumlah baris, pakai <code>COUNTIFS</code>.</li></ul>`,
  act:'Tulis satu SUMIFS untuk data pengeluaranmu.',
  q:{q:'Pada SUMIFS, argumen pertama adalah…', o:['Syarat pertama','Kolom yang dijumlahkan','Nama sheet','Hasil'], a:1, e:'Berbeda dari SUMIF lama, SUMIFS menaruh kolom penjumlahan di depan.'} },
{ id:'d15', cat:'hak', t:'THR: kapan dan berapa', min:3,
  h:`<p>Tunjangan Hari Raya keagamaan wajib dibayarkan pengusaha kepada pekerja yang telah bekerja minimal satu bulan secara terus-menerus.</p>
  <ul><li>Masa kerja 12 bulan atau lebih: <strong>satu bulan upah</strong>.</li><li>Masa kerja 1 sampai kurang dari 12 bulan: dibayar proporsional.</li><li>Dibayarkan paling lambat <strong>7 hari sebelum</strong> hari raya.</li></ul>
  <div class="tip">Rujukan: Permenaker 6/2016 dan peraturan turunannya. Perjanjian kerja bisa memberi hak lebih baik.</div>`,
  act:'Cek kapan THR terakhirmu dibayar dan apakah sesuai ketentuan.',
  q:{q:'THR paling lambat dibayarkan…', o:['Pada hari raya','7 hari sebelum hari raya','Sebulan setelah hari raya','Tidak ada batas'], a:1, e:'Ketentuannya paling lambat H-7.'} },
{ id:'d16', cat:'digi', t:'Phishing: tiga pertanyaan sebelum klik', min:3,
  h:`<p>Penipu memanfaatkan rasa terburu-buru. Sebelum klik tautan atau membuka lampiran, tanya:</p>
  <ol><li><strong>Siapa pengirimnya sebenarnya?</strong> Lihat alamat email lengkap, bukan hanya nama tampilan.</li><li><strong>Apakah ada tekanan waktu atau ancaman?</strong> "Akun diblokir 1 jam" adalah tanda bahaya.</li><li><strong>Ke mana tautan mengarah?</strong> Arahkan kursor dulu. Domain yang mirip tapi berbeda sering dipakai.</li></ol>
  <p>Ragu? Buka situs resmi lewat pengetikan alamat sendiri, jangan lewat tautan di pesan.</p>`,
  act:'Cek satu email "penting" di spam-mu dan cari tanda-tanda phishing.',
  q:{q:'Tanda umum phishing adalah…', o:['Menyebut namamu','Tekanan waktu dan ancaman','Bahasa formal','Ada logo'], a:1, e:'Urgensi buatan membuat korban bertindak tanpa berpikir.'} },
{ id:'d17', cat:'karir', t:'Satu halaman portofolio untuk bidang apa pun', min:4,
  h:`<p>Portofolio tidak hanya untuk desainer. Siapa pun bisa menunjukkan hasil kerja.</p>
  <ul><li>Pilih 3 pekerjaan terbaik: apa masalahnya, apa yang kamu lakukan, apa hasilnya.</li><li>Sertakan angka atau bukti: waktu yang dihemat, jumlah data diolah, umpan balik.</li><li>Hormati kerahasiaan. Samarkan data sensitif milik tempat kerja sebelumnya.</li></ul>`,
  act:'Tulis 3 kalimat tentang satu pekerjaan terbaikmu dengan pola masalah, tindakan, hasil.',
  q:{q:'Elemen paling kuat dalam contoh portofolio adalah…', o:['Daftar tugas','Masalah, tindakan, dan hasil terukur','Foto profil','Kutipan motivasi'], a:1, e:'Hasil terukur menunjukkan dampak, bukan sekadar aktivitas.'} },
{ id:'d18', cat:'prod', t:'Review mingguan 15 menit', min:3,
  h:`<p>Sekali seminggu, duduk 15 menit dan jawab:</p>
  <ol><li>Apa yang selesai dan apa yang membuatku bangga?</li><li>Apa yang tertunda, dan kenapa?</li><li>Tiga hal terpenting minggu depan.</li></ol>
  <p>Kebiasaan ini mencegah pekerjaan menumpuk diam-diam dan memperlihatkan pola yang tak terlihat dari hari ke hari.</p>`,
  act:'Jadwalkan 15 menit review mingguan di kalender, sama setiap minggu.',
  q:{q:'Tujuan utama review mingguan adalah…', o:['Menambah pekerjaan','Melihat kemajuan dan menetapkan prioritas','Menyalahkan diri','Mengganti kalender'], a:1, e:'Review memberi arah dan membuka pola yang terlewat.'} },
{ id:'d19', cat:'komun', t:'Presentasi 3 menit: satu pesan utama', min:4,
  h:`<p>Presentasi singkat yang baik punya satu pesan yang bisa diulang pendengar.</p>
  <ul><li><strong>Pembuka (30 dtk):</strong> masalah atau pertanyaan yang relevan.</li><li><strong>Isi (2 mnt):</strong> maksimal tiga poin dengan satu contoh atau angka.</li><li><strong>Penutup (30 dtk):</strong> ulangi pesan dan sebutkan langkah berikutnya.</li></ul>
  <p>Satu slide, satu gagasan. Slide yang padat membuat orang membaca, bukan mendengarkan.</p>`,
  act:'Tulis pesan utama presentasi berikutnya dalam satu kalimat.',
  q:{q:'Berapa pesan utama yang ideal pada presentasi singkat?', o:['Satu','Lima','Sepuluh','Sebanyak mungkin'], a:0, e:'Satu pesan yang jelas lebih mudah diingat.'} },
{ id:'d20', cat:'uang', t:'Membaca slip gaji: apa saja komponennya', min:4,
  h:`<p>Slip gaji biasanya terdiri dari:</p>
  <ul><li><strong>Pendapatan:</strong> gaji pokok, tunjangan tetap, tunjangan tidak tetap, lembur, bonus.</li><li><strong>Potongan:</strong> iuran BPJS (bagian pekerja), PPh 21, potongan lain seperti pinjaman.</li><li><strong>Gaji bersih (take home pay):</strong> pendapatan dikurangi potongan.</li></ul>
  <p>Selalu periksa apakah potongan sesuai dan apakah rincian PPh 21 dapat dijelaskan oleh bagian payroll.</p>`,
  act:'Ambil slip gaji terakhir dan tulis tiga potongan terbesarnya.',
  q:{q:'Gaji bersih (take home pay) adalah…', o:['Pendapatan bruto','Pendapatan dikurangi potongan','Hanya gaji pokok','Gaji pokok ditambah bonus'], a:1, e:'Take home pay = pendapatan setelah potongan.'} },
{ id:'d21', cat:'data', t:'XLOOKUP: cari data tanpa pusing urutan kolom', min:3,
  h:`<p><code>XLOOKUP(nilai_dicari; kolom_cari; kolom_hasil; "tidak ada")</code> mengambil hasil dari kolom lain yang sejajar dengan nilai yang cocok.</p>
  <ul><li>Bisa mencari ke kiri, tidak seperti VLOOKUP.</li><li>Argumen keempat menggantikan <code>IFERROR</code> untuk teks "tidak ditemukan".</li><li>Di versi Excel lama yang tidak punya XLOOKUP, gunakan <code>INDEX</code> dan <code>MATCH</code>.</li></ul>`,
  act:'Cari satu data dari tabel lain dengan XLOOKUP.',
  q:{q:'Keunggulan XLOOKUP dibanding VLOOKUP adalah…', o:['Hanya bekerja di Mac','Bisa mencari ke kolom kiri','Tidak bisa error','Lebih lama'], a:1, e:'XLOOKUP tidak terikat urutan kolom.'} },
{ id:'d22', cat:'pajak', t:'PPh 21 bulanan dengan TER: cara kerjanya', min:5,
  h:`<p>Sejak 2024, pemotongan PPh 21 bulanan untuk pegawai tetap memakai <strong>TER</strong> (tarif efektif rata-rata, PMK 168/2023).</p>
  <ul><li><strong>Januari–November:</strong> penghasilan bruto bulan itu × tarif TER sesuai kategori.</li><li><strong>Desember (masa pajak terakhir):</strong> dihitung setahun penuh dengan tarif Pasal 17, lalu dikurangi potongan Januari–November.</li><li>Kategori TER mengikuti status PTKP: A (TK/0, TK/1, K/0), B (TK/2, TK/3, K/1, K/2), C (K/3).</li></ul>
  <p>Gaji yang sama bisa terasa dipotong berbeda tiap bulan, tetapi total setahun disesuaikan di Desember. Coba di menu Belajar pajak → Kalkulator.</p>`,
  act:'Hitung PPh 21 gajimu dengan kalkulator TER di menu Belajar pajak.',
  q:{q:'Pada skema TER, bulan yang dihitung ulang dengan tarif Pasal 17 setahun penuh adalah…', o:['Januari','Juni','Desember (masa pajak terakhir)','Semua bulan'], a:2, e:'Selisih akibat TER disesuaikan pada masa pajak terakhir.'} },
{ id:'d23', cat:'hak', t:'Cuti tahunan dan lembur: dua hal yang sering salah paham', min:3,
  h:`<ul><li><strong>Cuti tahunan:</strong> pekerja yang sudah bekerja 12 bulan terus-menerus umumnya berhak cuti tahunan minimal 12 hari kerja. Pelaksanaannya diatur perjanjian kerja atau peraturan perusahaan.</li><li><strong>Lembur:</strong> kerja di luar jam kerja normal mensyaratkan persetujuan dan upah lembur dengan perhitungan khusus yang lebih tinggi dari upah per jam biasa. Rinciannya mengikuti peraturan ketenagakerjaan yang berlaku.</li></ul>
  <p>Simpan bukti persetujuan lembur (pesan atau form), karena itu menjadi dasar klaim.</p>`,
  act:'Cari tahu ketentuan lembur dan cuti di perjanjian kerja atau peraturan perusahaanmu.',
  q:{q:'Mengapa bukti persetujuan lembur penting?', o:['Agar terlihat rajin','Sebagai dasar klaim upah lembur','Tidak penting','Untuk dipamerkan'], a:1, e:'Bukti membantu menghindari sengketa perhitungan.'} },
{ id:'d24', cat:'digi', t:'AI sebagai asisten: periksa ulang sebelum dipakai', min:4,
  h:`<p>Asisten AI mempercepat menulis, merangkum, dan brainstorming, tetapi bisa keliru dengan nada yakin.</p>
  <ul><li><strong>Verifikasi fakta penting:</strong> angka, tanggal, aturan, kutipan. Cek ke sumber resmi.</li><li><strong>Beri konteks yang cukup,</strong> tetapi jangan menempel data rahasia perusahaan atau pribadi ke layanan yang tidak disetujui.</li><li><strong>Kamu penanggung jawab hasil akhir.</strong> AI membantu, bukan menggantikan penilaianmu.</li></ul>`,
  act:'Ambil satu jawaban AI dan verifikasi satu klaim di dalamnya ke sumber resmi.',
  q:{q:'Siapa yang bertanggung jawab atas hasil akhir pekerjaan yang dibantu AI?', o:['AI','Pengembang AI','Kamu','Tidak ada'], a:2, e:'Kamulah yang menandatangani dan mempertanggungjawabkan hasilnya.'} },
{ id:'d25', cat:'karir', t:'Jaringan profesional: mulai dari 3 orang', min:3,
  h:`<p>Jaringan tidak berarti mengumpulkan kontak sebanyak mungkin.</p>
  <ul><li>Pilih tiga orang yang bidangnya ingin kamu pelajari.</li><li>Kirim pesan singkat: perkenalan, alasan, dan satu pertanyaan spesifik.</li><li>Beri sesuatu kembali: terima kasih, kabar hasil, atau informasi berguna.</li></ul>
  <p>Hubungan yang dijaga pelan-pelan lebih bernilai daripada permintaan mendadak saat butuh.</p>`,
  act:'Kirim satu pesan terima kasih kepada orang yang pernah membantumu.',
  q:{q:'Pesan perkenalan yang baik berisi…', o:['Permintaan pekerjaan langsung','Perkenalan, alasan, dan pertanyaan spesifik','Hanya "halo"','Lampiran CV tanpa pesan'], a:1, e:'Spesifik memudahkan orang membalas.'} },
{ id:'d26', cat:'sehat', t:'Tidur dan fokus: hubungan yang sering diabaikan', min:3,
  h:`<p>Kurang tidur menurunkan perhatian dan daya ingat, dan memperbesar kesalahan. Beberapa kebiasaan sederhana:</p>
  <ul><li>Jam tidur dan bangun yang relatif konsisten.</li><li>Kurangi layar terang dan kafein menjelang malam.</li><li>Tulis daftar tugas besok sebelum tidur supaya pikiran tidak berputar.</li></ul>
  <div class="tip">Bila sulit tidur berkepanjangan atau mengganggu kerja, bicarakan dengan tenaga kesehatan.</div>`,
  act:'Tentukan jam tidur malam ini dan pasang alarm pengingat 30 menit sebelumnya.',
  q:{q:'Menulis daftar tugas besok sebelum tidur membantu…', o:['Menambah kafein','Mengurangi pikiran yang berputar','Memperpendek tidur','Tidak ada manfaat'], a:1, e:'Memindahkan beban ke kertas membuat otak lebih tenang.'} },
{ id:'d27', cat:'prod', t:'Aturan 2 menit dan antrean tugas kecil', min:2,
  h:`<p>Jika sebuah tugas bisa selesai dalam dua menit, kerjakan sekarang. Mencatat dan menunda justru lebih lama.</p>
  <p>Untuk tugas kecil yang menumpuk, kumpulkan dalam satu antrean dan selesaikan sekaligus di satu blok waktu supaya fokus utamamu tidak terpecah.</p>`,
  act:'Selesaikan tiga tugas kecil yang sudah lama kamu tunda.',
  q:{q:'Menurut aturan 2 menit, tugas yang selesai dalam dua menit sebaiknya…', o:['Dijadwalkan bulan depan','Dikerjakan langsung','Didelegasikan selalu','Dihapus'], a:1, e:'Biaya mencatat dan menunda lebih besar daripada mengerjakan.'} },
{ id:'d28', cat:'komun', t:'Memberi umpan balik dengan pola SBI', min:4,
  h:`<p>Umpan balik efektif menjelaskan fakta, bukan menghakimi pribadi. Pola <strong>SBI</strong>:</p>
  <ul><li><strong>Situation:</strong> kapan dan di mana.</li><li><strong>Behavior:</strong> perilaku yang teramati.</li><li><strong>Impact:</strong> dampaknya.</li></ul>
  <p>Contoh: "Saat rapat kemarin (S), laporan dikirim setelah tenggat (B), sehingga tim tidak sempat memeriksanya (I)." Setelah itu, tanyakan pendapatnya.</p>`,
  act:'Tulis satu umpan balik positif dengan pola SBI untuk rekan kerja.',
  q:{q:'Huruf B pada SBI berarti…', o:['Benefit','Behavior','Budget','Boundary'], a:1, e:'Behavior: perilaku yang teramati.'} },
{ id:'d29', cat:'uang', t:'BPJS: iuran dan manfaat dasar', min:4,
  h:`<p>Pekerja penerima upah umumnya didaftarkan pemberi kerja pada dua program:</p>
  <ul><li><strong>BPJS Kesehatan:</strong> iuran 5% dari upah (4% pemberi kerja, 1% pekerja) dengan batas upah tertentu.</li><li><strong>BPJS Ketenagakerjaan:</strong> JKK (kecelakaan kerja), JKM (kematian), JHT (hari tua), dan JP (pensiun). Pada JHT bagian pekerja umumnya 2% dan pada JP 1%.</li></ul>
  <div class="tip">Besaran dan batas upah dapat berubah. Cek bpjs.go.id atau slip gajimu.</div>`,
  act:'Cek apakah namamu terdaftar di kedua program BPJS.',
  q:{q:'JHT pada BPJS Ketenagakerjaan adalah jaminan…', o:['Kesehatan','Hari tua','Kecelakaan kerja','Kematian'], a:1, e:'JHT = Jaminan Hari Tua.'} },
{ id:'d30', cat:'pajak', t:'Bukti potong dan SPT Tahunan untuk karyawan', min:4,
  h:`<p>Setiap tahun pemberi kerja menerbitkan <strong>bukti potong PPh 21</strong> (bukti pemotongan tahunan) berisi ringkasan penghasilan dan pajak yang dipotong.</p>
  <ul><li>Gunakan sebagai dasar mengisi <strong>SPT Tahunan orang pribadi</strong>.</li><li>Batas lapor SPT Tahunan OP: <strong>31 Maret</strong>.</li><li>Jika punya penghasilan lain, tuliskan juga dan periksa pajak yang sudah dipotong atau dikredit.</li></ul>
  <p>Simpan salinan SPT dan bukti pelaporan.</p>`,
  act:'Cari tahu apakah pemberi kerjamu sudah mengirim bukti potong tahun lalu.',
  q:{q:'Batas lapor SPT Tahunan orang pribadi adalah…', o:['31 Januari','31 Maret','30 April','30 Juni'], a:1, e:'OP 31 Maret, badan 30 April.'} },
{ id:'d31', cat:'data', t:'Pivot table dalam 4 langkah', min:4,
  h:`<ol><li>Pastikan data berupa tabel rapi (<code>Ctrl+T</code>).</li><li>Insert → PivotTable.</li><li>Tarik kolom kategori ke <strong>Rows</strong>, angka ke <strong>Values</strong>.</li><li>Tambahkan <strong>Slicer</strong> atau kelompokkan tanggal per bulan.</li></ol>
  <p>Klik kanan → Refresh bila data sumber berubah. Pivot bukan grafik, tetapi bisa diubah jadi grafik dengan satu klik.</p>`,
  act:'Buat pivot dari data pengeluaranmu, dikelompokkan per kategori.',
  q:{q:'Area untuk menaruh angka yang dijumlahkan pada pivot adalah…', o:['Rows','Columns','Values','Filters'], a:2, e:'Values berisi angka yang dihitung.'} },
{ id:'d32', cat:'hak', t:'Membaca kontrak kerja: lima bagian yang perlu dicek', min:4,
  h:`<ol><li><strong>Posisi dan uraian tugas.</strong></li><li><strong>Masa berlaku dan status</strong> (PKWT atau PKWTT), serta masa percobaan.</li><li><strong>Gaji dan komponennya</strong>, termasuk tunjangan dan jadwal pembayaran.</li><li><strong>Jam kerja, lembur, cuti.</strong></li><li><strong>Klausul khusus:</strong> kerahasiaan, ikatan dinas, larangan bekerja di pesaing, denda pengunduran diri.</li></ol>
  <p>Minta salinan kontrak yang sudah ditandatangani kedua pihak dan simpan.</p>`,
  act:'Periksa kelima bagian itu pada kontrak yang kamu punya atau pernah lihat.',
  q:{q:'Hal yang perlu diminta setelah tanda tangan kontrak adalah…', o:['Tidak ada','Salinan kontrak bertanda tangan kedua pihak','Foto kantor','Rekaman suara'], a:1, e:'Salinan menjadi bukti ketentuan yang disepakati.'} },
{ id:'d33', cat:'digi', t:'Menjaga data pribadi saat melamar kerja', min:3,
  h:`<ul><li>Cantumkan di CV hanya yang perlu: nama, kontak, kota. Alamat lengkap dan nomor KTP tidak perlu di tahap awal.</li><li>Waspada permintaan data sensitif (foto KTP, OTP, nomor rekening) sebelum ada penawaran resmi.</li><li>Verifikasi perusahaan lewat situs dan akun resmi.</li><li>Proses rekrutmen yang sah tidak memungut biaya dari pelamar.</li></ul>`,
  act:'Periksa CV-mu dan hapus data yang tidak perlu dicantumkan.',
  q:{q:'Rekrutmen yang sah biasanya…', o:['Meminta biaya administrasi','Tidak memungut biaya pelamar','Minta kode OTP','Hanya lewat chat pribadi'], a:1, e:'Permintaan uang atau OTP adalah ciri penipuan.'} },
{ id:'d34', cat:'karir', t:'Belajar mandiri 30 menit sehari', min:3,
  h:`<p>Keterampilan tumbuh dari praktik kecil yang konsisten.</p>
  <ul><li>Pilih satu keterampilan untuk 4 minggu, jangan lima sekaligus.</li><li>Tetapkan hasil kecil: satu proyek mini, bukan sekadar menonton video.</li><li>Catat hal yang kamu pelajari tiap sesi. Menjelaskan ulang membantu mengingat.</li></ul>`,
  act:'Pilih satu keterampilan untuk 4 minggu ke depan dan tulis hasil akhirnya.',
  q:{q:'Cara belajar yang paling efektif menurut materi ini adalah…', o:['Menonton banyak video saja','Praktik kecil yang konsisten dengan hasil nyata','Belajar semalam suntuk','Mengumpulkan banyak kursus'], a:1, e:'Praktik dan hasil nyata memperkuat pemahaman.'} },
{ id:'d35', cat:'karir', t:'Mengolah penolakan lamaran jadi data', min:4,
  h:`<p>Penolakan terasa personal, padahal sering dipengaruhi hal yang tidak kamu kendalikan: jumlah pelamar, kecocokan internal, anggaran.</p>
  <ul><li>Catat tahap tempat prosesmu berhenti. Pola akan terlihat dari beberapa lamaran.</li><li>Pisahkan yang bisa diperbaiki (CV, kecocokan lowongan, tindak lanjut) dari yang tidak.</li><li>Bila ada kesempatan, minta umpan balik singkat dengan sopan.</li></ul>
  <p>Tab Analisis di aplikasi ini membantumu melihat pola itu.</p>`,
  act:'Buka tab Analisis dan lihat di tahap mana lamaranmu paling sering berhenti.',
  q:{q:'Langkah pertama mengolah penolakan secara konstruktif adalah…', o:['Menyalahkan diri','Mencatat tahap tempat proses berhenti','Berhenti melamar','Mengabaikan'], a:1, e:'Pencatatan mengubah pengalaman jadi data yang bisa dipelajari.'} },
{ id:'d36', cat:'sehat', t:'Menetapkan batas antara kerja dan istirahat', min:3,
  h:`<p>Terus tersedia sepanjang waktu tidak membuat kerjamu lebih baik, hanya lebih cepat lelah.</p>
  <ul><li>Tentukan jam selesai kerja dan komunikasikan dengan sopan.</li><li>Matikan notifikasi kerja di luar jam kerja bila memungkinkan.</li><li>Jadwalkan jeda singkat dan satu aktivitas non-kerja yang kamu nikmati setiap hari.</li></ul>
  <div class="tip">Bila kelelahan berkepanjangan, bicarakan dengan atasan, orang tepercaya, atau tenaga profesional.</div>`,
  act:'Tentukan jam "selesai kerja" untuk besok dan patuhi.',
  q:{q:'Salah satu cara menjaga batas kerja adalah…', o:['Selalu membalas pesan 24 jam','Mematikan notifikasi kerja di luar jam kerja','Tidak pernah istirahat','Menunda tidur'], a:1, e:'Batas yang jelas menjaga energi jangka panjang.'} }
];
