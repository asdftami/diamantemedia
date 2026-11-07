/* Interactive print pieces: a Z-fold (accordion) and a roll trifold that open like the real paper.
   Each panel is a 3D card hinged to its neighbor. Steps: ← → / buttons / swipe. Esc closes.
   With Animation off or reduced motion, panels snap between steps. */
(() => {
  const P = 'assets/folds/';
  const PIECES = {
    runaway: {
      title: 'The Runaway', sub: '· Z-fold brochure', ratio: 740 / 760, panels: 4,
      // front faces (left→right when open) and their backs; the back of the cover is the mailer
      front: ['runaway-a1', 'runaway-a2', 'runaway-a3', 'runaway-a4'], back: ['runaway-b4', 'runaway-b3', 'runaway-b2', 'runaway-b1'],
      steps: [
        { label: 'Folded · Cover', fold: [0, 179.6, -179.6, 179.6] },
        { label: 'Unfolding', fold: [0, 0, 179.6, -179.6] },
        { label: 'Unfolding', fold: [0, 0, 0, 179.6] },
        { label: 'Open · Inside', fold: [0, 0, 0, 0] },
        { label: 'Back · Folded (mailer)', fold: [0, -179.6, 179.6, -179.6], flip: true },
        { label: 'Back · Unfolding', fold: [0, 0, -179.6, 179.6], flip: true },
        { label: 'Back · Unfolding', fold: [0, 0, 0, -179.6], flip: true },
        { label: 'Open · Back side', fold: [0, 0, 0, 0], flip: true },
      ],
    },
    cadravo: {
      title: 'Cadravo Communications', sub: '· Trifold brochure', ratio: 660 / 1000, panels: 3, trifold: true,
      // inside I1 I2 I3; outside: cover (O3) is the back of I1, back cover (O2) behind I2, flap (O1) behind I3
      front: ['cadravo-i1', 'cadravo-i2', 'cadravo-i3'], back: ['cadravo-o3', 'cadravo-o2', 'cadravo-o1'],
      steps: [
        { label: 'Closed · Front cover', fold: [179, 0, -179.6] },
        { label: 'Cover open', fold: [0, 0, -179.6] },
        { label: 'Open · Inside', fold: [0, 0, 0] },
        { label: 'Flipped · Outside', fold: [0, 0, 0], flip: true },
      ],
    },
  };

  const d = document.createElement('dialog');
  d.className = 'fold-dlg'; d.setAttribute('aria-labelledby', 'foldTitle');
  d.innerHTML = '<div class="mag-top"><p class="mag-title" id="foldTitle"></p><button type="button" class="mag-close">Close ✕</button></div>' +
    '<div class="fold-stage"><div class="fold-sheet"></div></div>' +
    '<div class="mag-bar"><button type="button" class="mag-nav prev" aria-label="Fold back">←</button><p class="mag-count" aria-live="polite"></p><button type="button" class="mag-nav next" aria-label="Unfold">→</button></div>' +
    '<p class="mag-hint" aria-hidden="true">← → or swipe to unfold · Esc to close</p>';
  document.body.appendChild(d);
  const stage = d.querySelector('.fold-stage'), sheet = d.querySelector('.fold-sheet'), title = d.querySelector('#foldTitle'),
        count = d.querySelector('.mag-count'), prev = d.querySelector('.prev'), next = d.querySelector('.next');
  let piece = null, step = 0, panels = [], opener = null, tuck;
  const still = () => document.documentElement.classList.contains('no-motion') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  function face(src, cls) { const f = document.createElement('div'); f.className = 'fold-face ' + cls; f.style.backgroundImage = 'url(' + P + src + '.webp)'; return f; }
  function build(key) {
    piece = PIECES[key]; sheet.innerHTML = ''; panels = [];
    title.innerHTML = piece.title + ' <span>' + piece.sub + '</span>';
    d.style.setProperty('--ratio', piece.ratio); d.style.setProperty('--n', piece.panels);
    if (piece.trifold) {
      // middle panel fixed; left leaf hinged on its left edge, right leaf on its right edge
      const mid = document.createElement('div'); mid.className = 'fold-panel mid';
      mid.append(face(piece.front[1], 'front'), face(piece.back[1], 'back'));
      const l = document.createElement('div'); l.className = 'fold-panel leaf-l'; l.append(face(piece.front[0], 'front'), face(piece.back[0], 'back'));
      const r = document.createElement('div'); r.className = 'fold-panel leaf-r'; r.append(face(piece.front[2], 'front'), face(piece.back[2], 'back'));
      mid.append(r, l);                       // the cover (left leaf) lies on top of the flap
      sheet.append(mid); panels = [l, mid, r];
      sheet.classList.add('tri');
    } else {
      // accordion: each panel carries the next one on its right edge
      let parent = sheet;
      piece.front.forEach((src, k) => {
        const p = document.createElement('div'); p.className = 'fold-panel acc' + (k ? ' hinged' : '');
        p.append(face(src, 'front'), face(piece.back[k], 'back'));
        parent.append(p); parent = p; panels.push(p);
      });
      sheet.classList.remove('tri');
    }
  }
  function apply() {
    const s = piece.steps[step];
    panels.forEach((p, k) => { p.style.transform = 'rotateY(' + s.fold[k] + 'deg)'; });
    // panels tucked under the stack: hide their faces once the fold settles, so no edges peek through
    clearTimeout(tuck); panels.forEach(p => p.classList.remove('tucked'));
    if (!piece.trifold) tuck = setTimeout(() => panels.forEach((p, k) => p.classList.toggle('tucked', k > 0 && s.fold.slice(1, k + 1).some(f => f !== 0))), still() ? 0 : 820);
    // keep what is visible centered in the stage
    let shift = 0;
    if (!piece.trifold) { const open = s.fold.findIndex((f, k) => k > 0 && f !== 0); const visible = open === -1 ? piece.panels : open; shift = (piece.panels - visible) / 2; }
    else if (step === 1) shift = 0.5;
    if (s.flip) shift = -shift;   // flipped: the folded stack sits on the right
    sheet.style.transform = 'translateX(calc(' + shift + ' * var(--pw)))' + (s.flip ? ' rotateY(180deg)' : '');
    count.textContent = s.label;
    prev.disabled = step === 0; next.disabled = step === piece.steps.length - 1;
    stage.setAttribute('aria-label', piece.title + ', ' + s.label);
  }
  function go(dir) { const t = step + dir; if (!piece || t < 0 || t >= piece.steps.length) return; step = t; apply(); paper(); }
  let ctx;
  function paper() {
    try { if (localStorage.getItem('tt-sound') === 'off') return; } catch (e) {}
    if (document.documentElement.classList.contains('no-motion')) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; ctx = ctx || new AC(); if (ctx.state !== 'running') ctx.resume();
      const t = ctx.currentTime, n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * .4, ctx.sampleRate), x = b.getChannelData(0);
      for (let k = 0; k < x.length; k++) x[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / x.length, 2.5);
      n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.setValueAtTime(1400, t); f.frequency.exponentialRampToValueAtTime(3600, t + .3); f.Q.value = .7;
      const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + .38);
      n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + .4);
    } catch (e) {}
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  stage.addEventListener('click', e => { const r = stage.getBoundingClientRect(); go(e.clientX - r.left > r.width / 2 ? 1 : -1); });
  d.querySelector('.mag-close').addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if (e.target === d) d.close(); });
  document.addEventListener('keydown', e => {
    if (!d.open) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });
  let sx = null;
  stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
  d.addEventListener('close', () => opener && opener.focus());
  stage.setAttribute('role', 'img');
  document.querySelectorAll('[data-fold]').forEach(b => b.addEventListener('click', () => {
    opener = b; build(b.dataset.fold); step = 0; d.showModal(); apply(); next.focus();
  }));
})();
