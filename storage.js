/* =====================================================================
   storage.js: "backend" lokal untuk versi GitHub Pages.
   Semua data tersimpan di localStorage browser pengguna, jadi:
   - tiap orang yang membuka situs ini punya data sendiri (tidak tercampur),
   - tidak ada server dan tidak ada login,
   - data hilang bila data situs browser dihapus, jadi gunakan fitur Cadangan.
   Fungsi di objek Store di bawah dipanggil oleh app.js lewat api('namaFungsi', ...).
   ===================================================================== */
(function () {
'use strict';

const KEY = { rows: 'lt.rows.v1', settings: 'lt.settings.v1', progress: 'lt.progress.v1', seq: 'lt.seq.v1' };
const STATUSES = ['Pendaftaran', 'Tanpa Kabar', 'Screening', 'Psikotes/Assessment', 'Interview', 'Offering', 'Accepted', 'Got Rejected', 'Saya Tolak'];
const FINAL = ['Accepted', 'Got Rejected', 'Saya Tolak'];
const DEFAULTS = { name: '', target: 100, deadline: '', ghostDays: 21, followDays: 14, theme: 'auto', started: false, lastBackup: '' };

/* ---------- baca/tulis localStorage (dengan cadangan di memori bila diblokir) ---------- */
let mem = {}, persistent = true;
function read(k, def) {
  if (!persistent && mem[k] !== undefined) return mem[k];
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { persistent = false; return mem[k] !== undefined ? mem[k] : def; }
}
function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { persistent = false; mem[k] = v; } }

/* ---------- tanggal ---------- */
const pad = n => String(n).padStart(2, '0');
const toIso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const todayIso = () => toIso(new Date());
const addDays = (iso, n) => { const p = iso.split('-').map(Number), d = new Date(p[0], p[1] - 1, p[2] + n); return toIso(d); };
const BULAN_MAP = { januari: 0, jan: 0, februari: 1, feb: 1, maret: 2, mar: 2, april: 3, apr: 3, mei: 4, juni: 5, jun: 5, juli: 6, jul: 6, agustus: 7, agu: 7, agt: 7, aug: 7, september: 8, sep: 8, sept: 8, oktober: 9, okt: 9, oct: 9, november: 10, nov: 10, desember: 11, des: 11, dec: 11 };
/* Membaca tanggal dari teks: "Senin, 03 Agustus 2026", "2026-08-03", "03/08/2026". Hasil: "yyyy-mm-dd" atau "". */
function parseDate(v) {
  const s = String(v == null ? '' : v).trim().toLowerCase(); if (!s) return '';
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/); if (m) return m[1] + '-' + m[2] + '-' + m[3];
  m = s.match(/(\d{1,2})\s*([a-z]+)\.?\s*(\d{4})/); if (m && BULAN_MAP[m[2]] !== undefined) return toIso(new Date(Number(m[3]), BULAN_MAP[m[2]], Number(m[1])));
  m = s.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/); if (m) return toIso(new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
  return '';
}

/* ---------- status & tahap ---------- */
function normalizeStatus(raw) {
  const s = String(raw || '').trim().toLowerCase(); if (!s) return 'Pendaftaran';
  if (/saya (tolak|menolak)|declin/.test(s)) return 'Saya Tolak';
  if (/accept|diterima|hired/.test(s)) return 'Accepted';
  if (/offer/.test(s)) return 'Offering';
  if (/reject|gagal|ditolak|berhenti|tidak lolos/.test(s)) return 'Got Rejected';
  if (/interview|wawancara/.test(s)) return 'Interview';
  if (/psiko|assess|assesmen|\btes\b|\btest\b/.test(s)) return 'Psikotes/Assessment';
  if (/screening|seleksi berkas/.test(s)) return 'Screening';
  if (/tanpa kabar|ghost|no response/.test(s)) return 'Tanpa Kabar';
  return 'Pendaftaran';
}
const statusInput = v => { v = String(v || '').trim(); return STATUSES.indexOf(v) > -1 ? v : normalizeStatus(v); };
/* 0 tanpa respons, 1 dibalas/ditolak, 2 tes/screening, 3 interview, 4 tawaran/diterima */
function rank(status, text) {
  const t = String(text || '').toLowerCase();
  if (status === 'Offering' || status === 'Accepted' || status === 'Saya Tolak') return 4;
  if (status === 'Interview' || /interview|wawancara/.test(t)) return 3;
  if (status === 'Screening' || status === 'Psikotes/Assessment' || /psiko|assesmen|assessment|\btes\b|\btest\b/.test(t)) return 2;
  if (status === 'Got Rejected') return 1;
  return 0;
}

/* ---------- data baris ---------- */
const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n || 500);
const isoOrEmpty = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : '';
function cleanRow(r, id) {
  return { id, jenis: str(r.jenis, 40) || 'Pekerjaan', appliedDate: isoOrEmpty(r.appliedDate), info: str(r.info, 80), company: str(r.company, 200), position: str(r.position, 200),
    status: statusInput(r.status), respDate: isoOrEmpty(r.respDate), notes: str(r.notes, 1500), link: str(r.link, 500), contact: str(r.contact, 200), salary: str(r.salary, 80), followup: isoOrEmpty(r.followup) };
}
function nextId() { const n = (read(KEY.seq, 0) || 0) + 1; write(KEY.seq, n); return n; }
const rawRows = () => read(KEY.rows, []);
const pub = (r, i) => Object.assign({}, r, { no: i + 1, rank: rank(r.status, r.notes) });
const allRows = () => rawRows().map(pub);
function getSettings() { return Object.assign({}, DEFAULTS, read(KEY.settings, {})); }
function setSettings(s) { write(KEY.settings, s); return s; }
const emptyProgress = () => ({ done: {}, quiz: {}, daily: { done: [], last: '', streak: 0, best: 0 }, tax: { read: [] } });
const getProgress = () => Object.assign(emptyProgress(), read(KEY.progress, {}));

/* ---------- CSV ---------- */
/* Memecah teks CSV menjadi baris dan sel. delim: ',' ';' atau tab. Sel ber-kutip (boleh berisi koma dan baris baru) didukung. */
function parseCsv(text, delim) {
  text = String(text).replace(/^\uFEFF/, ''); delim = delim || ',';
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
const normH = c => String(c == null ? '' : c).replace(/\s+/g, ' ').trim().toUpperCase();
const isCompanyH = u => u === 'PERUSAHAAN' || u === 'NAMA PERUSAHAAN' || u === 'COMPANY';
const isPositionH = u => u === 'POSISI' || u === 'JABATAN' || u === 'POSITION' || u === 'POSISI YANG DILAMAR';
function findHeader(grid) {
  for (let r = 0; r < Math.min(grid.length, 50); r++) { const up = grid[r].map(normH); if (up.some(isCompanyH) && up.some(isPositionH)) return r; }
  return -1;
}
/* Mengimpor CSV dari Google Sheets (pemisah koma, titik koma, atau tab dicoba otomatis; header dicari di 50 baris pertama)
   atau CSV hasil ekspor aplikasi ini. */
function rowsFromCsv(text) {
  const t = String(text || '');
  if (/^PK\u0003\u0004/.test(t)) throw new Error('File ini berformat Excel (.xlsx), bukan CSV. Di Google Sheets pilih File → Unduh → Nilai dipisahkan koma (.csv).');
  if (/^\s*<(!doctype|html)/i.test(t)) throw new Error('File ini halaman web, bukan CSV. Unduh lewat File → Unduh → Nilai dipisahkan koma (.csv).');
  let grid = null, h = -1;
  for (const d of [',', ';', '\t']) { const g = parseCsv(t, d), i = findHeader(g); if (i > -1) { grid = g; h = i; break; } }
  if (h < 0) {
    const g = parseCsv(t, ','), first = g.find(r => r.some(c => String(c).trim()));
    const seen = first ? first.filter(c => String(c).trim()).slice(0, 6).join(' | ') : '(file kosong)';
    throw new Error('Kolom PERUSAHAAN dan POSISI tidak ditemukan. Isi baris pertama yang terbaca: "' + seen.slice(0, 120) + '". Kemungkinan tab yang diunduh bukan tab lamaranmu: buka tab lamaran dulu di Google Sheets, baru unduh.');
  }
  const idx = {}, tgl = [];
  grid[h].forEach((c, i) => { const u = normH(c);
    if (u === 'JENIS') idx.jenis = i; else if (u === 'TANGGAL') tgl.push(i); else if (u === 'INFO' || u === 'SUMBER' || u === 'SUMBER INFO') idx.info = i;
    else if (isCompanyH(u)) idx.company = i; else if (isPositionH(u)) idx.position = i; else if (u === 'STATUS') idx.status = i;
    else if (u === 'NOTES' || u === 'NOTE' || u === 'CATATAN') idx.notes = i; else if (u === 'LINK LOWONGAN' || u === 'LINK') idx.link = i;
    else if (u === 'KONTAK HRD' || u === 'KONTAK') idx.contact = i; else if (u === 'GAJI') idx.salary = i; else if (u === 'TINDAK LANJUT') idx.followup = i;
    else if (u === 'TANGGAL RESPONS' || u === 'TANGGAL RESPONS / HASIL') idx.resp = i; });
  idx.applied = tgl[0]; if (idx.resp === undefined) idx.resp = tgl[1];
  const out = [];
  for (let r = h + 1; r < grid.length; r++) {
    const g = k => (idx[k] === undefined ? '' : String(grid[r][idx[k]] == null ? '' : grid[r][idx[k]]).trim());
    const company = g('company'); if (!company) continue;
    let status = g('status'), notes = g('notes'); const respRaw = g('resp'), respDate = parseDate(respRaw);
    if (!respDate && respRaw) { if (!status) status = respRaw; if (!notes) notes = respRaw; } // baris yang bergeser
    out.push({ jenis: g('jenis'), appliedDate: parseDate(g('applied')), info: g('info'), company, position: g('position'), status, respDate, notes, link: g('link'), contact: g('contact'), salary: g('salary'), followup: parseDate(g('followup')) });
  }
  return out;
}

/* ---------- data contoh ---------- */
function sampleRows() {
  const t = todayIso(), d = n => addDays(t, -n);
  return [
    ['PT Contoh Nusantara', 'Tax Staff', 'LinkedIn', 52, 'Got Rejected', 41, 'Gagal di tahap asesmen'], ['CV Maju Bersama', 'Admin Finance', 'Glints', 47, 'Interview', 35, 'Interview HRD, tunggu user'],
    ['PT Sentosa Abadi', 'Accounting Staff', 'LinkedIn', 44, 'Tanpa Kabar', 0, ''], ['Bank Contoh', 'Teller', 'Website Resmi', 40, 'Psikotes/Assessment', 30, 'Tes online dua tahap'],
    ['PT Karya Mandiri', 'Finance Officer', 'Dealls', 33, 'Got Rejected', 25, 'Belum sesuai kebutuhan'], ['PT Global Logistik', 'Administrasi Gudang', 'Instagram', 26, 'Tanpa Kabar', 0, ''],
    ['Koperasi Sejahtera', 'Staff Akuntansi', 'Glints', 19, 'Offering', 8, 'Tawaran masuk, sedang negosiasi'], ['PT Digital Kreasi', 'Marketing Executive', 'LinkedIn', 12, 'Pendaftaran', 0, ''],
    ['PT Teknologi Baru', 'Data Entry', 'Job Street', 6, 'Pendaftaran', 0, ''], ['PT Inti Pajak', 'Tax Officer', 'LinkedIn', 2, 'Pendaftaran', 0, '']
  ].map(s => ({ jenis: 'Pekerjaan', appliedDate: d(s[3]), info: s[2], company: s[0], position: s[1], status: s[4], respDate: s[5] ? d(s[5]) : '', notes: s[6] }));
}

/* ---------- API (nama fungsi sama dengan versi Apps Script) ---------- */
const Store = {
  getBootstrap() {
    const s = getSettings();
    return { user: { email: '' }, settings: s, progress: getProgress(), statuses: STATUSES, today: todayIso(), needsSetup: !s.started, rows: allRows(), meta: { sheetName: 'Browser ini', headerRow: 1, extrasReady: true, url: '' }, persistent };
  },
  saveRow(p) {
    p = p || {}; const company = str(p.company, 200), position = str(p.position, 200);
    if (!company || !position) throw new Error('Perusahaan dan posisi wajib diisi.');
    const rows = rawRows(); let id = Number(p.id) || 0, i = rows.findIndex(r => r.id === id);
    const status = statusInput(p.status); let resp = isoOrEmpty(p.respDate); if (FINAL.indexOf(status) > -1 && !resp) resp = todayIso();
    const data = cleanRow(Object.assign({}, p, { status, respDate: resp, appliedDate: p.appliedDate || todayIso() }), id);
    if (i > -1) rows[i] = data; else { id = nextId(); data.id = id; rows.push(data); }
    write(KEY.rows, rows); return { rows: allRows(), savedId: id };
  },
  updateStatus(id, status) {
    const rows = rawRows(), r = rows.find(x => x.id === Number(id)); if (!r) throw new Error('Baris tidak ditemukan. Muat ulang data.');
    r.status = statusInput(status); if (FINAL.indexOf(r.status) > -1 && !r.respDate) r.respDate = todayIso();
    write(KEY.rows, rows); return { rows: allRows() };
  },
  deleteRow(id) { const rows = rawRows().filter(x => x.id !== Number(id)); write(KEY.rows, rows); return { rows: allRows() }; },
  setupExtras() { return { extrasReady: true }; },
  saveSettings(s) {
    const cur = getSettings(), num = (v, a, b, d) => Math.max(a, Math.min(b, Number(v) || d));
    return setSettings({ name: str(s.name, 40), target: num(s.target, 1, 1000, cur.target), deadline: isoOrEmpty(s.deadline), ghostDays: num(s.ghostDays, 7, 90, cur.ghostDays), followDays: num(s.followDays, 3, 60, cur.followDays),
      theme: ['auto', 'light', 'dark'].indexOf(s.theme) > -1 ? s.theme : cur.theme, started: cur.started, lastBackup: cur.lastBackup });
  },
  saveProgress(p) {
    const src = p || {}, clean = emptyProgress();
    Object.keys(src.done || {}).forEach(k => { if (Array.isArray(src.done[k])) clean.done[k] = src.done[k].map(Number).filter(n => n >= 0 && n < 50); });
    Object.keys(src.quiz || {}).forEach(k => { const q = src.quiz[k] || {}; clean.quiz[k] = { best: Number(q.best) || 0, total: Number(q.total) || 0, at: str(q.at, 10) }; });
    const d = src.daily || {}; clean.daily = { done: (d.done || []).map(x => str(x, 40)).slice(0, 400), last: str(d.last, 10), streak: Number(d.streak) || 0, best: Number(d.best) || 0 };
    clean.tax.read = ((src.tax || {}).read || []).map(x => str(x, 40)).slice(0, 200);
    write(KEY.progress, clean); return clean;
  },
  startFresh(name) { const s = getSettings(); s.started = true; if (str(name, 40)) s.name = str(name, 40); setSettings(s); return { ok: true }; },
  loadSample(name) {
    const s = getSettings(); s.started = true; if (str(name, 40)) s.name = str(name, 40); setSettings(s);
    const rows = rawRows(); sampleRows().forEach(r => { const id = nextId(); rows.push(cleanRow(r, id)); }); write(KEY.rows, rows); return { ok: true, added: sampleRows().length };
  },
  importCsv(text) {
    const list = rowsFromCsv(text); if (!list.length) throw new Error('Tidak ada baris lamaran yang terbaca dari file ini.');
    const rows = rawRows(); list.forEach(r => { if (r.company) rows.push(cleanRow(Object.assign({}, r, { position: r.position || 'Posisi belum diisi' }), nextId())); }); write(KEY.rows, rows);
    const s = getSettings(); if (!s.started) { s.started = true; setSettings(s); } return { ok: true, added: list.length };
  },
  exportBackup() {
    const s = getSettings(); s.lastBackup = todayIso(); setSettings(s);
    return JSON.stringify({ app: 'lamaran-tracker', version: 1, exportedAt: new Date().toISOString(), rows: rawRows(), settings: s, progress: getProgress() }, null, 2);
  },
  restoreBackup(text) {
    let o; try { o = JSON.parse(text); } catch (e) { throw new Error('File cadangan tidak valid (bukan JSON).'); }
    if (!o || o.app !== 'lamaran-tracker' || !Array.isArray(o.rows)) throw new Error('File ini bukan cadangan Lamaran Tracker.');
    write(KEY.seq, 0); const rows = o.rows.filter(r => r && r.company && r.position).map(r => cleanRow(r, nextId())); write(KEY.rows, rows);
    const s = Object.assign({}, DEFAULTS, o.settings || {}, { started: true }); setSettings(s);
    Store.saveProgress(o.progress || {}); return { ok: true, added: rows.length };
  },
  wipeAll() { Object.keys(KEY).forEach(k => { try { localStorage.removeItem(KEY[k]); } catch (e) {} }); mem = {}; return { ok: true }; }
};
Store._parse = { parseDate, rowsFromCsv, parseCsv, normalizeStatus };
window.LTStore = Store;
})();
