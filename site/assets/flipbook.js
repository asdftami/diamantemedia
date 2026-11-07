/* DOUX Magazine flipbook: real page turns between spreads.
   Next: the right half of the current spread lifts and turns over the spine, revealing the next spread.
   Keyboard: ← → to turn, Home/End, Esc to close. Swipe on touch. With Animation off, pages swap instantly. */
(() => {
  const opener = document.getElementById('douxOpen');
  if (!opener) return;
  const PAGES = Array.from({ length: 12 }, (_, i) => 'assets/utrgv/doux/doux-' + String(i + 1).padStart(2, '0') + '.webp');
  const LABELS = ['Front and back cover', 'Table of contents', 'What does indie mean today? Sound, Style, Spirit', 'Indie, continued', 'Rise: model-singer Camille on the rise', 'Music and fashion', 'The evolution of glam rock', 'What is Big Fashion?', 'Explore pop fashion', 'Epiphone: 140 years of sound', "What's your style? quiz", 'Banks'];
  PAGES.forEach(src => { const i = new Image(); i.src = src; });   // preload so turns are smooth

  const d = document.createElement('dialog');
  d.className = 'mag'; d.setAttribute('aria-labelledby', 'magTitle');
  d.innerHTML =
    '<div class="mag-top"><p class="mag-title" id="magTitle">DOUX Magazine <span>· with Jovanna Mireles</span></p><button type="button" class="mag-close">Close ✕</button></div>' +
    '<div class="mag-book"><div class="mag-base"></div><div class="mag-left"></div><div class="mag-leaf"><div class="mag-front"></div><div class="mag-back"></div></div><div class="mag-spine" aria-hidden="true"></div></div>' +
    '<div class="mag-bar"><button type="button" class="mag-nav prev" aria-label="Previous page">←</button><p class="mag-count" aria-live="polite"></p><button type="button" class="mag-nav next" aria-label="Next page">→</button></div>' +
    '<p class="mag-hint" aria-hidden="true">← → or swipe to turn pages · Esc to close</p>';
  document.body.appendChild(d);
  const book = d.querySelector('.mag-book'), base = d.querySelector('.mag-base'), left = d.querySelector('.mag-left'),
        leaf = d.querySelector('.mag-leaf'), front = d.querySelector('.mag-front'), back = d.querySelector('.mag-back'),
        count = d.querySelector('.mag-count'), prev = d.querySelector('.prev'), next = d.querySelector('.next');
  let cur = 0, busy = false;
  const bg = (el, i) => { el.style.backgroundImage = 'url(' + PAGES[i] + ')'; };
  const still = () => document.documentElement.classList.contains('no-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  function show(i) {
    cur = i; bg(base, i); left.style.backgroundImage = ''; leaf.hidden = true;
    book.setAttribute('role', 'img'); book.setAttribute('aria-label', 'DOUX Magazine, ' + LABELS[i]);
    count.textContent = 'Spread ' + (i + 1) + ' of ' + PAGES.length + ' · ' + LABELS[i];
    prev.disabled = i === 0; next.disabled = i === PAGES.length - 1;
  }
  function turn(dir) {
    const to = cur + dir;
    if (busy || to < 0 || to >= PAGES.length) return;
    if (still()) { show(to); return; }
    busy = true;
    // forward: left half of current stays, base shows next; leaf = current right half (front) / next left half (back)
    // backward: mirror of that
    leaf.className = 'mag-leaf ' + (dir > 0 ? 'fwd' : 'bwd');
    if (dir > 0) { bg(base, to); bg(left, cur); bg(front, cur); bg(back, to); }
    else { bg(base, to); bg(left, cur); bg(front, cur); bg(back, to); }
    left.className = 'mag-left ' + (dir > 0 ? 'keep-l' : 'keep-r');
    leaf.hidden = false; void leaf.offsetWidth; leaf.classList.add('go');
    flip();
    setTimeout(() => { busy = false; show(to); left.className = 'mag-left'; }, 760);
  }
  // soft paper sound for each turn (respects Key sounds mute)
  let ctx;
  function flip() {
    try { if (localStorage.getItem('tt-sound') === 'off') return; } catch (e) {}
    try {
      const AC = window.AudioContext || window.webkitAudioContext; ctx = ctx || new AC(); if (ctx.state !== 'running') ctx.resume();
      const t = ctx.currentTime, n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate), x = b.getChannelData(0);
      for (let k = 0; k < x.length; k++) x[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / x.length, 2);
      n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(3200, t + .35); f.Q.value = .8;
      const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .08); g.gain.exponentialRampToValueAtTime(.0001, t + .45);
      n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + .5);
    } catch (e) {}
  }
  prev.addEventListener('click', () => turn(-1));
  next.addEventListener('click', () => turn(1));
  book.addEventListener('click', e => { const r = book.getBoundingClientRect(); turn(e.clientX - r.left > r.width / 2 ? 1 : -1); });
  d.querySelector('.mag-close').addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  d.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); turn(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); turn(-1); }
    if (e.key === 'Home') { e.preventDefault(); show(0); }
    if (e.key === 'End') { e.preventDefault(); show(PAGES.length - 1); }
  });
  let sx = null;
  book.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  book.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) turn(dx < 0 ? 1 : -1); sx = null; });
  d.addEventListener('close', () => opener.focus());
  opener.addEventListener('click', () => { show(0); d.showModal(); next.focus(); });
})();
