/* Efek suara dibuat lewat WebAudio (tanpa file mp3). Mau pakai audio sendiri? Ganti isi fungsi di bawah. */
window.Sfx = (function () {
  let ctx, master, drone, lastHover = 0, lastHeart = 0;
  const get = (k) => { try { return localStorage.getItem("ls_" + k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem("ls_" + k, v); } catch (e) {} };
  let sfxOn = get("sfx") !== "off", ambOn = get("amb") === "on";

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      ctx = new C(); master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  const env = (g, t, a, d, v) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + d); };

  function tone(o) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.delay || 0), os = c.createOscillator(), g = c.createGain();
    os.type = o.type || "sine"; os.frequency.setValueAtTime(o.f, t);
    if (o.f2) os.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    env(g, t, 0.01, o.d, o.v || 0.1); os.connect(g);
    let out = g;
    if (o.lp) { const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = o.lp; g.connect(f); out = f; }
    out.connect(master); os.start(t); os.stop(t + o.d + 0.05);
  }
  function noise(o) {
    const c = ac(); if (!c) return;
    const t = c.currentTime, n = Math.floor(c.sampleRate * o.d), b = c.createBuffer(1, n, c.sampleRate), data = b.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b;
    const f = c.createBiquadFilter(); f.type = o.type || "lowpass"; f.frequency.setValueAtTime(o.f, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.d);
    const g = c.createGain(); env(g, t, o.a || 0.02, o.d, o.v || 0.1);
    s.connect(f); f.connect(g); g.connect(master); s.start(t);
  }

  function startAmb() {
    const c = ac(); if (!c || drone) return;
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(0.06, c.currentTime + 3);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 220;
    const lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 70; lfo.connect(lg); lg.connect(lp.frequency);
    const oscs = [[55, "sawtooth"], [55.7, "sawtooth"], [110.4, "sine"]].map(([f, ty]) => { const o = c.createOscillator(); o.type = ty; o.frequency.value = f; o.connect(lp); o.start(); return o; });
    lp.connect(g); g.connect(master); lfo.start();
    drone = { g, stop() { const t = c.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0.0001, t, 0.4); setTimeout(() => { oscs.forEach((o) => o.stop()); lfo.stop(); }, 1800); } };
  }
  function stopAmb() { if (drone) { drone.stop(); drone = null; } }

  return {
    get sfx() { return sfxOn; }, get amb() { return ambOn; },
    setSfx(v) { sfxOn = v; set("sfx", v ? "on" : "off"); if (v) this.click(); },
    setAmb(v) { ambOn = v; set("amb", v ? "on" : "off"); v ? startAmb() : stopAmb(); },
    resumeAmb() { if (ambOn) startAmb(); },
    click() { if (!sfxOn) return; tone({ f: 150, f2: 55, type: "triangle", d: 0.14, v: 0.25 }); noise({ d: 0.06, f: 900, v: 0.08 }); },
    hover() { const n = performance.now(); if (!sfxOn || n - lastHover < 90) return; lastHover = n; tone({ f: 700, f2: 520, d: 0.05, v: 0.03 }); },
    open()  { if (!sfxOn) return; noise({ d: 0.7, f: 150, f2: 1400, type: "bandpass", v: 0.12, a: 0.25 }); tone({ f: 62, d: 0.8, v: 0.12 }); },
    close() { if (!sfxOn) return; noise({ d: 0.4, f: 1200, f2: 150, type: "bandpass", v: 0.1, a: 0.05 }); },
    creak() { if (!sfxOn) return; tone({ f: 80, f2: 150, type: "sawtooth", d: 0.45, v: 0.05, lp: 380 }); tone({ f: 150, f2: 95, type: "sawtooth", d: 0.35, v: 0.04, lp: 380, delay: 0.3 }); },
    buzz()  { if (!sfxOn) return; tone({ f: 100, type: "square", d: 0.28, v: 0.03, lp: 300 });  },
    whisper() { if (!sfxOn) return; noise({ d: 1.6, f: 3000, f2: 1400, type: "bandpass", v: 0.05, a: 0.6 }); },
    heart() { const n = performance.now(); if (!sfxOn || n - lastHeart < 1800) return; lastHeart = n; tone({ f: 70, f2: 40, d: 0.2, v: 0.35 }); tone({ f: 65, f2: 38, d: 0.22, v: 0.28, delay: 0.24 }); }
  };
})();
