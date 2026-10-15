/* MODUL KARIER — berlaku untuk semua bidang pekerjaan.
   Struktur: { id, icon, color, title, level, minutes, desc, lessons:[{t, h}], quiz:[{q, o:[...], a:indexJawaban, e:penjelasan}] }
   Menambah modul = menambah satu objek baru di array ini. */
const MODULES = [
{
  id:'strategi', icon:'file', color:'--c1', title:'Strategi mencari kerja yang efisien', level:'Dasar', minutes:25,
  desc:'CV berbasis hasil, melamar secara terarah, dan mengelola proses lamaran dengan data.',
  lessons:[
    {t:'CV yang menunjukkan hasil', h:`
      <h3>CV yang menunjukkan hasil</h3>
      <p>CV adalah alat memudahkan orang lain mengambil keputusan dalam hitungan detik. Untuk pengalaman di bawah tiga tahun, satu halaman cukup.</p>
      <ol><li><strong>Kontak</strong> yang profesional.</li><li><strong>Ringkasan</strong> 2–3 kalimat tentang bidang dan nilai yang kamu bawa.</li><li><strong>Pengalaman</strong> terbaru dulu, termasuk magang, proyek, dan organisasi.</li><li><strong>Pendidikan</strong>, <strong>keterampilan</strong>, dan <strong>sertifikat</strong> yang relevan.</li></ol>
      <p>Tulis poin pengalaman dengan pola <em>kata kerja + apa yang dikerjakan + hasil yang terukur</em>.</p>
      <div class="tip">"Merekap data bulanan dan menurunkan kesalahan input" lebih kuat daripada "bertanggung jawab atas administrasi".</div>`},
    {t:'Melamar terarah, bukan menyebar', h:`
      <h3>Melamar terarah, bukan menyebar</h3>
      <ul><li>Pisahkan syarat <strong>wajib</strong> dari <strong>nilai plus</strong>. Memenuhi sebagian besar poin sudah layak dicoba.</li><li>Pakai istilah yang sama dengan iklan lowongan, karena banyak perusahaan memakai sistem penyaring (ATS) yang membaca teks CV.</li><li>Hindari tabel rumit dan teks di dalam gambar.</li><li>Buat 2–3 versi dasar CV, lalu sesuaikan 10–15 menit untuk tiap lamaran.</li></ul>
      <p>Subjek email lamaran: <code>Lamaran [Posisi] – [Nama Lengkap]</code>. Ejaan nama perusahaan harus tepat.</p>`},
    {t:'Kelola proses dengan data', h:`
      <h3>Kelola proses dengan data</h3>
      <p>Catat setiap lamaran: tanggal, sumber, posisi, status, dan catatan. Itulah gunanya tracker ini.</p>
      <ul><li><strong>Follow-up</strong> satu kali setelah 1–2 minggu tanpa kabar. Lebih dari itu, fokus ke lowongan lain.</li><li>Tinjau <strong>Analisis</strong> tiap minggu: sumber mana yang membalas, tahap mana yang sering berhenti.</li><li>Catat satu pelajaran dari tiap penolakan di kolom Notes.</li></ul>
      <p>Untuk wawancara, siapkan lima cerita dengan pola <strong>STAR</strong> (Situation, Task, Action, Result) yang bisa dipakai menjawab banyak pertanyaan.</p>`}
  ],
  quiz:[
    {q:'Poin pengalaman yang paling kuat adalah…', o:['Rajin dan teliti','Bertanggung jawab atas administrasi','Merekap 80 dokumen per minggu dan menurunkan kesalahan input','Membantu tim'], a:2, e:'Poin kuat memuat tindakan dan hasil yang terukur.'},
    {q:'Fungsi ATS pada proses rekrutmen adalah…', o:['Mengirim lamaran otomatis','Menampung dan menyaring lamaran masuk','Menghitung gaji','Menilai wawancara'], a:1, e:'ATS membaca teks CV, jadi format sederhana dan kata kunci yang sesuai membantu.'},
    {q:'Sikap yang tepat bila lamaran 3 minggu tanpa kabar adalah…', o:['Mengirim follow-up setiap hari','Follow-up satu kali, lalu fokus ke lowongan lain','Menunggu selamanya','Menghapus semua catatan'], a:1, e:'Follow-up sopan sekali cukup, sisanya alihkan energi.'},
    {q:'STAR adalah singkatan dari…', o:['Situation, Task, Action, Result','Skill, Target, Attitude, Reward','Story, Talent, Action, Result','Situation, Time, Answer, Review'], a:0, e:'Metode bercerita untuk menjawab pertanyaan perilaku.'}
  ]
},
{
  id:'komunikasi', icon:'mic', color:'--c2', title:'Komunikasi profesional', level:'Dasar', minutes:25,
  desc:'Email, pesan singkat, presentasi, mendengarkan, dan memberi umpan balik.',
  lessons:[
    {t:'Menulis yang mudah dibalas', h:`
      <h3>Menulis yang mudah dibalas</h3>
      <ul><li><strong>Subjek spesifik</strong> yang memuat isi dan tenggat.</li><li><strong>Tujuan di kalimat pertama</strong>, konteks setelahnya.</li><li><strong>Satu pesan, satu permintaan.</strong></li><li><strong>Penutup dengan langkah berikutnya:</strong> siapa, melakukan apa, kapan.</li></ul>
      <p>Untuk chat kerja, tulis satu pesan utuh daripada banyak kalimat pendek, dan hormati jam istirahat.</p>
      <div class="tip">Keputusan penting yang disepakati lewat chat sebaiknya ditegaskan ulang lewat email.</div>`},
    {t:'Presentasi dan mendengarkan aktif', h:`
      <h3>Presentasi dan mendengarkan aktif</h3>
      <p><strong>Presentasi:</strong> satu pesan utama. Pembuka berupa masalah, isi maksimal tiga poin dengan contoh atau angka, penutup berupa pesan yang diulang dan langkah berikutnya. Satu slide, satu gagasan.</p>
      <p><strong>Mendengarkan aktif:</strong></p>
      <ul><li>Biarkan lawan bicara selesai sebelum menjawab.</li><li>Ulangi inti ucapannya dengan kata-katamu sendiri untuk memastikan paham.</li><li>Ajukan pertanyaan terbuka: "Bisa ceritakan lebih jauh?"</li></ul>`},
    {t:'Umpan balik dan penolakan sopan', h:`
      <h3>Umpan balik dan penolakan sopan</h3>
      <p><strong>Pola SBI</strong> untuk umpan balik: <em>Situation</em> (kapan dan di mana), <em>Behavior</em> (perilaku teramati), <em>Impact</em> (dampaknya). Fokus pada fakta, bukan sifat pribadi.</p>
      <p><strong>Menolak dengan sopan:</strong> ucapkan terima kasih, sampaikan keputusan dengan jelas, beri alasan singkat bila perlu, dan tawarkan alternatif bila ada. "Terima kasih sudah memikirkan saya. Minggu ini kapasitas saya penuh. Bisa kita bahas lagi setelah Jumat?"</p>`}
  ],
  quiz:[
    {q:'Bagian email yang sebaiknya paling awal adalah…', o:['Salam panjang','Tujuan atau permintaan','Tanda tangan','Latar belakang rinci'], a:1, e:'Penerima sibuk, jadi tujuan harus cepat terlihat.'},
    {q:'Huruf I pada SBI berarti…', o:['Idea','Impact','Interest','Intention'], a:1, e:'Impact: dampak perilaku tersebut.'},
    {q:'Mendengarkan aktif mencakup…', o:['Memotong untuk menyela','Mengulang inti ucapan dengan kata sendiri','Sibuk dengan ponsel','Menyiapkan jawaban sambil menunggu'], a:1, e:'Parafrase memastikan pemahaman.'},
    {q:'Jumlah pesan utama ideal dalam presentasi singkat adalah…', o:['Satu','Lima','Sepuluh','Tidak ada'], a:0, e:'Satu pesan yang jelas lebih mudah diingat.'}
  ]
},
{
  id:'produktivitas', icon:'clock', color:'--c4', title:'Produktivitas & manajemen waktu', level:'Dasar', minutes:25,
  desc:'Memprioritaskan, menjadwalkan, dan menjaga fokus tanpa membakar energi.',
  lessons:[
    {t:'Prioritas: penting vs mendesak', h:`
      <h3>Prioritas: penting vs mendesak</h3>
      <p>Matriks Eisenhower membagi tugas menjadi empat kotak: <strong>kerjakan</strong> (penting+mendesak), <strong>jadwalkan</strong> (penting+tidak mendesak), <strong>delegasikan</strong> (tidak penting+mendesak), dan <strong>hapus</strong>.</p>
      <p>Pertumbuhan jangka panjang hampir selalu ada di kotak kedua, sehingga mudah tertunda. Lindungi ia dengan jadwal.</p>`},
    {t:'Time blocking dan fokus', h:`
      <h3>Time blocking dan fokus</h3>
      <ul><li>Beri pekerjaan penting blok 60–90 menit di kalender.</li><li>Kelompokkan pekerjaan ringan (membalas pesan) dalam satu blok.</li><li>Matikan notifikasi saat blok fokus.</li><li>Sisakan blok kosong untuk hal tak terduga.</li></ul>
      <p>Tugas yang selesai dalam dua menit sebaiknya langsung dikerjakan.</p>`},
    {t:'Review mingguan dan energi', h:`
      <h3>Review mingguan dan energi</h3>
      <p>Setiap minggu, 15 menit: apa yang selesai, apa yang tertunda dan mengapa, tiga prioritas minggu depan.</p>
      <p>Energi sama pentingnya dengan waktu. Tidur cukup, jeda singkat, dan batas jam kerja yang jelas membuat hasil jangka panjang lebih baik daripada lembur terus-menerus.</p>`}
  ],
  quiz:[
    {q:'Tugas penting tetapi tidak mendesak sebaiknya…', o:['Dihapus','Dijadwalkan','Didelegasikan selalu','Dikerjakan paling akhir'], a:1, e:'Dijadwalkan agar tidak terus tergeser oleh yang mendesak.'},
    {q:'Mengapa menyisakan blok kosong di kalender?', o:['Agar terlihat santai','Untuk hal tak terduga','Karena kebiasaan','Tidak ada alasan'], a:1, e:'Rencana yang terlalu padat mudah runtuh.'},
    {q:'Durasi blok fokus yang disarankan adalah…', o:['5 menit','60–90 menit','4 jam tanpa jeda','10 detik'], a:1, e:'Cukup panjang untuk mendalam, cukup pendek untuk dijaga.'},
    {q:'Tujuan review mingguan adalah…', o:['Menambah beban','Melihat kemajuan dan menetapkan prioritas','Menyalahkan diri','Mengganti pekerjaan'], a:1, e:'Review memberi arah dan memunculkan pola.'}
  ]
},
{
  id:'excel', icon:'grid', color:'--c6', title:'Excel & data untuk semua profesi', level:'Dasar', minutes:30,
  desc:'Tabel rapi, rumus inti, pivot, dan pembersihan data. Berguna di bidang apa pun.',
  lessons:[
    {t:'Rumus yang paling sering dipakai', h:`
      <h3>Rumus yang paling sering dipakai</h3>
      <ul><li><code>SUMIFS</code>, <code>COUNTIFS</code>, <code>AVERAGEIFS</code>: hitung dengan beberapa syarat.</li><li><code>IF</code>, <code>IFS</code>, <code>IFERROR</code>: logika dan penanganan galat.</li><li><code>XLOOKUP(nilai; kolom_cari; kolom_hasil; "tidak ada")</code> dan <code>VLOOKUP(nilai; tabel; no_kolom; FALSE)</code>.</li></ul>
      <div class="tip">Excel dengan pengaturan wilayah Indonesia memakai titik koma (;) sebagai pemisah argumen. Contoh: <code>=SUMIFS(D:D;B:B;"Transport")</code>.</div>`},
    {t:'Tabel rapi dan pivot table', h:`
      <h3>Tabel rapi dan pivot table</h3>
      <p>Syarat data: satu baris judul, tanpa sel yang digabung, dan tanpa baris kosong. Tekan <code>Ctrl+T</code> untuk menjadikannya tabel.</p>
      <ol><li>Insert → PivotTable.</li><li>Tarik kolom ke Rows, Columns, dan Values.</li><li>Kelompokkan tanggal per bulan, tambahkan Slicer.</li></ol>
      <p>Setelah data berubah, klik kanan lalu <em>Refresh</em>.</p>`},
    {t:'Bersihkan data & pintasan', h:`
      <h3>Bersihkan data & pintasan</h3>
      <ul><li><code>TRIM</code> menghapus spasi berlebih, <code>CLEAN</code> menghapus karakter tak terlihat.</li><li>Text to Columns memisahkan isi kolom, Remove Duplicates menghapus data ganda.</li><li>Data Validation membatasi isian, misalnya daftar status.</li></ul>
      <p>Pintasan: <code>Ctrl+T</code> tabel, <code>Ctrl+Shift+L</code> filter, <code>F4</code> kunci referensi sel, <code>Ctrl+;</code> tanggal hari ini, <code>Alt+=</code> jumlah otomatis.</p>`}
  ],
  quiz:[
    {q:'Argumen terakhir VLOOKUP untuk pencarian persis adalah…', o:['TRUE','FALSE','1','Kosong'], a:1, e:'FALSE atau 0 meminta kecocokan persis.'},
    {q:'Pintasan untuk mengubah rentang menjadi tabel adalah…', o:['Ctrl+T','Ctrl+B','Ctrl+K','Ctrl+H'], a:0, e:'Ctrl+T membuat tabel Excel.'},
    {q:'Tombol untuk mengunci referensi sel adalah…', o:['F2','F4','F5','F9'], a:1, e:'F4 berganti antara bentuk relatif dan absolut.'},
    {q:'Keunggulan XLOOKUP adalah…', o:['Bisa mencari ke kolom kiri','Hanya di Google Sheets','Tidak butuh data','Lebih lambat'], a:0, e:'XLOOKUP tidak terikat urutan kolom.'}
  ]
},
{
  id:'keuangan', icon:'wallet', color:'--c3', title:'Literasi keuangan pribadi untuk pekerja', level:'Dasar', minutes:30,
  desc:'Anggaran, dana darurat, slip gaji, BPJS, dan mengelola utang. Informasi edukasi umum.',
  lessons:[
    {t:'Anggaran dan dana darurat', h:`
      <h3>Anggaran dan dana darurat</h3>
      <p>Kerangka 50/30/20 hanyalah titik awal: sekitar 50% kebutuhan, 30% keinginan, 20% tujuan keuangan. Sesuaikan dengan biaya hidupmu, yang penting kamu mencatat.</p>
      <p><strong>Dana darurat</strong> umumnya 3–6 kali pengeluaran bulanan, disimpan di tempat yang mudah dicairkan dan stabil, terpisah dari rekening harian. Orang dengan penghasilan tidak tetap sering butuh lebih.</p>
      <div class="tip">Ini informasi edukasi umum, bukan nasihat keuangan personal.</div>`},
    {t:'Slip gaji dan BPJS', h:`
      <h3>Slip gaji dan BPJS</h3>
      <p>Slip gaji memuat pendapatan (gaji pokok, tunjangan, lembur, bonus), potongan (iuran BPJS bagian pekerja, PPh 21, pinjaman), dan gaji bersih.</p>
      <ul><li><strong>BPJS Kesehatan:</strong> iuran 5% dari upah (4% pemberi kerja, 1% pekerja) dengan batas upah tertentu.</li><li><strong>BPJS Ketenagakerjaan:</strong> JKK, JKM, JHT, dan JP. Pada JHT bagian pekerja umumnya 2%, pada JP 1%.</li></ul>
      <p>Besaran bisa berubah, jadi cek bpjs.go.id dan tanyakan payroll bila ada yang tidak jelas.</p>`},
    {t:'Utang dan inflasi', h:`
      <h3>Utang dan inflasi</h3>
      <ul><li>Cicilan bulanan sebaiknya tidak membuat kebutuhan pokok terganggu. Banyak perencana memakai patokan total cicilan di bawah sekitar 30% penghasilan sebagai pedoman kasar.</li><li>Lunasi utang berbunga tinggi lebih dulu. Kartu kredit dan pinjaman online biasanya yang termahal.</li><li>Inflasi menggerus daya beli uang tunai. Dana jangka panjang perlu dipikirkan, tetapi pahami risiko sebelum memilih instrumen.</li></ul>`}
  ],
  quiz:[
    {q:'Dana darurat umumnya sebesar…', o:['1 kali pengeluaran bulanan','3–6 kali pengeluaran bulanan','Seumur hidup','Tidak perlu'], a:1, e:'Jarak aman saat penghasilan terganggu.'},
    {q:'Gaji bersih (take home pay) adalah…', o:['Gaji pokok saja','Pendapatan dikurangi potongan','Bonus saja','Total tunjangan'], a:1, e:'Pendapatan setelah semua potongan.'},
    {q:'Utang yang sebaiknya dilunasi lebih dulu adalah…', o:['Yang bunganya paling rendah','Yang bunganya paling tinggi','Yang paling lama','Yang paling kecil jumlahnya saja'], a:1, e:'Bunga tinggi membengkak paling cepat.'},
    {q:'JHT pada BPJS Ketenagakerjaan adalah jaminan…', o:['Hari tua','Kecelakaan kerja','Kesehatan','Kematian'], a:0, e:'JHT = Jaminan Hari Tua.'}
  ]
},
{
  id:'hak', icon:'handshake', color:'--c8', title:'Hak, kontrak & negosiasi kerja', level:'Menengah', minutes:25,
  desc:'Membaca offering letter dan kontrak, status hubungan kerja, serta negosiasi gaji dengan sopan.',
  lessons:[
    {t:'Membaca offering letter dan kontrak', h:`
      <h3>Membaca offering letter dan kontrak</h3>
      <ul><li>Posisi, atasan langsung, lokasi, tanggal mulai.</li><li>Status: PKWT, PKWTT, atau magang.</li><li>Gaji pokok, tunjangan tetap dan tidak tetap, jadwal bayar.</li><li>Masa percobaan, jam kerja, lembur, cuti, BPJS.</li><li>Klausul khusus: ikatan dinas, kerahasiaan, larangan bekerja di pesaing.</li></ul>
      <p>Tanyakan hal yang tidak jelas secara tertulis, dan simpan salinan yang sudah ditandatangani.</p>`},
    {t:'PKWT, PKWTT, magang, THR', h:`
      <h3>PKWT, PKWTT, magang, THR</h3>
      <ul><li><strong>PKWT:</strong> kontrak berbatas waktu atau untuk pekerjaan tertentu.</li><li><strong>PKWTT:</strong> karyawan tetap. Masa percobaan umumnya maksimal tiga bulan dan hanya untuk PKWTT.</li><li><strong>Magang:</strong> diatur perjanjian magang, bukan hubungan kerja biasa.</li><li><strong>THR:</strong> pekerja dengan masa kerja 12 bulan atau lebih berhak satu bulan upah, dibayar paling lambat 7 hari sebelum hari raya. Masa kerja 1 sampai kurang dari 12 bulan dibayar proporsional.</li></ul>
      <div class="tip">Aturan bisa berubah. Rujuk dinas ketenagakerjaan atau sumber resmi untuk keputusan penting.</div>`},
    {t:'Negosiasi gaji dengan sopan', h:`
      <h3>Negosiasi gaji dengan sopan</h3>
      <ol><li><strong>Riset rentang</strong> dari posisi serupa dan data pasar.</li><li><strong>Tentukan batas bawahmu</strong> sebelum percakapan.</li><li><strong>Sebut rentang</strong> dengan alasan nilai yang kamu bawa, bukan kebutuhan pribadi.</li><li><strong>Nilai total paket:</strong> tunjangan, BPJS, transport, jenjang karier, peluang belajar.</li><li><strong>Minta waktu</strong> 24–48 jam, dan balas tertulis.</li></ol>
      <p>Bila memutuskan menolak, sampaikan cepat dan sopan. Ada template di menu Tindak lanjut.</p>`}
  ],
  quiz:[
    {q:'Masa percobaan umumnya berlaku untuk status…', o:['PKWT','PKWTT','Magang','Semua'], a:1, e:'Maksimal tiga bulan dan umumnya hanya untuk karyawan tetap.'},
    {q:'THR untuk masa kerja 12 bulan atau lebih adalah…', o:['Setengah bulan upah','Satu bulan upah','Tiga bulan upah','Tidak ada'], a:1, e:'Satu bulan upah, paling lambat H-7 hari raya.'},
    {q:'Cara terbaik menyebut ekspektasi gaji…', o:['Satu angka kaku','Rentang berbasis riset dengan alasan nilai','Menolak menjawab','Menyebut kebutuhan cicilan'], a:1, e:'Rentang berbasis riset menunjukkan profesionalisme.'},
    {q:'Bila ada klausul tidak jelas di kontrak, sebaiknya…', o:['Abaikan','Tanyakan secara tertulis sebelum tanda tangan','Tanda tangan dulu','Tanya teman'], a:1, e:'Konfirmasi tertulis melindungi kedua pihak.'}
  ]
},
{
  id:'digital', icon:'shield', color:'--c7', title:'Keamanan digital & literasi AI', level:'Dasar', minutes:25,
  desc:'Akun aman, mengenali phishing dan lowongan palsu, dan memakai AI secara bertanggung jawab.',
  lessons:[
    {t:'Akun aman: sandi dan 2FA', h:`
      <h3>Akun aman: sandi dan 2FA</h3>
      <ul><li>Satu sandi unik per akun. Pakai pengelola sandi bila perlu.</li><li>Aktifkan <strong>verifikasi dua langkah</strong>, terutama di email utama.</li><li>Pilih aplikasi autentikator daripada SMS bila tersedia.</li><li>Simpan kode cadangan di tempat aman.</li></ul>`},
    {t:'Phishing dan lowongan palsu', h:`
      <h3>Phishing dan lowongan palsu</h3>
      <p>Sebelum klik: periksa pengirim sebenarnya, waspadai tekanan waktu, dan lihat tujuan tautan.</p>
      <p>Tanda lowongan palsu:</p>
      <ul><li>Diminta membayar biaya pelatihan, seragam, administrasi.</li><li>Wawancara hanya lewat WhatsApp atau Telegram.</li><li>Email pakai domain gratis padahal mengaku perusahaan besar.</li><li>Meminta foto KTP, OTP, atau rekening sejak awal.</li></ul>
      <div class="tip">Rekrutmen yang sah tidak memungut biaya dari pelamar.</div>`},
    {t:'Memakai AI dengan bertanggung jawab', h:`
      <h3>Memakai AI dengan bertanggung jawab</h3>
      <ul><li><strong>Verifikasi</strong> angka, tanggal, dan aturan ke sumber resmi.</li><li><strong>Jaga data:</strong> jangan menempel data rahasia ke layanan yang tidak disetujui.</li><li><strong>Kamu penanggung jawab</strong> hasil akhirnya.</li><li>Gunakan AI untuk menyusun kerangka, merangkum, dan memberi sudut pandang, lalu lakukan penilaianmu sendiri.</li></ul>`}
  ],
  quiz:[
    {q:'Akun yang paling prioritas diberi 2FA adalah…', o:['Email utama','Akun game lama','Akun forum','Akun belanja lama'], a:0, e:'Email adalah kunci pemulihan akun lain.'},
    {q:'Mana tanda lowongan palsu?', o:['Wawancara lewat video call resmi','Diminta transfer biaya administrasi','Uraian tugas jelas','Email domain perusahaan'], a:1, e:'Perekrutan sah tidak memungut biaya pelamar.'},
    {q:'Hal yang perlu dilakukan pada angka dari AI…', o:['Dipercaya langsung','Diverifikasi ke sumber resmi','Dihapus','Dibagikan dulu'], a:1, e:'AI bisa keliru dengan nada yakin.'},
    {q:'Pilihan 2FA yang umumnya lebih aman adalah…', o:['SMS saja','Aplikasi autentikator','Tanpa 2FA','Pertanyaan keamanan'], a:1, e:'Autentikator lebih sulit disadap daripada SMS.'}
  ]
}
];

const MOD_ICONS = {
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  grid:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 4v16"/>',
  wallet:'<path d="M4 7a2 2 0 0 1 2-2h12v4M4 7v10a2 2 0 0 0 2 2h14V9H6a2 2 0 0 1-2-2zM16 14h.01"/>',
  handshake:'<path d="M3 11l4-4 4 2 3-2 4 3 3-1M3 11l5 6a2 2 0 0 0 3 0l1-1 1 1a2 2 0 0 0 3 0l5-6M21 10v6"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
};
