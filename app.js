(function () {
'use strict';

/* Registri: file lain (Belajar.html) mendaftarkan tampilan dan aksi lewat objek LT ini. */
const LT = window.LT = { act: {}, chg: {}, inp: {}, views: {}, h: {} };

/* ============ UTIL ============ */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const toIso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const fromIso = s => { const p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
const diffDays = (a, b) => Math.round((fromIso(b) - fromIso(a)) / 864e5);
const addDays = (iso, n) => { const d = fromIso(iso); d.setDate(d.getDate() + n); return toIso(d); };
const weekStart = iso => { const d = fromIso(iso); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return toIso(d); };
const monthKey = iso => iso.slice(0, 7);
const fmtD = iso => { if (!iso) return '–'; const d = fromIso(iso); return pad(d.getDate()) + ' ' + BLN[d.getMonth()] + ' ' + d.getFullYear(); };
const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
const money = v => Number(String(v == null ? '' : v).replace(/\D/g, '')) || 0;
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const slug = s => String(s).replace(/[^A-Za-z0-9]+/g, '-');
const median = a => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y), m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const quant = (a, p) => { if (!a.length) return null; const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)]; };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;

const IC = {
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  board: '<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  scale: '<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>',
  flame: '<path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.6-2.6 1.5-3.5C10 9 11 7 12 3z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  check: '<path d="M5 12l5 5 9-10"/>', copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/>', download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>', inbox: '<path d="M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5"/>'
};
for (const k in MOD_ICONS) IC['m_' + k] = MOD_ICONS[k];
const ico = (n, s) => '<svg class="i" width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[n] || '') + '</svg>';

/* ============ STATE ============ */
const S = LT.S = {
  rows: [], meta: {}, user: {}, needsSetup: false, setupError: '',
  settings: { name: '', target: 100, deadline: '', ghostDays: 21, followDays: 14, theme: 'auto', digest: false },
  progress: { done: {}, quiz: {}, daily: { done: [], last: '', streak: 0, best: 0 }, tax: { read: [] } },
  statuses: [], today: toIso(new Date()), view: 'beranda', loading: true, error: null,
  filters: { q: '', jenis: '', status: '', info: '', bucket: '', sort: 'date-desc' },
  aTab: 'ringkasan', tpl: { type: 'followup', id: null }, charts: {}
};
const BK = {
  accepted: { l: 'Diterima', c: '--ok' }, offer: { l: 'Tawaran', c: '--teal' }, process: { l: 'Dalam proses', c: '--amber' },
  waiting: { l: 'Menunggu', c: '--info' }, ghost: { l: 'Hangus', c: '--idle' }, rejected: { l: 'Ditolak', c: '--bad' }
};
const PENDING = ['Pendaftaran', 'Tanpa Kabar'];
const FINAL = ['Accepted', 'Got Rejected', 'Saya Tolak'];

/* ============ API ============
   Versi GitHub Pages: tidak ada server. api('nama', ...) memanggil fungsi di js/storage.js (LTStore). */
function api(fn) {
  const args = Array.prototype.slice.call(arguments, 1);
  return new Promise((res, rej) => {
    try {
      if (!window.LTStore || !LTStore[fn]) throw new Error('Fungsi tidak ditemukan: ' + fn);
      const r = LTStore[fn].apply(LTStore, args);
      res(r === undefined ? null : JSON.parse(JSON.stringify(r)));
    } catch (e) { rej(e); }
  });
}
function download(name, text, mime) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
function readFile(file) { return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.onerror = () => rej(new Error('File tidak bisa dibaca.')); fr.readAsText(file); }); }
let busyCount = 0;
function busy(on) { busyCount += on ? 1 : -1; $('#busy').hidden = busyCount <= 0; }
function toast(msg, kind) {
  const el = document.createElement('div');
  el.className = 'toast' + (kind === 'err' ? ' err' : '');
  el.textContent = msg; $('#toasts').appendChild(el);
  setTimeout(() => el.remove(), kind === 'err' ? 6500 : 2800);
}
let saveTimer = null;
function saveProgressSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(() => api('saveProgress', S.progress).catch(() => {}), 600); }
function copyText(txt) {
  const done = () => toast('Tersalin ke clipboard.');
  const fb = () => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Gagal menyalin. Salin manual.', 'err'); } ta.remove(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fb); else fb();
}

/* ============ DATA TURUNAN ============ */
function categorize(p) {
  const t = String(p || '').toLowerCase();
  if (/tax|pajak|perpajakan/.test(t)) return 'Pajak';
  if (/account|akuntan|finance|keuangan|audit/.test(t)) return 'Akuntansi & Keuangan';
  if (/admin|tata usaha|staff umum|kreni|trainee|koordinator|purchasing|secretary|sekretaris/.test(t)) return 'Administrasi & Umum';
  if (/teller|front office|bank|customer service/.test(t)) return 'Perbankan & Layanan';
  if (/engineer|developer|programmer|data|it |software|network/.test(t)) return 'Teknologi & Data';
  if (/marketing|sales|brand|content|social media|digital/.test(t)) return 'Pemasaran & Penjualan';
  if (/hr|human|people|recruit|talent/.test(t)) return 'SDM';
  return 'Lainnya';
}
function bucketOf(r) {
  if (r.status === 'Accepted') return 'accepted';
  if (r.status === 'Offering' || r.status === 'Saya Tolak') return 'offer';
  if (['Screening', 'Psikotes/Assessment', 'Interview'].indexOf(r.status) > -1) return 'process';
  if (r.status === 'Got Rejected') return 'rejected';
  return r.ghost ? 'ghost' : 'waiting';
}
function enrich() {
  const g = S.settings.ghostDays;
  S.rows.forEach(r => {
    r.days = r.appliedDate ? diffDays(r.appliedDate, S.today) : null;
    r.pending = PENDING.indexOf(r.status) > -1;
    r.ghost = r.pending && r.days != null && r.days >= g;
    r.bucket = bucketOf(r);
    r.respDays = (r.respDate && r.appliedDate) ? diffDays(r.appliedDate, r.respDate) : null;
    r.cat = categorize(r.position);
  });
}
const byId = id => S.rows.find(r => r.id === Number(id));
function kpis() {
  const rows = S.rows, n = rows.length, c = b => rows.filter(r => r.bucket === b).length;
  const responded = rows.filter(r => !r.pending).length;
  const rd = rows.map(r => r.respDays).filter(v => v != null && v >= 0);
  return { n, waiting: c('waiting'), ghost: c('ghost'), process: c('process'), offer: c('offer'), accepted: c('accepted'), rejected: c('rejected'),
    responded, respRate: pct(responded, n), interview: rows.filter(r => r.rank >= 3).length, avgResp: rd.length ? Math.round(avg(rd)) : null };
}
function followList() { const f = S.settings.followDays, g = S.settings.ghostDays; return S.rows.filter(r => r.pending && r.days != null && r.days >= f && r.days < g).sort((a, b) => b.days - a.days); }
function dueList() { return S.rows.filter(r => r.followup && r.followup <= addDays(S.today, 7) && FINAL.indexOf(r.status) === -1).sort((a, b) => a.followup.localeCompare(b.followup)); }
const displayName = () => S.settings.name || (S.user.email ? S.user.email.split('@')[0] : '');

/* ============ TEMA & NAV ============ */
function applyTheme() {
  const t = S.settings.theme;
  const dark = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
const NAV = [
  { g: 'Pelacak' }, { v: 'beranda', l: 'Beranda', i: 'home', c: '--c1' }, { v: 'lamaran', l: 'Lamaran', i: 'list', c: '--c2' }, { v: 'papan', l: 'Papan', i: 'board', c: '--c6' },
  { v: 'analisis', l: 'Analisis', i: 'chart', c: '--c3' }, { v: 'tindak', l: 'Tindak lanjut', i: 'bell', c: '--c5' },
  { g: 'Belajar' }, { v: 'harian', l: 'Materi harian', i: 'sun', c: '--c4' }, { v: 'modul', l: 'Modul karier', i: 'book', c: '--c8' }, { v: 'pajak', l: 'Belajar pajak', i: 'scale', c: '--c7' },
  { g: 'Akun' }, { v: 'atur', l: 'Pengaturan', i: 'gear', c: '--c2' }
];
function renderNav() {
  const fl = (S.loading || S.needsSetup) ? 0 : followList().length + dueList().length;
  $('#nav').innerHTML = NAV.map(n => n.g ? '<div class="grp">' + n.g + '</div>' :
    '<button data-act="nav" data-v="' + n.v + '" style="--nc:var(' + n.c + ')" class="' + (S.view === n.v ? 'on' : '') + '"><span class="ib">' + ico(n.i, 17) + '</span><span>' + n.l + '</span>' + (n.v === 'tindak' && fl ? '<span class="badge">' + fl + '</span>' : '') + '</button>').join('');
  $('#syncInfo').innerHTML = S.loading ? 'Memuat…' : (S.needsSetup ? 'Data tersimpan di browser ini.' : '<b>' + S.rows.length + '</b> lamaran tersimpan di browser ini.');
}

/* ============ RENDER ============ */
const TRACKER_VIEWS = ['beranda', 'lamaran', 'papan', 'analisis', 'tindak'];
function render() {
  const y = window.scrollY;
  renderNav();
  const v = $('#view');
  if (S.loading) { v.innerHTML = '<div class="loading"><div><div class="spin"></div>Menyambungkan…</div></div>'; return; }
  if (S.error) { v.innerHTML = '<div class="loading"><div><h2>Terjadi masalah</h2><p>' + esc(S.error) + '</p><button class="btn primary" data-act="reload">' + ico('refresh') + 'Coba lagi</button></div></div>'; return; }
  const core = { beranda: viewBeranda, lamaran: viewLamaran, papan: viewPapan, analisis: viewAnalisis, tindak: viewTindak, atur: viewAtur };
  let html;
  if (TRACKER_VIEWS.indexOf(S.view) > -1 && S.needsSetup) html = viewSetup();
  else if (core[S.view]) html = core[S.view]();
  else if (LT.views[S.view]) html = LT.views[S.view].render();
  else html = '<div class="empty-note">Tampilan tidak ditemukan.</div>';
  v.innerHTML = html;
  if (!(TRACKER_VIEWS.indexOf(S.view) > -1 && S.needsSetup)) {
    if (S.view === 'beranda') drawBeranda();
    if (S.view === 'analisis') drawAnalisis();
    if (LT.views[S.view] && LT.views[S.view].after) LT.views[S.view].after();
  }
  window.scrollTo(0, y);
}
function head(title, sub, actions) { return '<div class="page-head"><div><h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><div class="actions">' + (actions || '') + '</div></div>'; }
const addBtn = '<button class="btn primary" data-act="add">' + ico('plus') + 'Lamaran baru</button>';
const refreshBtn = '<button class="btn" data-act="reload" title="Muat ulang">' + ico('refresh') + 'Muat ulang</button>';
LT.h = { $, $$, esc, pad, fmtD, rp, money, pct, ico, api, toast, busy, head, cssv, addDays, diffDays, toIso, fromIso, slug, copyText, saveProgressSoon, render: () => render(), mkChart: (...a) => mkChart(...a), openModal: h => openModal(h), closeModal: () => closeModal(), displayName };

function mkChart(id, cfg) {
  const el = document.getElementById(id); if (!el) return;
  if (!window.Chart) { el.parentNode.innerHTML = '<p class="muted small">Grafik membutuhkan koneksi internet untuk memuat Chart.js.</p>'; return; }
  if (S.charts[id]) S.charts[id].destroy();
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif"; Chart.defaults.color = cssv('--muted');
  S.charts[id] = new Chart(el, cfg);
}
const barOpts = (extra) => Object.assign({ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: cssv('--line') } }, x: { grid: { display: false } } } }, extra || {});

/* ============ ONBOARDING ============ */
const fileInput = '<input type="file" id="fileImport" data-act="importfile" accept=".csv,.json,text/csv,application/json" hidden>';
function viewSetup() {
  return head('Selamat datang 👋', 'Lamaran Tracker menyimpan datamu langsung di browser ini. Tanpa login dan tanpa server, jadi tidak ada orang lain yang bisa melihatnya.') +
    '<div class="panel" style="margin-bottom:16px"><div class="field" style="margin:0"><label for="setName">Nama panggilan (opsional)</label><input type="text" id="setName" value="' + esc(S.settings.name) + '" placeholder="Mis. Revi" maxlength="40"></div></div>' +
    '<div class="setup"><div class="panel" style="--sc:var(--c3)"><div class="big-ic">' + ico('plus', 24) + '</div><h2>Mulai dari awal</h2><p class="sub">Mulai dengan daftar kosong dan tambahkan lamaran pertamamu.</p><div><button class="btn primary" data-act="start">Mulai</button></div></div>' +
    '<div class="panel" style="--sc:var(--c2)"><div class="big-ic">' + ico('download', 24) + '</div><h2>Impor dari Google Sheets</h2><p class="sub">Di Google Sheets, buka tab lamaranmu, pilih <b>File → Unduh → Nilai dipisahkan koma (.csv)</b>, lalu pilih file itu di sini. Cadangan <b>.json</b> dari aplikasi ini juga bisa dipulihkan.</p><div><button class="btn" data-act="pickfile">Pilih file…</button>' + fileInput + '</div></div></div>' +
    '<div class="panel" style="margin-top:16px;--sc:var(--c4)"><div style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><h2>Ingin melihat dulu?</h2><p class="sub" style="margin:0">Muat 10 lamaran contoh untuk mencoba dashboard dan analisis. Bisa dihapus kapan saja di Pengaturan.</p></div><button class="btn" data-act="sample">Muat data contoh</button></div></div>' +
    '<p class="muted small" style="margin-top:14px">Modul belajar, materi harian, dan belajar pajak tetap bisa dibuka tanpa mengisi apa pun.</p>';
}
const nameVal = () => (($('#setName') || {}).value || '').trim();
LT.act.start = async () => { busy(true); try { await api('startFresh', nameVal()); toast('Siap! Tambahkan lamaran pertamamu.'); await load(); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } };
LT.act.sample = async () => { busy(true); try { await api('loadSample', nameVal()); toast('Data contoh dimuat.'); await load(); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } };

/* ============ BERANDA ============ */
function paceText() {
  const target = S.settings.target, total = S.rows.length, left = target - total;
  if (left <= 0) return 'Target ' + target + ' lamaran sudah tercapai. Fokus berikutnya: kualitas lamaran dan tindak lanjut.';
  const since = addDays(S.today, -27), recent = S.rows.filter(r => r.appliedDate && r.appliedDate >= since).length, perWeek = recent / 4;
  let t = total ? 'Sisa ' + left + ' lamaran lagi.' : 'Mulai dengan satu lamaran. Target kamu ' + target + ' perusahaan.';
  if (S.settings.deadline) { const dl = diffDays(S.today, S.settings.deadline); if (dl > 0) t += ' Agar selesai pada ' + fmtD(S.settings.deadline) + ', kamu perlu sekitar ' + (left / (dl / 7)).toFixed(1) + ' lamaran per minggu.'; else t += ' Tenggat target sudah lewat, perbarui di Pengaturan.'; }
  if (perWeek > 0) t += ' Dengan tempo 4 minggu terakhir (' + perWeek.toFixed(1) + ' per minggu), target tercapai sekitar ' + fmtD(addDays(S.today, Math.ceil(left / perWeek * 7))) + '.';
  else if (total) t += ' Belum ada lamaran dalam 4 minggu terakhir.';
  return t;
}
function greeting() { const h = new Date().getHours(), n = displayName(); return (h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 19 ? 'Selamat sore' : 'Selamat malam') + (n ? ', ' + esc(n) : ''); }
function heatHtml() {
  const counts = {}; S.rows.forEach(r => { if (r.appliedDate) counts[r.appliedDate] = (counts[r.appliedDate] || 0) + 1; });
  const start = addDays(weekStart(S.today), -17 * 7); let h = '';
  for (let i = 0; i < 126; i++) { const d = addDays(start, i), n = counts[d] || 0; h += '<i class="' + (n >= 3 ? 'l3' : n === 2 ? 'l2' : n === 1 ? 'l1' : '') + (d > S.today ? ' fut' : '') + '" title="' + fmtD(d) + ': ' + n + ' lamaran"></i>'; }
  return '<div class="heat" style="grid-template-columns:repeat(18,1fr)">' + h + '</div>';
}
function kpiCard(color, icon, value, label, sub) { return '<div class="kpi" style="--kc:var(' + color + ')"><div class="kic">' + ico(icon, 18) + '</div><b>' + value + '</b><span>' + label + '</span><small>' + sub + '</small></div>'; }
function backupBanner() {
  let h = '';
  if (S.persistent === false) h += '<div class="warnbox" style="margin:0 0 14px"><b>Penyimpanan browser diblokir.</b> Data hanya bertahan sampai halaman ditutup. Nonaktifkan mode privat atau izinkan penyimpanan situs, dan unduh cadangan secara berkala.</div>';
  if (S.rows.length >= 3) { const lb = S.settings.lastBackup, old = !lb || diffDays(lb, S.today) > 14;
    if (old) h += '<div class="tip" style="margin:0 0 14px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><span>Datamu hanya tersimpan di browser ini. ' + (lb ? 'Cadangan terakhir ' + fmtD(lb) + '.' : 'Kamu belum pernah mengunduh cadangan.') + '</span><button class="btn sm" data-act="backup">' + ico('download', 15) + ' Unduh cadangan</button></div>'; }
  return h;
}
function viewBeranda() {
  const k = kpis(), target = S.settings.target;
  const sorted = S.rows.slice().sort((a, b) => (a.appliedDate || '').localeCompare(b.appliedDate || '') || a.id - b.id);
  const total = Math.max(target, sorted.length), cols = Math.ceil(Math.sqrt(total));
  let dots = '';
  for (let i = 0; i < total; i++) { const r = sorted[i]; dots += r ? '<button class="dot b-' + r.bucket + '" data-act="edit" data-id="' + r.id + '" title="' + esc(r.company + ' – ' + r.position + ' (' + r.status + ')') + '" aria-label="' + esc(r.company) + '"></button>' : '<span class="dot empty"></span>'; }
  const legend = Object.keys(BK).map(b => '<span><i style="background:var(' + BK[b].c + ')"></i>' + BK[b].l + ' ' + S.rows.filter(r => r.bucket === b).length + '</span>').join('');
  const fl = followList().slice(0, 5), due = dueList().slice(0, 4);
  const item = (r, note) => '<div class="rowitem"><div class="t"><b>' + esc(r.company) + '</b><span>' + esc(r.position) + ' · ' + note + '</span></div><button class="btn sm" data-act="tpl" data-id="' + r.id + '">' + ico('mail', 15) + 'Pesan</button></div>';
  return backupBanner() + head(greeting(), 'Ringkasan pencarian kerjamu, diperbarui setiap kali halaman dibuka.', refreshBtn + addBtn) +
    '<div class="hero"><div class="dots" style="--cols:' + cols + '">' + dots + '</div><div><h1>' + k.n + '</h1><p class="of">dari ' + target + ' perusahaan</p><p class="lead">' + esc(paceText()) + '</p><div class="legend">' + legend + '</div></div></div><div class="sp"></div>' +
    (LT.homeCard ? LT.homeCard() + '<div class="sp"></div>' : '') +
    '<div class="kpis">' + kpiCard('--c3', 'inbox', k.respRate + '%', 'Tingkat respons', k.responded + ' dari ' + k.n + ' dibalas') + kpiCard('--c4', 'user', k.interview, 'Sampai interview', pct(k.interview, k.n) + '% dari total') +
    kpiCard('--c2', 'clock', k.avgResp == null ? '–' : k.avgResp + ' hr', 'Rata-rata balasan', 'hanya yang sudah dibalas') + kpiCard('--c1', 'target', k.waiting, 'Masih menunggu', k.ghost + ' dianggap hangus') + kpiCard('--c7', 'award', k.accepted + k.offer, 'Diterima / tawaran', k.rejected + ' ditolak') + '</div><div class="sp"></div>' +
    '<div class="grid g-hero"><div class="stack"><div class="panel"><h2>Lamaran per minggu</h2><p class="sub">12 minggu terakhir</p><div class="chartbox"><canvas id="chWeek"></canvas></div></div>' +
    '<div class="panel"><h2>Kebiasaan melamar</h2><p class="sub">Satu kotak = satu hari selama 18 minggu terakhir. Makin pekat, makin banyak lamaran.</p>' + heatHtml() + '</div></div>' +
    '<div class="stack"><div class="panel"><h2>Perlu perhatian</h2><p class="sub">Follow-up sesudah ' + S.settings.followDays + ' hari tanpa kabar.</p>' + (due.length || fl.length ? '<div class="rowlist">' + due.map(r => item(r, 'jadwal ' + fmtD(r.followup))).join('') + fl.map(r => item(r, r.days + ' hari tanpa kabar')).join('') + '</div>' : '<div class="empty-note">Tidak ada yang mendesak hari ini.</div>') + '</div>' +
    '<div class="panel"><h2>Komposisi hasil</h2><p class="sub">Status terkini semua lamaran</p><div class="chartbox"><canvas id="chStatus"></canvas></div></div></div></div>';
}
function drawBeranda() {
  const weeks = [], ws0 = weekStart(S.today); for (let i = 11; i >= 0; i--) weeks.push(addDays(ws0, -i * 7));
  mkChart('chWeek', { type: 'bar', data: { labels: weeks.map(w => { const d = fromIso(w); return d.getDate() + ' ' + BLN[d.getMonth()]; }), datasets: [{ data: weeks.map(w => S.rows.filter(r => r.appliedDate && weekStart(r.appliedDate) === w).length), backgroundColor: cssv('--c1'), borderRadius: 6, maxBarThickness: 28 }] }, options: barOpts() });
  const keys = Object.keys(BK);
  mkChart('chStatus', { type: 'doughnut', data: { labels: keys.map(b => BK[b].l), datasets: [{ data: keys.map(b => S.rows.filter(r => r.bucket === b).length), backgroundColor: keys.map(b => cssv(BK[b].c)), borderColor: cssv('--panel'), borderWidth: 2 }] }, options: { maintainAspectRatio: false, cutout: '62%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, usePointStyle: true } } } } });
}

/* ============ LAMARAN ============ */
function statusSelect(r) { return '<select class="pill s-' + slug(r.status) + '" data-act="status" data-id="' + r.id + '" aria-label="Status ' + esc(r.company) + '">' + S.statuses.map(s => '<option' + (s === r.status ? ' selected' : '') + '>' + esc(s) + '</option>').join('') + '</select>'; }
function filtered() {
  const f = S.filters, q = f.q.trim().toLowerCase();
  const rows = S.rows.filter(r => (!q || (r.company + ' ' + r.position + ' ' + r.info + ' ' + r.notes).toLowerCase().indexOf(q) > -1) && (!f.jenis || r.jenis === f.jenis) && (!f.status || r.status === f.status) && (!f.info || r.info === f.info) && (!f.bucket || r.bucket === f.bucket));
  const s = f.sort;
  rows.sort((a, b) => {
    if (s === 'date-asc') return (a.appliedDate || '').localeCompare(b.appliedDate || '') || a.id - b.id;
    if (s === 'company') return a.company.localeCompare(b.company);
    if (s === 'status') return a.status.localeCompare(b.status) || a.company.localeCompare(b.company);
    if (s === 'wait') return (b.pending ? b.days || 0 : -1) - (a.pending ? a.days || 0 : -1);
    return (b.appliedDate || '').localeCompare(a.appliedDate || '') || b.id - a.id;
  });
  return rows;
}
const uniq = key => Array.from(new Set(S.rows.map(r => r[key]).filter(Boolean))).sort();
function viewLamaran() {
  const f = S.filters, rows = filtered();
  const chip = (b, label) => '<button class="chip' + (f.bucket === b ? ' on' : '') + '" data-act="bucket" data-v="' + b + '">' + label + '<b>' + (b ? S.rows.filter(r => r.bucket === b).length : S.rows.length) + '</b></button>';
  const opt = (arr, cur) => arr.map(x => '<option' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>').join('');
  const body = rows.map(r => '<tr><td class="nowrap hide-m">' + fmtD(r.appliedDate) + '</td><td><div class="co">' + esc(r.company) + '</div><div class="po">' + esc(r.position) + '</div></td>' +
    '<td class="hide-m">' + esc(r.info) + '</td><td class="hide-m"><span class="tag">' + esc(r.jenis || '–') + '</span></td>' +
    '<td class="nowrap">' + statusSelect(r) + (r.ghost ? ' <span class="tag ghost" title="Lebih dari ' + S.settings.ghostDays + ' hari tanpa kabar">hangus</span>' : '') + '</td>' +
    '<td class="nowrap hide-m">' + (r.pending ? (r.days != null ? r.days + ' hr' : '–') : (r.respDate ? fmtD(r.respDate) : '–')) + '</td>' +
    '<td class="notes">' + esc(r.notes) + (r.followup ? ' <span class="tag warn">tindak lanjut ' + fmtD(r.followup) + '</span>' : '') + '</td>' +
    '<td class="act nowrap"><button class="btn icon sm" data-act="edit" data-id="' + r.id + '" title="Ubah">' + ico('edit', 16) + '</button> <button class="btn icon sm danger" data-act="del" data-id="' + r.id + '" title="Hapus">' + ico('trash', 16) + '</button>' + (r.link ? ' <a class="btn icon sm" href="' + esc(r.link) + '" target="_blank" rel="noopener" title="Buka lowongan">' + ico('ext', 16) + '</a>' : '') + '</td></tr>').join('');
  return head('Lamaran', 'Perubahan tersimpan otomatis di browser ini. Ubah status lewat menu di kolom Status.', '<button class="btn" data-act="csv">' + ico('download') + 'Ekspor CSV</button>' + refreshBtn + addBtn) +
    '<div class="chips">' + chip('', 'Semua') + chip('waiting', 'Menunggu') + chip('process', 'Dalam proses') + chip('offer', 'Tawaran') + chip('accepted', 'Diterima') + chip('rejected', 'Ditolak') + chip('ghost', 'Hangus') + '</div>' +
    '<div class="toolbar"><div class="search">' + ico('search', 16) + '<input type="search" id="q" data-inp="q" placeholder="Cari perusahaan, posisi, catatan…" value="' + esc(f.q) + '"></div>' +
    '<select data-act="filter" data-k="jenis" aria-label="Jenis"><option value="">Semua jenis</option>' + opt(uniq('jenis'), f.jenis) + '</select>' +
    '<select data-act="filter" data-k="info" aria-label="Sumber"><option value="">Semua sumber</option>' + opt(uniq('info'), f.info) + '</select>' +
    '<select data-act="filter" data-k="status" aria-label="Status"><option value="">Semua status</option>' + opt(S.statuses, f.status) + '</select>' +
    '<select data-act="filter" data-k="sort" aria-label="Urutkan">' + [['date-desc', 'Terbaru dulu'], ['date-asc', 'Terlama dulu'], ['wait', 'Paling lama menunggu'], ['company', 'Nama perusahaan'], ['status', 'Status']].map(o => '<option value="' + o[0] + '"' + (f.sort === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>' +
    '<div class="tablewrap"><table><thead><tr><th>Tanggal</th><th>Perusahaan / posisi</th><th>Sumber</th><th>Jenis</th><th>Status</th><th>Hari / respons</th><th>Catatan</th><th></th></tr></thead><tbody>' +
    (body || '<tr><td colspan="8"><div class="empty-note">Belum ada lamaran yang cocok. Ubah filter atau tambahkan lamaran baru.</div></td></tr>') + '</tbody></table></div><p class="muted small" style="margin-top:10px">Menampilkan ' + rows.length + ' dari ' + S.rows.length + ' lamaran.</p>';
}

/* ============ FORM & MODAL ============ */
function openModal(html) { $('#modalRoot').innerHTML = '<div class="modal-bg" data-act="modal-bg"><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>'; const f = $('#modalRoot input:not([type=hidden]), #modalRoot select, #modalRoot textarea'); if (f) f.focus(); }
function closeModal() { $('#modalRoot').innerHTML = ''; }
function openForm(id) {
  const r = id ? byId(id) : null, v = k => esc(r ? r[k] : '');
  const jenis = Array.from(new Set(['Pekerjaan', 'Internship'].concat(uniq('jenis'))));
  openModal('<h2>' + (r ? 'Ubah lamaran' : 'Lamaran baru') + '</h2><form id="rowForm" autocomplete="off"><input type="hidden" name="id" value="' + (r ? r.id : '') + '"><div class="fgrid">' +
    '<div class="field full"><label for="f_company">Perusahaan *</label><input type="text" id="f_company" name="company" required value="' + v('company') + '"></div>' +
    '<div class="field full"><label for="f_position">Posisi *</label><input type="text" id="f_position" name="position" required value="' + v('position') + '"></div>' +
    '<div class="field"><label>Jenis</label><select name="jenis">' + jenis.map(j => '<option' + (r && r.jenis === j ? ' selected' : '') + '>' + esc(j) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Sumber info</label><input type="text" name="info" list="srcList" value="' + v('info') + '" placeholder="LinkedIn, Glints, Instagram…"><datalist id="srcList">' + uniq('info').map(x => '<option value="' + esc(x) + '">').join('') + '</datalist></div>' +
    '<div class="field"><label>Tanggal melamar</label><input type="date" name="appliedDate" value="' + (r ? esc(r.appliedDate) : S.today) + '"></div>' +
    '<div class="field"><label>Status</label><select name="status">' + S.statuses.map(s => '<option' + ((r ? r.status : 'Pendaftaran') === s ? ' selected' : '') + '>' + esc(s) + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Tanggal respons / hasil</label><input type="date" name="respDate" value="' + v('respDate') + '"></div><div class="field"><label>Jadwal tindak lanjut</label><input type="date" name="followup" value="' + v('followup') + '"></div>' +
    '<div class="field full"><label>Catatan</label><textarea name="notes" placeholder="Versi CV yang dikirim, hasil riset, pelajaran dari proses…">' + v('notes') + '</textarea></div>' +
    '<div class="field"><label>Link lowongan</label><input type="url" name="link" value="' + v('link') + '" placeholder="https://"></div><div class="field"><label>Kontak HRD</label><input type="text" name="contact" value="' + v('contact') + '" placeholder="Nama / email / nomor"></div>' +
    '<div class="field"><label>Gaji (ekspektasi / tawaran)</label><input type="text" name="salary" value="' + v('salary') + '"></div></div>' +
    '<div class="foot"><div>' + (r ? '<button type="button" class="btn danger" data-act="del" data-id="' + r.id + '">' + ico('trash') + 'Hapus</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
function confirmBox(msg, onYes) { openModal('<h2>Konfirmasi</h2><p>' + msg + '</p><div class="foot"><span></span><div class="actions"><button class="btn" data-act="close">Batal</button><button class="btn danger" id="confirmYes">Ya, lanjutkan</button></div></div>'); $('#confirmYes').onclick = () => { closeModal(); onYes(); }; }
async function submitForm(form) {
  const p = {}; new FormData(form).forEach((v, k) => { p[k] = String(v).trim(); });
  if (!p.company || !p.position) { toast('Perusahaan dan posisi wajib diisi.', 'err'); return; }
  const btn = $('button[type=submit]', form); btn.disabled = true; busy(true);
  try { const res = await api('saveRow', p); S.rows = res.rows; enrich(); closeModal(); render(); toast(p.id ? 'Perubahan tersimpan.' : 'Lamaran ditambahkan.'); if (!S.meta.extrasReady) api('setupExtras').then(m => { S.meta = Object.assign(S.meta, m); }).catch(() => {}); }
  catch (e) { toast(e.message, 'err'); btn.disabled = false; } finally { busy(false); }
}
async function setStatus(id, status) {
  const r = byId(id); if (!r || r.status === status) return;
  const prev = r.status; r.status = status; if (FINAL.indexOf(status) > -1 && !r.respDate) r.respDate = S.today; enrich(); render(); busy(true);
  try { const res = await api('updateStatus', r.id, status); S.rows = res.rows; enrich(); render(); toast(r.company + ': ' + status); }
  catch (e) { r.status = prev; enrich(); render(); toast(e.message, 'err'); } finally { busy(false); }
}
function askDelete(id) {
  const r = byId(id); if (!r) return;
  confirmBox('Hapus baris <b>' + esc(r.company) + '</b> (' + esc(r.position) + ') dari daftar? Tindakan ini tidak bisa dibatalkan. Unduh cadangan dulu bila perlu.', async () => { busy(true); try { const res = await api('deleteRow', r.id); S.rows = res.rows; enrich(); render(); toast('Baris dihapus.'); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } });
}
function exportCsv() {
  const cols = [['appliedDate', 'Tanggal'], ['jenis', 'Jenis'], ['info', 'Sumber'], ['company', 'Perusahaan'], ['position', 'Posisi'], ['status', 'Status'], ['respDate', 'Tanggal respons'], ['notes', 'Catatan'], ['link', 'Link'], ['contact', 'Kontak'], ['salary', 'Gaji'], ['followup', 'Tindak lanjut']];
  const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const csv = '\ufeff' + [cols.map(c => q(c[1])).join(',')].concat((S.view === 'lamaran' ? filtered() : S.rows).map(r => cols.map(c => q(r[c[0]])).join(','))).join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'lamaran-' + S.today + '.csv'; document.body.appendChild(a); a.click(); a.remove();
}

/* ============ PAPAN ============ */
const COLS = [
  { k: 'waiting', t: 'Menunggu', c: '--info', set: 'Pendaftaran', test: r => r.pending && !r.ghost },
  { k: 'screen', t: 'Tes & seleksi', c: '--violet', set: 'Psikotes/Assessment', test: r => r.status === 'Screening' || r.status === 'Psikotes/Assessment' },
  { k: 'interview', t: 'Interview', c: '--amber', set: 'Interview', test: r => r.status === 'Interview' },
  { k: 'offer', t: 'Tawaran', c: '--teal', set: 'Offering', test: r => r.status === 'Offering' },
  { k: 'accepted', t: 'Diterima', c: '--ok', set: 'Accepted', test: r => r.status === 'Accepted' },
  { k: 'closed', t: 'Tidak lanjut', c: '--bad', set: 'Got Rejected', test: r => r.status === 'Got Rejected' || r.status === 'Saya Tolak' || r.ghost }
];
function viewPapan() {
  const cols = COLS.map(c => { const items = S.rows.filter(c.test).sort((a, b) => (b.appliedDate || '').localeCompare(a.appliedDate || ''));
    return '<div class="col" data-col="' + c.k + '" style="--cc:var(' + c.c + ')"><h3>' + c.t + '<span>' + items.length + '</span></h3><div class="cards">' + (items.map(r => '<div class="kcard" draggable="true" data-id="' + r.id + '"><b>' + esc(r.company) + '</b><div class="po">' + esc(r.position) + '</div><div class="meta"><span>' + (r.days != null ? r.days + ' hr · ' : '') + esc(r.info) + '</span>' + statusSelect(r) + '</div></div>').join('') || '<div class="empty-note small">Kosong</div>') + '</div></div>'; }).join('');
  return head('Papan proses', 'Seret kartu antar kolom untuk mengubah status. Di ponsel, gunakan menu status pada kartu.', refreshBtn + addBtn) + '<div class="board">' + cols + '</div>';
}

/* ============ ANALISIS ============ */
function groupStats(fn, rows) {
  const m = {};
  (rows || S.rows).forEach(r => { const k = fn(r) || 'Tidak diketahui'; const g = m[k] = m[k] || { key: k, n: 0, resp: 0, itv: 0, win: 0, days: [] }; g.n++; if (!r.pending) g.resp++; if (r.rank >= 3) g.itv++; if (r.bucket === 'accepted' || r.bucket === 'offer') g.win++; if (r.respDays != null && r.respDays >= 0) g.days.push(r.respDays); });
  return Object.keys(m).map(k => m[k]).sort((a, b) => b.n - a.n);
}
function statTable(arr, label) {
  return '<div class="tablewrap" style="border:0"><table class="mini"><thead><tr><th>' + label + '</th><th class="right">Kirim</th><th class="right">Respons</th><th class="right">Interview+</th><th class="right">Diterima</th><th class="right">Hari</th><th></th></tr></thead><tbody>' +
    arr.map(g => '<tr><td>' + esc(g.key) + '</td><td class="right">' + g.n + '</td><td class="right">' + pct(g.resp, g.n) + '%</td><td class="right">' + g.itv + '</td><td class="right">' + g.win + '</td><td class="right">' + (g.days.length ? Math.round(avg(g.days)) : '–') + '</td><td><span class="meter"><i style="width:' + pct(g.resp, g.n) + '%"></i></span></td></tr>').join('') + '</tbody></table></div>';
}
function salNum(s) {
  const t = String(s || '').toLowerCase().replace(/rp/g, ''), m = t.match(/(\d+(?:[.,]\d+)*)\s*(jt|juta|k|rb|ribu)?/); if (!m) return 0;
  let v; if (m[2] === 'jt' || m[2] === 'juta') v = parseFloat(m[1].replace(',', '.')) * 1e6; else if (m[2]) v = parseFloat(m[1].replace(',', '.')) * 1e3; else v = parseInt(m[1].replace(/[.,]/g, ''), 10);
  return v >= 100000 ? v : 0;
}
function applyStreak() { const ds = new Set(S.rows.map(r => r.appliedDate).filter(Boolean)); let d = ds.has(S.today) ? S.today : addDays(S.today, -1), n = 0; while (ds.has(d)) { n++; d = addDays(d, -1); } return n; }
function periodCmp() {
  const a0 = addDays(S.today, -29), b0 = addDays(S.today, -59), b1 = addDays(S.today, -30);
  const cur = S.rows.filter(r => r.appliedDate && r.appliedDate >= a0), prv = S.rows.filter(r => r.appliedDate && r.appliedDate >= b0 && r.appliedDate <= b1);
  return { cur, prv, curResp: cur.filter(r => !r.pending).length, prvResp: prv.filter(r => !r.pending).length };
}
function delta(a, b) { if (!b && !a) return '<span class="muted">sama</span>'; if (!b) return '<span class="up">baru</span>'; const d = Math.round((a - b) / b * 100); return d === 0 ? '<span class="muted">sama</span>' : '<span class="' + (d > 0 ? 'up' : 'down') + '">' + (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + '%</span>'; }
function insights() {
  const out = [], k = kpis();
  const bySrc = groupStats(r => r.info).filter(g => g.n >= 3).sort((a, b) => pct(b.resp, b.n) - pct(a.resp, a.n) || b.n - a.n);
  if (bySrc.length) out.push('<li class="good">Sumber dengan respons tertinggi: <b>' + esc(bySrc[0].key) + '</b>, ' + pct(bySrc[0].resp, bySrc[0].n) + '% dari ' + bySrc[0].n + ' lamaran dibalas.</li>');
  groupStats(r => r.info).filter(g => g.n >= 5 && g.resp === 0).forEach(g => out.push('<li class="warn"><b>' + esc(g.key) + '</b>: ' + g.n + ' lamaran dan belum ada balasan. Pertimbangkan menyesuaikan strategi di sumber ini.</li>'));
  const byCat = groupStats(r => r.cat).filter(g => g.n >= 3).sort((a, b) => pct(b.resp, b.n) - pct(a.resp, a.n) || b.n - a.n);
  if (byCat.length) out.push('<li class="good">Kategori posisi dengan respons terbaik: <b>' + esc(byCat[0].key) + '</b> (' + pct(byCat[0].resp, byCat[0].n) + '% dari ' + byCat[0].n + ' lamaran).</li>');
  const jn = groupStats(r => r.jenis).filter(g => g.n >= 3); if (jn.length > 1) { const b = jn.slice().sort((x, y) => pct(y.resp, y.n) - pct(x.resp, x.n))[0]; out.push('<li>Jenis <b>' + esc(b.key) + '</b> paling responsif (' + pct(b.resp, b.n) + '%).</li>'); }
  if (k.ghost) out.push('<li class="warn">' + k.ghost + ' lamaran sudah lewat ' + S.settings.ghostDays + ' hari tanpa kabar (' + pct(k.ghost, k.n) + '% dari total). Satu kali follow-up lalu fokus ke lowongan baru.</li>');
  const rd = S.rows.map(r => r.respDays).filter(v => v != null && v >= 0);
  if (rd.length) out.push('<li>Balasan datang rata-rata <b>' + Math.round(avg(rd)) + ' hari</b> (median ' + median(rd) + ', 90% balasan dalam ' + quant(rd, .9) + ' hari). Pakai angka ini sebagai patokan kapan follow-up.</li>');
  const wd = [0, 0, 0, 0, 0, 0, 0]; S.rows.forEach(r => { if (r.appliedDate) wd[fromIso(r.appliedDate).getDay()]++; }); const mx = Math.max.apply(null, wd);
  if (mx >= 5) out.push('<li>Kamu paling sering melamar pada hari <b>' + HARI[wd.indexOf(mx)] + '</b> (' + mx + ' lamaran).</li>');
  const rej = S.rows.filter(r => r.bucket === 'rejected'); if (rej.length >= 3) { const s2 = rej.filter(r => r.rank === 2).length, s3 = rej.filter(r => r.rank >= 3).length; if (s2 + s3) out.push('<li>Dari ' + rej.length + ' penolakan, <b>' + s2 + '</b> terjadi di tahap tes/asesmen dan <b>' + s3 + '</b> setelah interview. Latih bagian itu di menu Belajar.</li>'); }
  const pc = periodCmp(); if (pc.cur.length || pc.prv.length) out.push('<li>30 hari terakhir: ' + pc.cur.length + ' lamaran (' + (pc.prv.length ? 'sebelumnya ' + pc.prv.length : 'periode sebelumnya kosong') + ').</li>');
  return out.length ? out.join('') : '<li>Tambahkan lebih banyak data untuk melihat wawasan otomatis.</li>';
}
function dataIssues() {
  const out = [], seen = {};
  S.rows.forEach(r => {
    const key = (r.company + '|' + r.position).toLowerCase();
    if (seen[key]) out.push({ r, m: 'Kemungkinan lamaran ganda: perusahaan dan posisi sama dengan baris lain.' }); else seen[key] = 1;
    if (!r.appliedDate) out.push({ r, m: 'Tanggal melamar kosong atau tidak terbaca.' });
    if (r.status === 'Got Rejected' && /menunggu/i.test(r.notes)) out.push({ r, m: 'Status "Got Rejected" tetapi catatan masih "menunggu".' });
    if (r.pending && r.respDate) out.push({ r, m: 'Ada tanggal respons tetapi status masih ' + r.status + '.' });
    if (r.respDate && r.appliedDate && r.respDate < r.appliedDate) out.push({ r, m: 'Tanggal respons lebih awal dari tanggal melamar.' });
    if (r.status === 'Accepted' && !r.respDate) out.push({ r, m: 'Status Accepted tanpa tanggal respons.' });
  });
  return out;
}
function summaryText() {
  const k = kpis(), rd = S.rows.map(r => r.respDays).filter(v => v != null && v >= 0);
  return 'Ringkasan pencarian kerja (' + fmtD(S.today) + ')\nTotal lamaran: ' + k.n + ' dari target ' + S.settings.target + '\nTingkat respons: ' + k.respRate + '%\nSampai interview: ' + k.interview + ' (' + pct(k.interview, k.n) + '%)\nTawaran/diterima: ' + (k.offer + k.accepted) + '\nDitolak: ' + k.rejected + ' · Menunggu: ' + k.waiting + ' · Hangus: ' + k.ghost + '\nWaktu balasan rata-rata: ' + (rd.length ? Math.round(avg(rd)) + ' hari' : '-');
}
function tileHtml(c, v, l) { return '<div class="tile" style="--tc:var(' + c + ')"><b>' + v + '</b><span>' + l + '</span></div>'; }
function viewAnalisis() {
  const t = S.aTab, n = S.rows.length, k = kpis();
  const tabs = [['ringkasan', 'Ringkasan'], ['corong', 'Corong & tahap'], ['sumber', 'Sumber & posisi'], ['waktu', 'Waktu & tren'], ['data', 'Kualitas data']];
  const tabBar = '<div class="tabs">' + tabs.map(x => '<button data-act="atab" data-v="' + x[0] + '" class="' + (t === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
  const top = head('Analisis', 'Pola dari seluruh lamaranmu: dari mana balasan datang, posisi mana yang responsif, dan di tahap mana proses berhenti.', '<button class="btn" data-act="copysum">' + ico('copy') + 'Salin ringkasan</button>' + refreshBtn);
  if (!n) return top + tabBar + '<div class="panel"><div class="empty-note">Belum ada data. Tambahkan lamaran pertamamu untuk melihat analisis.</div></div>';
  let body = '';
  const rd = S.rows.map(r => r.respDays).filter(v => v != null && v >= 0);
  if (t === 'ringkasan') {
    const pc = periodCmp(), bestWeek = (() => { const m = {}; S.rows.forEach(r => { if (r.appliedDate) { const w = weekStart(r.appliedDate); m[w] = (m[w] || 0) + 1; } }); return Math.max.apply(null, Object.keys(m).map(x => m[x]).concat([0])); })();
    body = '<div class="tiles">' + tileHtml('--c1', n, 'Total lamaran') + tileHtml('--c3', k.respRate + '%', 'Tingkat respons') + tileHtml('--c4', pct(k.interview, n) + '%', 'Sampai interview') + tileHtml('--c7', pct(k.offer + k.accepted, n) + '%', 'Tawaran / diterima') +
      tileHtml('--c2', rd.length ? median(rd) + ' hr' : '–', 'Median waktu balasan') + tileHtml('--c8', rd.length ? quant(rd, .9) + ' hr' : '–', '90% balasan dalam') + tileHtml('--c5', pct(k.ghost, n) + '%', 'Hangus') + tileHtml('--c6', applyStreak() + ' hari', 'Streak melamar') + tileHtml('--c3', bestWeek, 'Lamaran pada minggu terbaik') + '</div><div class="sp"></div>' +
      '<div class="grid g2"><div class="panel"><h2>30 hari terakhir vs 30 hari sebelumnya</h2><p class="sub">Apakah ritmemu naik atau turun</p><table class="mini"><thead><tr><th></th><th class="right">Sekarang</th><th class="right">Sebelumnya</th><th class="right">Perubahan</th></tr></thead><tbody>' +
      '<tr><td>Lamaran dikirim</td><td class="right">' + pc.cur.length + '</td><td class="right">' + pc.prv.length + '</td><td class="right">' + delta(pc.cur.length, pc.prv.length) + '</td></tr>' +
      '<tr><td>Sudah dibalas</td><td class="right">' + pc.curResp + '</td><td class="right">' + pc.prvResp + '</td><td class="right">' + delta(pc.curResp, pc.prvResp) + '</td></tr>' +
      '<tr><td>Tingkat respons</td><td class="right">' + pct(pc.curResp, pc.cur.length) + '%</td><td class="right">' + pct(pc.prvResp, pc.prv.length) + '%</td><td class="right">' + delta(pct(pc.curResp, pc.cur.length), pct(pc.prvResp, pc.prv.length)) + '</td></tr></tbody></table><p class="muted small" style="margin-top:8px">Lamaran terbaru wajar belum dibalas, jadi tingkat respons periode sekarang cenderung lebih rendah.</p></div>' +
      '<div class="panel"><h2>Wawasan otomatis</h2><p class="sub">Dihitung dari datamu saat ini</p><ul class="insights">' + insights() + '</ul></div></div><div class="sp"></div>' +
      '<div class="panel"><h2>Akumulasi lamaran</h2><p class="sub">Garis putus-putus adalah laju yang dibutuhkan untuk mencapai target pada tenggat (bila diisi di Pengaturan)</p><div class="chartbox"><canvas id="chCum"></canvas></div></div>';
  } else if (t === 'corong') {
    const steps = [['Dikirim', n, '--c1'], ['Dibalas', S.rows.filter(r => !r.pending).length, '--c2'], ['Tes / seleksi', S.rows.filter(r => r.rank >= 2).length, '--c6'], ['Interview', S.rows.filter(r => r.rank >= 3).length, '--c4'], ['Tawaran / diterima', S.rows.filter(r => r.rank >= 4).length, '--c3']];
    const funnel = steps.map((s, i) => '<div class="fstep"><span>' + s[0] + '</span><div class="fbar"><i style="width:' + pct(s[1], n) + '%;background:var(' + s[2] + ')"></i></div><em>' + s[1] + ' · ' + pct(s[1], n) + '%</em></div>' + (i ? '<div class="fdrop">Konversi dari tahap sebelumnya: ' + pct(s[1], steps[i - 1][1]) + '%</div>' : '')).join('');
    body = '<div class="grid g2"><div class="panel"><h2>Corong seleksi</h2><p class="sub">Berapa lamaran yang bertahan di tiap tahap</p><div class="funnel">' + funnel + '</div></div>' +
      '<div class="panel"><h2>Di tahap mana proses berhenti</h2><p class="sub">Lamaran yang sudah tidak lanjut (ditolak atau hangus)</p><div class="chartbox"><canvas id="chStop"></canvas></div></div></div><div class="sp"></div>' +
      '<div class="panel"><h2>Hasil per bulan melamar</h2><p class="sub">Komposisi status menurut bulan tanggal lamaran</p><div class="chartbox" style="height:300px"><canvas id="chMonth"></canvas></div></div>';
  } else if (t === 'sumber') {
    const words = {}, stop = { staff: 1, officer: 1, and: 1, dan: 1, junior: 1, senior: 1, the: 1, of: 1, for: 1, assistant: 1, 'asisten': 1, trainee: 1 };
    S.rows.forEach(r => String(r.position).toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stop[w]).forEach(w => { (words[w] = words[w] || []).push(r); }));
    const kw = Object.keys(words).filter(w => words[w].length >= 2).map(w => { const rs = words[w]; return { key: w, n: rs.length, resp: rs.filter(r => !r.pending).length, itv: rs.filter(r => r.rank >= 3).length, win: rs.filter(r => r.bucket === 'accepted' || r.bucket === 'offer').length, days: rs.map(r => r.respDays).filter(v => v != null && v >= 0) }; }).sort((a, b) => b.n - a.n).slice(0, 10);
    const wd = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'], wdIdx = [1, 2, 3, 4, 5, 6, 0];
    const wdStats = wdIdx.map((d, i) => { const rs = S.rows.filter(r => r.appliedDate && fromIso(r.appliedDate).getDay() === d); return { key: HARI[d], n: rs.length, resp: rs.filter(r => !r.pending).length, itv: rs.filter(r => r.rank >= 3).length, win: rs.filter(r => r.bucket === 'accepted' || r.bucket === 'offer').length, days: [] }; });
    body = '<div class="grid g2"><div class="panel"><h2>Per sumber</h2><p class="sub">Respons = status bukan lagi menunggu · Hari = rata-rata waktu balasan</p>' + statTable(groupStats(r => r.info), 'Sumber') + '</div><div class="panel"><h2>Respons per sumber</h2><p class="sub">Sumber dengan minimal 2 lamaran</p><div class="chartbox"><canvas id="chSrc"></canvas></div></div></div><div class="sp"></div>' +
      '<div class="grid g3"><div class="panel"><h2>Per kategori posisi</h2><p class="sub">Dikelompokkan dari kata kunci nama posisi</p>' + statTable(groupStats(r => r.cat), 'Kategori') + '</div><div class="panel"><h2>Per jenis</h2><p class="sub">Pekerjaan dibanding internship</p>' + statTable(groupStats(r => r.jenis), 'Jenis') + '</div>' +
      '<div class="panel"><h2>Kata kunci posisi</h2><p class="sub">Kata yang muncul minimal 2 kali</p>' + (kw.length ? statTable(kw, 'Kata') : '<div class="empty-note">Belum cukup data.</div>') + '</div></div><div class="sp"></div>' +
      '<div class="panel"><h2>Hari melamar vs respons</h2><p class="sub">Apakah ada hari yang lebih sering dibalas (perhatikan jumlah sampelnya)</p>' + statTable(wdStats, 'Hari') + '</div>';
  } else if (t === 'waktu') {
    const sal = S.rows.map(r => salNum(r.salary)).filter(v => v > 0);
    body = '<div class="tiles">' + tileHtml('--c2', rd.length ? Math.round(avg(rd)) + ' hr' : '–', 'Rata-rata waktu balasan') + tileHtml('--c1', rd.length ? median(rd) + ' hr' : '–', 'Median') + tileHtml('--c8', rd.length ? quant(rd, .9) + ' hr' : '–', 'Persentil 90') + tileHtml('--c5', rd.length ? Math.max.apply(null, rd) + ' hr' : '–', 'Balasan terlama') + tileHtml('--c3', rd.length ? Math.min.apply(null, rd) + ' hr' : '–', 'Balasan tercepat') +
      (sal.length ? tileHtml('--c7', rp(avg(sal)), 'Rata-rata gaji dicatat (' + sal.length + ')') : '') + '</div><div class="sp"></div>' +
      '<div class="grid g2"><div class="panel"><h2>Sebaran waktu balasan</h2><p class="sub">Selisih hari antara melamar dan respons</p><div class="chartbox"><canvas id="chResp"></canvas></div></div><div class="panel"><h2>Tren bulanan</h2><p class="sub">Jumlah lamaran dan tingkat respons per bulan melamar</p><div class="chartbox"><canvas id="chTrend"></canvas></div></div></div><div class="sp"></div>' +
      '<div class="grid g2"><div class="panel"><h2>Hari melamar</h2><p class="sub">Jumlah lamaran menurut hari</p><div class="chartbox"><canvas id="chDow"></canvas></div></div><div class="panel"><h2>Hari balasan diterima</h2><p class="sub">Menurut tanggal respons</p><div class="chartbox"><canvas id="chDowR"></canvas></div></div></div>';
  } else {
    const issues = dataIssues(), pending = S.rows.filter(r => !r.pending);
    const comp = [['Tanggal respons (yang sudah dibalas)', pending.filter(r => r.respDate).length, pending.length], ['Catatan', S.rows.filter(r => r.notes).length, n], ['Sumber info', S.rows.filter(r => r.info).length, n], ['Link lowongan', S.rows.filter(r => r.link).length, n], ['Kontak HRD', S.rows.filter(r => r.contact).length, n], ['Gaji dicatat', S.rows.filter(r => r.salary).length, n]];
    body = '<div class="grid g2"><div class="panel"><h2>Kelengkapan data</h2><p class="sub">Makin lengkap, makin akurat analisisnya</p>' + comp.map(c => '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:13.5px"><span>' + c[0] + '</span><b>' + pct(c[1], c[2]) + '%</b></div><div class="prog"><i style="width:' + pct(c[1], c[2]) + '%"></i></div></div>').join('') + '</div>' +
      '<div class="panel"><h2>Cek kualitas data</h2><p class="sub">Hal yang mungkin perlu dirapikan di datamu</p>' + (issues.length ? issues.map(i => '<div class="issue"><span><b>' + esc(i.r.company) + '</b> · ' + esc(i.m) + '</span><button class="btn sm" data-act="edit" data-id="' + i.r.id + '">Perbaiki</button></div>').join('') : '<div class="empty-note">Tidak ditemukan masalah. Datamu rapi.</div>') + '</div></div>';
  }
  return top + tabBar + body;
}
function drawAnalisis() {
  const t = S.aTab, n = S.rows.length; if (!n) return;
  if (t === 'ringkasan') {
    const dates = S.rows.map(r => r.appliedDate).filter(Boolean).sort(); if (!dates.length) return;
    const w0 = weekStart(dates[0]), weeks = []; for (let w = w0; w <= weekStart(S.today); w = addDays(w, 7)) weeks.push(w);
    let cum = 0; const data = weeks.map(w => { cum += S.rows.filter(r => r.appliedDate && weekStart(r.appliedDate) === w).length; return cum; });
    const ds = [{ label: 'Akumulasi', data, borderColor: cssv('--c1'), backgroundColor: cssv('--c1') + '22', fill: true, tension: .25, pointRadius: 2 }];
    if (S.settings.deadline && weeks.length > 1) { const tw = Math.max(1, diffDays(w0, S.settings.deadline) / 7); ds.push({ label: 'Laju target', data: weeks.map((w, i) => Math.min(S.settings.target, Math.round(S.settings.target * (i / tw)))), borderColor: cssv('--c4'), borderDash: [6, 5], pointRadius: 0, fill: false }); }
    mkChart('chCum', { type: 'line', data: { labels: weeks.map(w => { const d = fromIso(w); return d.getDate() + ' ' + BLN[d.getMonth()]; }), datasets: ds }, options: barOpts({ plugins: { legend: { display: ds.length > 1 } } }) });
  }
  if (t === 'corong') {
    const stopped = S.rows.filter(r => r.bucket === 'rejected' || r.bucket === 'ghost');
    const labels = ['Tanpa balasan', 'Ditolak tanpa tes', 'Tahap tes / asesmen', 'Setelah interview'], cnt = [stopped.filter(r => r.bucket === 'ghost').length, stopped.filter(r => r.bucket === 'rejected' && r.rank <= 1).length, stopped.filter(r => r.bucket === 'rejected' && r.rank === 2).length, stopped.filter(r => r.bucket === 'rejected' && r.rank >= 3).length];
    mkChart('chStop', { type: 'doughnut', data: { labels, datasets: [{ data: cnt, backgroundColor: [cssv('--idle'), cssv('--c5'), cssv('--c6'), cssv('--c4')], borderColor: cssv('--panel'), borderWidth: 2 }] }, options: { maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, usePointStyle: true } } } } });
    const months = Array.from(new Set(S.rows.map(r => r.appliedDate && monthKey(r.appliedDate)).filter(Boolean))).sort().slice(-8), keys = Object.keys(BK);
    mkChart('chMonth', { type: 'bar', data: { labels: months.map(m => BLN[Number(m.slice(5)) - 1] + ' ' + m.slice(2, 4)), datasets: keys.map(b => ({ label: BK[b].l, data: months.map(m => S.rows.filter(r => r.appliedDate && monthKey(r.appliedDate) === m && r.bucket === b).length), backgroundColor: cssv(BK[b].c), borderRadius: 3 })) }, options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, ticks: { precision: 0 }, grid: { color: cssv('--line') } } } } });
  }
  if (t === 'sumber') {
    const src = groupStats(r => r.info).filter(g => g.n >= 2);
    mkChart('chSrc', { type: 'bar', data: { labels: src.map(g => g.key), datasets: [{ label: 'Respons %', data: src.map(g => pct(g.resp, g.n)), backgroundColor: cssv('--c3'), borderRadius: 6 }, { label: 'Interview+ %', data: src.map(g => pct(g.itv, g.n)), backgroundColor: cssv('--c4'), borderRadius: 6 }] }, options: { maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { x: { beginAtZero: true, max: 100, grid: { color: cssv('--line') } }, y: { grid: { display: false } } } } });
  }
  if (t === 'waktu') {
    const b = [['0–3 hr', 0, 3], ['4–7 hr', 4, 7], ['8–14 hr', 8, 14], ['15–21 hr', 15, 21], ['22+ hr', 22, 9999]], rd = S.rows.map(r => r.respDays).filter(v => v != null && v >= 0);
    mkChart('chResp', { type: 'bar', data: { labels: b.map(x => x[0]), datasets: [{ data: b.map(x => rd.filter(v => v >= x[1] && v <= x[2]).length), backgroundColor: cssv('--c2'), borderRadius: 6, maxBarThickness: 36 }] }, options: barOpts() });
    const months = Array.from(new Set(S.rows.map(r => r.appliedDate && monthKey(r.appliedDate)).filter(Boolean))).sort().slice(-10);
    mkChart('chTrend', { type: 'bar', data: { labels: months.map(m => BLN[Number(m.slice(5)) - 1] + ' ' + m.slice(2, 4)), datasets: [{ type: 'bar', label: 'Lamaran', data: months.map(m => S.rows.filter(r => r.appliedDate && monthKey(r.appliedDate) === m).length), backgroundColor: cssv('--c1'), borderRadius: 6, yAxisID: 'y' },
      { type: 'line', label: 'Respons %', data: months.map(m => { const rs = S.rows.filter(r => r.appliedDate && monthKey(r.appliedDate) === m); return pct(rs.filter(r => !r.pending).length, rs.length); }), borderColor: cssv('--c3'), backgroundColor: cssv('--c3'), tension: .25, yAxisID: 'y1' }] },
      options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: cssv('--line') } }, y1: { position: 'right', beginAtZero: true, max: 100, grid: { display: false } }, x: { grid: { display: false } } } } });
    const idx = [1, 2, 3, 4, 5, 6, 0], lab = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    mkChart('chDow', { type: 'bar', data: { labels: lab, datasets: [{ data: idx.map(d => S.rows.filter(r => r.appliedDate && fromIso(r.appliedDate).getDay() === d).length), backgroundColor: cssv('--c4'), borderRadius: 6, maxBarThickness: 36 }] }, options: barOpts() });
    mkChart('chDowR', { type: 'bar', data: { labels: lab, datasets: [{ data: idx.map(d => S.rows.filter(r => r.respDate && fromIso(r.respDate).getDay() === d).length), backgroundColor: cssv('--c7'), borderRadius: 6, maxBarThickness: 36 }] }, options: barOpts() });
  }
}

/* ============ TINDAK LANJUT ============ */
const TPL = {
  followup: { l: 'Follow-up lamaran', s: r => 'Follow-up Lamaran ' + r.position + ' – ' + displayName(), b: r => 'Yth. Bapak/Ibu HRD ' + r.company + ',\n\nSaya ' + displayName() + ', pelamar posisi ' + r.position + ' yang mengirimkan lamaran pada ' + fmtD(r.appliedDate) + '. Melalui email ini saya ingin menanyakan perkembangan proses seleksinya.\n\nSaya tetap sangat tertarik bergabung dan siap mengikuti tahapan berikutnya. Bila diperlukan dokumen tambahan, saya dengan senang hati melengkapinya.\n\nTerima kasih atas waktu dan perhatian Bapak/Ibu.\n\nHormat saya,\n' + displayName() },
  thanks: { l: 'Terima kasih setelah interview', s: r => 'Terima Kasih – Interview ' + r.position, b: r => 'Yth. Bapak/Ibu,\n\nTerima kasih atas kesempatan wawancara untuk posisi ' + r.position + ' di ' + r.company + '. Saya senang mengetahui lebih jauh tentang tim dan tanggung jawab posisi ini.\n\nPercakapan kita menguatkan minat saya untuk berkontribusi. Saya siap menyediakan informasi tambahan bila dibutuhkan.\n\nHormat saya,\n' + displayName() },
  status: { l: 'Tanya hasil tes / asesmen', s: r => 'Menanyakan Hasil Tahap Seleksi – ' + r.position, b: r => 'Yth. Bapak/Ibu HRD ' + r.company + ',\n\nSaya ' + displayName() + ', peserta seleksi posisi ' + r.position + '. Saya telah menyelesaikan tahap seleksi sebelumnya dan ingin menanyakan informasi mengenai hasil serta tahapan berikutnya.\n\nTerima kasih atas bantuan Bapak/Ibu.\n\nHormat saya,\n' + displayName() },
  accept: { l: 'Menerima tawaran', s: r => 'Konfirmasi Penerimaan Tawaran – ' + r.position, b: r => 'Yth. Bapak/Ibu ' + r.company + ',\n\nTerima kasih atas tawaran untuk posisi ' + r.position + '. Dengan senang hati saya menerima tawaran tersebut dan siap bergabung sesuai jadwal yang disepakati.\n\nMohon informasikan dokumen dan langkah administrasi yang perlu saya siapkan.\n\nHormat saya,\n' + displayName() },
  decline: { l: 'Menolak tawaran dengan sopan', s: r => 'Terima Kasih atas Tawaran – ' + r.position, b: r => 'Yth. Bapak/Ibu ' + r.company + ',\n\nTerima kasih banyak atas tawaran untuk posisi ' + r.position + ' dan waktu yang telah diluangkan selama proses seleksi. Setelah mempertimbangkan dengan matang, dengan berat hati saya memutuskan untuk tidak melanjutkan tawaran ini.\n\nSaya sangat menghargai kesempatan ini dan berharap hubungan baik kita tetap terjaga.\n\nHormat saya,\n' + displayName() }
};
function tplRow() { return byId(S.tpl.id) || followList()[0] || S.rows.slice().sort((a, b) => b.id - a.id)[0]; }
function viewTindak() {
  const fl = followList(), due = dueList(), ghosts = S.rows.filter(r => r.ghost).sort((a, b) => b.days - a.days);
  const item = (r, note) => '<div class="rowitem"><div class="t"><b>' + esc(r.company) + '</b><span>' + esc(r.position) + ' · ' + note + '</span></div><div class="actions"><button class="btn sm" data-act="tpl" data-id="' + r.id + '">' + ico('mail', 15) + 'Pesan</button><button class="btn sm" data-act="edit" data-id="' + r.id + '">' + ico('edit', 15) + '</button></div></div>';
  const r = tplRow(), t = TPL[S.tpl.type];
  const sel = '<select data-act="tplrow" aria-label="Pilih lamaran">' + S.rows.slice().sort((a, b) => a.company.localeCompare(b.company)).map(x => '<option value="' + x.id + '"' + (r && x.id === r.id ? ' selected' : '') + '>' + esc(x.company + ' – ' + x.position) + '</option>').join('') + '</select>';
  return head('Tindak lanjut', 'Daftar lamaran yang perlu disentuh, plus template pesan yang terisi otomatis.', refreshBtn) +
    '<div class="grid g2"><div class="stack"><div class="panel"><h2>Jadwal tindak lanjut</h2><p class="sub">Tanggal yang kamu isi di form lamaran, dalam 7 hari ke depan atau sudah lewat.</p>' + (due.length ? '<div class="rowlist">' + due.map(x => item(x, fmtD(x.followup))).join('') + '</div>' : '<div class="empty-note">Belum ada jadwal.</div>') + '</div>' +
    '<div class="panel"><h2>Saatnya follow-up</h2><p class="sub">' + S.settings.followDays + ' sampai ' + (S.settings.ghostDays - 1) + ' hari tanpa kabar.</p>' + (fl.length ? '<div class="rowlist">' + fl.map(x => item(x, x.days + ' hari')).join('') + '</div>' : '<div class="empty-note">Tidak ada lamaran pada rentang ini.</div>') + '</div>' +
    '<div class="panel"><h2>Dianggap hangus</h2><p class="sub">Lebih dari ' + S.settings.ghostDays + ' hari tanpa kabar.</p>' + (ghosts.length ? '<div class="rowlist">' + ghosts.map(x => item(x, x.days + ' hari')).join('') + '</div>' : '<div class="empty-note">Tidak ada.</div>') + '</div></div>' +
    '<div class="panel"><h2>Template pesan</h2><p class="sub">Pilih jenis pesan dan lamaran. Isi bisa kamu ubah sebelum disalin.</p><div class="field"><label>Jenis pesan</label><select data-act="tpltype">' + Object.keys(TPL).map(k => '<option value="' + k + '"' + (S.tpl.type === k ? ' selected' : '') + '>' + TPL[k].l + '</option>').join('') + '</select></div><div class="field"><label>Lamaran</label>' + sel + '</div>' +
    (r ? '<div class="field"><label>Subjek</label><input type="text" id="tplSubject" value="' + esc(t.s(r)) + '"></div><div class="field"><label>Isi pesan</label><textarea class="tpl-out" id="tplBody">' + esc(t.b(r)) + '</textarea></div><div class="actions"><button class="btn primary" data-act="copytpl">' + ico('copy') + 'Salin pesan</button><button class="btn" data-act="mailtpl">' + ico('mail') + 'Buka di aplikasi email</button></div>' : '<div class="empty-note">Tambahkan lamaran terlebih dahulu.</div>') + '</div></div>';
}

/* ============ PENGATURAN ============ */
function viewAtur() {
  const s = S.settings;
  return head('Pengaturan', 'Target, ambang waktu, tampilan, dan data milikmu di browser ini.') +
    '<div class="grid g2"><div class="panel"><h2>Target & tampilan</h2><p class="sub">Dipakai untuk hero Beranda dan penandaan "hangus".</p><form id="setForm"><div class="field"><label>Nama panggilan</label><input type="text" name="name" maxlength="40" value="' + esc(s.name) + '"></div>' +
    '<div class="fgrid"><div class="field"><label>Target jumlah perusahaan</label><input type="number" name="target" min="1" max="1000" value="' + esc(s.target) + '"></div><div class="field"><label>Tenggat target (opsional)</label><input type="date" name="deadline" value="' + esc(s.deadline) + '"></div>' +
    '<div class="field"><label>Mulai follow-up setelah (hari)</label><input type="number" name="followDays" min="3" max="60" value="' + esc(s.followDays) + '"></div><div class="field"><label>Dianggap hangus setelah (hari)</label><input type="number" name="ghostDays" min="7" max="90" value="' + esc(s.ghostDays) + '"></div></div>' +
    '<div class="field"><label>Tema</label><select name="theme">' + [['auto', 'Ikuti perangkat'], ['light', 'Terang'], ['dark', 'Gelap']].map(o => '<option value="' + o[0] + '"' + (s.theme === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div><button class="btn primary" type="submit">Simpan pengaturan</button></form></div>' +
    '<div class="stack"><div class="panel"><h2>Data & cadangan</h2><p class="sub">Datamu (' + S.rows.length + ' lamaran) tersimpan hanya di browser ini. Menghapus data situs browser akan menghapusnya, jadi unduh cadangan secara berkala.</p>' +
    '<p class="small muted">Cadangan terakhir: ' + (s.lastBackup ? fmtD(s.lastBackup) : 'belum pernah') + '</p><div class="actions"><button class="btn primary" data-act="backup">' + ico('download', 16) + ' Unduh cadangan (.json)</button><button class="btn" data-act="pickfile">Impor / pulihkan file…</button><button class="btn" data-act="csv">Ekspor CSV</button></div>' + fileInput +
    '<p class="muted small" style="margin-top:10px">Impor menerima CSV dari Google Sheets (menambah ke data yang ada) dan cadangan .json (mengganti seluruh data). Untuk pindah perangkat: unduh cadangan di perangkat lama, lalu pulihkan di perangkat baru.</p></div>' +
    '<div class="panel"><h2>Pasang sebagai aplikasi</h2><p class="sub" style="margin:0">Chrome/Edge: klik ikon pasang di bilah alamat. Android: menu ⋮ → Tambahkan ke layar utama. iPhone: Bagikan → Tambah ke Layar Utama. Setelah dipasang, aplikasi bisa dibuka tanpa internet.</p></div>' +
    '<div class="panel"><h2>Hapus semua data</h2><p class="sub">Menghapus lamaran, pengaturan, dan progres belajar dari browser ini.</p><button class="btn danger" data-act="wipe">Hapus semua data</button></div></div></div>';
}

/* ============ EVENT ============ */
Object.assign(LT.act, {
  nav(el) { S.view = el.dataset.v; render(); window.scrollTo(0, 0); },
  reload() { load(); }, add() { openForm(); }, edit(el) { openForm(el.dataset.id); }, del(el) { closeModal(); askDelete(el.dataset.id); }, close() { closeModal(); }, csv() { exportCsv(); },
  bucket(el) { S.filters.bucket = el.dataset.v; render(); },
  atab(el) { S.aTab = el.dataset.v; render(); },
  copysum() { copyText(summaryText()); },
  tpl(el) { S.tpl.id = Number(el.dataset.id); S.view = 'tindak'; render(); window.scrollTo(0, 0); },
  copytpl() { copyText($('#tplSubject').value + '\n\n' + $('#tplBody').value); },
  mailtpl() { const r = tplRow(), to = r && /\S+@\S+/.test(r.contact || '') ? r.contact.match(/\S+@\S+/)[0] : ''; window.open('mailto:' + to + '?subject=' + encodeURIComponent($('#tplSubject').value) + '&body=' + encodeURIComponent($('#tplBody').value), '_blank'); },
  pickfile() { const f = $('#fileImport'); if (f) f.click(); },
  async backup() { try { const txt = await api('exportBackup'); download('lamaran-tracker-cadangan-' + S.today + '.json', txt, 'application/json'); S.settings.lastBackup = S.today; render(); toast('Cadangan diunduh. Simpan di tempat aman.'); } catch (e) { toast(e.message, 'err'); } },
  wipe() { confirmBox('Hapus <b>semua</b> data (lamaran, pengaturan, progres belajar) dari browser ini? Tindakan ini tidak bisa dibatalkan.', async () => { busy(true); try { await api('wipeAll'); S.view = 'beranda'; toast('Semua data dihapus.'); await load(); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } }); }
});
LT.chg.importfile = async el => {
  const file = el.files && el.files[0]; if (!file) return;
  let text; try { text = await readFile(file); } catch (e) { toast(e.message, 'err'); return; }
  el.value = '';
  if (text.trim().charAt(0) === '{') confirmBox('Pulihkan dari cadangan? Ini akan <b>mengganti seluruh data</b> di browser ini.', async () => { busy(true); try { const r = await api('restoreBackup', text); toast(r.added + ' lamaran dipulihkan.'); await load(); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } });
  else { busy(true); try { const r = await api('importCsv', text); toast(r.added + ' lamaran diimpor.'); await load(); } catch (e) { toast(e.message, 'err'); } finally { busy(false); } }
};
LT.chg.status = el => setStatus(el.dataset.id, el.value);
LT.chg.filter = el => { S.filters[el.dataset.k] = el.value; render(); };
LT.chg.tpltype = el => { S.tpl.type = el.value; render(); };
LT.chg.tplrow = el => { S.tpl.id = Number(el.value); render(); };
LT.inp.q = el => { S.filters.q = el.value; const pos = el.selectionStart; render(); const q = $('#q'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } };

document.addEventListener('click', async e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  if (act === 'modal-bg') { if (e.target === el) closeModal(); return; }
  if (el.tagName === 'SELECT' || el.tagName === 'INPUT') return;
  if (LT.act[act]) await LT.act[act](el, e);
});
document.addEventListener('change', e => { const el = e.target.closest('[data-act]'); if (el && LT.chg[el.dataset.act]) LT.chg[el.dataset.act](el, e); });
document.addEventListener('input', e => { const el = e.target.closest('[data-inp]'); if (el && LT.inp[el.dataset.inp]) LT.inp[el.dataset.inp](el, e); });
document.addEventListener('submit', async e => {
  e.preventDefault();
  if (e.target.id === 'rowForm') submitForm(e.target);
  if (e.target.id === 'setForm') {
    const p = {}; new FormData(e.target).forEach((v, k) => { p[k] = v; }); busy(true);
    try { S.settings = await api('saveSettings', p); applyTheme(); enrich(); render(); toast('Pengaturan disimpan.'); } catch (err) { toast(err.message, 'err'); } finally { busy(false); }
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.kcard'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.id); e.dataTransfer.effectAllowed = 'move'; c.classList.add('drag'); });
document.addEventListener('dragend', () => { $$('.kcard.drag').forEach(c => c.classList.remove('drag')); $$('.col.over').forEach(c => c.classList.remove('over')); });
document.addEventListener('dragover', e => { const c = e.target.closest && e.target.closest('.col'); if (c) { e.preventDefault(); $$('.col.over').forEach(x => x !== c && x.classList.remove('over')); c.classList.add('over'); } });
document.addEventListener('drop', e => { const c = e.target.closest && e.target.closest('.col'); if (!c) return; e.preventDefault(); c.classList.remove('over'); const def = COLS.find(x => x.k === c.dataset.col), r = byId(e.dataTransfer.getData('text/plain')); if (r && def && !def.test(r)) setStatus(r.id, def.set); });

/* ============ MUAT DATA ============ */
function normProgress(p) {
  p = p || {}; return { done: p.done || {}, quiz: p.quiz || {}, daily: Object.assign({ done: [], last: '', streak: 0, best: 0 }, p.daily || {}), tax: Object.assign({ read: [] }, p.tax || {}) };
}
async function load() {
  S.loading = true; S.error = null; render();
  try {
    const d = await api('getBootstrap');
    S.user = d.user || {}; S.settings = Object.assign(S.settings, d.settings); S.progress = normProgress(d.progress); S.statuses = d.statuses; S.today = d.today || S.today;
    S.persistent = d.persistent; S.needsSetup = !!d.needsSetup; S.setupError = d.setupError || ''; S.rows = d.rows || []; S.meta = d.meta || {};
    applyTheme(); enrich(); S.loading = false;
  } catch (e) { S.loading = false; S.error = e.message; }
  render();
}
LT.start = function () {
  applyTheme();
  if (window.matchMedia) { try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.settings.theme === 'auto') { applyTheme(); render(); } }); } catch (e) {} }
  load();
};
})();
