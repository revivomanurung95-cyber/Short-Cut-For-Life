/* BELAJAR PAJAK — data materi, glosarium, dan kalkulator.
   Terakhir diverifikasi ke sumber: 12 Oktober 2026. Aturan pajak berubah. Untuk keperluan resmi, rujuk pajak.go.id atau konsultan pajak terdaftar. */
const TAX_UPDATED = '12 Okt 2026';

/* ---------- Tabel TER bulanan (PMK 168/2023): [batas atas penghasilan bruto, tarif %] ---------- */
const TER = {
  A: [[5400000,0],[5650000,.25],[5950000,.5],[6300000,.75],[6750000,1],[7500000,1.25],[8550000,1.5],[9650000,1.75],[10050000,2],[10350000,2.25],[10700000,2.5],[11050000,3],[11600000,3.5],[12500000,4],[13750000,5],[15100000,6],[16950000,7],[19750000,8],[24150000,9],[26450000,10],[28000000,11],[30050000,12],[32400000,13],[35400000,14],[39100000,15],[43850000,16],[47800000,17],[51400000,18],[56300000,19],[62200000,20],[68600000,21],[77500000,22],[89000000,23],[103000000,24],[125000000,25],[157000000,26],[206000000,27],[337000000,28],[454000000,29],[550000000,30],[695000000,31],[910000000,32],[1400000000,33],[Infinity,34]],
  B: [[6200000,0],[6500000,.25],[6850000,.5],[7300000,.75],[9200000,1],[10750000,1.5],[11250000,2],[11600000,2.5],[12600000,3],[13600000,4],[14950000,5],[16400000,6],[18450000,7],[21850000,8],[26000000,9],[27700000,10],[29350000,11],[31450000,12],[33950000,13],[37100000,14],[41100000,15],[45800000,16],[49500000,17],[53800000,18],[58500000,19],[64000000,20],[71000000,21],[80000000,22],[93000000,23],[109000000,24],[129000000,25],[163000000,26],[211000000,27],[374000000,28],[459000000,29],[555000000,30],[704000000,31],[957000000,32],[1405000000,33],[Infinity,34]],
  C: [[6600000,0],[6950000,.25],[7350000,.5],[7800000,.75],[8850000,1],[9800000,1.25],[10950000,1.5],[11200000,1.75],[12050000,2],[12950000,3],[14150000,4],[15550000,5],[17050000,6],[19500000,7],[22700000,8],[26600000,9],[28100000,10],[30100000,11],[32600000,12],[35400000,13],[38900000,14],[43000000,15],[47400000,16],[51200000,17],[55800000,18],[60400000,19],[66700000,20],[74500000,21],[83200000,22],[95600000,23],[110000000,24],[134000000,25],[169000000,26],[221000000,27],[390000000,28],[463000000,29],[561000000,30],[709000000,31],[965000000,32],[1419000000,33],[Infinity,34]]
};
const PTKP = { 'TK/0': 54e6, 'TK/1': 58.5e6, 'TK/2': 63e6, 'TK/3': 67.5e6, 'K/0': 58.5e6, 'K/1': 63e6, 'K/2': 67.5e6, 'K/3': 72e6 };
const TER_CAT = { 'TK/0': 'A', 'TK/1': 'A', 'K/0': 'A', 'TK/2': 'B', 'TK/3': 'B', 'K/1': 'B', 'K/2': 'B', 'K/3': 'C' };
const LAYERS17 = [[60e6, .05], [250e6, .15], [500e6, .25], [5e9, .30], [Infinity, .35]];

function terRate(cat, gross) { const t = TER[cat]; for (let i = 0; i < t.length; i++) if (gross <= t[i][0]) return t[i][1]; return 34; }
function pasal17(base) {
  let prev = 0, tax = 0; const det = [];
  LAYERS17.forEach(l => { if (base > prev) { const part = Math.min(base, l[0]) - prev; tax += part * l[1]; det.push([l[1], part, part * l[1]]); prev = l[0]; } });
  return { tax, det };
}

/* ---------- Kategori & topik ---------- */
const TAX_CATS = [
  { id:'dasar',  em:'🏛️', t:'Konsep & administrasi',        s:'Dasar pajak, NPWP/NIK, SPT, Coretax, sanksi', c:'--c1' },
  { id:'pph21',  em:'👔', t:'PPh orang pribadi & karyawan', s:'PPh 21, TER, tenaga ahli, THR dan bonus',    c:'--c2' },
  { id:'potput', em:'📊', t:'PPh pemotongan & pemungutan',  s:'PPh 22, 23, 26, 4(2), angsuran, rekonsiliasi', c:'--c6' },
  { id:'ppn',    em:'🧾', t:'PPN & faktur pajak',           s:'PPN 12% efektif 11%, DPP nilai lain, faktur', c:'--c8' },
  { id:'badan',  em:'🏢', t:'PPh badan, UMKM & aset tetap', s:'Tarif badan, UMKM terbaru, penyusutan fiskal', c:'--c3' },
  { id:'invest', em:'📈', t:'Investasi & ekonomi digital',  s:'Saham, kripto, freelancer dan kreator',       c:'--c7' },
  { id:'daerah', em:'🏠', t:'Pajak daerah & bea meterai',   s:'PBB, BPHTB, kendaraan, meterai',              c:'--c4' },
  { id:'adv',    em:'🎓', t:'Level lanjutan',               s:'Transfer pricing, sengketa, internasional',   c:'--c5' }
];

const TAX_TOPICS = [
/* ===== DASAR ===== */
{ id:'apa', cat:'dasar', em:'🏛️', t:'Apa itu pajak?', s:'Definisi, fungsi, jenis · Pasal 23A UUD 1945', h:`
<h3>Apa itu pajak?</h3>
<p>Pajak adalah kontribusi wajib kepada negara yang terutang oleh orang pribadi atau badan, bersifat memaksa berdasarkan undang-undang, tanpa imbalan langsung, dan dipakai untuk kebutuhan negara bagi sebesar-besar kemakmuran rakyat. Dasar konstitusionalnya adalah Pasal 23A UUD 1945.</p>
<h4>Fungsi</h4>
<ul><li><strong>Anggaran (budgeter):</strong> sumber utama penerimaan negara.</li><li><strong>Mengatur (regulerend):</strong> mengarahkan perilaku ekonomi, misalnya lewat insentif atau tarif.</li></ul>
<h4>Pajak pusat dan daerah</h4>
<table><thead><tr><th>Pusat (DJP)</th><th>Daerah (UU HKPD 1/2022)</th></tr></thead><tbody>
<tr><td>PPh, PPN dan PPnBM, PBB sektor perkebunan/perhutanan/pertambangan, bea meterai</td><td>PKB, BBNKB, PBB perdesaan/perkotaan, BPHTB, pajak barang dan jasa tertentu (PB1)</td></tr></tbody></table>
<h4>Sistem pemungutan</h4>
<p><strong>Self assessment</strong> (wajib pajak menghitung, menyetor, dan melapor sendiri), <strong>official assessment</strong> (fiskus menetapkan), dan <strong>withholding</strong> (pihak ketiga memotong atau memungut).</p>
<p class="small muted">Rujukan: UUD 1945 Pasal 23A, UU KUP, UU HKPD 1/2022.</p>` },
{ id:'npwp', cat:'dasar', em:'💳', t:'NPWP, NIK & identitas pajak', s:'NIK sebagai NPWP bagi orang pribadi', h:`
<h3>NPWP, NIK & identitas pajak</h3>
<p>Bagi wajib pajak orang pribadi dalam negeri, <strong>NIK pada KTP berfungsi sebagai NPWP</strong>. Wajib pajak badan dan pihak lain umumnya memakai NPWP format 16 digit. Integrasi ini berjalan seiring sistem Coretax sejak awal 2025.</p>
<ul><li><strong>Kewajiban mendaftar:</strong> terpenuhi syarat subjektif (subjek pajak) dan objektif (memperoleh penghasilan di atas batas tertentu atau menjalankan usaha).</li><li><strong>Pastikan data valid:</strong> nama, NIK, dan status di sistem DJP harus sesuai. Data tidak cocok bisa menghambat pemotongan dan pelaporan.</li><li><strong>Manfaat:</strong> pemotongan sesuai tarif normal, dan akses ke layanan perpajakan.</li></ul>
<div class="tip">Pada beberapa pemotongan, wajib pajak yang tidak terdaftar atau datanya tidak valid dikenai tarif lebih tinggi. Cek ketentuan terbaru pada jenis pajak yang bersangkutan.</div>` },
{ id:'spt', cat:'dasar', em:'📄', t:'SPT Tahunan & SPT Masa', s:'Batas lapor, jenis formulir, restitusi', h:`
<h3>SPT Tahunan & SPT Masa</h3>
<p>SPT adalah surat yang dipakai wajib pajak untuk melaporkan penghitungan dan pembayaran pajak.</p>
<table><thead><tr><th>Jenis</th><th>Batas lapor</th></tr></thead><tbody>
<tr><td>SPT Tahunan orang pribadi</td><td>31 Maret tahun berikutnya</td></tr>
<tr><td>SPT Tahunan badan</td><td>30 April tahun berikutnya</td></tr>
<tr><td>SPT Masa PPh (21, 23, 4(2), 25 dll.)</td><td>Tanggal 20 bulan berikutnya</td></tr>
<tr><td>SPT Masa PPN</td><td>Akhir bulan berikutnya</td></tr></tbody></table>
<ul><li>Formulir orang pribadi lazim disebut 1770 (usaha atau pekerjaan bebas), 1770 S (penghasilan dari pekerjaan, di atas Rp60 juta), dan 1770 SS (penghasilan dari satu pemberi kerja, sampai Rp60 juta). Badan memakai 1771.</li><li>Jika pajak yang sudah dibayar atau dikredit lebih besar dari terutang, hasilnya <strong>lebih bayar</strong>, yang dapat dimintakan restitusi atau dikompensasikan.</li><li>Pelaporan dan pembayaran dilakukan lewat Coretax.</li></ul>
<div class="tip">Jatuh tempo bergeser bila bertepatan hari libur dan kadang ada kelonggaran dari pemerintah. Periksa pengumuman DJP tiap periode.</div>
<p class="small muted">Rujukan: UU KUP, PMK 81/2024.</p>` },
{ id:'coretax', cat:'dasar', em:'⚡', t:'Coretax & PMK 81/2024', s:'Sistem inti administrasi perpajakan sejak 2025', badge:'2025', h:`
<h3>Coretax & PMK 81/2024</h3>
<p>Coretax (Sistem Inti Administrasi Perpajakan) mulai diterapkan pada <strong>awal 2025</strong>, mengintegrasikan layanan yang sebelumnya terpisah: pendaftaran, profil wajib pajak, faktur pajak, bukti potong, SPT, dan pembayaran.</p>
<ul><li><strong>Portal:</strong> coretax.pajak.go.id.</li><li><strong>Faktur dan bukti potong</strong> (yang sebelumnya e-Faktur dan e-Bupot) dibuat dan dilaporkan dalam sistem yang sama.</li><li><strong>Penguasaan akun:</strong> perusahaan menunjuk penanggung jawab dan, bila perlu, kuasa untuk mengakses.</li><li><strong>Kebiasaan baik:</strong> rekonsiliasi data faktur masukan dan keluaran tiap bulan, dan arsipkan bukti pelaporan.</li></ul>
<div class="tip">Ada fitur yang awalnya belum mendukung semua skenario (misalnya perhitungan DPP nilai lain secara otomatis). Hitung manual lalu cocokkan dengan sistem, dan ikuti panduan DJP terbaru.</div>
<p class="small muted">Rujukan: PMK 81/2024, coretax.pajak.go.id.</p>` },
{ id:'sanksi', cat:'dasar', em:'⚠️', t:'Sanksi & denda pajak', s:'Denda keterlambatan, bunga, kenaikan, pidana', badge:'Wajib tahu', h:`
<h3>Sanksi & denda pajak</h3>
<h4>Denda keterlambatan menyampaikan SPT</h4>
<table><thead><tr><th>SPT</th><th>Denda</th></tr></thead><tbody>
<tr><td>Masa PPN</td><td>Rp500.000</td></tr><tr><td>Masa lainnya</td><td>Rp100.000</td></tr><tr><td>Tahunan orang pribadi</td><td>Rp100.000</td></tr><tr><td>Tahunan badan</td><td>Rp1.000.000</td></tr></tbody></table>
<h4>Sanksi lain</h4>
<ul><li><strong>Bunga:</strong> atas kekurangan pembayaran, penundaan, atau pembetulan, dihitung per bulan berdasarkan suku bunga acuan yang ditetapkan Menteri Keuangan ditambah faktor penyesuaian. Bagian bulan dihitung penuh.</li><li><strong>Kenaikan:</strong> atas pajak yang kurang dibayar karena ketetapan atau pelanggaran tertentu.</li><li><strong>Pidana:</strong> untuk perbuatan yang disengaja, misalnya tidak melapor atau menyampaikan SPT yang isinya tidak benar.</li></ul>
<div class="warnbox">Terlambat melapor hampir selalu lebih murah dibandingkan tidak melapor sama sekali. Lapor dulu, perbaiki kemudian lewat pembetulan.</div>
<p class="small muted">Rujukan: UU KUP s.t.d.d. UU HPP 7/2021.</p>` },

/* ===== PPh ORANG PRIBADI ===== */
{ id:'pph21', cat:'pph21', em:'👔', t:'PPh Pasal 21 untuk karyawan', s:'Objek, tarif progresif, PTKP, biaya jabatan', h:`
<h3>PPh Pasal 21 untuk karyawan</h3>
<p>PPh 21 adalah pajak atas penghasilan yang diterima orang pribadi sehubungan dengan pekerjaan, jasa, atau kegiatan, seperti gaji, upah, honorarium, tunjangan, THR, bonus, dan pensiun. Pemberi kerja memotong dan menyetorkannya.</p>
<h4>Tarif Pasal 17 (orang pribadi)</h4>
<table><thead><tr><th>Penghasilan kena pajak setahun</th><th>Tarif</th></tr></thead><tbody>
<tr><td>sampai Rp60 juta</td><td>5%</td></tr><tr><td>Rp60 juta – Rp250 juta</td><td>15%</td></tr><tr><td>Rp250 juta – Rp500 juta</td><td>25%</td></tr><tr><td>Rp500 juta – Rp5 miliar</td><td>30%</td></tr><tr><td>di atas Rp5 miliar</td><td>35%</td></tr></tbody></table>
<h4>Langkah menghitung</h4>
<ol><li>Penghasilan bruto setahun.</li><li>Kurangi <strong>biaya jabatan</strong> 5% (maksimal Rp500.000 per bulan, Rp6 juta setahun) dan iuran pensiun/JHT yang dibayar pegawai.</li><li>Kurangi <strong>PTKP</strong> sesuai status.</li><li>Hasilnya <strong>PKP</strong> (dibulatkan ke bawah ribuan rupiah) dikalikan tarif progresif.</li></ol>
<h4>PTKP (PMK 101/2016, belum berubah per Oktober 2026)</h4>
<table><thead><tr><th>Status</th><th>PTKP/tahun</th></tr></thead><tbody>
<tr><td>TK/0</td><td>Rp54.000.000</td></tr><tr><td>K/0 atau TK/1</td><td>Rp58.500.000</td></tr><tr><td>Tambahan tiap tanggungan (maks. 3)</td><td>+Rp4.500.000</td></tr></tbody></table>
<p class="small muted">Rujukan: UU PPh jo. UU HPP 7/2021, PMK 101/2016, PMK 168/2023. Pemerintah dikabarkan mengkaji perubahan PTKP untuk tahun mendatang.</p>` },
{ id:'ter', cat:'pph21', em:'📅', t:'TER: tarif efektif rata-rata', s:'Kategori A/B/C, Januari–November, true-up Desember', badge:'PMK 168/2023', h:`
<h3>TER (Tarif Efektif Rata-rata)</h3>
<p>Sejak 1 Januari 2024, pemotongan PPh 21 bulanan untuk pegawai tetap memakai TER, yaitu penghasilan bruto bulan itu dikalikan tarif dari tabel. Tujuannya menyederhanakan pemotongan.</p>
<table><thead><tr><th>Kategori</th><th>Status PTKP</th></tr></thead><tbody>
<tr><td>A</td><td>TK/0, TK/1, K/0</td></tr><tr><td>B</td><td>TK/2, TK/3, K/1, K/2</td></tr><tr><td>C</td><td>K/3</td></tr></tbody></table>
<ul><li><strong>Januari–November:</strong> PPh 21 = penghasilan bruto bulan itu × tarif TER.</li><li><strong>Desember (masa pajak terakhir):</strong> dihitung ulang setahun penuh dengan tarif Pasal 17, lalu dikurangi potongan Januari–November. Bila berhenti kerja di tengah tahun, perhitungan akhir dilakukan pada masa pajak terakhir.</li><li><strong>THR dan bonus</strong> dimasukkan ke penghasilan bruto bulan diterimanya, sehingga potongan bulan itu bisa melonjak.</li><li>Pekerja harian dan sejenisnya punya TER harian tersendiri.</li></ul>
<div class="tip">Total pajak setahun tetap sama dengan perhitungan Pasal 17. TER hanya mengubah pembagian per bulan. Coba di Kalkulator → PPh 21 setahun.</div>
<p class="small muted">Rujukan: PP 58/2023, PMK 168/2023.</p>` },
{ id:'nonpeg', cat:'pph21', em:'💼', t:'PPh 21 non-pegawai (tenaga ahli)', s:'Freelancer, konsultan, dokter, pengacara', badge:'Penting', h:`
<h3>PPh 21 untuk bukan pegawai</h3>
<p>Penerima imbalan yang bukan pegawai, misalnya tenaga ahli, freelancer, atau konsultan, umumnya dipotong dengan dasar pengenaan <strong>50% dari penghasilan bruto</strong> dikalikan tarif Pasal 17. Pajak dihitung atas akumulasi dasar pengenaan dalam tahun yang sama.</p>
<ul><li>Pemotong menerbitkan bukti potong. Penerima mengkreditkannya di SPT Tahunan.</li><li>Skema bisa berbeda untuk penghasilan yang bersifat berkesinambungan. Periksa ketentuan di PMK 168/2023.</li><li>Orang pribadi yang menjalankan pekerjaan bebas melaporkan di SPT 1770 dan dapat menggunakan norma penghitungan atau pembukuan.</li></ul>
<div class="tip">Kalkulator PPh 21 non-pegawai tersedia di tab Kalkulator.</div>` },
{ id:'thr', cat:'pph21', em:'🎁', t:'THR, bonus & penghasilan tidak teratur', s:'Efek ke potongan bulanan', h:`
<h3>THR, bonus & penghasilan tidak teratur</h3>
<p>Dengan skema TER, THR, bonus, dan penghasilan sejenis digabung dengan gaji bulan diterimanya. Karena TER bersifat bertingkat, penghasilan bulan itu masuk ke lapisan tarif yang lebih tinggi, sehingga potongan bulan itu terasa besar.</p>
<ul><li>Total pajak setahun tidak bertambah karena skema ini. Selisih dibereskan pada Desember.</li><li>Pemberi kerja yang menanggung pajak karyawan (tunjangan pajak) memakai perhitungan gross up.</li></ul>
<p class="small muted">Untuk hak THR sebagai hak pekerja, lihat modul Hak, kontrak & negosiasi kerja.</p>` },

/* ===== POTPUT ===== */
{ id:'pph22', cat:'potput', em:'🛃', t:'PPh Pasal 22', s:'Impor, bendahara pemerintah, tertentu', h:`
<h3>PPh Pasal 22</h3>
<p>PPh 22 adalah pemungutan pajak di muka atas transaksi tertentu, dan umumnya dapat dikreditkan di SPT Tahunan.</p>
<table><thead><tr><th>Objek</th><th>Tarif umum</th></tr></thead><tbody>
<tr><td>Impor oleh importir ber-API</td><td>2,5% dari nilai impor</td></tr>
<tr><td>Impor oleh importir non-API</td><td>7,5% dari nilai impor</td></tr>
<tr><td>Impor barang yang tidak dikuasai</td><td>10% dari harga lelang</td></tr>
<tr><td>Pembelian oleh bendahara pemerintah dan BUMN tertentu</td><td>sekitar 1,5% dari harga pembelian (tanpa PPN)</td></tr></tbody></table>
<div class="warnbox">Tarif dan ambang batas dapat berubah. Cek PMK 41/2022 dan perubahannya sebelum dipakai dalam pekerjaan nyata.</div>` },
{ id:'pph23', cat:'potput', em:'🤝', t:'PPh Pasal 23', s:'Jasa 2%, dividen/bunga/royalti 15%', h:`
<h3>PPh Pasal 23</h3>
<p>PPh 23 dipotong oleh pemberi penghasilan (badan atau pihak tertentu) atas penghasilan yang diterima wajib pajak dalam negeri.</p>
<table><thead><tr><th>Objek</th><th>Tarif</th></tr></thead><tbody>
<tr><td>Dividen*, bunga, royalti, hadiah dan penghargaan</td><td>15% dari bruto</td></tr>
<tr><td>Sewa dan penggunaan harta (selain tanah/bangunan)</td><td>2% dari bruto</td></tr>
<tr><td>Jasa teknik, manajemen, konsultan, dan jasa lain (PMK 141/2015, lebih dari 30 jenis)</td><td>2% dari bruto</td></tr></tbody></table>
<ul><li>Dasar pengenaan adalah jumlah bruto <strong>tanpa PPN</strong>.</li><li>Setor paling lambat tanggal 10 dan lapor paling lambat tanggal 20 bulan berikutnya.</li><li>Bukti potong diterbitkan lewat sistem (e-Bupot, kini terintegrasi Coretax) dan menjadi kredit pajak bagi penerima.</li><li>*Dividen yang diterima badan dalam negeri dengan syarat tertentu dikecualikan.</li></ul>
<p class="small muted">Rujukan: UU PPh Pasal 23, PMK 141/2015.</p>` },
{ id:'pph26', cat:'potput', em:'🌍', t:'PPh Pasal 26', s:'Penghasilan wajib pajak luar negeri', h:`
<h3>PPh Pasal 26</h3>
<p>PPh 26 dikenakan atas penghasilan yang bersumber dari Indonesia dan diterima wajib pajak luar negeri, misalnya dividen, bunga, royalti, imbalan jasa, dan sewa.</p>
<ul><li>Tarif umum <strong>20%</strong> dari jumlah bruto.</li><li>Untuk bentuk usaha tetap (BUT), laba setelah pajak yang dibawa ke luar dikenai 20% (branch profit tax).</li><li>Tarif dapat lebih rendah bila ada <strong>P3B</strong> (tax treaty) dan penerima memenuhi syarat, termasuk menyampaikan DGT Form sebagai bukti domisili dan beneficial owner.</li></ul>
<p class="small muted">Rujukan: UU PPh Pasal 26, PER-25/PJ/2018.</p>` },
{ id:'pph42', cat:'potput', em:'🏠', t:'PPh Pasal 4 ayat (2): final', s:'Sewa, deposito, konstruksi, properti', badge:'Final', h:`
<h3>PPh Final Pasal 4 ayat (2)</h3>
<p>Penghasilan tertentu dikenai pajak yang bersifat <strong>final</strong>: tidak digabung dengan penghasilan lain dalam SPT Tahunan dan pajak yang dipotong tidak dapat dikreditkan.</p>
<table><thead><tr><th>Objek</th><th>Tarif umum</th></tr></thead><tbody>
<tr><td>Sewa tanah dan/atau bangunan</td><td>10% dari bruto</td></tr>
<tr><td>Bunga deposito dan tabungan</td><td>20% (ada ketentuan khusus untuk jumlah kecil)</td></tr>
<tr><td>Pengalihan hak atas tanah/bangunan</td><td>2,5% (ada tarif lebih rendah untuk rumah sederhana)</td></tr>
<tr><td>Jasa konstruksi: pelaksana usaha kecil</td><td>1,75%</td></tr>
<tr><td>Jasa konstruksi: pelaksana menengah/besar</td><td>2,65%</td></tr>
<tr><td>Jasa konstruksi: pelaksana tanpa kualifikasi</td><td>4%</td></tr>
<tr><td>Usaha UMKM tertentu</td><td>0,5% dari omzet (lihat topik UMKM)</td></tr></tbody></table>
<div class="warnbox">Tarif ini disederhanakan untuk belajar. Detail dan pengecualian ada di peraturan masing-masing, dan perlu dicek ke ketentuan terbaru.</div>` },
{ id:'pph25', cat:'potput', em:'📅', t:'PPh Pasal 25, 28A, dan 29', s:'Angsuran, kredit pajak, kurang/lebih bayar', h:`
<h3>PPh 25, 28A, dan 29</h3>
<ul><li><strong>PPh 25 (angsuran):</strong> pembayaran bulanan atas perkiraan pajak setahun. Umumnya = (PPh terutang tahun lalu − kredit pajak tahun lalu) ÷ 12.</li><li><strong>Kredit pajak:</strong> PPh yang sudah dipotong atau dipungut pihak lain (21, 22, 23) dan dibayar sendiri (25) yang mengurangi pajak terutang akhir tahun.</li><li><strong>PPh 29:</strong> kurang bayar. Disetor sebelum SPT Tahunan disampaikan.</li><li><strong>PPh 28A:</strong> lebih bayar. Dapat dikompensasikan atau dimintakan pengembalian (restitusi).</li></ul>
<p>Alur ringkas: pajak terutang setahun − seluruh kredit pajak = kurang bayar (29) atau lebih bayar (28A).</p>` },
{ id:'rekon', cat:'potput', em:'📊', t:'Rekonsiliasi fiskal & koreksi', s:'Dari laba akuntansi ke penghasilan kena pajak', h:`
<h3>Rekonsiliasi fiskal</h3>
<p>Laporan keuangan mengikuti standar akuntansi, sedangkan pajak mengikuti undang-undang perpajakan. Rekonsiliasi fiskal menjembataninya:</p>
<p><strong>Laba (rugi) komersial ± koreksi fiskal = penghasilan kena pajak.</strong></p>
<h4>Jenis koreksi</h4>
<ul><li><strong>Beda permanen:</strong> tidak akan berbalik. Contoh: biaya yang tidak boleh dikurangkan (bersifat pribadi, sanksi pajak), dan penghasilan yang sudah dikenai pajak final.</li><li><strong>Beda temporer (waktu):</strong> hanya berbeda saat pengakuan, misalnya penyusutan komersial dan fiskal.</li></ul>
<ul><li><strong>Koreksi positif</strong> menambah laba fiskal, <strong>koreksi negatif</strong> menguranginya.</li><li>Hasilnya dikalikan tarif PPh badan, lalu dikurangi kredit pajak.</li></ul>
<p class="small muted">Rujukan: UU PPh Pasal 6 (biaya yang boleh dikurangkan) dan Pasal 9 (yang tidak boleh).</p>` },

/* ===== PPN ===== */
{ id:'ppn', cat:'ppn', em:'🧾', t:'PPN: tarif 12%, efektif 11%', s:'DPP nilai lain 11/12 dan barang mewah', badge:'PMK 131/2024', h:`
<h3>PPN: tarif 12%, efektif 11%</h3>
<p>PPN adalah pajak atas konsumsi barang kena pajak (BKP) dan jasa kena pajak (JKP). Sejak 1 Januari 2025 tarif undang-undang adalah <strong>12%</strong>, tetapi untuk barang dan jasa non-mewah dipakai <strong>DPP nilai lain 11/12</strong> dari harga jual, sehingga beban efektifnya tetap <strong>11%</strong>.</p>
<table><thead><tr><th>Jenis</th><th>DPP</th><th>PPN</th></tr></thead><tbody>
<tr><td>BKP/JKP non-mewah</td><td>11/12 × harga jual</td><td>12% × DPP = 11% × harga</td></tr>
<tr><td>BKP mewah (kena PPnBM)</td><td>harga jual penuh</td><td>12% × harga</td></tr></tbody></table>
<p>Contoh Rp1.000.000: DPP = 11/12 × 1.000.000 = Rp916.667, lalu PPN = 12% × DPP = <strong>Rp110.000</strong>.</p>
<ul><li>DPP 11/12 hanya untuk menghitung <strong>PPN</strong>, bukan PPh.</li><li>PMK 11/2025 menyesuaikan perlakuan untuk barang/jasa yang sudah punya DPP nilai lain atau PPN besaran tertentu.</li><li>Ekspor BKP berwujud dikenai tarif 0%. Sebagian barang kebutuhan pokok, jasa kesehatan, pendidikan, dan lainnya dibebaskan.</li><li>Pengusaha dengan omzet di atas batas pengusaha kecil (Rp4,8 miliar setahun) wajib dikukuhkan sebagai PKP.</li></ul>
<p class="small muted">Rujukan: UU PPN jo. UU HPP 7/2021, PMK 131/2024, PMK 11/2025.</p>` },
{ id:'alurppn', cat:'ppn', em:'🔀', t:'Alur PPN: pajak masukan vs keluaran', s:'Mekanisme pengkreditan', h:`
<h3>Alur PPN: pajak masukan vs keluaran</h3>
<ul><li><strong>Pajak Keluaran (PK):</strong> PPN yang dipungut PKP saat menjual.</li><li><strong>Pajak Masukan (PM):</strong> PPN yang dibayar PKP saat membeli, dapat dikreditkan bila memenuhi syarat.</li></ul>
<p><strong>PPN kurang bayar = PK − PM.</strong> Bila PM lebih besar, kelebihan dikompensasikan ke masa berikutnya atau dimintakan restitusi.</p>
<ul><li>PM dikreditkan dengan faktur pajak yang sah dan sesuai syarat. Pada umumnya dikreditkan di masa pajak yang sama atau dalam batas waktu sesudahnya sesuai ketentuan.</li><li>PM atas pengeluaran yang tidak berhubungan dengan kegiatan usaha tidak dapat dikreditkan.</li></ul>
<div class="tip">Gunakan Kalkulator → PPN kurang/lebih bayar.</div>` },
{ id:'faktur', cat:'ppn', em:'📄', t:'Faktur pajak elektronik', s:'Kode transaksi, retur, pembatalan', h:`
<h3>Faktur pajak elektronik</h3>
<p>Faktur pajak dibuat PKP saat menyerahkan BKP/JKP dan kini diterbitkan lewat Coretax.</p>
<ul><li><strong>Kode transaksi</strong> menunjukkan jenis penyerahan. Penyerahan dengan DPP nilai lain 11/12 memakai kode <strong>04</strong>.</li><li>Faktur wajib memuat identitas penjual dan pembeli, uraian, harga, DPP, PPN, dan tanggal.</li><li><strong>Retur dan pembatalan:</strong> ada mekanisme faktur pajak pengganti atau nota retur yang mengoreksi PPN.</li><li>Simpan arsip faktur untuk pemeriksaan dan rekonsiliasi.</li></ul>` },
{ id:'ppnbm', cat:'ppn', em:'💎', t:'PPnBM: pajak barang mewah', s:'Dikenakan sekali, tarif bertingkat', h:`
<h3>PPnBM</h3>
<p>Pajak Penjualan atas Barang Mewah dikenakan <strong>sekali</strong> pada saat penyerahan oleh pabrikan atau impor, selain PPN. Tarifnya bertingkat menurut jenis barang, dengan batas maksimum menurut undang-undang sampai 200%.</p>
<ul><li>Untuk kendaraan bermotor, tarifnya diatur lebih lanjut dengan mempertimbangkan antara lain emisi dan konsumsi bahan bakar (PP 73/2019 dan perubahannya).</li><li>Barang yang dikenai PPnBM dikenai PPN 12% atas DPP penuh.</li></ul>` },

/* ===== BADAN ===== */
{ id:'pphbadan', cat:'badan', em:'🏢', t:'PPh badan: tarif & Pasal 31E', s:'22%, fasilitas pengurangan tarif, kompensasi rugi', h:`
<h3>PPh badan</h3>
<ul><li><strong>Tarif umum:</strong> 22%.</li><li><strong>Perusahaan terbuka</strong> yang memenuhi syarat (misalnya saham yang diperdagangkan minimal 40% dan syarat lain) mendapat tarif lebih rendah, yaitu 3 poin persentase (19%).</li><li><strong>Pasal 31E:</strong> badan dengan omzet sampai Rp50 miliar mendapat pengurangan tarif 50% (efektif 11%) atas bagian penghasilan kena pajak dari omzet sampai Rp4,8 miliar.</li><li><strong>Kompensasi kerugian fiskal:</strong> dapat dikompensasikan ke tahun-tahun berikutnya paling lama 5 tahun.</li></ul>
<h4>Rumus Pasal 31E (omzet antara Rp4,8 miliar dan Rp50 miliar)</h4>
<p>Bagian PKP berfasilitas = (Rp4,8 miliar ÷ omzet) × PKP. Bagian itu dikenai tarif 11%, sisanya 22%. Bila omzet sampai Rp4,8 miliar, seluruh PKP berfasilitas.</p>
<p class="small muted">Rujukan: UU PPh Pasal 17 dan 31E jo. UU HPP 7/2021. Hitung di Kalkulator → PPh badan.</p>` },
{ id:'umkm', cat:'badan', em:'🛵', t:'Pajak UMKM terbaru', s:'PPh final 0,5% permanen untuk OP dan PT Perorangan', badge:'Baru 2026', h:`
<h3>Pajak UMKM terbaru</h3>
<div class="tip"><strong>Pembaruan 2026:</strong> PP 20/2026 (diundangkan 22 April 2026) mengubah PP 55/2022. Batas waktu pemanfaatan PPh final 0,5% bagi orang pribadi dihapus, dan penerima fasilitas difokuskan.</div>
<table><thead><tr><th>Hal</th><th>Ketentuan</th></tr></thead><tbody>
<tr><td>Tarif</td><td>0,5% dari omzet bruto</td></tr>
<tr><td>Batas omzet</td><td>sampai Rp4,8 miliar per tahun</td></tr>
<tr><td>WP orang pribadi</td><td>Omzet sampai Rp500 juta setahun tidak dikenai PPh</td></tr>
<tr><td>Penerima fasilitas</td><td>WP orang pribadi dan PT perorangan (juga koperasi dengan batas waktu); badan usaha lain mendapat masa transisi</td></tr>
<tr><td>Batas waktu untuk orang pribadi</td><td>Dihapus, berlaku selama syarat omzet terpenuhi</td></tr>
<tr><td>Dikecualikan</td><td>Pekerjaan bebas dan jasa profesi tertentu (misalnya tenaga ahli, industri kreatif dan hiburan) memakai tarif normal</td></tr></tbody></table>
<ul><li>Pecah usaha menjadi beberapa entitas untuk memperoleh fasilitas dipersempit oleh aturan baru.</li><li>Kewajiban tetap: menghitung omzet bulanan, membayar PPh final paling lambat tanggal 15 bulan berikutnya, dan melapor.</li></ul>
<div class="warnbox">Detail transisi bergantung pada jenis badan dan tahun mulai memakai fasilitas. Baca PP 20/2026 atau tanyakan ke KPP sebelum memutuskan.</div>
<p class="small muted">Rujukan: PP 55/2022 s.t.d.d. PP 20/2026; pengumuman DJP dan Kementerian UMKM.</p>` },
{ id:'aset', cat:'badan', em:'🏗️', t:'Aset tetap & penyusutan fiskal', s:'Kelompok harta, garis lurus, saldo menurun', h:`
<h3>Aset tetap & penyusutan fiskal</h3>
<p>Harta berwujud yang masa manfaatnya lebih dari satu tahun disusutkan menurut kelompok yang ditetapkan undang-undang. Tanah tidak disusutkan.</p>
<table><thead><tr><th>Kelompok</th><th>Masa manfaat</th><th>Garis lurus</th><th>Saldo menurun</th></tr></thead><tbody>
<tr><td>Kelompok 1</td><td>4 tahun</td><td>25%</td><td>50%</td></tr><tr><td>Kelompok 2</td><td>8 tahun</td><td>12,5%</td><td>25%</td></tr>
<tr><td>Kelompok 3</td><td>16 tahun</td><td>6,25%</td><td>12,5%</td></tr><tr><td>Kelompok 4</td><td>20 tahun</td><td>5%</td><td>10%</td></tr>
<tr><td>Bangunan permanen</td><td>20 tahun</td><td>5%</td><td>-</td></tr><tr><td>Bangunan tidak permanen</td><td>10 tahun</td><td>10%</td><td>-</td></tr></tbody></table>
<ul><li>Pada saldo menurun, tarif dikalikan nilai buku fiskal, dan sisa nilai buku dibebankan penuh di tahun terakhir.</li><li>Perbedaan dengan penyusutan akuntansi menimbulkan koreksi fiskal.</li></ul>
<p class="small muted">Rujukan: UU PPh Pasal 11. Hitung di Kalkulator → Penyusutan fiskal.</p>` },

/* ===== INVEST ===== */
{ id:'saham', cat:'invest', em:'📈', t:'Pajak saham & dividen', s:'PPh final transaksi saham', h:`
<h3>Pajak saham & dividen</h3>
<ul><li>Penjualan saham di bursa dikenai PPh final <strong>0,1%</strong> dari nilai transaksi penjualan, dipotong oleh perusahaan efek. Tidak peduli untung atau rugi.</li><li><strong>Dividen:</strong> perlakuannya tergantung penerimanya. Untuk orang pribadi dalam negeri ada ketentuan pengecualian bila diinvestasikan kembali di Indonesia dan skema final bila tidak. Untuk badan, sering dikecualikan dengan syarat. Periksa ketentuan terkini.</li></ul>
<div class="warnbox">Ini informasi edukasi, bukan saran investasi atau pajak personal.</div>` },
{ id:'kripto', cat:'invest', em:'₿', t:'Pajak kripto (PMK 50/2025)', s:'PPh 22 final 0,21% dan 1%, tanpa PPN', badge:'Diperbarui', h:`
<h3>Pajak kripto</h3>
<p>Sejak <strong>1 Agustus 2025</strong>, PMK 50/2025 menggantikan skema lama (PMK 68/2022). Aset kripto diperlakukan seperti aset keuangan sejenis surat berharga, sehingga <strong>tidak dikenai PPN</strong> dan penghasilannya dikenai PPh Pasal 22 final.</p>
<table><thead><tr><th>Transaksi</th><th>PPh 22 final</th></tr></thead><tbody>
<tr><td>Jual lewat penyelenggara perdagangan (PPMSE) dalam negeri</td><td>0,21% dari nilai transaksi</td></tr>
<tr><td>Jual lewat PPMSE luar negeri</td><td>1% dari nilai transaksi</td></tr></tbody></table>
<ul><li>Pemungutan oleh penyelenggara domestik. Untuk platform luar negeri, ada penunjukan pemungut atau penyetoran sendiri.</li><li>Karena final, kerugian transaksi tidak mengurangi penghasilan lain.</li><li>Penambangan (mining) memakai ketentuan tersendiri: PPh dengan tarif umum mulai tahun pajak 2026 dan PPN dengan besaran tertentu.</li></ul>
<p class="small muted">Rujukan: PMK 50/2025, PMK 53/2025, PMK 54/2025.</p>` },
{ id:'freelance', cat:'invest', em:'🧑‍💻', t:'Freelancer & kreator konten', s:'Norma, pembukuan, SPT 1770', badge:'Sering ditanya', h:`
<h3>Freelancer & kreator konten</h3>
<p>Penghasilan dari pekerjaan bebas (desainer, penulis, konsultan, pembuat konten) umumnya dilaporkan di SPT Tahunan orang pribadi.</p>
<ul><li><strong>Norma penghitungan penghasilan neto (NPPN):</strong> tersedia untuk orang pribadi dengan peredaran bruto sampai Rp4,8 miliar. Penghasilan neto dihitung dari persentase tertentu terhadap omzet menurut jenis usaha.</li><li><strong>Pembukuan:</strong> bila memilih atau wajib.</li><li>Penghasilan kena pajak setelah PTKP dikenai tarif Pasal 17.</li><li>Potongan PPh 21 atau PPh 23 dari klien adalah <strong>kredit pajak</strong> di SPT.</li><li>Setelah PP 20/2026, pekerjaan bebas dan jasa profesi tertentu tidak lagi dapat memakai PPh final UMKM 0,5%.</li></ul>
<p class="small muted">Rujukan: UU PPh Pasal 14, PMK 168/2023, PP 20/2026.</p>` },

/* ===== DAERAH ===== */
{ id:'pbb', cat:'daerah', em:'🏠', t:'PBB, BPHTB & pajak kendaraan', s:'Pajak daerah menurut UU HKPD', h:`
<h3>PBB, BPHTB & pajak kendaraan</h3>
<ul><li><strong>PBB perdesaan/perkotaan:</strong> pajak daerah atas bumi dan bangunan berdasarkan NJOP. Tarif maksimum ditetapkan UU HKPD (0,5%) dan diatur lebih rinci oleh perda.</li><li><strong>BPHTB:</strong> pajak atas perolehan hak tanah dan bangunan. Tarif paling tinggi 5% dikalikan (NPOP − NPOPTKP).</li><li><strong>PKB dan BBNKB:</strong> pajak kendaraan bermotor dan bea balik nama kendaraan. Tarif, termasuk opsen, diatur UU HKPD dan perda tiap provinsi.</li></ul>
<div class="tip">Tarif daerah berbeda-beda. Gunakan layanan resmi pemda atau Samsat untuk angka terkini.</div>
<p class="small muted">Rujukan: UU HKPD 1/2022.</p>` },
{ id:'meterai', cat:'daerah', em:'📜', t:'Bea meterai Rp10.000', s:'Dokumen yang kena, e-Meterai', badge:'Sering salah', h:`
<h3>Bea meterai</h3>
<p>Sejak 2021, bea meterai berlaku tarif tunggal <strong>Rp10.000</strong> (UU 10/2020).</p>
<ul><li><strong>Dokumen yang dikenai:</strong> surat perjanjian, akta notaris, surat berharga tertentu, dan dokumen yang menyebut nominal uang di atas Rp5 juta.</li><li>Tersedia <strong>e-Meterai</strong> (PMK 134/2021) yang dibubuhkan secara digital.</li><li>Dokumen yang belum bermeterai tidak otomatis batal, tetapi harus dimeteraikan kemudian bila dijadikan alat bukti.</li></ul>` },

/* ===== ADVANCED ===== */
{ id:'tp', cat:'adv', em:'🔗', t:'Transfer pricing', s:'Arm\'s length, TP Doc, CbCR', badge:'Lanjutan', h:`
<h3>Transfer pricing</h3>
<p>Transaksi antar pihak yang mempunyai hubungan istimewa harus mengikuti prinsip kewajaran dan kelaziman usaha (<em>arm's length principle</em>).</p>
<ul><li><strong>Metode:</strong> CUP, harga jual kembali, biaya-plus, pembagian laba, dan TNMM.</li><li><strong>Dokumentasi:</strong> Master File, Local File, dan CbCR untuk kelompok usaha yang memenuhi ambang tertentu.</li><li><strong>Analisis kesebandingan</strong> memilih perusahaan pembanding dan menyesuaikan perbedaan fungsi, aset, dan risiko.</li></ul>
<p class="small muted">Rujukan: PMK 172/2023. Ambang dan tenggat dokumentasi perlu dicek di ketentuan terbaru.</p>` },
{ id:'sengketa', cat:'adv', em:'⚖️', t:'Manajemen sengketa pajak', s:'Pemeriksaan, keberatan, banding, PK', badge:'Lanjutan', h:`
<h3>Manajemen sengketa pajak</h3>
<ol><li><strong>Pemeriksaan:</strong> pemeriksa menyampaikan temuan (SPHP), wajib pajak menanggapi dalam pembahasan akhir.</li><li><strong>Surat ketetapan</strong> (SKPKB, SKPLB, dan lainnya) diterbitkan.</li><li><strong>Keberatan</strong> ke DJP, diajukan paling lama 3 bulan sejak surat ketetapan dikirim.</li><li><strong>Banding</strong> ke Pengadilan Pajak, diajukan paling lama 3 bulan sejak keputusan keberatan diterima.</li><li><strong>Peninjauan Kembali</strong> ke Mahkamah Agung bila ada syarat yang terpenuhi.</li></ol>
<div class="tip">Perhatikan kewajiban pembayaran sebagian dan batas waktu. Telat satu hari bisa menggugurkan hak.</div>` },
{ id:'intl', cat:'adv', em:'🌍', t:'Pajak internasional & pajak minimum global', s:'P3B, BUT, beneficial owner, Pillar Two', badge:'Lanjutan', h:`
<h3>Pajak internasional</h3>
<ul><li><strong>P3B (tax treaty):</strong> membagi hak pemajakan dan dapat menurunkan tarif pemotongan, dengan syarat penerima adalah pemilik manfaat (beneficial owner).</li><li><strong>BUT:</strong> kegiatan usaha tetap di Indonesia oleh entitas luar negeri yang menimbulkan kewajiban pajak.</li><li><strong>CFC:</strong> aturan penghasilan dari perusahaan asing yang dikendalikan.</li><li><strong>Pajak minimum global (Pillar Two):</strong> pajak minimum efektif 15% untuk kelompok usaha multinasional besar, yang mulai diterapkan di Indonesia lewat ketentuan terbaru (antara lain PMK 136/2024).</li></ul>
<p class="small muted">Periksa detail penerapan tiap tahun pajak.</p>` },
{ id:'psak', cat:'adv', em:'📊', t:'Akuntansi pajak penghasilan', s:'Pajak tangguhan, beda temporer', badge:'Lanjutan', h:`
<h3>Akuntansi pajak penghasilan</h3>
<p>Standar akuntansi pajak penghasilan (PSAK 212, sebelumnya PSAK 46) mengatur pengakuan pajak kini dan pajak tangguhan.</p>
<ul><li><strong>Aset pajak tangguhan:</strong> pajak yang akan dapat dikurangkan di masa depan karena beda temporer atau kompensasi rugi.</li><li><strong>Liabilitas pajak tangguhan:</strong> pajak yang akan terutang di masa depan.</li><li><strong>Tarif efektif</strong> = beban pajak total ÷ laba sebelum pajak. Selisih dengan tarif statutori dijelaskan dalam rekonsiliasi tarif.</li></ul>` },
{ id:'fasilitas', cat:'adv', em:'🎁', t:'Fasilitas perpajakan', s:'Tax holiday, tax allowance, super deduction', badge:'Lanjutan', h:`
<h3>Fasilitas perpajakan</h3>
<ul><li><strong>Tax holiday:</strong> pembebasan atau pengurangan PPh badan untuk periode tertentu pada industri pionir.</li><li><strong>Tax allowance:</strong> pengurangan penghasilan neto, penyusutan dipercepat, dan lainnya untuk bidang usaha tertentu.</li><li><strong>Super tax deduction:</strong> pengurangan penghasilan bruto tambahan untuk kegiatan vokasi dan litbang.</li></ul>
<p class="small muted">Syarat dan besaran berubah sesuai peraturan. Cek sebelum merencanakan.</p>` }
];

/* ---------- Tarif ringkas untuk chip di atas ---------- */
const TAX_RATES = [
  ['5–35%','PPh 21 (Pasal 17)','--c2'], ['2% / 15%','PPh 23','--c6'], ['20%','PPh 26','--c5'],
  ['12% (11% efektif)','PPN','--c8'], ['22%','PPh badan','--c3'], ['0,5%','PPh final UMKM','--c4'],
  ['10%','Final sewa tanah/bangunan','--c1'], ['0,21%','Kripto (PPMSE dalam negeri)','--c7']
];

/* ---------- Glosarium ---------- */
const GL_CATS = { umum:'Umum', pph:'PPh', ppn:'PPN', admin:'Administrasi', hukum:'Hukum', intl:"Internasional", digital:'Digital' };
const GLOSSARY = [
['Wajib Pajak (WP)','umum','Orang pribadi atau badan yang hak dan kewajiban perpajakannya diatur undang-undang, termasuk pemungut dan pemotong.'],
['Subjek pajak','umum','Pihak yang dapat dikenai pajak, seperti orang pribadi, badan, warisan yang belum terbagi.'],
['Objek pajak','umum','Penghasilan atau transaksi yang menjadi dasar pengenaan pajak.'],
['DJP','admin','Direktorat Jenderal Pajak, unit Kementerian Keuangan yang mengelola pajak pusat.'],
['KPP','admin','Kantor Pelayanan Pajak tempat wajib pajak terdaftar.'],
['NPWP','admin','Nomor Pokok Wajib Pajak. Untuk orang pribadi dalam negeri berfungsi dengan NIK.'],
['NIK','admin','Nomor Induk Kependudukan, kini berfungsi sebagai identitas pajak orang pribadi.'],
['Coretax','digital','Sistem inti administrasi perpajakan DJP yang berjalan sejak awal 2025.'],
['e-Bupot','digital','Aplikasi pembuatan bukti potong, kini terintegrasi dalam Coretax.'],
['e-Faktur','digital','Faktur pajak elektronik yang dibuat PKP, kini melalui Coretax.'],
['Kode billing','admin','Kode untuk pembayaran pajak melalui bank atau kanal pembayaran.'],
['SPT','admin','Surat Pemberitahuan, sarana melaporkan penghitungan dan pembayaran pajak.'],
['SPT Masa','admin','Laporan pajak untuk satu masa pajak, biasanya bulanan.'],
['SPT Tahunan','admin','Laporan pajak penghasilan untuk satu tahun pajak.'],
['Pembetulan SPT','admin','Perbaikan SPT yang sudah disampaikan bila ada kesalahan.'],
['Masa pajak','admin','Jangka waktu satu bulan kalender untuk pajak yang dilaporkan bulanan.'],
['Tahun pajak','admin','Jangka waktu satu tahun kalender untuk perhitungan pajak tahunan.'],
['Restitusi','admin','Pengembalian kelebihan pembayaran pajak kepada wajib pajak.'],
['Kompensasi','admin','Memindahkan kelebihan pembayaran pajak ke masa atau tahun pajak berikutnya.'],
['PPh','pph','Pajak Penghasilan, dikenakan atas penghasilan yang diterima atau diperoleh.'],
['PPh 21','pph','Pajak atas penghasilan sehubungan dengan pekerjaan, jasa, atau kegiatan orang pribadi.'],
['PPh 22','pph','Pemungutan pajak di muka atas impor dan transaksi tertentu.'],
['PPh 23','pph','Pemotongan atas dividen, bunga, royalti, sewa, dan jasa tertentu.'],
['PPh 24','pph','Kredit atas pajak yang dibayar di luar negeri.'],
['PPh 25','pph','Angsuran pajak penghasilan tiap bulan.'],
['PPh 26','pph','Pemotongan atas penghasilan wajib pajak luar negeri, umumnya 20%.'],
['PPh 29','pph','Kekurangan pembayaran PPh pada akhir tahun pajak.'],
['PPh final','pph','Pajak yang tuntas pada pemotongan atau pembayaran, tidak digabung dalam penghasilan lain.'],
['PTKP','pph','Penghasilan Tidak Kena Pajak, pengurang penghasilan neto orang pribadi.'],
['PKP (penghasilan)','pph','Penghasilan kena pajak: dasar mengalikan tarif PPh.'],
['TER','pph','Tarif efektif rata-rata untuk pemotongan PPh 21 bulanan.'],
['Biaya jabatan','pph','Pengurang 5% dari penghasilan bruto pegawai, maksimal Rp6 juta setahun.'],
['Gross up','pph','Menambah penghasilan sebesar pajak yang ditanggung pemberi kerja.'],
['Natura','pph','Imbalan dalam bentuk barang atau fasilitas, bukan uang.'],
['Bukti potong','pph','Dokumen bukti pemotongan pajak yang dapat menjadi kredit pajak penerima.'],
['Kredit pajak','pph','Pajak yang sudah dibayar atau dipotong yang mengurangi pajak terutang.'],
['Rekonsiliasi fiskal','pph','Penyesuaian laba komersial menjadi penghasilan kena pajak.'],
['Koreksi positif','pph','Koreksi fiskal yang menambah laba fiskal.'],
['Koreksi negatif','pph','Koreksi fiskal yang mengurangi laba fiskal.'],
['Beda permanen','pph','Perbedaan akuntansi dan pajak yang tidak berbalik di masa depan.'],
['Beda temporer','pph','Perbedaan waktu pengakuan antara akuntansi dan pajak.'],
['NPPN','pph','Norma Penghitungan Penghasilan Neto untuk orang pribadi pengusaha atau pekerja bebas.'],
['Penyusutan fiskal','pph','Pembebanan harga perolehan aset tetap menurut aturan pajak.'],
['Kompensasi rugi','pph','Kerugian fiskal yang dikurangkan dari laba tahun berikutnya, maksimal 5 tahun.'],
['Pasal 31E','pph','Fasilitas pengurangan tarif 50% PPh badan untuk omzet tertentu.'],
['PPN','ppn','Pajak Pertambahan Nilai atas konsumsi BKP dan JKP.'],
['BKP','ppn','Barang Kena Pajak.'],
['JKP','ppn','Jasa Kena Pajak.'],
['PKP','ppn','Pengusaha Kena Pajak: pengusaha yang wajib memungut PPN.'],
['DPP','ppn','Dasar Pengenaan Pajak: nilai yang dikalikan tarif.'],
['DPP nilai lain','ppn','DPP berupa nilai selain harga jual, misalnya 11/12 dari harga jual.'],
['Pajak Keluaran (PK)','ppn','PPN yang dipungut PKP atas penyerahan.'],
['Pajak Masukan (PM)','ppn','PPN yang dibayar PKP atas perolehan.'],
['Faktur pajak','ppn','Bukti pungutan PPN yang dibuat PKP.'],
['PPnBM','ppn','Pajak Penjualan atas Barang Mewah.'],
['Pengusaha kecil','ppn','Pengusaha dengan omzet setahun di bawah batas tertentu (Rp4,8 miliar), tidak wajib PKP.'],
['PBB','umum','Pajak Bumi dan Bangunan.'],
['BPHTB','umum','Bea Perolehan Hak atas Tanah dan Bangunan.'],
['NJOP','umum','Nilai Jual Objek Pajak, dasar PBB.'],
['PKB','umum','Pajak Kendaraan Bermotor.'],
['BBNKB','umum','Bea Balik Nama Kendaraan Bermotor.'],
['PB1','umum','Pajak barang dan jasa tertentu atas hotel, restoran, hiburan, parkir (pajak daerah).'],
['Bea meterai','umum','Pajak atas dokumen tertentu, tarif Rp10.000.'],
['UU KUP','hukum','Undang-Undang Ketentuan Umum dan Tata Cara Perpajakan.'],
['UU HPP','hukum','Undang-Undang Harmonisasi Peraturan Perpajakan (7/2021).'],
['UU HKPD','hukum','Undang-Undang Hubungan Keuangan Pusat dan Daerah (1/2022).'],
['PMK','hukum','Peraturan Menteri Keuangan, aturan pelaksana pajak.'],
['PP','hukum','Peraturan Pemerintah.'],
['SKPKB','hukum','Surat Ketetapan Pajak Kurang Bayar.'],
['SKPLB','hukum','Surat Ketetapan Pajak Lebih Bayar.'],
['SPHP','hukum','Surat Pemberitahuan Hasil Pemeriksaan.'],
['Keberatan','hukum','Upaya hukum atas surat ketetapan yang diajukan ke DJP.'],
['Banding','hukum','Upaya hukum ke Pengadilan Pajak atas keputusan keberatan.'],
['Peninjauan Kembali','hukum','Upaya hukum luar biasa ke Mahkamah Agung.'],
['Tax evasion','hukum','Penggelapan pajak secara melawan hukum.'],
['Tax avoidance','hukum','Perencanaan pajak yang memanfaatkan celah aturan tanpa melanggar hukum secara formal.'],
['Bukper','hukum','Bukti Permulaan, tahap awal penyidikan tindak pidana perpajakan.'],
['P3B','intl','Persetujuan Penghindaran Pajak Berganda (tax treaty).'],
['BUT','intl','Bentuk Usaha Tetap.'],
['Beneficial owner','intl','Pemilik manfaat sebenarnya atas penghasilan.'],
['DGT Form','intl','Formulir domisili untuk klaim manfaat P3B.'],
['Transfer pricing','intl','Penetapan harga transaksi antar pihak berelasi.'],
['Arm\'s length','intl','Prinsip kewajaran: harga seperti antara pihak independen.'],
['Master File','intl','Dokumen induk kelompok usaha dalam dokumentasi TP.'],
['Local File','intl','Dokumen rinci transaksi afiliasi wajib pajak lokal.'],
['CbCR','intl','Country-by-Country Report, laporan per negara kelompok multinasional.'],
['Pillar Two','intl','Pajak minimum global 15% untuk grup multinasional besar.'],
['PMSE','digital','Perdagangan Melalui Sistem Elektronik.'],
['Sertifikat elektronik','digital','Tanda tangan digital yang dipakai untuk menandatangani dokumen perpajakan elektronik.']
];

/* ---------- Referensi peraturan ---------- */
const TAX_REFS = [
['UU PPh','UU 7/1983 s.t.d.d. UU 36/2008 jo. UU HPP 7/2021'],
['UU PPN','UU 8/1983 s.t.d.d. UU 42/2009 jo. UU HPP 7/2021'],
['UU KUP','UU 6/1983 s.t.d.d. UU 28/2007 jo. UU HPP 7/2021'],
['UU HKPD','UU 1/2022: pajak daerah'],
['UU Bea Meterai','UU 10/2020; e-Meterai: PMK 134/2021'],
['PMK 81/2024','Ketentuan umum dan tata cara perpajakan, Coretax (berlaku 1 Jan 2025)'],
['PMK 131/2024','DPP nilai lain PPN (efektif 11% untuk non-mewah)'],
['PMK 11/2025','Penyesuaian DPP nilai lain dan PPN besaran tertentu'],
['PMK 168/2023 & PP 58/2023','TER PPh Pasal 21 (berlaku Januari 2024)'],
['PMK 101/2016','PTKP orang pribadi'],
['PMK 141/2015','Jenis jasa PPh Pasal 23'],
['PMK 172/2023','Transfer pricing / penerapan prinsip kewajaran'],
['PMK 50/2025','Pajak atas perdagangan aset kripto (berlaku 1 Agt 2025)'],
['PP 55/2022 s.t.d.d. PP 20/2026','PPh final UMKM 0,5%, berlaku tanpa batas waktu untuk OP'],
['PER-25/PJ/2018','DGT Form dan klaim manfaat P3B']
];

/* ---------- Kalkulator ---------- */
const PTKP_OPTS = Object.keys(PTKP).map(k => [k, k + ' (Rp' + Math.round(PTKP[k] / 1e6 * 10) / 10 + ' jt)']);
const CALCS = [
{ id:'ter', g:'PPh 21', t:'PPh 21 bulanan (TER)', d:'Potongan bulanan Januari–November untuk pegawai tetap.',
  f:[{k:'gross',l:'Penghasilan bruto sebulan (Rp)',type:'money',def:12000000},{k:'ptkp',l:'Status PTKP',type:'select',opts:PTKP_OPTS,def:'TK/0'}],
  run:v=>{ const cat=TER_CAT[v.ptkp], r=terRate(cat,v.gross); return [{l:'Kategori TER',s:cat},{l:'Tarif TER',s:r+'%'},{l:'PPh 21 bulan ini',v:v.gross*r/100,big:true},{l:'Gaji setelah pajak',v:v.gross-v.gross*r/100}]; } },
{ id:'terth', g:'PPh 21', t:'PPh 21 setahun: TER + Desember', d:'Membandingkan potongan Januari–November dan penyesuaian masa pajak terakhir.',
  f:[{k:'gross',l:'Penghasilan bruto sebulan, tetap (Rp)',type:'money',def:12000000},{k:'bonus',l:'Bonus/THR setahun, diterima di Desember (Rp)',type:'money',def:0},{k:'other',l:'Iuran pensiun/JHT pegawai setahun (Rp)',type:'money',def:0},{k:'ptkp',l:'Status PTKP',type:'select',opts:PTKP_OPTS,def:'TK/0'}],
  run:v=>{ const cat=TER_CAT[v.ptkp], r=terRate(cat,v.gross)/100, m=v.gross*r, ter11=m*11, ag=v.gross*12+v.bonus, jab=Math.min(ag*.05,6e6), neto=Math.max(0,ag-jab-v.other), pkp=Math.max(0,Math.floor((neto-PTKP[v.ptkp])/1000)*1000), p=pasal17(pkp), dec=Math.max(0,p.tax-ter11);
    return [{l:'Kategori TER · tarif',s:cat+' · '+(r*100)+'%'},{l:'Potongan tiap bulan Jan–Nov',v:m},{l:'Total Jan–Nov (11 bulan)',v:ter11},{l:'Penghasilan bruto setahun',v:ag},{l:'Biaya jabatan',v:jab},{l:'PKP (setelah PTKP)',v:pkp},{l:'PPh 21 terutang setahun (Pasal 17)',v:p.tax},{l:'Potongan Desember (penyesuaian)',v:dec,big:true},{l:'Total dipotong setahun',v:ter11+dec}]; } },
{ id:'p17', g:'PPh 21', t:'PPh 21 tahunan (Pasal 17)', d:'Simulasi tarif progresif orang pribadi dengan PTKP.',
  f:[{k:'gross',l:'Penghasilan bruto setahun (Rp)',type:'money',def:144000000},{k:'other',l:'Iuran pensiun/JHT pegawai setahun (Rp)',type:'money',def:0},{k:'ptkp',l:'Status PTKP',type:'select',opts:PTKP_OPTS,def:'TK/0'}],
  run:v=>{ const jab=Math.min(v.gross*.05,6e6), neto=Math.max(0,v.gross-jab-v.other), pkp=Math.max(0,Math.floor((neto-PTKP[v.ptkp])/1000)*1000), p=pasal17(pkp);
    const rows=[{l:'Biaya jabatan (5%, maks Rp6 jt)',v:jab},{l:'Penghasilan neto',v:neto},{l:'PTKP '+v.ptkp,v:PTKP[v.ptkp]},{l:'PKP',v:pkp}];
    p.det.forEach(d=>rows.push({l:Math.round(d[0]*100)+'% × '+Math.round(d[1]).toLocaleString('id-ID'),v:d[2]}));
    rows.push({l:'PPh 21 terutang setahun',v:p.tax,big:true},{l:'Rata-rata per bulan',v:p.tax/12}); return rows; } },
{ id:'nonpeg', g:'PPh 21', t:'PPh 21 non-pegawai', d:'DPP 50% dari bruto dikali tarif Pasal 17 atas akumulasi. Penyederhanaan edukasi.',
  f:[{k:'gross',l:'Imbalan bruto kali ini (Rp)',type:'money',def:10000000},{k:'cum',l:'Akumulasi DPP sebelumnya tahun ini (Rp)',type:'money',def:0}],
  run:v=>{ const dpp=v.gross*.5, tax=pasal17(v.cum+dpp).tax-pasal17(v.cum).tax; return [{l:'DPP (50% × bruto)',v:dpp},{l:'PPh 21 dipotong',v:tax,big:true},{l:'Imbalan diterima bersih',v:v.gross-tax}]; } },
{ id:'p23', g:'PPh potput', t:'PPh 23', d:'Jasa dan sewa 2%, dividen/bunga/royalti/hadiah 15%.',
  f:[{k:'amt',l:'Penghasilan bruto tanpa PPN (Rp)',type:'money',def:5000000},{k:'rate',l:'Tarif',type:'select',opts:[['2','2% (jasa, sewa)'],['15','15% (dividen, bunga, royalti, hadiah)']],def:'2'}],
  run:v=>{ const r=Number(v.rate), t=v.amt*r/100; return [{l:'PPh 23 ('+r+'%)',v:t,big:true},{l:'Diterima setelah dipotong',v:v.amt-t}]; } },
{ id:'p22', g:'PPh potput', t:'PPh 22 impor', d:'Pemungutan atas impor. Cek tarif terbaru.',
  f:[{k:'amt',l:'Nilai impor (Rp)',type:'money',def:100000000},{k:'rate',l:'Jenis importir',type:'select',opts:[['2.5','Ber-API (2,5%)'],['7.5','Non-API (7,5%)'],['10','Tidak dikuasai (10%)']],def:'2.5'}],
  run:v=>{ const r=Number(v.rate); return [{l:'PPh 22 ('+String(r).replace('.',',')+'%)',v:v.amt*r/100,big:true}]; } },
{ id:'p42', g:'PPh potput', t:'PPh final Pasal 4(2)', d:'Sewa, bunga, konstruksi, properti.',
  f:[{k:'amt',l:'Jumlah bruto (Rp)',type:'money',def:50000000},{k:'rate',l:'Objek',type:'select',opts:[['10','Sewa tanah/bangunan (10%)'],['20','Bunga deposito/tabungan (20%)'],['2.5','Pengalihan tanah/bangunan (2,5%)'],['1.75','Konstruksi: pelaksana kecil (1,75%)'],['2.65','Konstruksi: menengah/besar (2,65%)'],['4','Konstruksi: tanpa kualifikasi (4%)']],def:'10'}],
  run:v=>{ const r=Number(v.rate); return [{l:'PPh final ('+String(r).replace('.',',')+'%)',v:v.amt*r/100,big:true},{l:'Diterima bersih',v:v.amt-v.amt*r/100}]; } },
{ id:'p26', g:'PPh potput', t:'PPh 26', d:'20% atau tarif P3B bila memenuhi syarat.',
  f:[{k:'amt',l:'Jumlah bruto (Rp)',type:'money',def:100000000},{k:'rate',l:'Tarif (%)',type:'num',def:20}],
  run:v=>[{l:'PPh 26 ('+v.rate+'%)',v:v.amt*v.rate/100,big:true},{l:'Diterima bersih',v:v.amt-v.amt*v.rate/100}] },
{ id:'ppn', g:'PPN', t:'PPN dasar & DPP nilai lain', d:'Tarif 12%. Non-mewah memakai DPP 11/12, mewah DPP penuh.',
  f:[{k:'amt',l:'Jumlah (Rp)',type:'money',def:10000000},{k:'kind',l:'Jenis',type:'select',opts:[['n','Non-mewah (DPP 11/12)'],['m','Barang mewah (DPP penuh)']],def:'n'},{k:'mode',l:'Jumlah di atas adalah',type:'select',opts:[['ex','Harga sebelum PPN'],['in','Harga sudah termasuk PPN']],def:'ex'}],
  run:v=>{ const lux=v.kind==='m', eff=lux?1.12:1.11, base=v.mode==='in'?v.amt/eff:v.amt, dpp=lux?base:base*11/12, ppn=dpp*.12;
    return [{l:'Harga sebelum PPN',v:base},{l:'DPP'+(lux?'':' (11/12 × harga)'),v:dpp},{l:'PPN 12% × DPP',v:ppn},{l:'Total',v:base+ppn,big:true},{l:'Tarif efektif',s:(ppn/base*100).toFixed(1).replace('.',',')+'%'}]; } },
{ id:'pmpk', g:'PPN', t:'PPN kurang/lebih bayar', d:'Pajak keluaran dikurangi pajak masukan.',
  f:[{k:'pk',l:'Pajak keluaran (Rp)',type:'money',def:45000000},{k:'pm',l:'Pajak masukan dapat dikreditkan (Rp)',type:'money',def:30000000},{k:'carry',l:'Kompensasi lebih bayar masa lalu (Rp)',type:'money',def:0}],
  run:v=>{ const n=v.pk-v.pm-v.carry; return [{l:'Pajak keluaran',v:v.pk},{l:'Pajak masukan + kompensasi',v:v.pm+v.carry},{l:n>=0?'PPN kurang bayar':'PPN lebih bayar',v:Math.abs(n),big:true,n:n>=0?'Disetor sebelum SPT Masa PPN dilaporkan.':'Dikompensasikan ke masa berikutnya atau dimintakan restitusi.'}]; } },
{ id:'gross', g:'Alat bantu', t:'Gross up pajak', d:'Mencari bruto bila pajak ditanggung pemberi penghasilan: bruto = neto ÷ (1 − tarif).',
  f:[{k:'net',l:'Jumlah neto yang ingin diterima (Rp)',type:'money',def:10000000},{k:'rate',l:'Tarif pajak',type:'select',opts:[['2','PPh 23 jasa (2%)'],['15','PPh 23 royalti/bunga (15%)'],['10','PPh final sewa (10%)'],['20','PPh 26 (20%)']],def:'2'}],
  run:v=>{ const r=Number(v.rate)/100, g=v.net/(1-r); return [{l:'Penghasilan bruto',v:g,big:true},{l:'Pajak ditanggung',v:g-v.net}]; } },
{ id:'aset', g:'PPh badan', t:'Penyusutan fiskal aset tetap', d:'Jadwal penyusutan menurut kelompok harta.',
  f:[{k:'price',l:'Harga perolehan (Rp)',type:'money',def:120000000},{k:'grp',l:'Kelompok',type:'select',opts:[['1','Kelompok 1 (4 th)'],['2','Kelompok 2 (8 th)'],['3','Kelompok 3 (16 th)'],['4','Kelompok 4 (20 th)'],['bp','Bangunan permanen (20 th)'],['bt','Bangunan tidak permanen (10 th)']],def:'1'},{k:'met',l:'Metode',type:'select',opts:[['gl','Garis lurus'],['sm','Saldo menurun (khusus bukan bangunan)']],def:'gl'}],
  run:v=>{ const T={'1':[4,25,50],'2':[8,12.5,25],'3':[16,6.25,12.5],'4':[20,5,10],bp:[20,5,0],bt:[10,10,0]}[v.grp], yrs=T[0]; let met=v.met; if(met==='sm'&&!T[2]) met='gl';
    const rate=(met==='gl'?T[1]:T[2])/100; let bv=v.price; const rows=[{l:'Metode · tarif',s:(met==='gl'?'Garis lurus':'Saldo menurun')+' · '+(rate*100)+'% · '+yrs+' tahun'}];
    for(let y=1;y<=yrs;y++){ let dep=met==='gl'?v.price*rate:bv*rate; if(met==='sm'&&y===yrs) dep=bv; dep=Math.min(dep,bv); bv-=dep; rows.push({l:'Tahun '+y+' · beban',v:dep,n:'Nilai buku akhir: Rp'+Math.round(bv).toLocaleString('id-ID')}); }
    return rows; } },
{ id:'umkm', g:'PPh badan', t:'PPh final UMKM 0,5%', d:'Sesuai PP 20/2026. Untuk orang pribadi, omzet sampai Rp500 juta tidak dikenai PPh.',
  f:[{k:'omzet',l:'Omzet bruto setahun (Rp)',type:'money',def:900000000},{k:'wp',l:'Jenis wajib pajak',type:'select',opts:[['op','Orang pribadi'],['pt','PT perorangan / koperasi / lainnya']],def:'op'}],
  run:v=>{ if(v.omzet>4.8e9) return [{l:'Status',s:'Omzet melebihi Rp4,8 miliar. Tidak memakai PPh final UMKM.',},{l:'Catatan',s:'Gunakan tarif normal dan pembukuan.'}]; const base=v.wp==='op'?Math.max(0,v.omzet-500e6):v.omzet; return [{l:'Omzet yang dikenai',v:base},{l:'PPh final 0,5% setahun',v:base*.005,big:true},{l:'Rata-rata per bulan',v:base*.005/12,n:'Praktiknya dibayar tiap bulan paling lambat tanggal 15 bulan berikutnya.'}]; } },
{ id:'badan', g:'PPh badan', t:'PPh badan dengan Pasal 31E', d:'22% dengan pengurangan tarif 50% atas bagian PKP dari omzet sampai Rp4,8 miliar.',
  f:[{k:'omzet',l:'Peredaran bruto setahun (Rp)',type:'money',def:3000000000},{k:'pkp',l:'Penghasilan kena pajak (Rp)',type:'money',def:300000000}],
  run:v=>{ let tax,fas=0; if(v.omzet<=4.8e9){ fas=v.pkp; tax=v.pkp*.22*.5; } else if(v.omzet<=50e9){ fas=4.8e9/v.omzet*v.pkp; tax=fas*.22*.5+(v.pkp-fas)*.22; } else tax=v.pkp*.22;
    return [{l:'PKP berfasilitas (tarif 11%)',v:fas},{l:'PKP tarif 22%',v:v.pkp-fas},{l:'PPh badan terutang',v:tax,big:true},{l:'Tarif efektif',s:v.pkp?(tax/v.pkp*100).toFixed(2).replace('.',',')+'%':'-'}]; } },
{ id:'inv', g:'Investasi', t:'Pajak saham & kripto', d:'PPh final atas penjualan.',
  f:[{k:'amt',l:'Nilai transaksi penjualan (Rp)',type:'money',def:50000000},{k:'rate',l:'Jenis',type:'select',opts:[['0.1','Saham di bursa (0,1%)'],['0.21','Kripto lewat PPMSE dalam negeri (0,21%)'],['1','Kripto lewat PPMSE luar negeri (1%)']],def:'0.21'}],
  run:v=>{ const r=Number(v.rate); return [{l:'PPh final ('+String(r).replace('.',',')+'%)',v:v.amt*r/100,big:true},{l:'Nilai setelah pajak',v:v.amt-v.amt*r/100}]; } },
{ id:'p25', g:'PPh badan', t:'Angsuran PPh 25', d:'(PPh terutang tahun lalu − kredit pajak) ÷ 12.',
  f:[{k:'tax',l:'PPh terutang tahun lalu (Rp)',type:'money',def:120000000},{k:'credit',l:'Kredit pajak tahun lalu: PPh 22, 23, 24 (Rp)',type:'money',def:24000000}],
  run:v=>[{l:'Angsuran per bulan',v:Math.max(0,(v.tax-v.credit)/12),big:true},{l:'Setahun',v:Math.max(0,v.tax-v.credit)}] }
];
