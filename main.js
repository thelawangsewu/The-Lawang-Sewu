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
  $("heroTitle").innerHTML = [...SITE.title].map((ch, i) =>
    `<span aria-hidden="true" style="--i:${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  ["navPlay", "btnPlay", "footPlay"].forEach((i) => ($(i).href = L.play));
  ["btnDiscord", "footDiscord"].forEach((i) => ($(i).href = L.discord));
  $("aboutText").innerHTML = SITE.about.map((p) => `<p>${p}</p>`).join("");

  /* ---------- Modal + lightbox ---------- */
  const modal = $("modal"), mBody = $("modalBody");
  let lb = null;
  function openModal(html, wide) { mBody.innerHTML = html; modal.classList.toggle("wide", !!wide); if (!modal.open) modal.showModal(); S.open(); }
  function closeModal() { if (modal.open) { modal.close(); S.close(); } }
  $("modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modal.addEventListener("cancel", () => S.close());
  modal.addEventListener("close", () => { lb = null; });
  const lbHtml = () => `<div class="lb"><div class="lb-img" style="${bg(lb.imgs[lb.i])}"></div>` +
    (lb.imgs.length > 1 ? `<div class="lb-bar"><button class="lb-btn" data-d="-1" aria-label="Sebelumnya">&lsaquo;</button><span>${lb.i + 1} / ${lb.imgs.length}</span><button class="lb-btn" data-d="1" aria-label="Berikutnya">&rsaquo;</button></div>` : "") + `</div>`;
  function lbStep(d) { lb.i = (lb.i + d + lb.imgs.length) % lb.imgs.length; mBody.innerHTML = lbHtml(); }
  mBody.addEventListener("click", (e) => { const b = e.target.closest(".lb-btn"); if (b && lb) lbStep(+b.dataset.d); });
  addEventListener("keydown", (e) => { if (modal.open && lb && lb.imgs.length > 1 && (e.key === "ArrowLeft" || e.key === "ArrowRight")) { lbStep(e.key === "ArrowLeft" ? -1 : 1); S.click(); } });

  /* ---------- Chapter ---------- */
  const tabs = $("chTabs"), panel = $("chPanel");
  const lock = `<svg class="lock" viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
  tabs.innerHTML = SITE.chapters.map((c, i) => {
    const soon = c.status === "soon";
    return `<button role="tab" data-i="${i}" class="${soon ? "is-soon" : ""}"><span>Chapter ${c.no || i + 1}${soon ? "<em>Coming soon</em>" : ""}</span>${c.title}</button>`;
  }).join("");

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
    const c = SITE.chapters[i];
    [...tabs.children].forEach((b, n) => b.setAttribute("aria-selected", n === i));
    if (c.status === "soon") {
      cur = { imgs: [], i: 0 };
      panel.innerHTML = `<div class="soon swap" style="--t:url('${c.teaser || SITE.banner}')">${lock}<h3>Coming Soon</h3><p>${c.text || ""}</p><a class="btn ghost" href="${L.discord}" target="_blank" rel="noopener">Kabar terbaru di Discord</a></div>`;
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
  showChapter(0);

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

  /* ---------- Cara main ---------- */
  $("steps").innerHTML = SITE.steps.map((s) => `<li class="reveal"><strong>${s.title}</strong><span>${s.text}</span></li>`).join("");
  $("controls").innerHTML = SITE.controls.map((c) => `<div><dt>${c.key}</dt><dd>${c.action}</dd></div>`).join("");

  /* ---------- Kredit: sejajar (pengembang | pengisi suara) ---------- */
  const C = SITE.credits;
  const photo = (p, cls) => `<div class="${cls}"><span class="ini">${p.name[0]}</span><div class="img" style="${bg(p.photo)}"></div></div>`;
  const card = (p, g, i, d) => `<button class="person reveal" data-g="${g}" data-i="${i}" style="--d:${d}ms">${photo(p, "photo")}
    <div class="meta"><span class="c-name">${p.name}</span><span class="c-role">${p.role}</span><span class="more">Klik untuk detail</span></div></button>`;
  $("credits").innerHTML = `
    <h3 class="sub-h">Tim Pengembang</h3>
    <p class="sub center"><a href="${L.group}" target="_blank" rel="noopener">Sewu Studio</a></p>
    <div class="team">${C.developers.map((p, i) => card(p, "developers", i, i * 110)).join("")}</div>
    <div class="voice">
      <h3 class="sub-h">Pengisi Suara</h3>
      <div class="team">${C.voice.map((p, i) => card(p, "voice", i, 0)).join("")}</div>
      <div class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
    </div>`;
  $("credits").addEventListener("click", (e) => {
    const b = e.target.closest(".person"); if (!b) return;
    const p = C[b.dataset.g][+b.dataset.i];
    const link = p.link ? `<a class="btn" href="${p.link}" target="_blank" rel="noopener">Lihat profil Roblox</a>` : "";
    openModal(`<div class="m-grid">${photo(p, "photo m-photo")}<div class="m-body"><h3>${p.name}</h3><p class="m-role">${p.role}</p><p>${p.bio || ""}</p>${link}</div></div>`);
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
  const burger = $("burger"), menu = $("menu");
  burger.addEventListener("click", () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); });
  menu.addEventListener("click", (e) => { if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });
  addEventListener("scroll", () => {
    $("nav").classList.toggle("solid", scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    $("progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, { passive: true });
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a) => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

  /* ---------- Reveal ---------- */
  document.querySelectorAll("h2, .alt .narrow p, .panel").forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
  document.querySelectorAll(".reveal, .watch").forEach((el) => io.observe(el));

  /* ---------- Suara ---------- */
  const bS = $("btnSfx"), bA = $("btnAmb");
  bS.setAttribute("aria-pressed", S.sfx); bA.setAttribute("aria-pressed", S.amb);
  bS.addEventListener("click", () => { const v = !S.sfx; S.setSfx(v); bS.setAttribute("aria-pressed", v); });
  bA.addEventListener("click", () => { const v = !S.amb; S.setAmb(v); bA.setAttribute("aria-pressed", v); });
  addEventListener("pointerdown", () => S.resumeAmb(), { once: true });
  document.addEventListener("click", (e) => { if (e.target.closest("a, button") && !e.target.closest(".snd")) S.click(); });
  document.addEventListener("pointerover", (e) => { if (e.pointerType === "mouse" && e.target.closest(".btn, .item, .person, .tabs button, .chips button, .thumb, #menu a")) S.hover(); if (e.target.closest("#btnPlay, #navPlay, #footPlay")) S.heart(); });

  /* ---------- Hero: senter, debu, kedip ---------- */
  const hero = $("beranda"), dark = $("heroDark"), cv = $("dust");
  let mx = null, my = null;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
    dark.style.setProperty("--x", mx + "px"); dark.style.setProperty("--y", my + "px");
  });
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
