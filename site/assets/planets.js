/* Painterly, spinning planets drawn in code.
   Each .planet3 element carries data-p="<preset>". A marbled band texture is generated once on a
   canvas (value-noise turbulence), then scrolls behind a shaded sphere so the planet rotates.
   Respects the site's Animation switch (html.no-motion) and prefers-reduced-motion. */
(function () {
  const PRESETS = {
    // name: [band colors], band count, swirl, ring color (or null), moon color (or null), glow
    rose:     { c: ['#7a1f45', '#c94f7c', '#f3c4d2', '#fff1f4', '#e58aa8', '#a83260', '#f7d9e2'], bands: 9, swirl: 0.55, ring: null, moon: '#e9d6f2', glow: '#ff8fb855' },
    lavender: { c: ['#5b4b9a', '#9f8fe0', '#e6dcff', '#c9b6ff', '#f6efff', '#8a73d6', '#d8c9ff'], bands: 7, swirl: 0.35, ring: '#ffd6ec', moon: null, glow: '#c9b6ff66' },
    cream:    { c: ['#b86b5b', '#f2d2c0', '#fff6ee', '#e7a98f', '#fbe3d6', '#c98974', '#fff0e6'], bands: 11, swirl: 0.6, ring: null, moon: '#ffd6e6', glow: '#ffd2c066' },
    aqua:     { c: ['#0d2a6b', '#1f5fb8', '#38c6d9', '#a8f0ff', '#2a86d6', '#0f3f91', '#7fe3f0'], bands: 6, swirl: 0.9, ring: null, moon: null, glow: '#5fd8ff66' },
    dusk:     { c: ['#6b3f8f', '#d99cc8', '#ffe1ef', '#b48be0', '#f5c2de', '#8c5bb5', '#ffd9ec'], bands: 8, swirl: 0.45, ring: '#fff1a6', moon: '#a8d8ff', glow: '#e7a6ff55' },
    sand:     { c: ['#8a5a3c', '#d8b48a', '#f5e6cf', '#c49a6c', '#efd8b8', '#a9764f', '#fbf0de'], bands: 10, swirl: 0.4, ring: '#3b2a20', moon: null, glow: '#d8c3a566' },
    mint:     { c: ['#1d6b66', '#5fc4b8', '#d9fff8', '#81d8d0', '#b8f2ea', '#2f8f86', '#effffc'], bands: 7, swirl: 0.5, ring: '#ffb3d9', moon: null, glow: '#81d8d066' },
    sky:      { c: ['#2b4fb8', '#7fb6ff', '#e6f3ff', '#a8d8ff', '#cfe6ff', '#4a74d6', '#f5fbff'], bands: 9, swirl: 0.3, ring: '#fff1a6', moon: '#ffb3d9', glow: '#a8d8ff66' },
  };

  // --- tiny seeded value noise + fbm
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
    const n = makeNoise(name.length * 977 + p.bands * 31), cols = p.c.map(hex);
    const fbm4 = (x, y) => { let v = 0, a = .5, f = 1; for (let o = 0; o < 4; o++) { v += a * n(x * f, y * f); a *= .5; f *= 2; } return v; };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      // sample noise on a circle so the texture tiles seamlessly left-right
      const ang = x / W * Math.PI * 2, cx = Math.cos(ang) * 1.6, cy = Math.sin(ang) * 1.6, yy = y / H * 3;
      // two-step domain warp gives soft, marbled swirls
      const q1 = fbm4(cx + 3.1, cy + yy), q2 = fbm4(cx + 8.7, cy + yy + 4.2);
      const r1 = fbm4(cx + 2 * q1 + 1.7, cy + yy + 2 * q2 + 9.2);
      let t = (y / H) * p.bands + (r1 - .5) * p.swirl * 6 + (q1 - .5) * p.swirl * 2;
      t = ((t % cols.length) + cols.length) % cols.length;
      const i0 = Math.floor(t), f0 = t - i0, f = f0 * f0 * (3 - 2 * f0), c0 = cols[i0], c1 = cols[(i0 + 1) % cols.length];
      const grain = (n(x * 1.3, y * 1.3) - .5) * 6;
      const k = (y * W + x) * 4;
      d[k] = mix(c0[0], c1[0], f) + grain; d[k + 1] = mix(c0[1], c1[1], f) + grain; d[k + 2] = mix(c0[2], c1[2], f) + grain; d[k + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return (cache[name] = cv.toDataURL('image/jpeg', .9));
  }

  function build(el) {
    const name = el.dataset.p, p = PRESETS[name]; if (!p) return;
    el.style.setProperty('--glow', p.glow);
    el.innerHTML =
      (p.ring ? '<span class="p3-ring back" style="--ring:' + p.ring + '"></span>' : '') +
      '<span class="p3-ball"><span class="p3-tex" style="background-image:url(' + texture(name, p) + ')"></span><span class="p3-shade"></span></span>' +
      (p.ring ? '<span class="p3-ring front" style="--ring:' + p.ring + '"></span>' : '') +
      (p.moon ? '<span class="p3-orbit"><span class="p3-moon" style="--moon:' + p.moon + '"></span></span>' : '');
  }

  function init() { document.querySelectorAll('.planet3').forEach(build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.TTPlanets = { PRESETS, init };
})();
