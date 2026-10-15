(function () {
'use strict';
const { S, h } = LT;
const { $, $$, esc, fmtD, rp, money, pct, ico, toast, head, cssv, addDays, saveProgressSoon } = h;
const render = () => h.render();

/* =====================================================================
   MATERI HARIAN
   Alur: pilih/lanjutkan materi -> baca -> jawab 1 kuis -> materi dianggap selesai
   -> materi berikutnya yang belum selesai langsung muncul sebagai "Materi hari ini".
   ===================================================================== */
const D = { open: null, step: 'read', picked: null };
const catOf = l => DAILY_CATS[l.cat] || { l: l.cat, c: '--c1' };
function dstate() {
  const done = new Set(S.progress.daily.done), next = DAILY.find(x => !done.has(x.id));
  return { done, next, count: DAILY.filter(x => done.has(x.id)).length, total: DAILY.length };
}
function streakNow() {
  const d = S.progress.daily; if (!d.last) return 0;
  return (d.last === S.today || d.last === addDays(S.today, -1)) ? d.streak : 0;
}
function completeDaily(id) {
  const d = S.progress.daily;
  if (d.done.indexOf(id) === -1) d.done.push(id);
  if (d.last !== S.today) { d.streak = d.last === addDays(S.today, -1) ? (d.streak || 0) + 1 : 1; d.last = S.today; if (d.streak > (d.best || 0)) d.best = d.streak; }
  saveProgressSoon();
}
LT.homeCard = function () {
  const st = dstate(), n = st.next;
  if (!n) return '<div class="today" style="--tcol:var(--c3)"><div><div class="eyebrow">Materi harian</div><h2>Semua ' + st.total + ' materi selesai 🎉</h2><p>Hebat. Buka menu Materi harian untuk mengulang dari awal, atau minta materi baru untuk ditambahkan.</p></div><div class="streak">' + ico('flame', 18) + streakNow() + ' hari</div></div>';
  const c = catOf(n);
  return '<div class="today" style="--tcol:var(' + c.c + ')"><div><div class="eyebrow">Materi hari ini · ' + esc(c.l) + '</div><h2>' + esc(n.t) + '</h2><p>Aksi kecil: ' + esc(n.act) + '</p><button class="btn" data-act="dopen" data-id="' + n.id + '">' + ico('sun', 16) + ' Mulai belajar (±' + n.min + ' menit)</button></div><div class="streak">' + ico('flame', 18) + streakNow() + ' hari</div></div>';
};
function viewHarian() {
  const st = dstate(), sub = 'Satu materi singkat tiap kali. Selesaikan, dan materi baru langsung muncul. Diperbarui ' + DAILY_UPDATED.split('-').reverse().join('/') + '.';
  if (D.open) return harianReader(DAILY.find(x => x.id === D.open), st);
  const cats = Object.keys(DAILY_CATS).map(k => { const all = DAILY.filter(x => x.cat === k), dn = all.filter(x => st.done.has(x.id)).length, c = DAILY_CATS[k];
    return '<div class="panel" style="padding:14px 16px"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="catchip" style="--cc:var(' + c.c + ')">' + esc(c.l) + '</span><span class="small muted">' + dn + '/' + all.length + '</span></div><div class="prog" style="margin-top:10px;--pc:var(' + c.c + ')"><i style="width:' + pct(dn, all.length) + '%"></i></div></div>'; }).join('');
  const list = DAILY.map(x => { const c = catOf(x), dn = st.done.has(x.id); return '<button class="ditem' + (dn ? ' done' : '') + '" style="--cc:var(' + c.c + ')" data-act="dopen" data-id="' + x.id + '"><span class="catchip" style="--cc:var(' + c.c + ')">' + esc(c.l) + '</span><b>' + esc(x.t) + '</b><span class="small muted">' + (dn ? '✓ Selesai' : '±' + x.min + ' menit') + '</span></button>'; }).join('');
  return head('Materi harian', sub, '<span class="streak" style="background:var(--panel2);color:var(--ink)">' + ico('flame', 18) + ' Streak ' + streakNow() + ' hari · rekor ' + (S.progress.daily.best || 0) + '</span>') +
    LT.homeCard() + '<div class="sp"></div>' +
    '<div class="panel"><h2>Progres ' + st.count + ' dari ' + st.total + ' materi</h2><div class="prog" style="margin:10px 0 0"><i style="width:' + pct(st.count, st.total) + '%"></i></div></div><div class="sp"></div>' +
    '<div class="grid g3" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">' + cats + '</div><div class="sp"></div>' +
    '<div class="panel"><h2>Semua materi</h2><p class="sub">Kamu bisa membuka materi mana pun untuk dibaca ulang.</p><div class="dgrid">' + list + '</div>' + (st.count ? '<div style="margin-top:14px"><button class="btn sm" data-act="dreset">Ulangi dari awal</button></div>' : '') + '</div>';
}
function harianReader(l, st) {
  const c = catOf(l), isDone = st.done.has(l.id);
  let body;
  if (D.step === 'read') {
    body = '<div class="prose">' + l.h + '</div><div class="tip"><b>Aksi kecil:</b> ' + esc(l.act) + '</div><div class="actions"><button class="btn primary" data-act="dquiz">' + ico('check', 16) + ' Lanjut ke kuis kilat</button></div>';
  } else {
    const q = l.q;
    body = '<p class="muted small">Kuis kilat · 1 pertanyaan</p><h3 style="font-size:20px;margin:0 0 6px">' + esc(q.q) + '</h3>' + q.o.map((o, i) => '<button class="opt' + (D.picked != null ? (i === q.a ? ' ok' : (i === D.picked ? ' no' : '')) : '') + '" data-act="dpick" data-i="' + i + '"' + (D.picked != null ? ' disabled' : '') + '>' + esc(o) + '</button>').join('');
    if (D.picked != null) {
      const nx = DAILY.find(x => !st.done.has(x.id) && x.id !== l.id);
      body += '<div class="expl"><b>' + (D.picked === q.a ? 'Benar.' : 'Kurang tepat.') + '</b> ' + esc(q.e) + '</div><div class="expl" style="background:color-mix(in srgb,var(--c3) 14%,var(--panel))"><b>Materi selesai ✓</b> Streak ' + streakNow() + ' hari.' + (nx ? ' Materi baru sudah siap: <b>' + esc(nx.t) + '</b>.' : ' Semua materi sudah kamu selesaikan 🎉') + '</div><div class="actions" style="margin-top:12px">' +
        (nx ? '<button class="btn primary" data-act="dopen" data-id="' + nx.id + '">Materi berikutnya ' + ico('arrow', 16) + '</button>' : '') + '<button class="btn" data-act="dback">Kembali ke daftar</button></div>';
    }
  }
  return head(esc(l.t), '<span class="catchip" style="--cc:var(' + c.c + ')">' + esc(c.l) + '</span> ' + (isDone ? '✓ sudah selesai' : '±' + l.min + ' menit'), '<button class="btn" data-act="dback">Semua materi</button>') + '<div class="panel" style="border-top:4px solid var(' + c.c + ')">' + body + '</div>';
}
Object.assign(LT.act, {
  dopen(el) { D.open = el.dataset.id; D.step = 'read'; D.picked = null; if (S.view !== 'harian') S.view = 'harian'; render(); window.scrollTo(0, 0); },
  dquiz() { D.step = 'quiz'; D.picked = null; render(); },
  dpick(el) { const l = DAILY.find(x => x.id === D.open); if (D.picked != null) return; D.picked = Number(el.dataset.i); completeDaily(l.id); render(); },
  dback() { D.open = null; D.step = 'read'; D.picked = null; render(); window.scrollTo(0, 0); },
  dreset() { S.progress.daily.done = []; saveProgressSoon(); render(); toast('Progres materi harian diulang dari awal.'); }
});

/* =====================================================================
   MODUL KARIER
   ===================================================================== */
const M = { tab: 'modul', mod: null, lesson: 0, quiz: null };
function modPct(m) { const done = (S.progress.done[m.id] || []).length, q = S.progress.quiz[m.id], ok = q && q.total && q.best / q.total >= .7 ? 1 : 0; return Math.round((done + ok) / (m.lessons.length + 1) * 100); }
function viewModul() {
  const tabs = '<div class="tabs"><button data-act="mtab" data-v="modul" class="' + (M.tab === 'modul' ? 'on' : '') + '">Modul</button><button data-act="mtab" data-v="drill" class="' + (M.tab === 'drill' ? 'on' : '') + '">Latihan hitung cepat</button></div>';
  if (M.tab === 'drill') return head('Modul karier', 'Latihan singkat untuk melatih kecepatan dan ketelitian hitung.') + tabs + '<div class="panel"><h2>Latihan hitung cepat</h2><p class="sub">10 soal numerik. Gunakan kertas coretan, tanpa kalkulator.</p><div id="drillBox"></div></div>';
  if (M.mod) return viewModule(MODULES.find(m => m.id === M.mod));
  const all = Math.round(MODULES.reduce((a, m) => a + modPct(m), 0) / MODULES.length);
  return head('Modul karier', 'Modul lintas bidang pekerjaan. Progres tersimpan otomatis di akunmu.') + tabs +
    '<div class="panel" style="margin-bottom:16px"><b>Progres keseluruhan ' + all + '%</b><div class="prog" style="margin-top:8px"><i style="width:' + all + '%"></i></div></div><div class="mods">' +
    MODULES.map(m => { const q = S.progress.quiz[m.id], p = modPct(m); return '<button class="mod" style="--mc:var(' + m.color + ')" data-act="openmod" data-id="' + m.id + '"><span class="ic">' + ico('m_' + m.icon, 22) + '</span><b>' + esc(m.title) + '</b><p>' + esc(m.desc) + '</p><div class="prog" style="--pc:var(' + m.color + ')"><i style="width:' + p + '%"></i></div><span class="muted small">' + m.level + ' · ±' + m.minutes + ' menit · ' + p + '%' + (q && q.total ? ' · kuis ' + q.best + '/' + q.total : '') + '</span></button>'; }).join('') + '</div>';
}
function viewModule(m) {
  const done = S.progress.done[m.id] || [];
  const nav = m.lessons.map((l, i) => '<button data-act="lesson" data-i="' + i + '" class="' + (M.lesson === i ? 'on' : '') + '"><span class="ck' + (done.indexOf(i) > -1 ? ' done' : '') + '">' + (done.indexOf(i) > -1 ? ico('check', 12) : '') + '</span>' + esc(l.t) + '</button>').join('') +
    '<button data-act="lesson" data-i="quiz" class="' + (M.lesson === 'quiz' ? 'on' : '') + '"><span class="ck' + ((S.progress.quiz[m.id] && S.progress.quiz[m.id].best / S.progress.quiz[m.id].total >= .7) ? ' done' : '') + '"></span>Kuis modul</button>';
  let content;
  if (M.lesson === 'quiz') content = viewQuiz(m);
  else { const les = m.lessons[M.lesson], isDone = done.indexOf(M.lesson) > -1, next = M.lesson + 1 < m.lessons.length ? M.lesson + 1 : 'quiz';
    content = '<div class="prose">' + les.h + '</div><div class="actions" style="margin-top:18px"><button class="btn primary" data-act="finish" data-next="' + next + '">' + ico('check') + (isDone ? 'Lanjut' : 'Tandai selesai & lanjut') + '</button></div>'; }
  return head(esc(m.title), esc(m.desc), '<button class="btn" data-act="backmod">Semua modul</button>') + '<div class="lesson-layout"><div class="lnav">' + nav + '</div><div class="panel" style="border-top:4px solid var(' + m.color + ')">' + content + '</div></div>';
}
function viewQuiz(m) {
  let q = M.quiz; if (!q || q.mod !== m.id) q = M.quiz = { mod: m.id, i: 0, score: 0, picked: null, done: false };
  const best = S.progress.quiz[m.id];
  if (q.done) { const ok = q.score / m.quiz.length >= .7; return '<h3 style="font-size:24px;margin:0 0 8px">Hasil kuis: ' + q.score + ' dari ' + m.quiz.length + '</h3><p>' + (ok ? 'Bagus, modul ini dihitung lulus (skor minimal 70%).' : 'Belum mencapai 70%. Baca ulang materi, lalu coba lagi.') + '</p><div class="actions"><button class="btn primary" data-act="retry">Ulangi kuis</button><button class="btn" data-act="backmod">Semua modul</button></div>'; }
  const it = m.quiz[q.i];
  return '<p class="muted small">Soal ' + (q.i + 1) + ' dari ' + m.quiz.length + (best && best.total ? ' · skor terbaik ' + best.best + '/' + best.total : '') + '</p><h3 style="font-size:21px;margin:0 0 6px">' + esc(it.q) + '</h3>' +
    it.o.map((o, i) => '<button class="opt' + (q.picked != null ? (i === it.a ? ' ok' : (i === q.picked ? ' no' : '')) : '') + '" data-act="pick" data-i="' + i + '"' + (q.picked != null ? ' disabled' : '') + '>' + esc(o) + '</button>').join('') +
    (q.picked != null ? '<div class="expl"><b>' + (q.picked === it.a ? 'Benar.' : 'Kurang tepat.') + '</b> ' + esc(it.e) + '</div><div class="actions" style="margin-top:12px"><button class="btn primary" data-act="nextq">' + (q.i + 1 < m.quiz.length ? 'Soal berikutnya' : 'Lihat hasil') + '</button></div>' : '');
}
/* latihan hitung cepat */
let drill = null, drillTimer = null;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
function newDrill() {
  const qs = [];
  for (let i = 0; i < 10; i++) { const t = i % 4; let a, b, q, ans;
    if (t === 0) { a = rand(120, 980); b = rand(120, 980); q = a + ' + ' + b; ans = a + b; }
    else if (t === 1) { a = rand(500, 990); b = rand(100, 499); q = a + ' − ' + b; ans = a - b; }
    else if (t === 2) { a = rand(12, 49); b = rand(3, 19); q = a + ' × ' + b; ans = a * b; }
    else { a = rand(2, 19) * 100; b = [10, 15, 20, 25, 30, 40, 50][rand(0, 6)]; q = b + '% dari ' + a; ans = a * b / 100; }
    qs.push({ q, ans }); }
  drill = { qs, start: Date.now(), done: false };
}
function renderDrill() {
  const box = $('#drillBox'); if (!box) return; clearInterval(drillTimer);
  if (!drill) { box.innerHTML = '<button class="btn primary" data-act="drillstart">Mulai latihan</button>'; return; }
  if (drill.done) { const ok = drill.qs.filter(q => q.ok).length;
    box.innerHTML = '<h3 style="margin:0 0 6px">Skor ' + ok + ' / 10 dalam ' + drill.secs + ' detik</h3>' + drill.qs.map(q => '<div class="drill-q"><span>' + esc(q.q) + ' = ' + q.ans + '</span><span class="muted">jawabanmu: ' + esc(q.given || '–') + '</span><span>' + (q.ok ? '✓' : '✗') + '</span></div>').join('') + '<div class="actions" style="margin-top:14px"><button class="btn primary" data-act="drillstart">Ulangi dengan soal baru</button></div>'; return; }
  box.innerHTML = '<p class="muted">Waktu: <b id="drillTime">0</b> detik</p>' + drill.qs.map((q, i) => '<div class="drill-q"><label for="dq' + i + '">' + (i + 1) + '. ' + esc(q.q) + '</label><input type="text" inputmode="numeric" id="dq' + i + '"><span></span></div>').join('') + '<div class="actions" style="margin-top:14px"><button class="btn primary" data-act="drillcheck">Periksa jawaban</button></div>';
  drillTimer = setInterval(() => { const el = $('#drillTime'); if (el) el.textContent = Math.round((Date.now() - drill.start) / 1000); else clearInterval(drillTimer); }, 500);
}
Object.assign(LT.act, {
  mtab(el) { M.tab = el.dataset.v; M.mod = null; render(); },
  openmod(el) { M.mod = el.dataset.id; M.lesson = 0; M.quiz = null; render(); window.scrollTo(0, 0); },
  backmod() { M.mod = null; M.quiz = null; render(); },
  lesson(el) { M.lesson = el.dataset.i === 'quiz' ? 'quiz' : Number(el.dataset.i); M.quiz = null; render(); },
  finish(el) { const id = M.mod, d = S.progress.done[id] = S.progress.done[id] || []; if (typeof M.lesson === 'number' && d.indexOf(M.lesson) === -1) { d.push(M.lesson); saveProgressSoon(); } M.lesson = el.dataset.next === 'quiz' ? 'quiz' : Number(el.dataset.next); M.quiz = null; render(); window.scrollTo(0, 0); },
  pick(el) { const q = M.quiz, m = MODULES.find(x => x.id === M.mod); if (q.picked != null) return; q.picked = Number(el.dataset.i); if (q.picked === m.quiz[q.i].a) q.score++; render(); },
  nextq() { const q = M.quiz, m = MODULES.find(x => x.id === M.mod); if (q.i + 1 < m.quiz.length) { q.i++; q.picked = null; } else { q.done = true; const b = S.progress.quiz[m.id]; if (!b || q.score >= b.best) S.progress.quiz[m.id] = { best: q.score, total: m.quiz.length, at: S.today }; saveProgressSoon(); } render(); },
  retry() { M.quiz = null; render(); },
  drillstart() { newDrill(); renderDrill(); },
  drillcheck() { drill.qs.forEach((q, i) => { q.given = $('#dq' + i).value.trim(); q.ok = Number(q.given.replace(',', '.')) === q.ans; }); drill.done = true; drill.secs = Math.round((Date.now() - drill.start) / 1000); renderDrill(); }
});

/* =====================================================================
   BELAJAR PAJAK: topik, glosarium, kalkulator, referensi
   ===================================================================== */
const P = { tab: 'topik', open: null, openCat: { dasar: true }, q: '', gq: '', gcat: '', calc: 'ter' };
const topicRead = id => S.progress.tax.read.indexOf(id) > -1;
function viewPajak() {
  const tabs = [['topik', 'Topik'], ['glosarium', 'Glosarium'], ['kalkulator', 'Kalkulator'], ['referensi', 'Referensi']];
  const bar = '<div class="tabs">' + tabs.map(t => '<button data-act="ptab" data-v="' + t[0] + '" class="' + (P.tab === t[0] ? 'on' : '') + '">' + t[1] + '</button>').join('') + '</div>';
  const hd = head('Belajar pajak', 'Pajak Indonesia dari dasar sampai lanjutan, dengan kalkulator. Materi bersifat edukatif dan disederhanakan.', '<span class="updated">' + ico('check', 14) + ' Diverifikasi ' + esc(TAX_UPDATED) + '</span>');
  if (P.tab === 'topik' && P.open) return topicView(TAX_TOPICS.find(t => t.id === P.open));
  if (P.tab === 'topik') return hd + bar + topicList();
  if (P.tab === 'glosarium') return hd + bar + glossaryView();
  if (P.tab === 'kalkulator') return hd + bar + calcView();
  return hd + bar + refView();
}
function topicList() {
  const chips = '<div class="ratechips">' + TAX_RATES.map(r => '<div class="rchip" style="--rc:var(' + r[2] + ')"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>').join('') + '</div>';
  const q = P.q.trim().toLowerCase();
  const row = t => '<button class="topic" data-act="ptopic" data-id="' + t.id + '"><span class="em">' + t.em + '</span><span><b>' + esc(t.t) + '</b><span class="s">' + esc(t.s) + '</span></span>' + (topicRead(t.id) ? '<span class="badge2 new">✓ dibaca</span>' : (t.badge ? '<span class="badge2' + (/baru|diperbarui|2025|2026/i.test(t.badge) ? ' new' : '') + '">' + esc(t.badge) + '</span>' : '')) + '</button>';
  const search = '<div class="toolbar"><div class="search">' + ico('search', 16) + '<input type="search" data-inp="pq" placeholder="Cari topik: PPN, TER, UMKM, kripto…" value="' + esc(P.q) + '"></div><span class="muted small">' + TAX_TOPICS.length + ' topik · ' + TAX_TOPICS.filter(t => topicRead(t.id)).length + ' sudah dibaca</span></div>';
  if (q) { const hits = TAX_TOPICS.filter(t => (t.t + ' ' + t.s + ' ' + t.h.replace(/<[^>]+>/g, ' ')).toLowerCase().indexOf(q) > -1); return chips + search + '<div class="acc"><div class="items">' + (hits.map(row).join('') || '<div class="empty-note">Tidak ada topik yang cocok.</div>') + '</div></div>'; }
  return chips + search + TAX_CATS.map(c => { const items = TAX_TOPICS.filter(t => t.cat === c.id), open = !!P.openCat[c.id];
    return '<div class="acc" style="--cc:var(' + c.c + ')"><button data-act="pcat" data-id="' + c.id + '"><span style="font-size:24px">' + c.em + '</span><span><b>' + esc(c.t) + '</b><span class="s">' + esc(c.s) + '</span></span><span class="cnt">' + items.length + ' topik ' + (open ? '▾' : '▸') + '</span></button>' + (open ? '<div class="items">' + items.map(row).join('') + '</div>' : '') + '</div>'; }).join('');
}
function topicView(t) {
  const idx = TAX_TOPICS.findIndex(x => x.id === t.id), nx = TAX_TOPICS[idx + 1], c = TAX_CATS.find(x => x.id === t.cat);
  return head(t.em + ' ' + esc(t.t), '<span class="catchip" style="--cc:var(' + c.c + ')">' + esc(c.t) + '</span> · diverifikasi ' + esc(TAX_UPDATED), '<button class="btn" data-act="pback">Semua topik</button>') +
    '<div class="panel" style="border-top:4px solid var(' + c.c + ')"><div class="prose">' + t.h + '</div><div class="actions" style="margin-top:18px"><button class="btn ' + (topicRead(t.id) ? '' : 'primary') + '" data-act="pread" data-id="' + t.id + '">' + ico('check', 16) + (topicRead(t.id) ? 'Sudah dibaca (batalkan)' : 'Tandai sudah dibaca') + '</button>' + (nx ? '<button class="btn" data-act="ptopic" data-id="' + nx.id + '">Berikutnya: ' + esc(nx.t) + ' ' + ico('arrow', 16) + '</button>' : '') + '</div></div>' +
    '<p class="muted small" style="margin-top:12px">Materi bersifat edukatif dan disederhanakan. Untuk keperluan resmi, rujuk pajak.go.id atau konsultan pajak terdaftar.</p>';
}
function glossaryView() {
  const q = P.gq.trim().toLowerCase(), items = GLOSSARY.filter(g => (!P.gcat || g[1] === P.gcat) && (!q || (g[0] + ' ' + g[2]).toLowerCase().indexOf(q) > -1));
  const chips = '<div class="chips"><button class="chip' + (!P.gcat ? ' on' : '') + '" data-act="gcat" data-v="">Semua<b>' + GLOSSARY.length + '</b></button>' + Object.keys(GL_CATS).map(k => '<button class="chip' + (P.gcat === k ? ' on' : '') + '" data-act="gcat" data-v="' + k + '">' + GL_CATS[k] + '<b>' + GLOSSARY.filter(g => g[1] === k).length + '</b></button>').join('') + '</div>';
  return '<div class="toolbar"><div class="search">' + ico('search', 16) + '<input type="search" data-inp="gq" placeholder="Cari istilah…" value="' + esc(P.gq) + '"></div></div>' + chips +
    '<div class="gl">' + (items.map(g => '<div class="gterm"><b>' + esc(g[0]) + '</b> <span class="catchip">' + GL_CATS[g[1]] + '</span><p>' + esc(g[2]) + '</p></div>').join('') || '<div class="empty-note">Istilah tidak ditemukan.</div>') + '</div>';
}
function refView() {
  return '<div class="panel"><h2>Referensi peraturan</h2><p class="sub">Daftar dasar hukum yang dipakai pada materi dan kalkulator. Selalu cek versi terbaru.</p><table class="mini"><thead><tr><th>Peraturan</th><th>Isi singkat</th></tr></thead><tbody>' + TAX_REFS.map(r => '<tr><td><b>' + esc(r[0]) + '</b></td><td>' + esc(r[1]) + '</td></tr>').join('') + '</tbody></table></div>' +
    '<div class="panel" style="margin-top:16px"><h2>Tautan resmi</h2><p><a href="https://pajak.go.id" target="_blank" rel="noopener">pajak.go.id</a> · <a href="https://coretax.pajak.go.id" target="_blank" rel="noopener">coretax.pajak.go.id</a> · Kring Pajak 1500200</p><div class="warnbox">Materi di aplikasi ini bersifat edukatif dan disederhanakan, bukan nasihat pajak. Aturan dapat berubah. Untuk keputusan atau pelaporan resmi, konsultasikan dengan konsultan pajak terdaftar atau DJP.</div></div>';
}
/* kalkulator */
function calcView() {
  const groups = {}; CALCS.forEach(c => { (groups[c.g] = groups[c.g] || []).push(c); });
  const pick = Object.keys(groups).map(g => '<div class="small muted" style="margin:8px 0 4px;font-weight:700">' + esc(g) + '</div><div class="calcpick">' + groups[g].map(c => '<button class="cpick' + (P.calc === c.id ? ' on' : '') + '" data-act="pcalc" data-id="' + c.id + '">' + esc(c.t) + '</button>').join('') + '</div>').join('');
  const c = CALCS.find(x => x.id === P.calc);
  const fld = f => '<div class="field' + (c.f.length === 1 ? ' full' : '') + '"><label for="cf_' + f.k + '">' + esc(f.l) + '</label>' + (f.type === 'select' ? '<select id="cf_' + f.k + '" data-inp="calc">' + f.opts.map(o => '<option value="' + o[0] + '"' + (String(o[0]) === String(f.def) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>' : '<input type="text" inputmode="' + (f.type === 'num' ? 'decimal' : 'numeric') + '" id="cf_' + f.k + '" data-inp="calc" data-money="' + (f.type === 'money' ? 1 : 0) + '" value="' + (f.type === 'money' ? Number(f.def).toLocaleString('id-ID') : f.def) + '">') + '</div>';
  return pick + '<div class="panel"><h2>' + esc(c.t) + '</h2><p class="sub">' + esc(c.d) + '</p><div class="fgrid">' + c.f.map(fld).join('') + '</div><div class="tool-out" id="calcOut"></div><p class="muted small" style="margin-top:10px">Simulasi edukasi, bukan perhitungan pajak resmi. Aturan bisa berubah, cek pajak.go.id.</p></div>';
}
function calcValues(c) {
  const v = {}; c.f.forEach(f => { const el = document.getElementById('cf_' + f.k); if (!el) { v[f.k] = f.def; return; } v[f.k] = f.type === 'money' ? money(el.value) : f.type === 'num' ? (Number(String(el.value).replace(',', '.')) || 0) : el.value; }); return v;
}
function drawCalc() {
  const out = $('#calcOut'); if (!out) return; const c = CALCS.find(x => x.id === P.calc);
  let rows; try { rows = c.run(calcValues(c)); } catch (e) { out.innerHTML = '<div>Tidak bisa menghitung. Periksa isian.</div>'; return; }
  out.innerHTML = rows.map(r => '<div class="' + (r.big ? 'big' : '') + '"><span>' + esc(r.l) + (r.n ? '<span class="note">' + esc(r.n) + '</span>' : '') + '</span><b>' + (r.s != null ? esc(r.s) : rp(r.v)) + '</b></div>').join('');
}
Object.assign(LT.act, {
  ptab(el) { P.tab = el.dataset.v; P.open = null; render(); },
  pcat(el) { P.openCat[el.dataset.id] = !P.openCat[el.dataset.id]; render(); },
  ptopic(el) { P.tab = 'topik'; P.open = el.dataset.id; S.view = 'pajak'; render(); window.scrollTo(0, 0); },
  pback() { P.open = null; render(); },
  pread(el) { const r = S.progress.tax.read, i = r.indexOf(el.dataset.id); if (i > -1) r.splice(i, 1); else r.push(el.dataset.id); saveProgressSoon(); render(); },
  gcat(el) { P.gcat = el.dataset.v; render(); },
  pcalc(el) { P.calc = el.dataset.id; render(); }
});
LT.inp.pq = el => { P.q = el.value; const pos = el.selectionStart; render(); const q = $('[data-inp="pq"]'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } };
LT.inp.gq = el => { P.gq = el.value; const pos = el.selectionStart; render(); const q = $('[data-inp="gq"]'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } };
LT.inp.calc = el => { if (el.dataset.money === '1') { const n = money(el.value); el.value = n ? n.toLocaleString('id-ID') : ''; } drawCalc(); };

LT.views.harian = { render: viewHarian };
LT.views.modul = { render: viewModul, after: () => { if (M.tab === 'drill') renderDrill(); } };
LT.views.pajak = { render: viewPajak, after: () => { if (P.tab === 'kalkulator') drawCalc(); } };
})();
