/* =====================================================================
   keuangan.js: dompet, cashflow, rekap, anggaran, tabungan, tagihan, dan transfer data HP <-> laptop.
   Data disimpan di browser (kunci 'lt.fin.v1'). Tiap item punya id unik dan updatedAt supaya
   data dari dua perangkat bisa digabung tanpa dobel (lihat bagian "Transfer data").
   ===================================================================== */
(function () {
'use strict';
const { S, h } = LT;
const { $, $$, esc, pad, rp, money, pct, ico, toast, head, cssv, addDays, diffDays, fromIso, toIso, fmtD, mkChart, openModal, closeModal, confirmBox } = h;
const kv = LTStore._kv, render = () => h.render();
const BLN_F = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BLN_S = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const nowTs = () => Date.now();
const FKEY = 'lt.fin.v1';

/* ---------- bawaan (id tetap agar sama di semua perangkat) ---------- */
const DEF_WALLETS = [['w_tunai', 'Tunai', 'tunai'], ['w_bank', 'Bank', 'bank'], ['w_ewallet', 'E-wallet', 'ewallet']];
const DEF_CATS = [
  ['k_makan', 'out', 'Makan & minum', '🍜'], ['k_transport', 'out', 'Transport', '🚌'], ['k_belanja', 'out', 'Belanja', '🛒'], ['k_tagihan', 'out', 'Tagihan & langganan', '🧾'],
  ['k_rumah', 'out', 'Kos / rumah', '🏠'], ['k_kesehatan', 'out', 'Kesehatan', '💊'], ['k_hiburan', 'out', 'Hiburan', '🎬'], ['k_pendidikan', 'out', 'Pendidikan', '📚'],
  ['k_sosial', 'out', 'Sosial & hadiah', '🎁'], ['k_tabung', 'out', 'Tabungan & investasi', '🐷'], ['k_lain', 'out', 'Lainnya', '✨'],
  ['i_gaji', 'in', 'Gaji', '💼'], ['i_freelance', 'in', 'Freelance', '🧑‍💻'], ['i_bonus', 'in', 'Bonus / THR', '🎉'], ['i_hadiah', 'in', 'Hadiah', '🎁'], ['i_lain', 'in', 'Lainnya', '✨'],
  ['k_adj', 'out', 'Penyesuaian saldo', '⚖️', true], ['i_adj', 'in', 'Penyesuaian saldo', '⚖️', true]
];
/* kata kunci untuk menebak kategori dari catatan */
const KW = {
  k_transport: ['grab', 'gojek', 'gocar', 'goride', 'bensin', 'pertamax', 'pertalite', 'parkir', 'tol', 'ojek', 'angkot', 'kereta', 'krl', 'busway', 'transjakarta', 'travel', 'tiket'],
  k_makan: ['makan', 'nasi', 'kopi', 'warteg', 'bakso', 'mie', 'ayam', 'sate', 'minum', 'teh', 'jajan', 'resto', 'cafe', 'kafe', 'gofood', 'grabfood', 'shopeefood', 'sarapan', 'snack'],
  k_belanja: ['indomaret', 'alfamart', 'supermarket', 'belanja', 'shopee', 'tokopedia', 'lazada', 'pasar', 'sabun', 'shampo'],
  k_tagihan: ['listrik', 'pln', 'wifi', 'internet', 'pulsa', 'paket data', 'netflix', 'spotify', 'youtube', 'langganan', 'bpjs', 'asuransi', 'cicilan'],
  k_rumah: ['kos', 'kost', 'sewa', 'kontrakan', 'pdam', 'galon', 'gas'], k_kesehatan: ['obat', 'apotek', 'dokter', 'klinik', 'rumah sakit', 'vitamin', 'gym'],
  k_hiburan: ['bioskop', 'nonton', 'game', 'konser', 'karaoke', 'liburan'], k_pendidikan: ['buku', 'kursus', 'kuliah', 'spp', 'ukt', 'fotokopi', 'print', 'udemy'],
  k_sosial: ['hadiah', 'kado', 'sumbangan', 'sedekah', 'zakat', 'donasi', 'arisan'],
  i_gaji: ['gaji', 'salary', 'payroll'], i_freelance: ['freelance', 'proyek', 'project', 'honor', 'fee', 'jasa'], i_bonus: ['bonus', 'thr', 'insentif']
};

/* ---------- data ---------- */
let F = null;
function loadF() {
  let f = kv.read(FKEY, null) || { v: 1, device: uid(), lastOut: 0 };
  ['wallets', 'cats', 'txs', 'tpls', 'bills', 'budgets', 'goals'].forEach(k => { if (!Array.isArray(f[k])) f[k] = []; });
  if (!f.device) f.device = uid();
  DEF_WALLETS.forEach(w => { if (!f.wallets.find(x => x.id === w[0])) f.wallets.push({ id: w[0], name: w[1], type: w[2], opening: 0, archived: false, updatedAt: 0 }); });
  DEF_CATS.forEach(c => { if (!f.cats.find(x => x.id === c[0])) f.cats.push({ id: c[0], kind: c[1], name: c[2], emoji: c[3], sys: !!c[4], updatedAt: 0 }); });
  return f;
}
const fin = () => F || (F = loadF());
function saveF() { kv.write(FKEY, fin()); }
const touch = o => { o.updatedAt = nowTs(); return o; };
const live = arr => arr.filter(x => !x.deleted);
const wallets = () => live(fin().wallets).filter(w => !w.archived);
const walletName = id => { const w = fin().wallets.find(x => x.id === id); return w ? w.name : '–'; };
const catById = id => fin().cats.find(x => x.id === id);
const cats = kind => live(fin().cats).filter(c => c.kind === kind && !c.sys);
const txs = () => live(fin().txs);
const ymOf = iso => iso.slice(0, 7);
const dim = ym => new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0).getDate();
const shiftYm = (ym, d) => { const dt = new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1 + d, 1); return dt.getFullYear() + '-' + pad(dt.getMonth() + 1); };
const ymLabel = ym => BLN_F[Number(ym.slice(5, 7)) - 1] + ' ' + ym.slice(0, 4);
const sums = list => { let i = 0, o = 0; list.forEach(t => { if (t.type === 'in') i += t.amount; else if (t.type === 'out') o += t.amount; }); return { in: i, out: o, net: i - o }; };
const monthTxs = ym => txs().filter(t => ymOf(t.date) === ym);
function balances() {
  const b = {}; fin().wallets.forEach(w => { b[w.id] = Number(w.opening) || 0; });
  txs().forEach(t => { if (t.type === 'in') b[t.wallet] = (b[t.wallet] || 0) + t.amount; else if (t.type === 'out') b[t.wallet] = (b[t.wallet] || 0) - t.amount; else if (t.type === 'transfer') { b[t.wallet] = (b[t.wallet] || 0) - t.amount; b[t.to] = (b[t.to] || 0) + t.amount; } });
  return b;
}
const totalBalance = () => { const b = balances(); return wallets().reduce((s, w) => s + (b[w.id] || 0), 0); };
const sortTx = (a, b) => b.date.localeCompare(a.date) || (b.updatedAt || 0) - (a.updatedAt || 0);
function addTx(t) {
  const x = { id: uid(), date: t.date || S.today, type: t.type, amount: Math.round(Number(t.amount) || 0), wallet: t.wallet, to: t.to || '', cat: t.cat || '', note: String(t.note || '').trim().slice(0, 200), tag: String(t.tag || '').trim().replace(/^#/, '').slice(0, 40), updatedAt: nowTs() };
  if (!(x.amount > 0)) throw new Error('Isi jumlahnya dulu.'); if (!x.wallet) throw new Error('Pilih dompet.');
  if (x.type === 'transfer' && (!x.to || x.to === x.wallet)) throw new Error('Pilih dompet tujuan yang berbeda.');
  fin().txs.push(x); fin().pref = Object.assign(fin().pref || {}, { wallet: x.wallet }); saveF(); return x;
}
function updTx(id, p) { const t = fin().txs.find(x => x.id === id); if (!t) return; Object.assign(t, p); t.amount = Math.round(Number(t.amount) || 0); touch(t); saveF(); }
function delTx(id) { const t = fin().txs.find(x => x.id === id); if (t) { t.deleted = true; touch(t); saveF(); } }
function guessCat(note, kind) {
  const n = String(note || '').toLowerCase().trim(); if (!n) return '';
  const hist = txs().slice().sort(sortTx).find(t => t.note.toLowerCase() === n && t.cat && (catById(t.cat) || {}).kind === kind); if (hist) return hist.cat;
  for (const id in KW) { if ((kind === 'in') !== (id[0] === 'i')) continue; if (KW[id].some(k => n.indexOf(k) > -1)) return id; }
  return '';
}
function topCats(kind, n) {
  const cnt = {}; txs().forEach(t => { if (t.cat) cnt[t.cat] = (cnt[t.cat] || 0) + 1; });
  return cats(kind).slice().sort((a, b) => (cnt[b.id] || 0) - (cnt[a.id] || 0)).slice(0, n);
}
const rupiahInput = el => { const n = money(el.value); el.value = n ? n.toLocaleString('id-ID') : ''; };

/* ---------- komponen ---------- */
function txRow(t) {
  const c = catById(t.cat), em = t.type === 'transfer' ? '🔁' : (c ? c.emoji : '•');
  const title = t.note || (t.type === 'transfer' ? 'Transfer' : (c ? c.name : 'Tanpa kategori'));
  const sub = (t.type === 'transfer' ? walletName(t.wallet) + ' → ' + walletName(t.to) : (c ? c.name + ' · ' : '') + walletName(t.wallet)) + (t.tag ? ' · #' + t.tag : '');
  return '<button class="txr" data-act="txedit" data-id="' + t.id + '"><span class="em">' + em + '</span><span class="tt"><b>' + esc(title) + '</b><small>' + esc(sub) + ' · ' + fmtD(t.date) + '</small></span><span class="amt ' + (t.type === 'in' ? 'pos' : t.type === 'out' ? 'neg' : '') + '">' + (t.type === 'in' ? '+' : t.type === 'out' ? '−' : '') + rp(t.amount) + '</span></button>';
}
const monthNav = (act, ym) => '<div class="monthnav"><button class="btn icon sm" data-act="' + act + '" data-d="-1" aria-label="Bulan sebelumnya">‹</button><b>' + ymLabel(ym) + '</b><button class="btn icon sm" data-act="' + act + '" data-d="1" aria-label="Bulan berikutnya">›</button></div>';
const tileF = (c, v, l, sub) => '<div class="tile" style="--tc:var(' + c + ')"><b>' + v + '</b><span>' + l + '</span>' + (sub ? '<span style="display:block">' + sub + '</span>' : '') + '</div>';
const walletOpts = (sel, skip) => wallets().filter(w => w.id !== skip).map(w => '<option value="' + w.id + '"' + (w.id === sel ? ' selected' : '') + '>' + esc(w.name) + '</option>').join('');
const catOpts = (kind, sel) => cats(kind).map(c => '<option value="' + c.id + '"' + (c.id === sel ? ' selected' : '') + '>' + c.emoji + ' ' + esc(c.name) + '</option>').join('');

/* =====================================================================
   CATAT (layar utama mode cepat)
   ===================================================================== */
const Q = { type: 'out', cat: '', wallet: '', to: '', amt: '', note: '', date: '', tag: '', manual: false };
function stash() { const g = id => { const e = $(id); return e ? e.value : null; }; const a = g('#q_amt'); if (a !== null) Q.amt = a; const n = g('#q_note'); if (n !== null) Q.note = n; const d = g('#q_date'); if (d !== null) Q.date = d; const t = g('#q_tag'); if (t !== null) Q.tag = t; const w = g('#q_wallet'); if (w) Q.wallet = w; const to = g('#q_to'); if (to) Q.to = to; }
function viewCatat() {
  const f = fin(), quick = S.mode === 'cepat', ws = wallets(); const kind = Q.type === 'in' ? 'in' : 'out';
  if (!Q.wallet || !ws.find(w => w.id === Q.wallet)) Q.wallet = (f.pref && ws.find(w => w.id === f.pref.wallet)) ? f.pref.wallet : (ws[0] || {}).id;
  if (Q.type === 'transfer' && (!Q.to || Q.to === Q.wallet)) Q.to = (ws.find(w => w.id !== Q.wallet) || {}).id || '';
  if (!Q.date) Q.date = S.today;
  const seg = '<div class="seg3">' + [['out', 'Keluar'], ['in', 'Masuk'], ['transfer', 'Transfer']].map(x => '<button type="button" data-act="qtype" data-v="' + x[0] + '" class="' + (Q.type === x[0] ? 'on ' + x[0] : '') + '">' + x[1] + '</button>').join('') + '</div>';
  const tp = live(f.tpls).filter(t => t.type === Q.type || (Q.type !== 'transfer' && false));
  const tplRow = tp.length ? '<div class="chipset">' + tp.map(t => '<button type="button" class="cchip fav" data-act="qtpl" data-id="' + t.id + '">⭐ ' + esc(t.name) + (t.amount ? ' · ' + rp(t.amount) : '') + '</button>').join('') + '</div>' : '';
  let mid;
  if (Q.type === 'transfer') mid = '<div class="fgrid"><div class="field"><label>Dari dompet</label><select id="q_wallet" data-act="qwallet">' + walletOpts(Q.wallet) + '</select></div><div class="field"><label>Ke dompet</label><select id="q_to">' + walletOpts(Q.to, Q.wallet) + '</select></div></div>';
  else {
    const top = topCats(kind, 7), all = cats(kind), shown = top.slice();
    if (Q.cat && !shown.find(c => c.id === Q.cat) && catById(Q.cat)) shown.unshift(catById(Q.cat));
    mid = '<div class="field"><label>Kategori</label><div class="chipset">' + shown.map(c => '<button type="button" class="cchip' + (Q.cat === c.id ? ' on' : '') + '" data-act="qcat" data-id="' + c.id + '">' + c.emoji + ' ' + esc(c.name) + '</button>').join('') +
      (all.length > shown.length ? '<select class="cchip" data-act="qcatsel" aria-label="Kategori lain"><option value="">Lainnya…</option>' + all.filter(c => !shown.find(s => s.id === c.id)).map(c => '<option value="' + c.id + '">' + c.emoji + ' ' + esc(c.name) + '</option>').join('') + '</select>' : '') + '</div></div>' +
      '<div class="field"><label>Dompet</label><select id="q_wallet">' + walletOpts(Q.wallet) + '</select></div>';
  }
  const notes = Array.from(new Set(txs().slice().sort(sortTx).map(t => t.note).filter(Boolean))).slice(0, 30);
  const form = '<div class="panel qform">' + seg + tplRow + '<div class="field" style="margin-top:12px"><label for="q_amt">Jumlah (Rp)</label><input type="text" id="q_amt" class="bigamt" inputmode="numeric" autocomplete="off" placeholder="0" value="' + esc(Q.amt) + '" data-inp="qamt"></div>' + mid +
    '<div class="field"><label for="q_note">Catatan</label><input type="text" id="q_note" list="qnotes" autocomplete="off" placeholder="' + (Q.type === 'in' ? 'Mis. gaji Oktober' : Q.type === 'transfer' ? 'Opsional' : 'Mis. makan siang') + '" value="' + esc(Q.note) + '" data-inp="qnote"><datalist id="qnotes">' + notes.map(n => '<option value="' + esc(n) + '">').join('') + '</datalist></div>' +
    '<details' + (quick ? '' : ' open') + '><summary class="small muted" style="cursor:pointer;margin-bottom:8px">Tanggal dan tag</summary><div class="fgrid"><div class="field"><label for="q_date">Tanggal</label><input type="date" id="q_date" value="' + esc(Q.date) + '"></div><div class="field"><label for="q_tag">Tag / proyek (opsional)</label><input type="text" id="q_tag" placeholder="Mis. trip-bali" value="' + esc(Q.tag) + '"></div></div></details>' +
    '<div class="actions" style="margin-top:6px"><button type="button" class="btn primary qsave" data-act="qsave">' + ico('check', 18) + ' Simpan</button><button type="button" class="btn" data-act="qfav" title="Simpan isian ini sebagai favorit">⭐ Jadikan favorit</button></div></div>';
  const t0 = txs().filter(t => t.date === S.today), sm = sums(t0), recent = txs().slice().sort(sortTx).slice(0, quick ? 6 : 10);
  const today = '<div class="sumbar"><div><span>Masuk hari ini</span><b class="pos">' + rp(sm.in) + '</b></div><div><span>Keluar hari ini</span><b class="neg">' + rp(sm.out) + '</b></div><div><span>Saldo total</span><b>' + rp(totalBalance()) + '</b></div></div>';
  return head('Catat', quick ? '' : 'Catat pemasukan, pengeluaran, atau transfer antar dompet. Tersimpan di browser ini.', quick ? '<button class="btn sm" data-act="nav" data-v="atur">' + ico('gear', 16) + '</button>' : '') + today + form +
    '<div class="panel" style="margin-top:16px"><h2>Catatan terakhir</h2><p class="sub">Ketuk untuk mengubah atau menghapus.</p>' + (recent.length ? '<div class="txlist">' + recent.map(txRow).join('') + '</div>' : '<div class="empty-note">Belum ada transaksi. Isi jumlah di atas lalu tekan Simpan.</div>') + '</div>';
}
function afterCatat() { if (S.mode === 'cepat') { const a = $('#q_amt'); if (a && !Q.amt) a.focus(); } }
Object.assign(LT.act, {
  qtype(el) { stash(); Q.type = el.dataset.v; Q.cat = ''; Q.manual = false; render(); },
  qcat(el) { stash(); Q.cat = Q.cat === el.dataset.id ? '' : el.dataset.id; Q.manual = true; render(); },
  qtpl(el) { const t = fin().tpls.find(x => x.id === el.dataset.id); if (!t) return; Q.type = t.type; Q.cat = t.cat || ''; Q.wallet = t.wallet || Q.wallet; Q.amt = t.amount ? Number(t.amount).toLocaleString('id-ID') : ''; Q.note = t.note || ''; Q.manual = true; render(); },
  qfav() {
    stash(); const amt = money(Q.amt), name = (Q.note || (catById(Q.cat) || {}).name || '').trim(); if (!name) { toast('Isi catatan atau pilih kategori dulu agar favorit punya nama.', 'err'); return; }
    fin().tpls.push(touch({ id: uid(), name: name.slice(0, 30), type: Q.type === 'transfer' ? 'out' : Q.type, amount: amt, cat: Q.cat, wallet: Q.wallet, note: Q.note })); saveF(); toast('Favorit disimpan: ' + name); render();
  },
  qsave() {
    stash(); try {
      const t = addTx({ type: Q.type, amount: money(Q.amt), wallet: Q.wallet, to: Q.to, cat: Q.type === 'transfer' ? '' : Q.cat || (Q.type === 'in' ? 'i_lain' : 'k_lain'), note: Q.note, date: Q.date, tag: Q.tag });
      toast('Tersimpan: ' + (t.type === 'in' ? '+' : t.type === 'out' ? '−' : '') + rp(t.amount)); Q.amt = ''; Q.note = ''; Q.tag = ''; Q.cat = ''; Q.manual = false; Q.date = ''; render();
    } catch (e) { toast(e.message, 'err'); }
  }
});
LT.chg.qcatsel = el => { if (!el.value) return; stash(); Q.cat = el.value; Q.manual = true; render(); };
LT.chg.qwallet = el => { stash(); Q.wallet = el.value; render(); };
LT.inp.qamt = el => rupiahInput(el);
LT.inp.qnote = el => { if (Q.manual || Q.type === 'transfer') return; const g = guessCat(el.value, Q.type === 'in' ? 'in' : 'out'); if (g && g !== Q.cat) { stash(); Q.cat = g; const pos = el.selectionStart; render(); const n = $('#q_note'); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} } } };

/* ---------- ubah / hapus transaksi ---------- */
function txModal(id) {
  const t = fin().txs.find(x => x.id === id); if (!t) return;
  const kind = t.type === 'in' ? 'in' : 'out';
  openModal('<h2>Ubah transaksi</h2><form id="txForm" data-id="' + t.id + '"><div class="fgrid">' +
    '<div class="field"><label>Jumlah (Rp)</label><input type="text" name="amount" inputmode="numeric" data-inp="qamt" value="' + Number(t.amount).toLocaleString('id-ID') + '"></div><div class="field"><label>Tanggal</label><input type="date" name="date" value="' + esc(t.date) + '"></div>' +
    '<div class="field"><label>' + (t.type === 'transfer' ? 'Dari dompet' : 'Dompet') + '</label><select name="wallet">' + fin().wallets.filter(w => !w.deleted).map(w => '<option value="' + w.id + '"' + (w.id === t.wallet ? ' selected' : '') + '>' + esc(w.name) + '</option>').join('') + '</select></div>' +
    (t.type === 'transfer' ? '<div class="field"><label>Ke dompet</label><select name="to">' + fin().wallets.filter(w => !w.deleted).map(w => '<option value="' + w.id + '"' + (w.id === t.to ? ' selected' : '') + '>' + esc(w.name) + '</option>').join('') + '</select></div>' : '<div class="field"><label>Kategori</label><select name="cat">' + fin().cats.filter(c => !c.deleted && c.kind === kind).map(c => '<option value="' + c.id + '"' + (c.id === t.cat ? ' selected' : '') + '>' + c.emoji + ' ' + esc(c.name) + '</option>').join('') + '</select></div>') +
    '<div class="field full"><label>Catatan</label><input type="text" name="note" value="' + esc(t.note) + '"></div><div class="field full"><label>Tag</label><input type="text" name="tag" value="' + esc(t.tag) + '"></div></div>' +
    '<div class="foot"><div><button type="button" class="btn danger" data-act="txdel" data-id="' + t.id + '">' + ico('trash') + 'Hapus</button></div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
LT.act.txedit = el => txModal(el.dataset.id);
LT.act.txdel = el => { const id = el.dataset.id; closeModal(); confirmBox('Hapus transaksi ini?', () => { delTx(id); toast('Transaksi dihapus.'); render(); }); };
document.addEventListener('submit', e => {
  if (e.target.id !== 'txForm') return; e.preventDefault();
  const p = {}; new FormData(e.target).forEach((v, k) => { p[k] = String(v).trim(); }); p.amount = money(p.amount);
  if (!(p.amount > 0)) { toast('Jumlah tidak valid.', 'err'); return; }
  updTx(e.target.dataset.id, p); closeModal(); toast('Perubahan tersimpan.'); render();
});

/* =====================================================================
   CASHFLOW (daftar transaksi per bulan)
   ===================================================================== */
const C = { ym: '', type: '', wallet: '', cat: '', q: '' };
function viewCashflow() {
  if (!C.ym) C.ym = ymOf(S.today);
  let list = monthTxs(C.ym).filter(t => (!C.type || t.type === C.type) && (!C.wallet || t.wallet === C.wallet || t.to === C.wallet) && (!C.cat || t.cat === C.cat) && (!C.q || (t.note + ' ' + t.tag).toLowerCase().indexOf(C.q.toLowerCase()) > -1)).sort(sortTx);
  const sm = sums(monthTxs(C.ym)), by = {}; list.forEach(t => { (by[t.date] = by[t.date] || []).push(t); });
  const days = Object.keys(by).sort().reverse();
  const allCats = live(fin().cats).filter(c => !c.sys);
  const body = days.map(d => { const s = sums(by[d]); return '<div class="dayhead"><b>' + fmtD(d) + '</b><span><span class="pos">+' + rp(s.in) + '</span> · <span class="neg">−' + rp(s.out) + '</span></span></div><div class="txlist">' + by[d].map(txRow).join('') + '</div>'; }).join('');
  return head('Cashflow', 'Semua transaksi per bulan, lengkap dengan filter.', '<button class="btn" data-act="fcsv">' + ico('download') + 'Ekspor CSV</button><button class="btn primary" data-act="nav" data-v="catat">' + ico('plus') + 'Catat</button>') + monthNav('cmonth', C.ym) +
    '<div class="tiles">' + tileF('--c3', rp(sm.in), 'Pemasukan') + tileF('--c5', rp(sm.out), 'Pengeluaran') + tileF(sm.net >= 0 ? '--c2' : '--c8', (sm.net < 0 ? '−' : '') + rp(Math.abs(sm.net)), 'Selisih') + tileF('--c6', sm.in ? Math.round(sm.net / sm.in * 100) + '%' : '–', 'Rasio tabung') + '</div><div class="sp"></div>' +
    '<div class="toolbar"><div class="search">' + ico('search', 16) + '<input type="search" data-inp="cq" placeholder="Cari catatan atau tag…" value="' + esc(C.q) + '"></div>' +
    '<select data-act="cfilter" data-k="type" aria-label="Jenis"><option value="">Semua jenis</option><option value="in"' + (C.type === 'in' ? ' selected' : '') + '>Masuk</option><option value="out"' + (C.type === 'out' ? ' selected' : '') + '>Keluar</option><option value="transfer"' + (C.type === 'transfer' ? ' selected' : '') + '>Transfer</option></select>' +
    '<select data-act="cfilter" data-k="wallet" aria-label="Dompet"><option value="">Semua dompet</option>' + wallets().map(w => '<option value="' + w.id + '"' + (C.wallet === w.id ? ' selected' : '') + '>' + esc(w.name) + '</option>').join('') + '</select>' +
    '<select data-act="cfilter" data-k="cat" aria-label="Kategori"><option value="">Semua kategori</option>' + allCats.map(c => '<option value="' + c.id + '"' + (C.cat === c.id ? ' selected' : '') + '>' + c.emoji + ' ' + esc(c.name) + '</option>').join('') + '</select></div>' +
    '<div class="panel">' + (body || '<div class="empty-note">Tidak ada transaksi pada bulan dan filter ini.</div>') + '</div>';
}
Object.assign(LT.act, {
  cmonth(el) { C.ym = shiftYm(C.ym || ymOf(S.today), Number(el.dataset.d)); render(); },
  fcsv() {
    const q = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"', rows = monthTxs(C.ym || ymOf(S.today)).sort((a, b) => a.date.localeCompare(b.date));
    const csv = '\ufeff' + ['Tanggal,Jenis,Jumlah,Dompet,Ke dompet,Kategori,Catatan,Tag'].concat(rows.map(t => [t.date, t.type, t.amount, walletName(t.wallet), t.to ? walletName(t.to) : '', (catById(t.cat) || {}).name || '', t.note, t.tag].map(q).join(','))).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'cashflow-' + (C.ym || ymOf(S.today)) + '.csv'; document.body.appendChild(a); a.click(); a.remove();
  }
});
LT.chg.cfilter = el => { C[el.dataset.k] = el.value; render(); };
LT.inp.cq = el => { C.q = el.value; const pos = el.selectionStart; render(); const q = $('[data-inp="cq"]'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } };

/* =====================================================================
   REKAP (harian, bulanan, tahunan)
   ===================================================================== */
const R = { tab: 'bulanan', ym: '', date: '', year: '' };
function catTable(list, prevList) {
  const by = {}; list.filter(t => t.type === 'out').forEach(t => { by[t.cat || 'k_lain'] = (by[t.cat || 'k_lain'] || 0) + t.amount; });
  const pv = {}; (prevList || []).filter(t => t.type === 'out').forEach(t => { pv[t.cat || 'k_lain'] = (pv[t.cat || 'k_lain'] || 0) + t.amount; });
  const total = Object.keys(by).reduce((s, k) => s + by[k], 0), rows = Object.keys(by).sort((a, b) => by[b] - by[a]);
  return { by, total, rows, html: rows.length ? '<table class="mini"><thead><tr><th>Kategori</th><th class="right">Jumlah</th><th class="right">%</th>' + (prevList ? '<th class="right">vs bulan lalu</th>' : '') + '</tr></thead><tbody>' + rows.map(k => { const c = catById(k) || { name: k, emoji: '•' }; const p = pv[k]; return '<tr><td>' + c.emoji + ' ' + esc(c.name) + '</td><td class="right">' + rp(by[k]) + '</td><td class="right">' + pct(by[k], total) + '%</td>' + (prevList ? '<td class="right">' + (p ? '<span class="' + (by[k] > p ? 'down' : 'up') + '">' + (by[k] > p ? '▲' : '▼') + ' ' + Math.abs(Math.round((by[k] - p) / p * 100)) + '%</span>' : '<span class="muted">baru</span>') + '</td>' : '') + '</tr>'; }).join('') + '</tbody></table>' : '<div class="empty-note">Belum ada pengeluaran.</div>' };
}
function viewRekap() {
  if (!R.ym) R.ym = ymOf(S.today); if (!R.date) R.date = S.today; if (!R.year) R.year = S.today.slice(0, 4);
  const tabs = '<div class="tabs">' + [['harian', 'Harian'], ['bulanan', 'Bulanan'], ['tahunan', 'Tahunan']].map(x => '<button data-act="rtab" data-v="' + x[0] + '" class="' + (R.tab === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
  const top = head('Rekap', 'Ringkasan pemasukan dan pengeluaran. Transfer antar dompet tidak dihitung.', '<button class="btn" data-act="printpage">' + ico('download') + 'Cetak / PDF</button>') + tabs;
  if (R.tab === 'harian') {
    const list = txs().filter(t => t.date === R.date).sort(sortTx), sm = sums(list), ct = catTable(list);
    return top + '<div class="toolbar"><div class="field" style="margin:0"><label>Tanggal</label><input type="date" data-act="rdate" value="' + R.date + '"></div></div><div class="tiles">' + tileF('--c3', rp(sm.in), 'Pemasukan') + tileF('--c5', rp(sm.out), 'Pengeluaran') + tileF('--c2', (sm.net < 0 ? '−' : '') + rp(Math.abs(sm.net)), 'Selisih') + '</div><div class="sp"></div>' +
      '<div class="grid g2"><div class="panel"><h2>Per kategori</h2>' + ct.html + '</div><div class="panel"><h2>Transaksi</h2>' + (list.length ? '<div class="txlist">' + list.map(txRow).join('') + '</div>' : '<div class="empty-note">Tidak ada transaksi pada tanggal ini.</div>') + '</div></div>';
  }
  if (R.tab === 'tahunan') {
    const yl = txs().filter(t => t.date.slice(0, 4) === R.year), sm = sums(yl), ct = catTable(yl), months = Array.from({ length: 12 }, (_, i) => R.year + '-' + pad(i + 1));
    const rows = months.map(m => { const s = sums(yl.filter(t => ymOf(t.date) === m)); return '<tr><td>' + BLN_F[Number(m.slice(5)) - 1] + '</td><td class="right pos">' + rp(s.in) + '</td><td class="right neg">' + rp(s.out) + '</td><td class="right">' + (s.net < 0 ? '−' : '') + rp(Math.abs(s.net)) + '</td></tr>'; }).join('');
    const active = months.filter(m => yl.some(t => ymOf(t.date) === m)).length || 1;
    return top + '<div class="monthnav"><button class="btn icon sm" data-act="ryear" data-d="-1">‹</button><b>' + R.year + '</b><button class="btn icon sm" data-act="ryear" data-d="1">›</button></div><div class="tiles">' + tileF('--c3', rp(sm.in), 'Pemasukan setahun') + tileF('--c5', rp(sm.out), 'Pengeluaran setahun') + tileF('--c2', (sm.net < 0 ? '−' : '') + rp(Math.abs(sm.net)), 'Selisih') + tileF('--c6', rp(sm.out / active), 'Rata-rata keluar / bulan') + '</div><div class="sp"></div>' +
      '<div class="panel"><h2>Per bulan</h2><div class="chartbox"><canvas id="fcYear"></canvas></div></div><div class="sp"></div><div class="grid g2"><div class="panel"><h2>Tabel bulanan</h2><table class="mini"><thead><tr><th>Bulan</th><th class="right">Masuk</th><th class="right">Keluar</th><th class="right">Selisih</th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="panel"><h2>Kategori terbesar</h2>' + ct.html + '</div></div>';
  }
  const ml = monthTxs(R.ym), sm = sums(ml), prevYm = shiftYm(R.ym, -1), pl = monthTxs(prevYm), ps = sums(pl), ct = catTable(ml, pl), isCur = R.ym === ymOf(S.today);
  const elapsed = isCur ? Number(S.today.slice(8)) : dim(R.ym), daysLeft = dim(R.ym) - elapsed, projected = isCur && elapsed ? sm.out / elapsed * dim(R.ym) : sm.out;
  const budgetTotal = live(fin().budgets).reduce((s, b) => s + (Number(b.limit) || 0), 0);
  const tags = {}; ml.filter(t => t.tag && t.type === 'out').forEach(t => { tags[t.tag] = (tags[t.tag] || 0) + t.amount; });
  const tagRows = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);
  const forecast = isCur ? '<div class="panel"><h2>Prakiraan akhir bulan</h2><p class="sub">Dari laju pengeluaranmu sejauh ini (' + elapsed + ' dari ' + dim(R.ym) + ' hari).</p><div class="tool-out"><div><span>Pengeluaran sampai hari ini</span><b>' + rp(sm.out) + '</b></div><div><span>Perkiraan total bulan ini</span><b>' + rp(projected) + '</b></div>' +
    (budgetTotal ? '<div><span>Total anggaran</span><b>' + rp(budgetTotal) + '</b></div><div class="big"><span>Sisa jatah per hari</span><span>' + (daysLeft ? rp(Math.max(0, budgetTotal - sm.out) / daysLeft) : '–') + '</span></div>' : sm.in ? '<div class="big"><span>Sisa dari pemasukan bulan ini</span><span>' + (sm.in - sm.out < 0 ? '−' : '') + rp(Math.abs(sm.in - sm.out)) + '</span></div>' : '') + '</div></div>' : '';
  return top + monthNav('rmonth', R.ym) + '<div class="tiles">' + tileF('--c3', rp(sm.in), 'Pemasukan', ps.in ? deltaTxt(sm.in, ps.in) : '') + tileF('--c5', rp(sm.out), 'Pengeluaran', ps.out ? deltaTxt(sm.out, ps.out, true) : '') + tileF('--c2', (sm.net < 0 ? '−' : '') + rp(Math.abs(sm.net)), 'Selisih') + tileF('--c6', sm.in ? Math.round(sm.net / sm.in * 100) + '%' : '–', 'Rasio tabung') + tileF('--c4', rp(sm.out / (elapsed || 1)), 'Rata-rata keluar / hari') + '</div><div class="sp"></div>' +
    '<div class="grid g2"><div class="panel"><h2>Arus harian</h2><p class="sub">Pemasukan dan pengeluaran per hari</p><div class="chartbox"><canvas id="fcDaily"></canvas></div></div><div class="panel"><h2>Pengeluaran per kategori</h2><div class="chartbox"><canvas id="fcCat"></canvas></div></div></div><div class="sp"></div>' +
    '<div class="grid g2"><div class="panel"><h2>Rincian kategori</h2>' + ct.html + '</div><div class="stack">' + forecast + (tagRows.length ? '<div class="panel"><h2>Per tag / proyek</h2><table class="mini"><tbody>' + tagRows.map(k => '<tr><td>#' + esc(k) + '</td><td class="right">' + rp(tags[k]) + '</td></tr>').join('') + '</tbody></table></div>' : '') + '</div></div>';
}
function deltaTxt(a, b, inverse) { const d = Math.round((a - b) / b * 100); if (!d) return 'sama dengan bulan lalu'; const good = inverse ? d < 0 : d > 0; return '<span class="' + (good ? 'up' : 'down') + '">' + (d > 0 ? '▲' : '▼') + ' ' + Math.abs(d) + '%</span> dari bulan lalu'; }
function drawRekap() {
  if (R.tab === 'bulanan') {
    const n = dim(R.ym), ml = monthTxs(R.ym), inn = Array(n).fill(0), out = Array(n).fill(0);
    ml.forEach(t => { const d = Number(t.date.slice(8)) - 1; if (t.type === 'in') inn[d] += t.amount; else if (t.type === 'out') out[d] += t.amount; });
    mkChart('fcDaily', { type: 'bar', data: { labels: Array.from({ length: n }, (_, i) => i + 1), datasets: [{ label: 'Masuk', data: inn, backgroundColor: cssv('--c3'), borderRadius: 3 }, { label: 'Keluar', data: out, backgroundColor: cssv('--c5'), borderRadius: 3 }] }, options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { y: { beginAtZero: true, grid: { color: cssv('--line') } }, x: { grid: { display: false } } } } });
    const ct = catTable(ml); mkChart('fcCat', { type: 'doughnut', data: { labels: ct.rows.map(k => (catById(k) || { name: k }).name), datasets: [{ data: ct.rows.map(k => ct.by[k]), backgroundColor: ['--c1', '--c2', '--c3', '--c4', '--c5', '--c6', '--c7', '--c8', '--idle', '--teal', '--info'].map(cssv), borderColor: cssv('--panel'), borderWidth: 2 }] }, options: { maintainAspectRatio: false, cutout: '58%', plugins: { legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } } } } });
  }
  if (R.tab === 'tahunan') {
    const months = Array.from({ length: 12 }, (_, i) => R.year + '-' + pad(i + 1)), yl = txs().filter(t => t.date.slice(0, 4) === R.year);
    const ss = months.map(m => sums(yl.filter(t => ymOf(t.date) === m)));
    mkChart('fcYear', { type: 'bar', data: { labels: BLN_S, datasets: [{ label: 'Masuk', data: ss.map(s => s.in), backgroundColor: cssv('--c3'), borderRadius: 4 }, { label: 'Keluar', data: ss.map(s => s.out), backgroundColor: cssv('--c5'), borderRadius: 4 }, { type: 'line', label: 'Selisih', data: ss.map(s => s.net), borderColor: cssv('--c1'), backgroundColor: cssv('--c1'), tension: .25 }] }, options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } }, scales: { y: { grid: { color: cssv('--line') } }, x: { grid: { display: false } } } } });
  }
}
Object.assign(LT.act, { rtab(el) { R.tab = el.dataset.v; render(); }, rmonth(el) { R.ym = shiftYm(R.ym || ymOf(S.today), Number(el.dataset.d)); render(); }, ryear(el) { R.year = String(Number(R.year) + Number(el.dataset.d)); render(); }, printpage() { window.print(); } });
LT.chg.rdate = el => { if (el.value) { R.date = el.value; render(); } };

/* =====================================================================
   DOMPET
   ===================================================================== */
function viewDompet() {
  const b = balances(), ws = wallets(), total = totalBalance(), arch = live(fin().wallets).filter(w => w.archived), icons = { tunai: '💵', bank: '🏦', ewallet: '📱' };
  const cards = ws.map(w => '<div class="wcard"><div class="wtop"><span class="em">' + (icons[w.type] || '👛') + '</span><div><b>' + esc(w.name) + '</b><small>' + ({ tunai: 'Tunai', bank: 'Rekening bank', ewallet: 'E-wallet' }[w.type] || 'Dompet') + '</small></div></div><div class="wbal ' + ((b[w.id] || 0) < 0 ? 'neg' : '') + '">' + ((b[w.id] || 0) < 0 ? '−' : '') + rp(Math.abs(b[w.id] || 0)) + '</div><div class="actions"><button class="btn sm" data-act="wtransfer" data-id="' + w.id + '">' + ico('swap', 14) + ' Transfer</button><button class="btn sm" data-act="wrecon" data-id="' + w.id + '">⚖️ Rekonsiliasi</button><button class="btn sm" data-act="wedit" data-id="' + w.id + '">' + ico('edit', 14) + '</button></div></div>').join('');
  return head('Dompet', 'Saldo tiap dompet dihitung dari saldo awal ditambah semua transaksi.', '<button class="btn primary" data-act="wadd">' + ico('plus') + 'Dompet baru</button>') +
    '<div class="panel" style="margin-bottom:16px"><span class="muted small">Total saldo</span><div class="bigtotal">' + (total < 0 ? '−' : '') + rp(Math.abs(total)) + '</div></div><div class="wgrid">' + cards + '</div>' +
    (arch.length ? '<p class="muted small" style="margin-top:14px">Diarsipkan: ' + arch.map(w => esc(w.name) + ' <button class="btn sm" data-act="wunarch" data-id="' + w.id + '">Aktifkan</button>').join(' ') + '</p>' : '') +
    '<p class="muted small" style="margin-top:14px"><b>Rekonsiliasi</b> mencocokkan saldo di aplikasi dengan saldo asli (mis. di mutasi rekening). Selisihnya bisa dicatat sebagai penyesuaian.</p>';
}
function walletModal(id) {
  const w = id ? fin().wallets.find(x => x.id === id) : null;
  openModal('<h2>' + (w ? 'Ubah dompet' : 'Dompet baru') + '</h2><form id="walletForm" data-id="' + (w ? w.id : '') + '"><div class="fgrid"><div class="field full"><label>Nama dompet</label><input type="text" name="name" required maxlength="30" value="' + esc(w ? w.name : '') + '" placeholder="Mis. BCA, GoPay, Tabungan"></div>' +
    '<div class="field"><label>Jenis</label><select name="type">' + [['tunai', 'Tunai'], ['bank', 'Rekening bank'], ['ewallet', 'E-wallet']].map(o => '<option value="' + o[0] + '"' + (w && w.type === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>' +
    '<div class="field"><label>Saldo awal (Rp)</label><input type="text" name="opening" inputmode="numeric" data-inp="qamt" value="' + (w && w.opening ? Number(w.opening).toLocaleString('id-ID') : '') + '" placeholder="0"></div></div>' +
    '<div class="foot"><div>' + (w ? '<button type="button" class="btn danger" data-act="warch" data-id="' + w.id + '">Arsipkan</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
Object.assign(LT.act, {
  wadd() { walletModal(); }, wedit(el) { walletModal(el.dataset.id); },
  warch(el) { const w = fin().wallets.find(x => x.id === el.dataset.id); if (wallets().length <= 1) { toast('Minimal harus ada satu dompet aktif.', 'err'); return; } w.archived = true; touch(w); saveF(); closeModal(); toast('Dompet diarsipkan. Riwayatnya tetap tersimpan.'); render(); },
  wunarch(el) { const w = fin().wallets.find(x => x.id === el.dataset.id); w.archived = false; touch(w); saveF(); render(); },
  wtransfer(el) {
    const from = el.dataset.id; openModal('<h2>Transfer dari ' + esc(walletName(from)) + '</h2><form id="trfForm" data-from="' + from + '"><div class="fgrid"><div class="field"><label>Ke dompet</label><select name="to">' + walletOpts('', from) + '</select></div><div class="field"><label>Jumlah (Rp)</label><input type="text" name="amount" inputmode="numeric" data-inp="qamt" placeholder="0"></div><div class="field full"><label>Catatan</label><input type="text" name="note" placeholder="Opsional"></div></div><div class="foot"><span></span><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Transfer</button></div></div></form>');
  },
  wrecon(el) {
    const id = el.dataset.id, bal = balances()[id] || 0; openModal('<h2>Rekonsiliasi ' + esc(walletName(id)) + '</h2><form id="reconForm" data-id="' + id + '"><p>Saldo menurut aplikasi: <b>' + rp(bal) + '</b></p><div class="field"><label>Saldo sebenarnya (Rp)</label><input type="text" id="reconAmt" name="actual" inputmode="numeric" data-inp="qamt" placeholder="Isi saldo asli"></div><div class="tool-out" id="reconOut"><div><span>Isi saldo sebenarnya untuk melihat selisih.</span></div></div><div class="foot"><span></span><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Catat penyesuaian</button></div></div></form>');
    $('#reconAmt').addEventListener('input', e => { const diff = money(e.target.value) - bal; $('#reconOut').innerHTML = '<div class="big"><span>Selisih</span><span class="' + (diff < 0 ? 'neg' : diff > 0 ? 'pos' : '') + '">' + (diff > 0 ? '+' : diff < 0 ? '−' : '') + rp(Math.abs(diff)) + '</span></div><div><span>' + (diff === 0 ? 'Saldo sudah cocok.' : diff > 0 ? 'Ada uang lebih yang belum tercatat (akan dicatat sebagai pemasukan penyesuaian).' : 'Ada uang kurang (akan dicatat sebagai pengeluaran penyesuaian).') + '</span></div>'; });
  }
});
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'walletForm') {
    e.preventDefault(); const p = {}; new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); }); if (!p.name) return;
    if (f.dataset.id) { const w = fin().wallets.find(x => x.id === f.dataset.id); Object.assign(w, { name: p.name, type: p.type, opening: money(p.opening) }); touch(w); } else fin().wallets.push(touch({ id: uid(), name: p.name, type: p.type, opening: money(p.opening), archived: false }));
    saveF(); closeModal(); toast('Dompet tersimpan.'); render();
  }
  if (f.id === 'trfForm') {
    e.preventDefault(); const p = {}; new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); });
    try { addTx({ type: 'transfer', amount: money(p.amount), wallet: f.dataset.from, to: p.to, note: p.note }); closeModal(); toast('Transfer dicatat.'); render(); } catch (err) { toast(err.message, 'err'); }
  }
  if (f.id === 'reconForm') {
    e.preventDefault(); const id = f.dataset.id, p = {}; new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); }); if (p.actual === '') { toast('Isi saldo sebenarnya.', 'err'); return; }
    const diff = money(p.actual) - (balances()[id] || 0); if (!diff) { closeModal(); toast('Saldo sudah cocok.'); return; }
    addTx({ type: diff > 0 ? 'in' : 'out', amount: Math.abs(diff), wallet: id, cat: diff > 0 ? 'i_adj' : 'k_adj', note: 'Penyesuaian saldo' }); closeModal(); toast('Penyesuaian dicatat.'); render();
  }
});

/* =====================================================================
   RENCANA: anggaran, tabungan, tagihan
   ===================================================================== */
const Pl = { tab: 'anggaran', ym: '' };
const budgetOf = catId => { const b = fin().budgets.find(x => x.id === catId && !x.deleted); return b ? Number(b.limit) || 0 : 0; };
function setBudget(catId, limit) { let b = fin().budgets.find(x => x.id === catId); if (!b) { b = { id: catId, limit: 0 }; fin().budgets.push(b); } b.limit = Math.max(0, Math.round(limit)); b.deleted = false; touch(b); saveF(); }
function viewRencana() {
  if (!Pl.ym) Pl.ym = ymOf(S.today);
  const tabs = '<div class="tabs">' + [['anggaran', 'Anggaran'], ['tabungan', 'Tabungan'], ['tagihan', 'Tagihan']].map(x => '<button data-act="ptab2" data-v="' + x[0] + '" class="' + (Pl.tab === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
  const top = head('Rencana', 'Anggaran bulanan, tujuan tabungan, dan tagihan rutin.') + tabs;
  if (Pl.tab === 'tabungan') {
    const gl = live(fin().goals);
    return top + '<div class="actions" style="margin-bottom:14px"><button class="btn primary" data-act="gadd">' + ico('plus') + 'Tujuan baru</button></div>' + (gl.length ? '<div class="wgrid">' + gl.map(g => { const p = Math.min(100, pct(g.saved, g.target)), left = Math.max(0, g.target - g.saved);
      let need = ''; if (g.deadline && left) { const months = Math.max(1, Math.ceil(diffDays(S.today, g.deadline) / 30)); need = '<small class="muted">Butuh ±' + rp(left / months) + ' per bulan sampai ' + fmtD(g.deadline) + '</small>'; }
      return '<div class="wcard"><div class="wtop"><span class="em">🐷</span><div><b>' + esc(g.name) + '</b><small>Target ' + rp(g.target) + '</small></div></div><div class="wbal">' + rp(g.saved) + '</div><div class="prog" style="--pc:var(--c3)"><i style="width:' + p + '%"></i></div><small>' + p + '% · sisa ' + rp(left) + '</small>' + need + '<div class="actions"><button class="btn sm primary" data-act="gdeposit" data-id="' + g.id + '">+ Setor</button><button class="btn sm" data-act="gedit" data-id="' + g.id + '">' + ico('edit', 14) + '</button></div></div>'; }).join('') + '</div>' : '<div class="panel"><div class="empty-note">Belum ada tujuan tabungan. Mulailah dengan dana darurat 3–6 kali pengeluaran bulanan.</div></div>');
  }
  if (Pl.tab === 'tagihan') {
    const bl = live(fin().bills).slice().sort((a, b) => (a.day || 0) - (b.day || 0));
    return top + '<div class="actions" style="margin-bottom:14px"><button class="btn primary" data-act="badd">' + ico('plus') + 'Tagihan baru</button></div>' + '<div class="panel">' + (bl.length ? '<div class="rowlist">' + bl.map(b => { const st = billStatus(b); return '<div class="rowitem"><div class="t"><b>' + esc(b.name) + '</b><span>' + rp(b.amount) + ' · tiap tanggal ' + b.day + ' · ' + esc(walletName(b.wallet)) + '</span></div><div class="actions"><span class="tag ' + (st.cls || '') + '">' + st.label + '</span>' + (st.paid ? '' : '<button class="btn sm primary" data-act="bpay" data-id="' + b.id + '">Bayar</button>') + '<button class="btn sm" data-act="bedit" data-id="' + b.id + '">' + ico('edit', 14) + '</button></div></div>'; }).join('') + '</div>' : '<div class="empty-note">Belum ada tagihan rutin. Tambahkan kos, listrik, atau langganan agar diingatkan.</div>') + '</div>';
  }
  /* anggaran */
  const ym = Pl.ym, ml = monthTxs(ym), spent = {}; ml.filter(t => t.type === 'out').forEach(t => { spent[t.cat || 'k_lain'] = (spent[t.cat || 'k_lain'] || 0) + t.amount; });
  const cl = cats('out'), totalB = cl.reduce((s, c) => s + budgetOf(c.id), 0), totalS = cl.reduce((s, c) => s + (spent[c.id] || 0), 0);
  const rows = cl.map(c => { const lim = budgetOf(c.id), sp = spent[c.id] || 0, p = lim ? Math.min(100, Math.round(sp / lim * 100)) : 0, col = !lim ? '--idle' : sp > lim ? '--c5' : sp / lim >= .8 ? '--c4' : '--c3';
    return '<div class="brow"><div class="btop"><span>' + c.emoji + ' ' + esc(c.name) + '</span><span class="small muted">' + rp(sp) + (lim ? ' dari ' : '') + '</span><input type="text" inputmode="numeric" class="blim" data-act="blimit" data-id="' + c.id + '" data-inp="qamt" placeholder="Batas" value="' + (lim ? lim.toLocaleString('id-ID') : '') + '"></div><div class="prog" style="--pc:var(' + col + ')"><i style="width:' + (lim ? p : 0) + '%"></i></div>' + (lim && sp > lim ? '<small class="down">Melebihi batas ' + rp(sp - lim) + '</small>' : '') + '</div>'; }).join('');
  return top + monthNav('pmonth', ym) + '<div class="tiles">' + tileF('--c1', rp(totalB), 'Total anggaran') + tileF('--c5', rp(totalS), 'Terpakai') + tileF(totalB - totalS < 0 ? '--c8' : '--c3', (totalB - totalS < 0 ? '−' : '') + rp(Math.abs(totalB - totalS)), totalB ? 'Sisa anggaran' : 'Sisa (belum ada batas)') + '</div><div class="sp"></div>' +
    '<div class="panel"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div><h2>Batas per kategori</h2><p class="sub" style="margin:0">Ketik batas lalu pindah kolom untuk menyimpan. Warna kuning mulai 80%, merah bila melebihi.</p></div><button class="btn sm" data-act="bauto">Isi dari rata-rata 3 bulan terakhir</button></div><div style="margin-top:14px">' + rows + '</div></div>';
}
function billStatus(b) {
  const ym = ymOf(S.today), due = ym + '-' + pad(Math.min(b.day || 1, dim(ym))); const paid = (b.paid || []).indexOf(ym) > -1;
  if (paid) return { paid: true, label: 'Lunas bulan ini', cls: '' }; const d = diffDays(S.today, due);
  if (d < 0) return { label: 'Terlambat ' + (-d) + ' hari', cls: 'warn', due, d }; if (d === 0) return { label: 'Jatuh tempo hari ini', cls: 'warn', due, d }; if (d <= 7) return { label: d + ' hari lagi', cls: 'warn', due, d }; return { label: 'Belum jatuh tempo', cls: '', due, d };
}
function dueBills(days) { return live(fin().bills).filter(b => b.active !== false).map(b => Object.assign({ bill: b }, billStatus(b))).filter(x => !x.paid && x.d <= (days == null ? 7 : days)).sort((a, b) => a.d - b.d); }
function goalModal(id) {
  const g = id ? fin().goals.find(x => x.id === id) : null;
  openModal('<h2>' + (g ? 'Ubah tujuan' : 'Tujuan tabungan baru') + '</h2><form id="goalForm" data-id="' + (g ? g.id : '') + '"><div class="fgrid"><div class="field full"><label>Nama tujuan</label><input type="text" name="name" required maxlength="40" value="' + esc(g ? g.name : '') + '" placeholder="Mis. Dana darurat"></div><div class="field"><label>Target (Rp)</label><input type="text" name="target" inputmode="numeric" data-inp="qamt" value="' + (g ? Number(g.target).toLocaleString('id-ID') : '') + '"></div><div class="field"><label>Tenggat (opsional)</label><input type="date" name="deadline" value="' + esc(g ? g.deadline : '') + '"></div></div><div class="foot"><div>' + (g ? '<button type="button" class="btn danger" data-act="gdel" data-id="' + g.id + '">Hapus</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
function billModal(id) {
  const b = id ? fin().bills.find(x => x.id === id) : null;
  openModal('<h2>' + (b ? 'Ubah tagihan' : 'Tagihan baru') + '</h2><form id="billForm" data-id="' + (b ? b.id : '') + '"><div class="fgrid"><div class="field full"><label>Nama tagihan</label><input type="text" name="name" required maxlength="40" value="' + esc(b ? b.name : '') + '" placeholder="Mis. Kos, Listrik, Netflix"></div><div class="field"><label>Jumlah (Rp)</label><input type="text" name="amount" inputmode="numeric" data-inp="qamt" value="' + (b ? Number(b.amount).toLocaleString('id-ID') : '') + '"></div><div class="field"><label>Tanggal jatuh tempo tiap bulan</label><input type="number" name="day" min="1" max="31" value="' + (b ? b.day : 1) + '"></div><div class="field"><label>Kategori</label><select name="cat">' + catOpts('out', b ? b.cat : 'k_tagihan') + '</select></div><div class="field"><label>Dompet pembayaran</label><select name="wallet">' + walletOpts(b ? b.wallet : (wallets()[0] || {}).id) + '</select></div></div><div class="foot"><div>' + (b ? '<button type="button" class="btn danger" data-act="bdel" data-id="' + b.id + '">Hapus</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
Object.assign(LT.act, {
  ptab2(el) { Pl.tab = el.dataset.v; render(); }, pmonth(el) { Pl.ym = shiftYm(Pl.ym || ymOf(S.today), Number(el.dataset.d)); render(); },
  gadd() { goalModal(); }, gedit(el) { goalModal(el.dataset.id); },
  gdel(el) { const g = fin().goals.find(x => x.id === el.dataset.id); g.deleted = true; touch(g); saveF(); closeModal(); render(); },
  gdeposit(el) { const g = fin().goals.find(x => x.id === el.dataset.id); openModal('<h2>Setor ke ' + esc(g.name) + '</h2><form id="depForm" data-id="' + g.id + '"><div class="field"><label>Jumlah setoran (Rp)</label><input type="text" name="amount" inputmode="numeric" data-inp="qamt" placeholder="0"></div><p class="muted small">Ini mencatat kemajuan tujuan saja. Untuk memindahkan uang, catat transfer antar dompet.</p><div class="foot"><span></span><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Setor</button></div></div></form>'); },
  badd() { billModal(); }, bedit(el) { billModal(el.dataset.id); },
  bdel(el) { const b = fin().bills.find(x => x.id === el.dataset.id); b.deleted = true; touch(b); saveF(); closeModal(); render(); },
  bpay(el) { LT.fin.payBill(el.dataset.id); render(); },
  bauto() {
    const base = Pl.ym || ymOf(S.today), mths = [1, 2, 3].map(i => shiftYm(base, -i)), tot = {}; let n = 0;
    mths.forEach(m => { const l = monthTxs(m); if (l.length) n++; l.filter(t => t.type === 'out').forEach(t => { tot[t.cat || 'k_lain'] = (tot[t.cat || 'k_lain'] || 0) + t.amount; }); });
    if (!n) { toast('Belum ada data 3 bulan sebelumnya.', 'err'); return; }
    Object.keys(tot).forEach(k => { const c = catById(k); if (c && !c.sys) setBudget(k, Math.ceil(tot[k] / n / 10000) * 10000); }); toast('Batas diisi dari rata-rata ' + n + ' bulan.'); render();
  }
});
LT.chg.blimit = el => { setBudget(el.dataset.id, money(el.value)); render(); };
document.addEventListener('submit', e => {
  const f = e.target, p = {}; if (['goalForm', 'billForm', 'depForm'].indexOf(f.id) < 0) return; e.preventDefault(); new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); });
  if (f.id === 'goalForm') { if (!p.name || !money(p.target)) { toast('Isi nama dan target.', 'err'); return; } if (f.dataset.id) { const g = fin().goals.find(x => x.id === f.dataset.id); Object.assign(g, { name: p.name, target: money(p.target), deadline: p.deadline }); touch(g); } else fin().goals.push(touch({ id: uid(), name: p.name, target: money(p.target), saved: 0, deadline: p.deadline })); }
  if (f.id === 'depForm') { const g = fin().goals.find(x => x.id === f.dataset.id); g.saved = (g.saved || 0) + money(p.amount); touch(g); }
  if (f.id === 'billForm') { if (!p.name || !money(p.amount)) { toast('Isi nama dan jumlah.', 'err'); return; } const day = Math.max(1, Math.min(31, Number(p.day) || 1)); if (f.dataset.id) { const b = fin().bills.find(x => x.id === f.dataset.id); Object.assign(b, { name: p.name, amount: money(p.amount), day, cat: p.cat, wallet: p.wallet }); touch(b); } else fin().bills.push(touch({ id: uid(), name: p.name, amount: money(p.amount), day, cat: p.cat, wallet: p.wallet, active: true, paid: [] })); }
  saveF(); closeModal(); toast('Tersimpan.'); render();
});

/* =====================================================================
   TRANSFER DATA HP <-> LAPTOP
   Paket berisi item yang berubah sejak pengiriman terakhir. Saat diterima, item digabung per id:
   yang updatedAt-nya lebih baru menang, sehingga tidak ada transaksi ganda dan hapus/ubah ikut terbawa.
   ===================================================================== */
const COLLS = ['wallets', 'cats', 'txs', 'tpls', 'bills', 'budgets', 'goals'];
const LCOLLS = ['habits', 'todos', 'notes'];
const life = () => LT.life ? LT.life() : { habits: [], todos: [], notes: [], focus: {}, cfg: {} };
function pendingCount() { const since = fin().lastOut || 0; let n = 0; COLLS.forEach(k => { n += fin()[k].filter(x => (x.updatedAt || 0) > since).length; }); const l = life(); LCOLLS.forEach(k => { n += (l[k] || []).filter(x => (x.updatedAt || 0) > since).length; }); return n; }
function buildPackage(all) {
  const since = all ? 0 : (fin().lastOut || 0), pick = a => a.filter(x => (x.updatedAt || 0) > since || (all && true)), pkg = { app: 'lamaran-tracker', kind: 'transfer', v: 1, at: nowTs(), from: fin().device, fin: {}, life: {} };
  COLLS.forEach(k => { pkg.fin[k] = pick(fin()[k]); }); const l = life(); LCOLLS.forEach(k => { pkg.life[k] = pick(l[k] || []); }); pkg.life.focus = l.focus || {};
  return pkg;
}
const encodePkg = p => 'LTX1:' + btoa(unescape(encodeURIComponent(JSON.stringify(p))));
function decodePkg(text) {
  let t = String(text || '').trim(); if (!t) throw new Error('Tempel kode atau pilih file terlebih dahulu.');
  if (t.indexOf('LTX1:') === 0) { try { t = decodeURIComponent(escape(atob(t.slice(5).replace(/\s+/g, '')))); } catch (e) { throw new Error('Kode tidak utuh. Pastikan seluruh kode tersalin sampai akhir.'); } }
  let o; try { o = JSON.parse(t); } catch (e) { throw new Error('Isi tidak dikenali. Gunakan kode yang diawali LTX1: atau file transfer.'); }
  if (!o || o.app !== 'lamaran-tracker' || o.kind !== 'transfer') throw new Error('Ini bukan paket transfer Lamaran Tracker.'); return o;
}
function mergeColl(local, incoming) {
  const map = new Map(local.map(x => [x.id, x])); let added = 0, updated = 0, same = 0;
  (incoming || []).forEach(it => { if (!it || !it.id) return; const cur = map.get(it.id); if (!cur) { map.set(it.id, it); added++; } else if ((it.updatedAt || 0) > (cur.updatedAt || 0)) { map.set(it.id, it); updated++; } else same++; });
  return { list: Array.from(map.values()), added, updated, same };
}
function applyPackage(pkg) {
  const res = { added: 0, updated: 0, same: 0, tx: 0 }; const f = fin();
  COLLS.forEach(k => { const m = mergeColl(f[k], (pkg.fin || {})[k]); f[k] = m.list; res.added += m.added; res.updated += m.updated; res.same += m.same; if (k === 'txs') res.tx = m.added; });
  saveF(); if (LT.lifeMerge) { const r = LT.lifeMerge(pkg.life || {}, mergeColl); res.added += r.added; res.updated += r.updated; res.same += r.same; } return res;
}
const Tx = { code: '', note: '' };
function viewTransfer() {
  const quick = S.mode === 'cepat', n = pendingCount(), lo = fin().lastOut;
  const send = '<div class="panel"><h2>1. Kirim dari perangkat ini</h2><p class="sub">Paket berisi <b>' + n + '</b> perubahan baru' + (lo ? ' sejak ' + new Date(lo).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : ' (belum pernah dikirim)') + '.</p><div class="actions"><button class="btn primary" data-act="tcopy" data-all="0">' + ico('copy', 16) + ' Salin kode data baru</button><button class="btn" data-act="tfile" data-all="0">' + ico('download', 16) + ' Unduh file</button></div><p class="muted small" style="margin-top:10px">Kirim kode ke diri sendiri lewat WhatsApp atau email, lalu tempel di perangkat lain. Terlewat atau hilang? <button class="btn sm" data-act="tcopy" data-all="1">Salin semua data</button></p></div>';
  const recv = '<div class="panel"><h2>2. Terima di perangkat ini</h2><p class="sub">Tempel kode (diawali <code>LTX1:</code>) atau pilih file transfer. Data digabung, bukan ditimpa.</p><div class="field"><textarea id="tcode" rows="3" placeholder="LTX1:…">' + esc(Tx.code) + '</textarea></div><div class="actions"><button class="btn primary" data-act="tmerge">Gabungkan data</button><button class="btn" data-act="tpick">Pilih file…</button><input type="file" id="tfileIn" data-act="tfilein" accept=".json,.ltx,application/json" hidden></div>' + (Tx.note ? '<div class="tip" style="margin-top:12px">' + Tx.note + '</div>' : '') + '</div>';
  const how = '<div class="panel"><h2>Alur yang disarankan</h2><ol style="padding-left:20px;line-height:1.8"><li>Di HP, catat transaksi sepanjang hari dengan <b>Mode cepat</b>.</li><li>Malam hari, di HP buka <b>Transfer data → Salin kode data baru</b>, lalu kirim ke WhatsApp sendiri.</li><li>Di laptop, buka WhatsApp Web, salin kode, tempel di <b>Terima di perangkat ini → Gabungkan data</b>.</li><li>Rekap lengkap tinggal dibuka di laptop.</li></ol><p class="muted small">Transaksi punya nomor unik, jadi menggabungkan dua kali tidak membuat data ganda. Perubahan dan penghapusan juga ikut terbawa. Data lamaran kerja tidak ikut dalam transfer ini, gunakan cadangan di Pengaturan untuk itu.</p></div>';
  return head('Transfer data', quick ? '' : 'Pindahkan catatan keuangan dan harian antara HP dan laptop.') + (quick ? send + recv : '<div class="grid g2">' + send + recv + '</div><div class="sp"></div>' + how);
}
Object.assign(LT.act, {
  async tcopy(el) { const all = el.dataset.all === '1'; try { const code = encodePkg(buildPackage(all)); h.copyText(code); fin().lastOut = nowTs(); saveF(); toast('Kode disalin. Tempel di perangkat lain.'); Tx.note = ''; render(); } catch (e) { toast(e.message, 'err'); } },
  tfile(el) { const all = el.dataset.all === '1', pkg = buildPackage(all), a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(pkg)], { type: 'application/json' })); a.download = 'transfer-data-' + S.today + '.json'; document.body.appendChild(a); a.click(); a.remove(); fin().lastOut = nowTs(); saveF(); toast('File transfer diunduh.'); render(); },
  tpick() { const f = $('#tfileIn'); if (f) f.click(); },
  tmerge() { const el = $('#tcode'); Tx.code = el ? el.value : ''; try { const r = applyPackage(decodePkg(Tx.code)); Tx.note = '<b>Selesai.</b> ' + r.added + ' item baru, ' + r.updated + ' diperbarui, ' + r.same + ' sudah ada (dilewati).'; Tx.code = ''; toast('Data digabung.'); render(); } catch (e) { toast(e.message, 'err'); } }
});
LT.chg.tfilein = async el => { const file = el.files && el.files[0]; if (!file) return; const fr = new FileReader(); fr.onload = () => { try { const r = applyPackage(decodePkg(String(fr.result))); Tx.note = '<b>Selesai.</b> ' + r.added + ' item baru, ' + r.updated + ' diperbarui, ' + r.same + ' sudah ada (dilewati).'; toast('Data digabung.'); render(); } catch (e) { toast(e.message, 'err'); } }; fr.readAsText(file); el.value = ''; };

/* ---------- pengaturan: kategori dan favorit ---------- */
function settingsFin() {
  const outs = cats('out'), ins = cats('in'), tp = live(fin().tpls);
  const chip = c => '<span class="cchip">' + c.emoji + ' ' + esc(c.name) + ' <button class="x" data-act="catdel" data-id="' + c.id + '" title="Hapus" aria-label="Hapus ' + esc(c.name) + '">×</button></span>';
  return '<div class="panel"><h2>Kategori & favorit</h2><p class="sub">Kategori bawaan boleh dihapus. Riwayat transaksi lama tetap aman.</p><div class="small muted" style="margin-bottom:4px">Pengeluaran</div><div class="chipset">' + outs.map(chip).join('') + '</div><div class="small muted" style="margin:10px 0 4px">Pemasukan</div><div class="chipset">' + ins.map(chip).join('') + '</div>' +
    '<form id="catForm" class="fgrid" style="margin-top:12px"><div class="field"><label>Kategori baru</label><input type="text" name="name" maxlength="30" placeholder="Mis. Hobi"></div><div class="field"><label>Jenis</label><select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></div><div class="field"><label>Emoji (opsional)</label><input type="text" name="emoji" maxlength="4" placeholder="🎨"></div><div class="field" style="justify-content:flex-end"><button class="btn" type="submit">Tambah kategori</button></div></form>' +
    (tp.length ? '<div class="small muted" style="margin:6px 0 4px">Favorit</div><div class="chipset">' + tp.map(t => '<span class="cchip fav">⭐ ' + esc(t.name) + ' <button class="x" data-act="tpldel" data-id="' + t.id + '" aria-label="Hapus favorit">×</button></span>').join('') + '</div>' : '') + '</div>';
}
LT.settingsExtra = (LT.settingsExtra || []).concat([settingsFin]);
Object.assign(LT.act, {
  catdel(el) { const c = catById(el.dataset.id); if (c) { c.deleted = true; touch(c); saveF(); render(); } },
  tpldel(el) { const t = fin().tpls.find(x => x.id === el.dataset.id); if (t) { t.deleted = true; touch(t); saveF(); render(); } }
});
document.addEventListener('submit', e => { if (e.target.id !== 'catForm') return; e.preventDefault(); const p = {}; new FormData(e.target).forEach((v, k) => { p[k] = String(v).trim(); }); if (!p.name) return; fin().cats.push(touch({ id: 'c_' + uid(), kind: p.kind, name: p.name, emoji: p.emoji || '🏷️', sys: false })); saveF(); toast('Kategori ditambahkan.'); render(); });

/* ---------- API untuk modul lain ---------- */
LT.fin = {
  todaySummary() { const sm = sums(txs().filter(t => t.date === S.today)); return { in: sm.in, out: sm.out, net: sm.net, total: totalBalance(), count: txs().filter(t => t.date === S.today).length }; },
  dueBills, billStatus,
  payBill(id) { const b = fin().bills.find(x => x.id === id); if (!b) return; addTx({ type: 'out', amount: b.amount, wallet: b.wallet, cat: b.cat, note: b.name }); b.paid = (b.paid || []).concat(ymOf(S.today)); touch(b); saveF(); toast('Tagihan ' + b.name + ' dibayar dan dicatat.'); },
  txRow, pendingCount, _api: { addTx, balances, sums, monthTxs, buildPackage, encodePkg, decodePkg, applyPackage, fin, guessCat, totalBalance, updTx, delTx, setBudget }
};
LT.views.catat = { render: viewCatat, after: afterCatat };
LT.views.cashflow = { render: viewCashflow }; LT.views.rekap = { render: viewRekap, after: drawRekap };
LT.views.dompet = { render: viewDompet }; LT.views.rencana = { render: viewRencana }; LT.views.transfer = { render: viewTransfer };
})();
