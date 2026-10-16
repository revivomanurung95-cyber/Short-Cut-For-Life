/* =====================================================================
   produktif.js: halaman "Hari ini", pelacak kebiasaan, tugas & catatan, timer fokus, dan kunci PIN.
   Data harian disimpan di browser (kunci 'lt.life.v1'); PIN di 'lt.lock.v1'.
   ===================================================================== */
(function () {
'use strict';
const { S, h } = LT;
const { $, $$, esc, rp, ico, toast, head, addDays, fromIso, fmtD, openModal, closeModal, confirmBox } = h;
const kv = LTStore._kv, render = () => h.render();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const nowTs = () => Date.now();
const touch = o => { o.updatedAt = nowTs(); return o; };
const live = a => a.filter(x => !x.deleted);
const HARI_F = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/* ---------- data harian ---------- */
const LKEY = 'lt.life.v1';
let Ld = null;
function lifeLoad() {
  const l = kv.read(LKEY, null) || { v: 1 };
  ['habits', 'todos', 'notes'].forEach(k => { if (!Array.isArray(l[k])) l[k] = []; });
  ['focus', 'sess'].forEach(k => { if (!l[k] || typeof l[k] !== 'object') l[k] = {}; });
  l.cfg = Object.assign({ focus: 25, brk: 5, long: 15 }, l.cfg || {}); return l;
}
const life = () => Ld || (Ld = lifeLoad());
const saveL = () => kv.write(LKEY, life());
LT.life = life;
LT.lifeMerge = (o, mergeColl) => {
  const l = life(), r = { added: 0, updated: 0, same: 0 };
  ['habits', 'todos', 'notes'].forEach(k => { const m = mergeColl(l[k], o[k]); l[k] = m.list; r.added += m.added; r.updated += m.updated; r.same += m.same; });
  Object.keys(o.focus || {}).forEach(d => { l.focus[d] = Math.max(l.focus[d] || 0, o.focus[d] || 0); });
  Object.keys(o.sess || {}).forEach(d => { l.sess[d] = Math.max(l.sess[d] || 0, o.sess[d] || 0); });
  saveL(); return r;
};

/* =====================================================================
   KEBIASAAN
   ===================================================================== */
const SUGGEST = [['Olahraga', '🏃'], ['Membaca', '📖'], ['Minum air putih', '💧'], ['Belajar 30 menit', '🎓'], ['Tidur sebelum 23.00', '😴'], ['Catat pengeluaran', '🧾']];
function streakOf(hb) {
  const log = hb.log || {}; let d = log[S.today] ? S.today : addDays(S.today, -1), cur = 0; while (log[d]) { cur++; d = addDays(d, -1); }
  const days = Object.keys(log).sort(); let best = 0, run = 0, prev = null; days.forEach(x => { run = prev && addDays(prev, 1) === x ? run + 1 : 1; if (run > best) best = run; prev = x; });
  return { cur, best };
}
function toggleHabit(id, date) { const hb = life().habits.find(x => x.id === id); if (!hb) return; hb.log = hb.log || {}; if (hb.log[date]) delete hb.log[date]; else hb.log[date] = 1; touch(hb); saveL(); }
function viewKebiasaan() {
  const hs = live(life().habits);
  const days = Array.from({ length: 14 }, (_, i) => addDays(S.today, i - 13));
  const cards = hs.map(hb => { const st = streakOf(hb), done = !!(hb.log || {})[S.today], c30 = Array.from({ length: 30 }, (_, i) => addDays(S.today, -i)).filter(d => (hb.log || {})[d]).length;
    return '<div class="habit"><div class="htop"><span class="em">' + esc(hb.emoji || '✅') + '</span><div class="hname"><b>' + esc(hb.name) + '</b><small>🔥 ' + st.cur + ' hari berturut · rekor ' + st.best + ' · ' + Math.round(c30 / 30 * 100) + '% dalam 30 hari</small></div><button class="btn sm" data-act="hedit" data-id="' + hb.id + '" aria-label="Ubah">' + ico('edit', 14) + '</button></div>' +
      '<div class="hdots">' + days.map(d => '<button class="hd' + ((hb.log || {})[d] ? ' on' : '') + (d === S.today ? ' today' : '') + '" data-act="hday" data-id="' + hb.id + '" data-d="' + d + '" title="' + fmtD(d) + '" aria-label="' + fmtD(d) + '"></button>').join('') + '</div>' +
      '<button class="btn ' + (done ? '' : 'primary') + ' hbig" data-act="hday" data-id="' + hb.id + '" data-d="' + S.today + '">' + ico('check', 16) + (done ? ' Selesai hari ini (batalkan)' : ' Tandai hari ini') + '</button></div>'; }).join('');
  const sug = SUGGEST.filter(s => !hs.find(x => x.name === s[0]));
  return head('Kebiasaan', 'Centang tiap hari dan jaga streak-mu. Ketuk titik untuk mengubah hari sebelumnya.', '<button class="btn primary" data-act="hadd">' + ico('plus') + 'Kebiasaan baru</button>') +
    (hs.length ? '<div class="wgrid">' + cards + '</div>' : '<div class="panel"><div class="empty-note">Belum ada kebiasaan. Pilih satu untuk memulai atau buat sendiri.</div></div>') +
    (sug.length ? '<div class="panel" style="margin-top:16px"><h2>Saran cepat</h2><div class="chipset">' + sug.map(s => '<button class="cchip" data-act="hsug" data-n="' + esc(s[0]) + '" data-e="' + s[1] + '">' + s[1] + ' ' + esc(s[0]) + '</button>').join('') + '</div></div>' : '');
}
function habitModal(id) {
  const hb = id ? life().habits.find(x => x.id === id) : null;
  openModal('<h2>' + (hb ? 'Ubah kebiasaan' : 'Kebiasaan baru') + '</h2><form id="habitForm" data-id="' + (hb ? hb.id : '') + '"><div class="fgrid"><div class="field"><label>Nama</label><input type="text" name="name" required maxlength="40" value="' + esc(hb ? hb.name : '') + '"></div><div class="field"><label>Emoji</label><input type="text" name="emoji" maxlength="4" value="' + esc(hb ? hb.emoji : '✅') + '"></div></div><div class="foot"><div>' + (hb ? '<button type="button" class="btn danger" data-act="hdel" data-id="' + hb.id + '">Hapus</button>' : '') + '</div><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button type="submit" class="btn primary">Simpan</button></div></div></form>');
}
Object.assign(LT.act, {
  hadd() { habitModal(); }, hedit(el) { habitModal(el.dataset.id); },
  hday(el) { toggleHabit(el.dataset.id, el.dataset.d); render(); },
  hsug(el) { life().habits.push(touch({ id: uid(), name: el.dataset.n, emoji: el.dataset.e, created: S.today, log: {} })); saveL(); render(); },
  hdel(el) { const hb = life().habits.find(x => x.id === el.dataset.id); hb.deleted = true; touch(hb); saveL(); closeModal(); render(); }
});

/* =====================================================================
   TUGAS & CATATAN
   ===================================================================== */
const Tk = { tab: 'tugas', showDone: false, q: '' };
const activeTodos = () => live(life().todos).filter(t => !t.done).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999') || (a.created || 0) - (b.created || 0));
function todoRow(t) {
  const over = t.due && t.due < S.today, today = t.due === S.today;
  return '<div class="todo' + (t.done ? ' done' : '') + '"><button class="tick' + (t.done ? ' on' : '') + '" data-act="tdone" data-id="' + t.id + '" aria-label="Selesai">' + (t.done ? ico('check', 14) : '') + '</button><span class="ttx">' + esc(t.text) + '</span>' + (t.due ? '<span class="tag ' + (over && !t.done ? 'warn' : '') + '">' + (today ? 'hari ini' : over && !t.done ? 'lewat ' + fmtD(t.due) : fmtD(t.due)) + '</span>' : '') + '<button class="btn icon sm" data-act="tdel" data-id="' + t.id + '" aria-label="Hapus">' + ico('x', 14) + '</button></div>';
}
function viewTugas() {
  const tabs = '<div class="tabs">' + [['tugas', 'Tugas'], ['catatan', 'Catatan cepat']].map(x => '<button data-act="ttab" data-v="' + x[0] + '" class="' + (Tk.tab === x[0] ? 'on' : '') + '">' + x[1] + '</button>').join('') + '</div>';
  const top = head('Tugas & catatan', 'Daftar tugas dan catatan singkat. Tersimpan di browser ini.') + tabs;
  if (Tk.tab === 'catatan') {
    const q = Tk.q.toLowerCase(), ns = live(life().notes).filter(n => !q || n.text.toLowerCase().indexOf(q) > -1).sort((a, b) => b.ts - a.ts);
    return top + '<div class="panel"><form id="noteForm"><div class="field"><label for="noteText">Catatan baru</label><textarea id="noteText" name="text" rows="3" placeholder="Ide, nomor penting, hal yang perlu diingat…"></textarea></div><button class="btn primary" type="submit">Simpan catatan</button></form></div><div class="sp"></div><div class="toolbar"><div class="search">' + ico('search', 16) + '<input type="search" data-inp="nq" placeholder="Cari catatan…" value="' + esc(Tk.q) + '"></div></div>' +
      (ns.length ? '<div class="notegrid">' + ns.map(n => '<div class="note"><p>' + esc(n.text).replace(/\n/g, '<br>') + '</p><div class="nfoot"><small class="muted">' + new Date(n.ts).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + '</small><span><button class="btn icon sm" data-act="ncopy" data-id="' + n.id + '" aria-label="Salin">' + ico('copy', 14) + '</button><button class="btn icon sm" data-act="ndel" data-id="' + n.id + '" aria-label="Hapus">' + ico('x', 14) + '</button></span></div></div>').join('') + '</div>' : '<div class="panel"><div class="empty-note">Belum ada catatan.</div></div>');
  }
  const act = activeTodos(), done = live(life().todos).filter(t => t.done).sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0)).slice(0, 15);
  return top + '<div class="panel"><form id="todoForm" class="todoadd"><input type="text" name="text" required maxlength="160" placeholder="Tugas baru, lalu tekan Enter" aria-label="Tugas baru"><input type="date" name="due" aria-label="Tenggat"><button class="btn primary" type="submit">' + ico('plus', 16) + ' Tambah</button></form></div><div class="sp"></div>' +
    '<div class="panel"><h2>Aktif (' + act.length + ')</h2>' + (act.length ? act.map(todoRow).join('') : '<div class="empty-note">Tidak ada tugas aktif. Nikmati harimu 🎉</div>') + '</div>' +
    (done.length ? '<div class="panel" style="margin-top:16px"><button class="btn sm" data-act="tshow">' + (Tk.showDone ? 'Sembunyikan' : 'Tampilkan') + ' ' + done.length + ' tugas selesai</button>' + (Tk.showDone ? '<div style="margin-top:10px">' + done.map(todoRow).join('') + '</div>' : '') + '</div>' : '');
}
Object.assign(LT.act, {
  ttab(el) { Tk.tab = el.dataset.v; render(); },
  tdone(el) { const t = life().todos.find(x => x.id === el.dataset.id); if (!t) return; t.done = !t.done; t.doneAt = t.done ? nowTs() : 0; touch(t); saveL(); render(); },
  tdel(el) { const t = life().todos.find(x => x.id === el.dataset.id); if (!t) return; t.deleted = true; touch(t); saveL(); render(); },
  tshow() { Tk.showDone = !Tk.showDone; render(); },
  ndel(el) { const n = life().notes.find(x => x.id === el.dataset.id); if (!n) return; n.deleted = true; touch(n); saveL(); render(); },
  ncopy(el) { const n = life().notes.find(x => x.id === el.dataset.id); if (n) h.copyText(n.text); }
});
LT.inp.nq = el => { Tk.q = el.value; const pos = el.selectionStart; render(); const q = $('[data-inp="nq"]'); if (q) { q.focus(); try { q.setSelectionRange(pos, pos); } catch (e) {} } };
function addTodo(text, due) { text = String(text || '').trim(); if (!text) return; life().todos.push(touch({ id: uid(), text: text.slice(0, 160), due: due || '', done: false, doneAt: 0, created: nowTs() })); saveL(); }
function addNote(text) { text = String(text || '').trim(); if (!text) return; life().notes.push(touch({ id: uid(), text: text.slice(0, 2000), ts: nowTs() })); saveL(); }
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'todoForm') { e.preventDefault(); const fd = new FormData(f); addTodo(fd.get('text'), fd.get('due')); render(); }
  if (f.id === 'noteForm') { e.preventDefault(); addNote(new FormData(f).get('text')); toast('Catatan disimpan.'); render(); }
  if (f.id === 'habitForm') { e.preventDefault(); const p = {}; new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); }); if (!p.name) return; if (f.dataset.id) { const hb = life().habits.find(x => x.id === f.dataset.id); hb.name = p.name; hb.emoji = p.emoji || '✅'; touch(hb); } else life().habits.push(touch({ id: uid(), name: p.name, emoji: p.emoji || '✅', created: S.today, log: {} })); saveL(); closeModal(); render(); }
  if (f.id === 'hariTodo') { e.preventDefault(); addTodo(new FormData(f).get('text'), S.today); render(); }
  if (f.id === 'hariNote') { e.preventDefault(); addNote(new FormData(f).get('text')); toast('Catatan disimpan.'); render(); }
});

/* =====================================================================
   FOKUS (Pomodoro)
   ===================================================================== */
const T = { mode: 'focus', running: false, endAt: 0, left: 25 * 60, total: 25 * 60, timer: null, task: '' };
const durFor = m => (m === 'focus' ? life().cfg.focus : m === 'brk' ? life().cfg.brk : life().cfg.long) * 60;
function setMode(m) { T.mode = m; T.running = false; clearInterval(T.timer); T.total = T.left = Math.max(60, durFor(m)); document.title = 'Lamaran Tracker'; }
const fmtT = s => pad2(Math.floor(s / 60)) + ':' + pad2(s % 60), pad2 = n => String(n).padStart(2, '0');
function drawTimer() {
  const t = $('#tmTime'); if (t) t.textContent = fmtT(T.left);
  const r = $('#tmRing'); if (r) r.setAttribute('stroke-dashoffset', String(565.5 * (1 - (T.total ? T.left / T.total : 0))));
  if (T.running) document.title = fmtT(T.left) + ' · ' + (T.mode === 'focus' ? 'Fokus' : 'Istirahat'); else document.title = 'Lamaran Tracker';
}
function beep() { try { const ac = new (window.AudioContext || window.webkitAudioContext)(); [0, .25, .5].forEach(d => { const o = ac.createOscillator(), g = ac.createGain(); o.connect(g); g.connect(ac.destination); o.frequency.value = 880; g.gain.setValueAtTime(.0001, ac.currentTime + d); g.gain.exponentialRampToValueAtTime(.25, ac.currentTime + d + .02); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d + .2); o.start(ac.currentTime + d); o.stop(ac.currentTime + d + .22); }); } catch (e) {} }
function notify(title, body) { try { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body }); } catch (e) {} }
function tick() { if (!T.running) return; const left = Math.ceil((T.endAt - nowTs()) / 1000); T.left = Math.max(0, left); drawTimer(); if (left <= 0) finishTimer(); }
function startTimer() { if (T.running) return; T.running = true; T.endAt = nowTs() + T.left * 1000; clearInterval(T.timer); T.timer = setInterval(tick, 250); tick(); render(); }
function pauseTimer() { if (!T.running) return; T.left = Math.max(0, Math.round((T.endAt - nowTs()) / 1000)); T.running = false; clearInterval(T.timer); drawTimer(); render(); }
function finishTimer() {
  const was = T.mode; T.running = false; clearInterval(T.timer); beep();
  if (was === 'focus') { const l = life(), mins = Math.round(T.total / 60); l.focus[S.today] = (l.focus[S.today] || 0) + mins; l.sess[S.today] = (l.sess[S.today] || 0) + 1; saveL(); notify('Sesi fokus selesai', 'Saatnya istirahat sebentar.'); toast('Sesi fokus selesai. Istirahat dulu ☕'); }
  else { notify('Istirahat selesai', 'Siap fokus lagi?'); toast('Istirahat selesai.'); }
  setMode(was === 'focus' ? ((life().sess[S.today] || 0) % 4 === 0 ? 'long' : 'brk') : 'focus'); render();
}
function viewFokus() {
  const l = life(), mins = l.focus[S.today] || 0, n = l.sess[S.today] || 0, c = l.cfg, labels = { focus: 'Fokus', brk: 'Istirahat', long: 'Istirahat panjang' };
  const week = Array.from({ length: 7 }, (_, i) => addDays(S.today, i - 6)), mx = Math.max(30, ...week.map(d => l.focus[d] || 0));
  const todos = activeTodos();
  return head('Fokus', 'Timer Pomodoro: kerja fokus, lalu istirahat singkat. Empat sesi, lalu istirahat panjang.') +
    '<div class="grid g2"><div class="panel timerpanel"><div class="seg" style="margin-bottom:14px">' + ['focus', 'brk', 'long'].map(m => '<button data-act="tmode" data-v="' + m + '" class="' + (T.mode === m ? 'on' : '') + '">' + labels[m] + '</button>').join('') + '</div>' +
    '<div class="ringwrap"><svg viewBox="0 0 200 200" class="ring" aria-hidden="true"><circle cx="100" cy="100" r="90" class="rbg"/><circle id="tmRing" cx="100" cy="100" r="90" class="rfg" stroke-dasharray="565.5" stroke-dashoffset="' + (565.5 * (1 - (T.total ? T.left / T.total : 0))) + '" transform="rotate(-90 100 100)"/></svg><div class="rtext"><b id="tmTime">' + fmtT(T.left) + '</b><span>' + labels[T.mode] + '</span></div></div>' +
    '<div class="actions" style="justify-content:center;margin-top:14px">' + (T.running ? '<button class="btn primary" data-act="tpause">Jeda</button>' : '<button class="btn primary" data-act="tstart">' + (T.left < T.total ? 'Lanjut' : 'Mulai') + '</button>') + '<button class="btn" data-act="treset">Ulang</button><button class="btn" data-act="tskip">Lewati</button></div>' +
    '<div class="field" style="margin-top:14px"><label>Sedang mengerjakan (opsional)</label><select data-act="ttask"><option value="">— pilih tugas —</option>' + todos.map(t => '<option value="' + esc(t.text) + '"' + (T.task === t.text ? ' selected' : '') + '>' + esc(t.text) + '</option>').join('') + '</select></div></div>' +
    '<div class="stack"><div class="panel"><h2>Hari ini</h2><div class="tiles"><div class="tile" style="--tc:var(--c4)"><b>' + n + '</b><span>sesi selesai</span></div><div class="tile" style="--tc:var(--c3)"><b>' + mins + ' mnt</b><span>waktu fokus</span></div></div></div>' +
    '<div class="panel"><h2>7 hari terakhir</h2><div class="fbars">' + week.map(d => '<div class="fb"><i style="height:' + Math.round((l.focus[d] || 0) / mx * 100) + '%"></i><small>' + HARI_F[fromIso(d).getDay()].slice(0, 3) + '</small></div>').join('') + '</div></div>' +
    '<div class="panel"><h2>Pengaturan timer</h2><div class="fgrid"><div class="field"><label>Fokus (menit)</label><input type="number" min="1" max="120" value="' + c.focus + '" data-act="tcfg" data-k="focus"></div><div class="field"><label>Istirahat (menit)</label><input type="number" min="1" max="60" value="' + c.brk + '" data-act="tcfg" data-k="brk"></div><div class="field"><label>Istirahat panjang</label><input type="number" min="1" max="90" value="' + c.long + '" data-act="tcfg" data-k="long"></div></div><button class="btn sm" data-act="tnotif">Aktifkan notifikasi browser</button></div></div></div>';
}
Object.assign(LT.act, {
  tstart() { startTimer(); }, tpause() { pauseTimer(); }, treset() { setMode(T.mode); render(); }, tskip() { if (T.running || T.left < T.total) { setMode(T.mode === 'focus' ? 'brk' : 'focus'); } else setMode(T.mode === 'focus' ? 'brk' : 'focus'); render(); },
  tmode(el) { setMode(el.dataset.v); render(); },
  tnotif() { if ('Notification' in window) Notification.requestPermission().then(p => toast(p === 'granted' ? 'Notifikasi aktif.' : 'Notifikasi tidak diizinkan.')); else toast('Browser ini tidak mendukung notifikasi.', 'err'); }
});
LT.chg.ttask = el => { T.task = el.value; };
LT.chg.tcfg = el => { const v = Math.max(1, Math.min(120, Number(el.value) || 25)); life().cfg[el.dataset.k] = v; saveL(); if (!T.running) setMode(T.mode); render(); };

/* =====================================================================
   HARI INI
   ===================================================================== */
function viewHari() {
  const quick = S.mode === 'cepat', d = fromIso(S.today), name = h.displayName();
  const hr = new Date().getHours(), greet = (hr < 11 ? 'Selamat pagi' : hr < 15 ? 'Selamat siang' : hr < 19 ? 'Selamat sore' : 'Selamat malam') + (name ? ', ' + esc(name) : '');
  const cs = LT.fin.todaySummary(), bills = LT.fin.dueBills(7);
  const cash = '<div class="panel"><div class="ptitle"><h2>Cashflow hari ini</h2><button class="btn sm primary" data-act="nav" data-v="catat">' + ico('plus', 14) + ' Catat</button></div><div class="sumbar"><div><span>Masuk</span><b class="pos">' + rp(cs.in) + '</b></div><div><span>Keluar</span><b class="neg">' + rp(cs.out) + '</b></div><div><span>Saldo total</span><b>' + rp(cs.total) + '</b></div></div><p class="muted small" style="margin:10px 0 0">' + cs.count + ' transaksi tercatat hari ini.</p></div>';
  const billsP = '<div class="panel"><h2>Tagihan jatuh tempo</h2><p class="sub">7 hari ke depan dan yang terlambat</p>' + (bills.length ? '<div class="rowlist">' + bills.map(x => '<div class="rowitem"><div class="t"><b>' + esc(x.bill.name) + '</b><span>' + rp(x.bill.amount) + ' · ' + x.label + '</span></div><button class="btn sm primary" data-act="bpay2" data-id="' + x.bill.id + '">Bayar</button></div>').join('') + '</div>' : '<div class="empty-note">Tidak ada tagihan dekat jatuh tempo.</div>') + '</div>';
  const hs = live(life().habits), hab = '<div class="panel"><div class="ptitle"><h2>Kebiasaan hari ini</h2><button class="btn sm" data-act="nav" data-v="kebiasaan">Kelola</button></div>' + (hs.length ? hs.map(hb => { const done = !!(hb.log || {})[S.today], st = streakOf(hb); return '<div class="todo' + (done ? ' done' : '') + '"><button class="tick' + (done ? ' on' : '') + '" data-act="hday2" data-id="' + hb.id + '" aria-label="Tandai">' + (done ? ico('check', 14) : '') + '</button><span class="ttx">' + esc(hb.emoji || '✅') + ' ' + esc(hb.name) + '</span><span class="tag">🔥 ' + st.cur + '</span></div>'; }).join('') : '<div class="empty-note">Belum ada kebiasaan. <button class="btn sm" data-act="nav" data-v="kebiasaan">Buat</button></div>') + '</div>';
  const todos = activeTodos().filter(t => !t.due || t.due <= S.today).slice(0, 6), tg = '<div class="panel"><div class="ptitle"><h2>Tugas</h2><button class="btn sm" data-act="nav" data-v="tugas">Semua</button></div>' + (todos.length ? todos.map(todoRow).join('') : '<div class="empty-note">Tidak ada tugas untuk hari ini.</div>') + '<form id="hariTodo" class="todoadd" style="margin-top:10px"><input type="text" name="text" maxlength="160" placeholder="Tambah tugas hari ini…" aria-label="Tambah tugas"><button class="btn sm" type="submit">Tambah</button></form></div>';
  const fu = S.needsSetup ? [] : h.dueList().concat(h.followList()).slice(0, 5);
  const follow = fu.length ? '<div class="panel"><div class="ptitle"><h2>Follow-up lamaran</h2><button class="btn sm" data-act="nav" data-v="tindak">Semua</button></div><div class="rowlist">' + fu.map(r => '<div class="rowitem"><div class="t"><b>' + esc(r.company) + '</b><span>' + esc(r.position) + ' · ' + (r.followup && r.followup <= S.today ? 'jadwal ' + fmtD(r.followup) : r.days + ' hari tanpa kabar') + '</span></div><button class="btn sm" data-act="tpl" data-id="' + r.id + '">' + ico('mail', 14) + ' Pesan</button></div>').join('') + '</div></div>' : '';
  const l = life(), mins = l.focus[S.today] || 0, focus = '<div class="panel"><div class="ptitle"><h2>Fokus</h2><button class="btn sm primary" data-act="nav" data-v="fokus">' + ico('timer', 14) + ' Mulai timer</button></div><p class="muted" style="margin:0">' + (mins ? mins + ' menit fokus hari ini (' + (l.sess[S.today] || 0) + ' sesi).' : 'Belum ada sesi fokus hari ini.') + '</p></div>';
  const note = '<div class="panel"><h2>Catatan cepat</h2><form id="hariNote"><div class="field" style="margin-bottom:8px"><textarea name="text" rows="2" placeholder="Tulis sesuatu yang perlu diingat…" aria-label="Catatan cepat"></textarea></div><button class="btn sm" type="submit">Simpan</button></form></div>';
  const mat = LT.homeCard ? LT.homeCard() : '';
  return head(greet, HARI_F[d.getDay()] + ', ' + fmtD(S.today), quick ? '' : '<button class="btn" data-act="setmode" data-v="cepat">Mode cepat</button>') +
    (quick ? '<div class="stack">' + cash + billsP + hab + tg + follow + mat + focus + note + '</div>' : '<div class="grid g2"><div class="stack">' + cash + billsP + follow + mat + '</div><div class="stack">' + hab + tg + focus + note + '</div></div>');
}
Object.assign(LT.act, {
  hday2(el) { toggleHabit(el.dataset.id, S.today); render(); },
  bpay2(el) { LT.fin.payBill(el.dataset.id); render(); }
});

/* =====================================================================
   KUNCI PIN (pengaman tampilan, bukan enkripsi)
   ===================================================================== */
const LK = 'lt.lock.v1';
const lockCfg = () => kv.read(LK, null);
LT.lockEnabled = () => !!lockCfg();
async function hashPin(pin, salt) {
  const s = salt + ':' + pin;
  if (window.crypto && crypto.subtle && window.TextEncoder) { const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)); return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''); }
  let x = 5381; for (let i = 0; i < s.length; i++) x = ((x << 5) + x + s.charCodeAt(i)) >>> 0; return 'f' + x.toString(16);
}
const K = { locked: false, buf: '', tries: 0, blockedUntil: 0, last: nowTs() };
function showLock() {
  const cfg = lockCfg(); if (!cfg) return; K.locked = true; K.buf = ''; document.body.classList.add('locked');
  const root = $('#lockRoot'); if (!root) return;
  root.innerHTML = '<div class="lockbg"><div class="lockbox"><div class="lockic">🔒</div><h2>Aplikasi terkunci</h2><p class="small muted" id="lockMsg">Masukkan PIN</p><div class="pindots" id="pinDots"></div><div class="keypad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => '<button data-act="pinkey" data-k="' + n + '">' + n + '</button>').join('') + '<button data-act="pinkey" data-k="clear" aria-label="Hapus semua">C</button><button data-act="pinkey" data-k="0">0</button><button data-act="pinkey" data-k="back" aria-label="Hapus satu">⌫</button></div></div></div>';
  drawDots();
}
function drawDots() { const cfg = lockCfg(), d = $('#pinDots'); if (!d || !cfg) return; d.innerHTML = Array.from({ length: cfg.len || 4 }, (_, i) => '<i class="' + (i < K.buf.length ? 'on' : '') + '"></i>').join(''); }
function unlock() { K.locked = false; K.buf = ''; K.tries = 0; K.last = nowTs(); document.body.classList.remove('locked'); const r = $('#lockRoot'); if (r) r.innerHTML = ''; }
async function tryPin() {
  const cfg = lockCfg(), msg = $('#lockMsg'); if (!cfg) { unlock(); return; }
  if (nowTs() < K.blockedUntil) { if (msg) msg.textContent = 'Tunggu ' + Math.ceil((K.blockedUntil - nowTs()) / 1000) + ' detik.'; K.buf = ''; drawDots(); return; }
  const hsh = await hashPin(K.buf, cfg.salt);
  if (hsh === cfg.hash) { unlock(); return; }
  K.tries++; K.buf = ''; drawDots(); if (K.tries >= 5) { K.blockedUntil = nowTs() + 30000; K.tries = 0; if (msg) msg.textContent = 'Terlalu banyak percobaan. Tunggu 30 detik.'; } else if (msg) msg.textContent = 'PIN salah. Coba lagi.';
  const box = $('.lockbox'); if (box) { box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake'); }
}
function pinInput(k) { const cfg = lockCfg(); if (!cfg || !K.locked) return; if (k === 'back') K.buf = K.buf.slice(0, -1); else if (k === 'clear') K.buf = ''; else if (K.buf.length < (cfg.len || 4)) K.buf += k; drawDots(); if (K.buf.length === (cfg.len || 4)) tryPin(); }
LT.act.pinkey = el => pinInput(el.dataset.k);
LT.act.lockNow = () => { if (lockCfg()) showLock(); };
document.addEventListener('keydown', e => { if (!K.locked) return; if (/^\d$/.test(e.key)) pinInput(e.key); else if (e.key === 'Backspace') pinInput('back'); e.stopPropagation(); }, true);
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { if (!K.locked) K.last = nowTs(); }, { passive: true }));
function autoLockCheck() { const cfg = lockCfg(); if (!cfg || K.locked || !cfg.auto) return; if (nowTs() - K.last > cfg.auto * 60000) showLock(); }
setInterval(autoLockCheck, 10000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') autoLockCheck(); });
LT.lockInit = () => { if (lockCfg()) showLock(); };

function settingsLock() {
  const cfg = lockCfg();
  if (!cfg) return '<div class="panel"><h2>Kunci PIN</h2><p class="sub">Kunci tampilan aplikasi dengan PIN 4–6 angka. Ini pengaman tampilan, bukan enkripsi: data tetap tersimpan biasa di browser ini.</p><form id="pinSetForm"><div class="fgrid"><div class="field"><label>PIN baru</label><input type="password" name="pin" inputmode="numeric" maxlength="6" autocomplete="new-password" placeholder="4–6 angka"></div><div class="field"><label>Ulangi PIN</label><input type="password" name="pin2" inputmode="numeric" maxlength="6" autocomplete="new-password"></div></div><button class="btn primary" type="submit">' + ico('lock', 16) + ' Aktifkan kunci</button></form></div>';
  return '<div class="panel"><h2>Kunci PIN <span class="tag" style="color:var(--c3)">aktif</span></h2><p class="sub">Aplikasi terkunci saat dibuka dan setelah tidak dipakai. PIN tidak ikut dalam cadangan dan transfer data.</p><div class="field"><label>Kunci otomatis setelah</label><select data-act="lockauto">' + [[0, 'Tidak pernah'], [1, '1 menit'], [5, '5 menit'], [15, '15 menit'], [30, '30 menit']].map(o => '<option value="' + o[0] + '"' + (cfg.auto === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div><div class="actions"><button class="btn" data-act="lockNow">' + ico('lock', 16) + ' Kunci sekarang</button><button class="btn" data-act="pinchg">Ganti PIN</button><button class="btn danger" data-act="pinrem">Hapus PIN</button></div></div>';
}
LT.settingsExtra = (LT.settingsExtra || []).concat([settingsLock]);
async function savePin(pin) { const salt = uid(), hash = await hashPin(pin, salt), old = lockCfg(); kv.write(LK, { salt, hash, len: pin.length, auto: old ? old.auto : 5 }); K.last = nowTs(); }
async function verifyPin(pin) { const cfg = lockCfg(); return !!cfg && (await hashPin(pin, cfg.salt)) === cfg.hash; }
LT.act.pinchg = () => openModal('<h2>Ganti PIN</h2><form id="pinChgForm"><div class="field"><label>PIN saat ini</label><input type="password" name="cur" inputmode="numeric" maxlength="6" autocomplete="off"></div><div class="fgrid"><div class="field"><label>PIN baru</label><input type="password" name="pin" inputmode="numeric" maxlength="6" autocomplete="new-password"></div><div class="field"><label>Ulangi PIN baru</label><input type="password" name="pin2" inputmode="numeric" maxlength="6" autocomplete="new-password"></div></div><div class="foot"><span></span><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button class="btn primary" type="submit">Simpan</button></div></div></form>');
LT.act.pinrem = () => openModal('<h2>Hapus PIN</h2><form id="pinRemForm"><div class="field"><label>PIN saat ini</label><input type="password" name="cur" inputmode="numeric" maxlength="6" autocomplete="off"></div><div class="foot"><span></span><div class="actions"><button type="button" class="btn" data-act="close">Batal</button><button class="btn danger" type="submit">Hapus PIN</button></div></div></form>');
LT.chg.lockauto = el => { const cfg = lockCfg(); if (cfg) { cfg.auto = Number(el.value) || 0; kv.write(LK, cfg); toast('Pengaturan kunci disimpan.'); } };
document.addEventListener('submit', async e => {
  const f = e.target, p = {}; if (['pinSetForm', 'pinChgForm', 'pinRemForm'].indexOf(f.id) < 0) return; e.preventDefault(); new FormData(f).forEach((v, k) => { p[k] = String(v).trim(); });
  if (f.id === 'pinSetForm') { if (!/^\d{4,6}$/.test(p.pin || '')) { toast('PIN harus 4–6 angka.', 'err'); return; } if (p.pin !== p.pin2) { toast('Kedua PIN tidak sama.', 'err'); return; } await savePin(p.pin); toast('Kunci PIN aktif.'); render(); }
  if (f.id === 'pinChgForm') { if (!(await verifyPin(p.cur || ''))) { toast('PIN saat ini salah.', 'err'); return; } if (!/^\d{4,6}$/.test(p.pin || '')) { toast('PIN baru harus 4–6 angka.', 'err'); return; } if (p.pin !== p.pin2) { toast('Kedua PIN tidak sama.', 'err'); return; } await savePin(p.pin); closeModal(); toast('PIN diganti.'); render(); }
  if (f.id === 'pinRemForm') { if (!(await verifyPin(p.cur || ''))) { toast('PIN salah.', 'err'); return; } try { localStorage.removeItem(LK); } catch (er) {} kv.write(LK, null); closeModal(); toast('PIN dihapus.'); render(); }
});

LT.views.hari = { render: viewHari }; LT.views.kebiasaan = { render: viewKebiasaan }; LT.views.tugas = { render: viewTugas }; LT.views.fokus = { render: viewFokus, after: drawTimer };
LT.prod = { life, addTodo, addNote, toggleHabit, streakOf, T, setMode, startTimer, pauseTimer, finishTimer, K, hashPin, tryPin, showLock, unlock, lockCfg, savePin, pinInput };
})();
