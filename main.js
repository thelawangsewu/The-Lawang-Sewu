(function () {
  document.documentElement.classList.add("js");
  const $ = (id) => document.getElementById(id);
  const bg = (url) => `background-image:url('${url}')`;
  const L = SITE.links, S = window.Sfx;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.title = SITE.title + " — Game Horror Roblox";
  $("brandName").textContent = SITE.title;
  $("footTitle").textContent = SITE.title;
  $("footNote").textContent = SITE.footerNote;
  $("heroTagline").textContent = SITE.tagline;
  $("heroBg").style.cssText = bg(SITE.banner);
  $("heroTitle").setAttribute("aria-label", SITE.title);
  let li = 0;
  $("heroTitle").innerHTML = SITE.title.split(" ").map((w) =>
    `<span class="hw" aria-hidden="true">${[...w].map((ch) => `<span style="--i:${li++}">${ch}</span>`).join("")}</span>`).join(" ");
  $("aboutText").innerHTML = SITE.about.map((p) => `<p>${p}</p>`).join("");

  /* =====================================================
     WAKTU RILIS + HITUNG MUNDUR
     Tes cepat:  ?rilis=demo (hitung mundur 11 detik)  |  ?rilis=live (anggap sudah rilis)
     ===================================================== */
  const force = new URLSearchParams(location.search).get("rilis");
  SITE.chapters.forEach((c) => { c._t = c.release ? Date.parse(c.release) : 0; });
  if (force === "live") SITE.chapters.forEach((c) => (c._t = 0));
  if (force === "demo") { const c0 = SITE.chapters.find((c) => c.release) || SITE.chapters[0]; c0._t = Date.now() + 11000; }
  SITE.chapters.forEach((c) => { c._armed = c._t > Date.now(); });

  const fmt = (t, o) => new Intl.DateTimeFormat("id-ID", Object.assign({ timeZone: "Asia/Jakarta" }, o)).format(t);
  const longDate = (t) => fmt(t, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + ", pukul " +
    fmt(t, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).replace(":", ".") + " WIB";
  const shortDate = (t) => fmt(t, { day: "numeric", month: "short" });
  const phase = (c) => c._t ? (c._t > Date.now() ? "countdown" : "live") : (c.status === "soon" ? "soon" : "live");
  const upcoming = () => SITE.chapters.filter((c) => c._t > Date.now()).sort((a, b) => a._t - b._t)[0];
  const gated = () => SITE.gatePlayUntilRelease !== false && SITE.chapters[0] && phase(SITE.chapters[0]) === "countdown";

  const cdHtml = () => {
    const u = (k, cap) => `<div class="cd-unit" data-u="${k}"><span class="cd-num"></span><span class="cd-cap">${cap}</span></div>`;
    return `<div class="cd-row" role="timer" aria-label="Hitung mundur rilis">${u("d", "Hari")}<i class="cd-sep"></i>${u("h", "Jam")}<i class="cd-sep"></i>${u("m", "Menit")}<i class="cd-sep"></i>${u("s", "Detik")}</div>`;
  };
  function setNum(unit, str) {
    const box = unit.querySelector(".cd-num");
    if (box.children.length !== str.length) box.innerHTML = [...str].map(() => '<b class="dg"></b>').join("");
    [...box.children].forEach((d, i) => {
      if (d.textContent === str[i]) return;
      const had = d.textContent !== "";
      d.textContent = str[i];
      if (had && !reduce) d.animate([{ transform: "translateY(.32em)", opacity: 0, filter: "blur(5px)" }, { transform: "none", opacity: 1, filter: "none" }], { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)" });
    });
  }
  const cds = []; let tm;
  function paint(o) {
    const diff = Math.max(0, o.t - Date.now()), s = Math.floor(diff / 1000);
    const v = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    for (const k in v) setNum(o.row.querySelector(`[data-u="${k}"]`), String(v[k]).padStart(2, "0"));
    o.row.classList.toggle("urgent", diff < 864e5);
    o.row.classList.toggle("final", diff < 36e5);
  }
  function reg(row, t) { const o = { row, t }; cds.push(o); paint(o); }
  function tick() {
    clearTimeout(tm);
    for (let i = cds.length - 1; i >= 0; i--) { if (!cds[i].row.isConnected) cds.splice(i, 1); else paint(cds[i]); }
    SITE.chapters.forEach((c) => { if (c._armed && c._t <= Date.now()) { c._armed = false; onRelease(c); } });
    tm = setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) tick(); });

  function applyCtas() {
    const g = gated(), first = SITE.chapters[0];
    $("btnPlay").textContent = $("footPlay").textContent = g ? "Kabar rilis di Discord" : "Main di Roblox";
    $("btnPlay").href = $("footPlay").href = g ? L.discord : L.play;
    $("btnDiscord").textContent = g ? "Lihat halaman game" : "Gabung Discord";
    $("footDiscord").textContent = g ? "Halaman game" : "Discord";
    $("btnDiscord").href = $("footDiscord").href = g ? L.play : L.discord;
    const np = $("navPlay");
    np.textContent = g ? "Rilis " + shortDate(first._t) : "Main";
    np.href = g ? "#chapter" : L.play;
    if (g) { np.removeAttribute("target"); } else np.target = "_blank";
  }
  function renderRelease() {
    const box = $("release"), up = upcoming();
    if (up) {
      box.hidden = false;
      box.innerHTML = `<p class="rel-label">Chapter ${up.no} terbuka dalam</p>${cdHtml()}<p class="rel-date">${longDate(up._t)}</p>`;
      reg(box.querySelector(".cd-row"), up._t);
      return;
    }
    const rec = SITE.chapters.filter((c) => c._t && c._t <= Date.now() && Date.now() - c._t < 14 * 864e5).pop();
    box.hidden = !rec;
    box.innerHTML = rec ? `<p class="rel-live"><i></i>Chapter ${rec.no} sudah rilis</p>` : "";
  }

  /* Momen rilis: pintu menutup, halaman berganti, pintu terbuka */
  function onRelease(c) {
    const go = () => { applyCtas(); renderRelease(); renderTabs(); showChapter(SITE.chapters.indexOf(c)); };
    if (reduce) { go(); return; }
    const d = $("doors"); d.querySelector("p").textContent = `Chapter ${c.no} telah terbuka`;
    d.classList.remove("go"); void d.offsetWidth; d.classList.add("go"); S.open();
    setTimeout(() => { go(); S.creak(); S.whisper(); }, 1500);
    setTimeout(() => d.classList.remove("go"), 3300);
  }

  /* ---------- Modal + lightbox ---------- */
  const modal = $("modal"), mBody = $("modalBody");
  let lb = null;
  function openModal(html, wide) { mBody.innerHTML = html; modal.classList.toggle("wide", !!wide); if (!modal.open) modal.showModal(); S.open(); }
  function closeModal() { if (modal.open) { modal.close(); S.close(); } }
  $("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("cancel", () => S.close());
  modal.addEventListener("close", () => { lb = null; voxStop(); });
  const lbHtml = () => `<div class="lb"><div class="lb-img" style="${bg(lb.imgs[lb.i])}"></div>` +
    (lb.imgs.length > 1 ? `<div class="lb-bar"><button class="lb-btn" data-d="-1" aria-label="Sebelumnya">&lsaquo;</button><span>${lb.i + 1} / ${lb.imgs.length}</span><button class="lb-btn" data-d="1" aria-label="Berikutnya">&rsaquo;</button></div>` : "") + `</div>`;
  function lbStep(d) { lb.i = (lb.i + d + lb.imgs.length) % lb.imgs.length; mBody.innerHTML = lbHtml(); }
  mBody.addEventListener("click", (e) => { const b = e.target.closest(".lb-btn"); if (b && lb) lbStep(+b.dataset.d); });
  addEventListener("keydown", (e) => { if (modal.open && lb && lb.imgs.length > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { lbStep(e.key === "ArrowLeft" ? -1 : 1); S.click(); } });

  /* ---------- Chapter ---------- */
  const tabs = $("chTabs"), panel = $("chPanel");
  const lock = `<svg class="lock" viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
  let curCh = 0;
  function renderTabs() {
    tabs.innerHTML = SITE.chapters.map((c, i) => {
      const ph = phase(c);
      const chip = ph === "countdown" ? `<em>${shortDate(c._t)}</em>` : ph === "soon" ? "<em>Coming soon</em>" : "";
      return `<button role="tab" data-i="${i}" class="${ph === "live" ? "" : "is-soon"}"><span>Chapter ${c.no || i + 1}${chip}</span>${c.title}</button>`;
    }).join("");
  }
  renderTabs();

  let cur = { imgs: [], i: 0 };
  function galHtml(imgs) {
    if (!imgs.length) return `<div class="gal"><div class="gal-img empty"></div></div>`;
    const multi = imgs.length > 1;
    return `<div class="gal"><button class="gal-main" aria-label="Perbesar foto"><div class="gal-img" id="galImg" style="${bg(imgs[0])}"></div></button>
      ${multi ? `<button class="gal-nav prev" aria-label="Foto sebelumnya">&lsaquo;</button><button class="gal-nav next" aria-label="Foto berikutnya">&rsaquo;</button><span class="gal-count" id="galCount">1 / ${imgs.length}</span>` : ""}</div>
      ${multi ? `<div class="thumbs">${imgs.map((u, k) => `<button class="thumb" data-i="${k}" aria-label="Foto ${k + 1}" aria-current="${k === 0}" style="${bg(u)}"></button>`).join("")}</div>` : ""}`;
  }
  function setImg(i) {
    const n = cur.imgs.length; cur.i = (i + n) % n;
    const g = $("galImg"); g.style.cssText = bg(cur.imgs[cur.i]); g.style.animation = "none"; void g.offsetWidth; g.style.animation = "";
    $("galCount").textContent = `${cur.i + 1} / ${n}`;
    panel.querySelectorAll(".thumb").forEach((t, k) => t.setAttribute("aria-current", k === cur.i));
  }
  function showChapter(i) {
    curCh = i;
    const c = SITE.chapters[i], ph = phase(c);
    [...tabs.children].forEach((b, n) => b.setAttribute("aria-selected", n === i));
    cur = { imgs: [], i: 0 };
    if (ph === "countdown") {
      const img = (c.images && c.images[0]) || c.teaser || SITE.banner;
      panel.innerHTML = `<div class="soon cdown swap" style="--t:url('${img}')">${lock}<h3>Chapter ${c.no}: ${c.title}</h3><p>${c.preText || ""}</p>${cdHtml()}<p class="rel-date">${longDate(c._t)}</p><a class="btn ghost" href="${L.discord}" target="_blank" rel="noopener">Kabar terbaru di Discord</a></div>`;
      reg(panel.querySelector(".cd-row"), c._t);
      return;
    }
    if (ph === "soon") {
      panel.innerHTML = `<div class="soon swap" style="--t:url('${c.teaser || SITE.banner}')">${lock}<h3>Coming Soon</h3><p>${c.text || ""}</p><p class="await"><i></i><i></i><i></i>Menunggu info rilis</p><a class="btn ghost" href="${L.discord}" target="_blank" rel="noopener">Kabar terbaru di Discord</a></div>`;
      return;
    }
    cur = { imgs: c.images || [], i: 0 };
    panel.innerHTML = `<div class="swap">${galHtml(cur.imgs)}
      <div class="ch-body"><h3>Chapter ${c.no || i + 1}: ${c.title}</h3><p>${c.synopsis || ""}</p>
        ${c.cast ? `<div class="cast">${c.cast.map((p) => `<span><b>${p.name}</b>${p.role}</span>`).join("")}</div>` : ""}
        ${c.story ? `<details class="story"><summary>Baca alur cerita lengkap <small>(spoiler)</small></summary><div class="story-body">${c.story.map((p) => `<p>${p}</p>`).join("")}</div></details>` : ""}
      </div></div>`;
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { showChapter(+b.dataset.i); S.creak(); } });
  panel.addEventListener("click", (e) => {
    if (e.target.closest(".gal-nav")) setImg(cur.i + (e.target.closest(".prev") ? -1 : 1));
    else if (e.target.closest(".thumb")) setImg(+e.target.closest(".thumb").dataset.i);
    else if (e.target.closest(".gal-main") && cur.imgs.length) { lb = { imgs: cur.imgs, i: cur.i }; openModal(lbHtml(), true); }
  });

  applyCtas(); renderRelease(); showChapter(0); tick();

  /* ---------- Item (filter + modal) ---------- */
  const grid = $("itemGrid");
  grid.classList.add("watch");
  const tags = [...new Set(SITE.items.map((i) => i.tag).filter(Boolean))];
  grid.insertAdjacentHTML("beforebegin", `<div class="chips" id="chips">${["Semua", ...tags].map((t, k) => `<button data-t="${t}" aria-pressed="${k === 0}">${t}</button>`).join("")}</div>`);
  function renderItems(f) {
    grid.innerHTML = SITE.items.map((it, i) => ({ it, i })).filter((o) => f === "Semua" || o.it.tag === f).map(({ it, i }, k) => `
      <button class="item pop" data-i="${i}" style="--d:${k * 60}ms">
        ${it.tag ? `<span class="tag">${it.tag}</span>` : ""}
        <div class="item-img" style="${bg(it.image)}"></div>
        <h3>${it.name.trim()}</h3><p>${it.desc}</p>
        ${it.where ? `<p class="where">Lokasi: ${it.where}</p>` : ""}
      </button>`).join("");
  }
  renderItems("Semua");
  $("chips").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("chips").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderItems(b.dataset.t);
  });
  grid.addEventListener("click", (e) => {
    const b = e.target.closest(".item"); if (!b) return;
    const it = SITE.items[+b.dataset.i];
    openModal(`<div class="m-grid item-m"><div class="m-photo contain" style="${bg(it.image)}"></div>
      <div class="m-body">${it.tag ? `<span class="m-tag">${it.tag}</span>` : ""}<h3>${it.name.trim()}</h3>${it.where ? `<p class="m-role">Lokasi: ${it.where}</p>` : ""}<p>${it.desc}</p></div></div>`);
  });

  /* ---------- Badge & Title ---------- */
  const bGrid = $("badgeGrid"), BD = SITE.badges || [];
  $("badgeIntro").textContent = SITE.badgesIntro || "Klik untuk melihat detail.";
  bGrid.classList.add("watch");
  const keyhole = `<svg class="medal-ph" viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="9.5" r="3.2"/><path d="M10.6 12.2 9.4 19h5.2l-1.2-6.8"/></svg>`;
  const medal = (b, big) => `<span class="medal${big ? " big" : ""}${b.image ? "" : " empty"}">${b.image ? `<img class="medal-img" src="${b.image}" alt="" loading="lazy" onerror="this.parentNode.classList.add('empty')">` : ""}${keyhole}</span>`;
  const bTypes = [...new Set(BD.map((b) => b.type).filter(Boolean))];
  if (bTypes.length > 1) bGrid.insertAdjacentHTML("beforebegin", `<div class="chips" id="bChips">${["Semua", ...bTypes].map((t, k) => `<button data-t="${t}" aria-pressed="${k === 0}">${t}</button>`).join("")}</div>`);
  function renderBadges(f) {
    const list = BD.map((b, i) => ({ b, i })).filter((o) => !f || f === "Semua" || o.b.type === f);
    bGrid.innerHTML = list.length ? list.map(({ b, i }, k) => `
      <button class="badge pop" data-i="${i}" data-r="${(b.type || "").toLowerCase()}" style="--d:${k * 70}ms">
        ${medal(b)}
        ${b.type ? `<span class="b-type">${b.type}</span>` : ""}
        <h3>${b.name}</h3><p>${b.desc || ""}</p>
      </button>`).join("") : `<p class="empty-note">Daftar badge dan title akan segera diumumkan.</p>`;
  }
  renderBadges("Semua");
  if ($("bChips")) $("bChips").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    $("bChips").querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderBadges(b.dataset.t);
  });
  bGrid.addEventListener("click", (e) => {
    const el = e.target.closest(".badge"); if (!el) return;
    const b = BD[+el.dataset.i];
    openModal(`<div class="m-grid badge-m"><div class="m-badge" data-r="${(b.type || "").toLowerCase()}">${medal(b, true)}</div>
      <div class="m-body">${b.type ? `<span class="m-tag">${b.type}</span>` : ""}<h3>${b.name}</h3><p>${b.desc || ""}</p>
      ${b.how ? `<p class="m-how"><b>Cara mendapatkan</b>${b.how}</p>` : ""}</div></div>`);
  });

  /* ---------- Cara main ---------- */
  $("steps").innerHTML = SITE.steps.map((s) => `<li class="reveal"><strong>${s.title}</strong><span>${s.text}</span></li>`).join("");
  $("controls").innerHTML = SITE.controls.map((c) => `<div><dt>${c.key}</dt><dd>${c.action}</dd></div>`).join("");

  /* ---------- Kredit: sejajar (pengembang | pengisi suara) ---------- */
  const C = SITE.credits;
  const spk = `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a8 8 0 0 1 0 11"/></svg>`;
  const photo = (p, cls) => `<div class="${cls}"><span class="ini">${p.name[0]}</span><div class="img" style="${bg(p.photo)}"></div></div>`;
  const card = (p, g, i, d) => {
    const v = p.samples && p.samples.length;
    return `<button class="person reveal" data-g="${g}" data-i="${i}" style="--d:${d}ms">${v ? `<span class="has-voice" aria-hidden="true">${spk}</span>` : ""}${photo(p, "photo")}
    <div class="meta"><span class="c-name">${p.name}</span><span class="c-role">${p.role}</span><span class="more">${v ? "Klik untuk dengar suara" : "Klik untuk detail"}</span></div></button>`;
  };
  $("credits").innerHTML = `
    <h3 class="sub-h">Tim Pengembang</h3>
    <p class="sub center"><a href="${L.group}" target="_blank" rel="noopener">Sewu Studio</a></p>
    <div class="team">${C.developers.map((p, i) => card(p, "developers", i, i * 110)).join("")}</div>
    <div class="voice">
      <h3 class="sub-h">Pengisi Suara</h3>
      <div class="team">${C.voice.map((p, i) => card(p, "voice", i, 0)).join("")}</div>
      <div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>`;

  /* Pemutar suara aktor */
  const wbars = (n, seed) => Array.from({ length: n }, (_, k) => `<i style="height:${(22 + 78 * Math.abs(Math.sin(k * 0.9 + seed) * Math.cos(k * 0.37 + seed * 1.3))).toFixed(0)}%;--k:${k}"></i>`).join("");
  const icoPlay = `<svg class="i-play" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>`;
  const icoPause = `<svg class="i-pause" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14"/><rect x="13.5" y="5" width="4" height="14"/></svg>`;
  const voxHtml = (p) => !(p.samples && p.samples.length) ? "" : `<div class="vox"><p class="vox-h">Dengarkan suara ${p.character || p.name}</p>${p.samples.map((s, k) => `
    <div class="vox-row" data-src="${s.src}" style="--p:0%">
      <button class="vox-play" type="button" aria-label="Putar atau jeda: ${s.label}">${icoPlay}${icoPause}</button>
      <div class="vox-info"><span class="vox-label">${s.label}</span><span class="vox-time">Putar</span></div>
      <div class="vox-wave" aria-hidden="true">${wbars(38, k * 2.1 + 1)}<div class="fill">${wbars(38, k * 2.1 + 1)}</div></div>
      ${s.quote ? `<p class="vox-quote">&ldquo;${s.quote}&rdquo;</p>` : ""}
      <p class="vox-note" role="status"></p>
    </div>`).join("")}</div>`;

  const vox = new Audio(); vox.preload = "none";
  let voxRow = null;
  const mmss = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");
  function voxStop() {
    vox.pause();
    if (voxRow) { voxRow.classList.remove("playing", "loading"); voxRow.style.setProperty("--p", "0%"); }
    voxRow = null; S.duck(false);
    try { vox.currentTime = 0; } catch (e) {}
  }
  mBody.addEventListener("click", (e) => {
    const wave = e.target.closest(".vox-wave");
    if (wave) {
      const row = wave.closest(".vox-row");
      if (row === voxRow && isFinite(vox.duration)) { const r = wave.getBoundingClientRect(); vox.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * vox.duration; }
      return;
    }
    const btn = e.target.closest(".vox-play"); if (!btn) return;
    const row = btn.closest(".vox-row");
    if (row === voxRow && !vox.paused) { vox.pause(); return; }
    if (row !== voxRow) {
      if (voxRow) { voxRow.classList.remove("playing", "loading"); voxRow.style.setProperty("--p", "0%"); }
      voxRow = row; vox.src = row.dataset.src;
    }
    row.classList.remove("err"); row.querySelector(".vox-note").textContent = ""; row.classList.add("loading");
    const pr = vox.play(); if (pr && pr.catch) pr.catch(() => row.classList.remove("loading"));
  });
  vox.addEventListener("loadedmetadata", () => { if (voxRow) voxRow.querySelector(".vox-time").textContent = "0:00 / " + mmss(vox.duration); });
  vox.addEventListener("timeupdate", () => {
    if (!voxRow || !vox.duration) return;
    voxRow.style.setProperty("--p", (vox.currentTime / vox.duration) * 100 + "%");
    voxRow.querySelector(".vox-time").textContent = mmss(vox.currentTime) + " / " + mmss(vox.duration);
  });
  vox.addEventListener("play", () => { if (voxRow) { voxRow.classList.remove("loading"); voxRow.classList.add("playing"); } S.duck(true); });
  vox.addEventListener("pause", () => { if (voxRow) voxRow.classList.remove("playing"); S.duck(false); });
  vox.addEventListener("ended", () => { if (voxRow) { voxRow.classList.remove("playing"); voxRow.style.setProperty("--p", "0%"); voxRow.querySelector(".vox-time").textContent = "Putar lagi"; } vox.currentTime = 0; S.duck(false); });
  vox.addEventListener("error", () => {
    if (!voxRow) return;
    voxRow.classList.remove("playing", "loading"); voxRow.classList.add("err");
    voxRow.querySelector(".vox-note").textContent = "Rekaman belum tersedia.";
    console.warn("[Suara] File tidak ditemukan atau format tidak didukung:", voxRow.dataset.src);
  });

  $("credits").addEventListener("click", (e) => {
    const b = e.target.closest(".person"); if (!b) return;
    const p = C[b.dataset.g][+b.dataset.i];
    const link = p.link ? `<a class="btn" href="${p.link}" target="_blank" rel="noopener">Lihat profil Roblox</a>` : "";
    openModal(`<div class="m-grid">${photo(p, "photo m-photo")}<div class="m-body"><h3>${p.name}</h3><p class="m-role">${p.role}</p><p>${p.bio || ""}</p>${voxHtml(p)}${link}</div></div>`);
  });

  /* ---------- Arsip berkas (teks disamarkan) ---------- */
  const A = SITE.archive; let total = 0, opened = 0;
  const redact = (t) => t.replace(/\[\[(.+?)\]\]/g, (_, s) => { total++; return `<span class="redact" role="button" tabindex="0" aria-label="Teks disamarkan, klik untuk membuka">${s}</span>`; });
  $("docIntro").textContent = A.intro;
  $("doc").innerHTML = `<p class="doc-org">${A.header[0]}</p><p class="doc-no">${A.header[1]}</p><p class="doc-to">${A.to}</p>` +
    A.lines.map((l) => `<p>${redact(l)}</p>`).join("") + `<p class="doc-sign">${A.sign}</p>`;
  const count = () => ($("docCount").textContent = `Rahasia terbuka: ${opened} / ${total}`);
  count();
  function reveal(el) {
    if (!el || el.classList.contains("on")) return;
    el.classList.add("on"); el.removeAttribute("aria-label"); el.removeAttribute("role"); opened++; count(); S.creak();
    if (opened === total) {
      setTimeout(() => {
        const f = $("flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go"); S.buzz(); S.whisper();
        $("docFinal").textContent = A.final; $("docFinal").hidden = false;
      }, 700);
    }
  }
  $("doc").addEventListener("click", (e) => reveal(e.target.closest(".redact")));
  $("doc").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { const r = e.target.closest(".redact"); if (r) { e.preventDefault(); reveal(r); } } });

  /* ---------- Menu, progress, scrollspy ---------- */
  const burger = $("burger"), menu = $("menu"), more = $("more"), moreBtn = $("moreBtn");
  menu.querySelectorAll("a").forEach((a, i) => a.style.setProperty("--n", i));
  const setMenu = (o) => { menu.classList.toggle("open", o); burger.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Tutup menu" : "Buka menu"); document.documentElement.classList.toggle("menu-open", o); };
  const setMore = (o) => { more.classList.toggle("open", o); moreBtn.setAttribute("aria-expanded", o); };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  moreBtn.addEventListener("click", (e) => { e.stopPropagation(); setMore(!more.classList.contains("open")); });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) { setMenu(false); setMore(false); } });
  document.addEventListener("click", (e) => { if (!e.target.closest("#more")) setMore(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { setMore(false); if (menu.classList.contains("open")) { setMenu(false); burger.focus(); } } });
  matchMedia("(min-width: 901px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  addEventListener("scroll", () => {
    $("nav").classList.toggle("solid", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, { passive: true });
  const links = [...menu.querySelectorAll('a[href^="#"]:not(.btn)')];
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); moreBtn.classList.toggle("active", !!$("moreMenu").querySelector(".active")); } }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

  /* ---------- Reveal ---------- */
  document.querySelectorAll("h2, .alt .narrow p, .panel").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".reveal, .watch").forEach((el) => io.observe(el));

  /* ---------- Suara ---------- */
  S.config(SITE.ambient);
  const bS = $("btnSfx"), bA = $("btnAmb");
  S.onTrack = (t) => { bA.title = t ? "Memutar: " + t : "Ambient"; };
  bS.setAttribute("aria-pressed", S.sfx); bA.setAttribute("aria-pressed", S.amb);
  bS.addEventListener("click", () => { const v = !S.sfx; S.setSfx(v); bS.setAttribute("aria-pressed", v); });
  bA.addEventListener("click", () => { const v = !S.amb; S.setAmb(v); bA.setAttribute("aria-pressed", v); });
  addEventListener("pointerdown", () => S.resumeAmb(), { once: true });
  document.addEventListener("click", (e) => { if (e.target.closest("a, button") && !e.target.closest(".snd, .vox-play")) S.click(); });
  document.addEventListener("pointerover", (e) => { if (e.pointerType === "mouse" && e.target.closest(".btn, .item, .badge, .person, .tabs button, .chips button, .thumb, #menu a")) S.hover(); if (e.target.closest("#btnPlay, #navPlay, #footPlay")) S.heart(); });

  /* ---------- Hero: senter, debu, kedip ---------- */
  const hero = $("beranda"), dark = $("heroDark"), cv = $("dust");
  if (!matchMedia("(hover: hover)").matches) document.querySelector(".hint").textContent = "Sentuh dan geser layar untuk menyalakan senter. Disarankan memakai headphone.";
  let mx = null, my = null;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    dark.style.setProperty("--x", mx + "px"); dark.style.setProperty("--y", my + "px");
  });
  /* Layar sentuh: senter bergerak pelan sendiri sampai disentuh */
  let wander = !matchMedia("(hover: hover)").matches && !reduce;
  hero.addEventListener("pointerdown", () => { wander = false; });
  if (reduce) return;
  const cx = cv.getContext("2d"); let W, H, P = [], vis = true;
  function size() { W = cv.width = hero.clientWidth; H = cv.height = hero.clientHeight; P = Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.8, vx: (Math.random() - 0.5) * 0.15, vy: -0.05 - Math.random() * 0.25 })); }
  const eyesEl = $("eyes"), EYES = [[12, 30], [86, 24], [72, 80], [20, 72], [50, 88]];
  eyesEl.innerHTML = EYES.map(([x, y], i) => `<span class="eye" style="left:${x}%;top:${y}%;--b:${i * 0.9}s"><i></i><i></i></span>`).join("");
  const eyeNodes = [...eyesEl.children];
  size(); addEventListener("resize", size);
  new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis) loop(); }).observe(hero);
  function loop() {
    if (!vis) return;
    cx.clearRect(0, 0, W, H);
    if (wander) { const tt = performance.now() / 1000; mx = W * (0.5 + 0.32 * Math.sin(tt * 0.45)); my = H * (0.46 + 0.2 * Math.sin(tt * 0.31 + 1.2)); dark.style.setProperty("--x", mx + "px"); dark.style.setProperty("--y", my + "px"); }
    const lx = mx ?? W / 2, ly = my ?? H * 0.4;
    for (const p of P) {
      p.x += p.vx; p.y += p.vy; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; } if (p.x < -5) p.x = W + 5; if (p.x > W + 5) p.x = -5;
      const a = Math.max(0.06, 1 - Math.hypot(p.x - lx, p.y - ly) / 260) * 0.75;
      cx.fillStyle = `rgba(235,215,170,${a})`; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.283); cx.fill();
    }
    eyeNodes.forEach((n, k) => { const d = mx === null ? 999 : Math.hypot(EYES[k][0] / 100 * W - mx, EYES[k][1] / 100 * H - my); n.style.opacity = Math.max(0, 1 - d / 170).toFixed(2); });
    requestAnimationFrame(loop);
  }
  loop();
  /* Cahaya kursor di seluruh halaman */
  if (matchMedia("(pointer: fine)").matches) {
    const glow = $("glow"); let gx = 0, gy = 0, gt = false;
    addEventListener("pointermove", (e) => { gx = e.clientX; gy = e.clientY; if (!gt) { gt = true; requestAnimationFrame(() => { glow.style.transform = `translate(${gx - 220}px,${gy - 220}px)`; glow.style.opacity = 1; gt = false; }); } });
  }
  /* Bisikan acak */
  const wh = $("whisper");
  (function whisper() {
    setTimeout(() => {
      if (!document.hidden && SITE.whispers && SITE.whispers.length) {
        wh.textContent = SITE.whispers[Math.floor(Math.random() * SITE.whispers.length)];
        wh.style.left = 8 + Math.random() * 70 + "%"; wh.style.top = 12 + Math.random() * 70 + "%";
        wh.classList.remove("show"); void wh.offsetWidth; wh.classList.add("show"); S.whisper();
      }
      whisper();
    }, 16000 + Math.random() * 16000);
  })();
  (function blink() { setTimeout(() => { if (vis) { dark.classList.remove("blink"); void dark.offsetWidth; dark.classList.add("blink"); S.buzz(); } blink(); }, 7000 + Math.random() * 8000); })();
})();
