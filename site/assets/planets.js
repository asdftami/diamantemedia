/* Painterly, spinning planets drawn in code. Every preset is a different kind of world.
   <span class="planet3" data-p="<preset>"> — a texture is generated once on a canvas, then scrolls
   behind a shaded sphere so the planet rotates. Respects html.no-motion and prefers-reduced-motion.
   Preset fields: c palette · bands/swirl · style 'bands'|'marble'|'ridge'|'cloud'|'pin' · spot storm
   · craters · tilt (axial) · size (sphere inset %) · halo · rings [{c,a,w,o,k,inset}] · moons [{c,s,r,d,at,rev}] */
(function () {
  const PRESETS = {
    dusk:     { c: ['#6b3f8f', '#d99cc8', '#ffe1ef', '#b48be0', '#f5c2de', '#8c5bb5', '#ffd9ec'], bands: 8, swirl: .45, style: 'bands', tilt: -8, size: 12,
                rings: [{ c: '#fff1a6', a: -12, w: 9, o: .9, k: 'double' }], moons: [{ c: '#a8d8ff', s: 10, r: -2, d: 24, at: 40 }], glow: '#e7a6ff55' },
    peach:    { c: ['#b5524a', '#f39a7f', '#ffd9c2', '#ffb3a0', '#fff0e2', '#e0706a', '#ffc8b4'], bands: 7, swirl: .5, style: 'bands', tilt: 14, size: 12,
                spot: [.32, .6, .1, .055, '#d0675c'], moons: [{ c: '#fff1a6', s: 9, r: -6, d: 30, at: 200, rev: true }], glow: '#ff9f8a66' },
    cream:    { c: ['#b86b5b', '#f2d2c0', '#fff6ee', '#e7a98f', '#fbe3d6', '#c98974', '#fff0e6'], bands: 16, swirl: .25, style: 'pin', tilt: 0, size: 14,
                moons: [{ c: '#ffd6e6', s: 11, r: -2, d: 22, at: 30 }, { c: '#a8d8ff', s: 7, r: -12, d: 36, at: 210, rev: true }], glow: '#ffd2c066' },
    rose:     { c: ['#7a1f45', '#c94f7c', '#f3c4d2', '#fff1f4', '#e58aa8', '#a83260', '#f7d9e2'], bands: 4, swirl: 1.3, style: 'marble', tilt: -18, size: 10,
                glow: '#ff8fb899', halo: '#ffb3d9' },
    mint:     { c: ['#1d6b66', '#5fc4b8', '#d9fff8', '#81d8d0', '#b8f2ea', '#2f8f86', '#effffc'], bands: 7, swirl: .5, style: 'bands', tilt: 6, size: 14,
                rings: [{ c: '#ffb3d9', a: -22, w: 6, o: .85 }, { c: '#fff1a6', a: 22, w: 6, o: .85 }], glow: '#81d8d066' },
    lavender: { c: ['#5b4b9a', '#9f8fe0', '#e6dcff', '#c9b6ff', '#f6efff', '#8a73d6', '#d8c9ff'], bands: 7, swirl: .35, style: 'bands', tilt: -62, size: 14,
                rings: [{ c: '#ffd6ec', a: -62, w: 4, o: .9 }], glow: '#c9b6ff66' },
    sky:      { c: ['#2b4fb8', '#7fb6ff', '#e6f3ff', '#a8d8ff', '#cfe6ff', '#4a74d6', '#f5fbff'], bands: 9, swirl: .3, style: 'bands', tilt: 4, size: 16,
                rings: [{ c: '#cfe6ff', a: 8, w: 18, o: .4, k: 'band' }], moons: [{ c: '#ffb3d9', s: 8, r: -10, d: 28, at: 120 }], glow: '#a8d8ff66' },
    opal:     { c: ['#d9d3f2', '#fdfcff', '#cfe9ff', '#ffe3f0', '#f3f0ff', '#bfe9e4', '#ffffff'], bands: 5, swirl: .9, style: 'marble', tilt: 0, size: 18,
                craters: 14, moons: [{ c: '#c9b6ff', s: 6, r: -4, d: 18, at: 0 }, { c: '#81d8d0', s: 5, r: -14, d: 26, at: 140, rev: true }, { c: '#fff1a6', s: 4, r: -22, d: 40, at: 260 }], glow: '#ffffff55' },
    nebula:   { c: ['#2a1660', '#5b2fb0', '#b36bff', '#ff8fd6', '#7a3fd0', '#3b1d84', '#e0a6ff'], bands: 5, swirl: 1.1, style: 'cloud', tilt: 10, size: 12,
                glow: '#c86bff99', halo: '#e0a6ff' },
    sand:     { c: ['#8a5a3c', '#d8b48a', '#f5e6cf', '#c49a6c', '#efd8b8', '#a9764f', '#fbf0de'], bands: 10, swirl: .4, style: 'bands', tilt: -20, size: 14,
                rings: [{ c: '#3b2a20', a: -20, w: 5, o: .8 }, { c: '#d8c3a5', a: -20, w: 2, o: .9, inset: 9 }], glow: '#d8c3a566' },
    aqua:     { c: ['#0d2a6b', '#1f5fb8', '#38c6d9', '#a8f0ff', '#2a86d6', '#0f3f91', '#7fe3f0'], bands: 6, swirl: .9, style: 'ridge', tilt: 0, size: 12,
                glow: '#5fd8ff77' },
  };

  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function makeNoise(seed) {
    const r = rng(seed), N = 256, g = new Float32Array(N * N);
    for (let i = 0; i < g.length; i++) g[i] = r();
    const at = (x, y) => g[((y & (N - 1)) * N) + (x & (N - 1))];
    const sm = t => t * t * (3 - 2 * t);
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    };
  }
  const mix = (a, b, t) => a + (b - a) * t;
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

  const cache = {};
  function texture(name, p) {
    if (cache[name]) return cache[name];
    const W = 512, H = 256, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
    let seed = 7; for (const ch of name) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const n = makeNoise(seed), cols = p.c.map(hex), style = p.style || 'bands';
    const fbm = (x, y, o = 4) => { let v = 0, a = .5, f = 1; for (let i = 0; i < o; i++) { v += a * n(x * f, y * f); a *= .5; f *= 2; } return v; };
    const ridge = (x, y) => { let v = 0, a = .5, f = 1; for (let i = 0; i < 5; i++) { v += a * (1 - Math.abs(n(x * f, y * f) * 2 - 1)); a *= .5; f *= 2; } return v; };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ang = x / W * Math.PI * 2, cx = Math.cos(ang) * 1.6, cy = Math.sin(ang) * 1.6, yy = y / H * 3;
      const q1 = fbm(cx + 3.1, cy + yy), q2 = fbm(cx + 8.7, cy + yy + 4.2);
      const r1 = fbm(cx + 2 * q1 + 1.7, cy + yy + 2 * q2 + 9.2);
      let t;
      if (style === 'pin') t = (y / H) * p.bands + (r1 - .5) * p.swirl * 3;
      else if (style === 'marble') t = (r1 * 2.2 + q1 * 1.4) * p.bands * p.swirl + (y / H) * 2;
      else if (style === 'ridge') t = ridge(cx * 1.3 + q1, cy * 1.3 + yy * 1.2 + q2) * p.bands * 1.6;
      else if (style === 'cloud') t = fbm(cx * .8 + q1 * 2.5, cy * .8 + yy * .7 + r1 * 2.5, 5) * p.bands * 1.8;
      else t = (y / H) * p.bands + (r1 - .5) * p.swirl * 6 + (q1 - .5) * p.swirl * 2;
      t = ((t % cols.length) + cols.length) % cols.length;
      const i0 = Math.floor(t), f0 = t - i0, f = f0 * f0 * (3 - 2 * f0), c0 = cols[i0], c1 = cols[(i0 + 1) % cols.length];
      const grain = (n(x * 1.3, y * 1.3) - .5) * 6;
      const k = (y * W + x) * 4;
      d[k] = mix(c0[0], c1[0], f) + grain; d[k + 1] = mix(c0[1], c1[1], f) + grain; d[k + 2] = mix(c0[2], c1[2], f) + grain; d[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const paint = fn => { fn(0); fn(W); fn(-W); };   // keep the tile seamless
    if (p.spot) {
      const [sx, sy, rx, ry, sc] = p.spot;
      paint(off => {
        const X = sx * W + off, Y = sy * H, g = ctx.createRadialGradient(X, Y, 2, X, Y, rx * W);
        g.addColorStop(0, sc); g.addColorStop(.5, sc + 'cc'); g.addColorStop(.78, '#ffffff66'); g.addColorStop(1, '#ffffff00');
        ctx.save(); ctx.translate(X, Y); ctx.scale(1, ry / rx); ctx.translate(-X, -Y);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, rx * W, 0, 7); ctx.fill(); ctx.restore();
      });
    }
    if (p.craters) {
      const r = rng(seed + 5);
      for (let i = 0; i < p.craters; i++) {
        const cx = r() * W, cy = 20 + r() * (H - 40), cr = 4 + r() * 14;
        paint(off => {
          const g = ctx.createRadialGradient(cx + off - cr * .25, cy - cr * .25, 1, cx + off, cy, cr);
          g.addColorStop(0, '#5a4f8a33'); g.addColorStop(.72, '#5a4f8a22'); g.addColorStop(.88, '#ffffffaa'); g.addColorStop(1, '#ffffff00');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx + off, cy, cr, 0, 7); ctx.fill();
        });
      }
    }
    return (cache[name] = cv.toDataURL('image/jpeg', .9));
  }

  function build(el) {
    const name = el.dataset.p, p = PRESETS[name]; if (!p) return;
    el.style.setProperty('--glow', p.glow);
    el.style.setProperty('--size', (p.size || 12) + '%');
    if (p.halo) el.style.setProperty('--halo', p.halo);
    const rings = p.rings || [];
    const ring = side => rings.map(r => '<span class="p3-ring ' + side + (r.k ? ' ' + r.k : '') + '" style="--ring:' + r.c + ';--tilt:' + r.a + 'deg;--rw:' + (r.w || 6) + 'px;--ro:' + (r.o || .85) + (r.inset ? ';--rin:' + r.inset + '%' : '') + '"></span>').join('');
    el.innerHTML = ring('back') +
      '<span class="p3-ball' + (p.halo ? ' halo' : '') + '"><span class="p3-tilt" style="--axis:' + (p.tilt || 0) + 'deg"><span class="p3-tex" style="background-image:url(' + texture(name, p) + ')"></span></span><span class="p3-shade"></span></span>' +
      ring('front') +
      (p.moons || []).map(m => '<span class="p3-orbit" style="--orb:' + m.r + '%;--od:' + m.d + 's;--at:' + m.at + 'deg' + (m.rev ? ';animation-direction:reverse' : '') + '"><span class="p3-moon" style="--moon:' + m.c + ';--ms:' + m.s + '%"></span></span>').join('');
  }

  function init() { document.querySelectorAll('.planet3').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.TTPlanets = { PRESETS, init };
})();
