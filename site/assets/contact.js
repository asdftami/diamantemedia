/* Contact section: validation, copy-email, resume requests, and the phone that mirrors the form. */
(() => {
  // ---- contact form: honeypot + basic validation (service + human check to be connected)
  const form = document.getElementById('message'), status = document.getElementById('formStatus');
  // per-field errors, announced through aria-describedby
  const rules = [
    [form.name, 'e-name', el => el.value.trim() ? '' : 'Please enter your name.'],
    [form.email, 'e-email', el => !el.value.trim() ? 'Please enter your email.' : el.validity.valid ? '' : 'Please enter a valid email, like name@company.com.'],
    [form.message, 'e-msg', el => el.value.trim() ? '' : 'Please write a short message.'],
  ];
  function check([el, id, rule]) { const m = rule(el); document.getElementById(id).textContent = m; m ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid'); return !m; }
  function checkAll() { return rules.map(check).every(Boolean); }
  rules.forEach(r => { r[0].addEventListener('input', () => { if (r[0].getAttribute('aria-invalid')) check(r); }); r[0].addEventListener('blur', () => { if (r[0].value) check(r); }); });
  form.addEventListener('submit', e => {
    if (form.website.value) { e.preventDefault(); return; }               // bot filled the honeypot
    if (!checkAll()) { e.preventDefault(); const n = form.querySelectorAll('[aria-invalid="true"]').length; status.textContent = n === 1 ? 'One field needs a fix.' : n + ' fields need a fix.'; form.querySelector('[aria-invalid="true"]').focus(); return; }
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = 'Sending…';
    status.textContent = 'Sending your message…';
    const data = Object.fromEntries(new FormData(form));
    data.topic = form.topic.value === 'project' ? 'A project' : 'A job opening';
    fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(r => r.json()).then(r => {
        if (!r.success) throw new Error(r.message || 'failed');
        status.textContent = 'Message sent! Thank you. I\'ll get back to you soon.';
        form.reset(); form.dispatchEvent(new CustomEvent('tt-sent'));
      })
      .catch(() => { status.textContent = 'Sorry, your message didn\'t send. Please try again, or use Copy email above.'; form.dispatchEvent(new CustomEvent('tt-failed')); })
      .finally(() => { btn.disabled = false; btn.textContent = 'Send message'; });
  });

  // ---- copy-email: address is assembled only on click, so scrapers never see it in the page
  const ce = document.getElementById('copyEmail'), cs = document.getElementById('copyStatus');
  ce.addEventListener('click', async () => {
    const addr = ce.dataset.u + '@' + ce.dataset.d;
    try { await navigator.clipboard.writeText(addr); cs.textContent = 'Copied ' + addr + ' to your clipboard.'; ce.textContent = 'Copied ✓'; }
    catch (e) { cs.textContent = 'Email: ' + addr; }
    setTimeout(() => { ce.textContent = 'Copy email ⧉'; }, 2500);
  });

  // ---- "Request my resume": open the form pre-filled for a resume request
  function resumeRequest() {
    form.querySelector('input[value="hiring"]').checked = true;
    if (!form.message.value) form.message.value = "Hi Tami, I'd love a copy of your resume. The role: ";
    form.dispatchEvent(new Event('input'));
    setTimeout(() => form.querySelector('#f-name').focus({ preventScroll: true }), 400);
  }
  document.querySelectorAll('[data-resume]').forEach(a => a.addEventListener('click', resumeRequest));
  if (/[?&]resume=1/.test(location.search)) resumeRequest();

})();

  // ---- the phone mirrors the contact form as people type
  (() => {
    const form = document.getElementById('message');
    const sms = document.getElementById('phoneSms'), sl = document.getElementById('softL'), sr = document.getElementById('softR');
    if (!sms) return;
    const original = sms.innerHTML;
    const esc = t => t.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const t9 = {}; ['0 ','1','2abc','3def','4ghi','5jkl','6mno','7pqrs','8tuv','9wxyz'].forEach(g => [...g].forEach(ch => t9[ch] = g[0]));
    const keyFor = ch => /[0-9a-z ]/.test(ch) ? t9[ch] : ch === '#' ? '#' : '*';
    const flash = ch => { if (document.documentElement.classList.contains('no-motion')) return; const k = document.querySelector('.phone .k[data-k="' + keyFor(ch.toLowerCase()) + '"]'); if (!k) return; k.classList.add('hit'); setTimeout(() => k.classList.remove('hit'), 160); };
    function render() {
      const name = form.name.value.trim(), msg = form.message.value, topic = form.topic.value === 'project' ? 'PROJECT' : 'JOB';
      if (!name && !msg.trim()) { sms.classList.remove('live'); sms.innerHTML = original; sl.textContent = 'Reply'; sr.textContent = 'Menu'; return; }
      const body = msg.length > 80 ? '…' + msg.slice(-80) : msg;
      sms.innerHTML = '<div class="from"><span>' + esc((name || 'NEW MSG').slice(0, 12).toUpperCase()) + '</span><span class="tag">' + topic + '</span></div><div class="body"><span>' + esc(body) + '<span class="caret"></span></span></div>'; sms.classList.add('live');
      sl.textContent = 'Clear'; sr.textContent = 'Send';
    }
    form.addEventListener('input', e => { if (e.data) flash(e.data.slice(-1)); render(); });
    form.addEventListener('change', render);
    form.addEventListener('submit', () => {
      if (!form.checkValidity() || form.website.value) return;
      sms.classList.remove('live');
      sms.innerHTML = '✉ SENDING<span class="caret"></span>'; sl.textContent = ''; sr.textContent = '';
    });
    form.addEventListener('tt-sent', () => { sms.classList.remove('live'); sms.innerHTML = '✓ MESSAGE SENT<br>Talk soon :)'; sl.textContent = ''; sr.textContent = 'OK'; });
    form.addEventListener('tt-failed', () => { sms.classList.remove('live'); sms.innerHTML = '✕ NOT SENT<br>Please try<br>again'; sl.textContent = 'Back'; sr.textContent = 'Retry'; });
  })();

/* The phone keypad works like a classic T9 phone (multi-tap): tap 2 once for a, twice for b...
   Letters go into the Message box. 0 = space, * = delete, # = ABC/abc, soft keys: Clear / Send.
   Each press gives a short phone beep. It's a pointer bonus; keyboard users type in the Message box as usual. */
(() => {
  const phone = document.querySelector('.contact .phone, .phone'), form = document.getElementById('message');
  if (!phone || !form) return;
  const box = form.message;
  const MAP = { '1': ".,?!'1", '2': 'abc2', '3': 'def3', '4': 'ghi4', '5': 'jkl5', '6': 'mno6', '7': 'pqrs7', '8': 'tuv8', '9': 'wxyz9', '0': ' 0' };
  let last = null, idx = 0, timer = null, upper = false, ctx = null;
  // Mute: remembered per visitor
  let sound = true; try { sound = localStorage.getItem('tt-sound') !== 'off'; } catch (e) {}
  const st = document.getElementById('soundToggle');
  const showSound = () => { if (!st) return; st.setAttribute('aria-pressed', sound); st.querySelector('.ic').textContent = sound ? '🔊' : '🔇'; st.querySelector('b').textContent = sound ? 'on' : 'off'; };
  if (st) st.addEventListener('click', () => { sound = !sound; try { localStorage.setItem('tt-sound', sound ? 'on' : 'off'); } catch (e) {} showSound(); });
  showSound();

  // Phones only allow sound after a completed tap: unlock the audio on the first touchend/click/keydown.
  const AC = window.AudioContext || window.webkitAudioContext;
  function unlock() {
    if (!AC) return;
    try {
      ctx = ctx || new AC();
      if (ctx.state !== 'running') ctx.resume();
      const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource(); s.buffer = b; s.connect(ctx.destination); s.start(0);
    } catch (e) {}
  }
  ['touchend', 'click', 'keydown'].forEach(t => addEventListener(t, unlock, { passive: true }));
  function beep(freq = 1180) {
    if (!sound) return;
    try {
      ctx = ctx || new AC();
      if (ctx.state !== 'running') ctx.resume();
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
      o.type = 'square'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.09);
    } catch (e) {}
  }
  const changed = () => box.dispatchEvent(new Event('input', { bubbles: true }));
  const commit = () => { last = null; idx = 0; clearTimeout(timer); };
  function press(k) {
    if (MAP[k]) {
      const chars = MAP[k];
      if (k === last) { idx = (idx + 1) % chars.length; box.value = box.value.slice(0, -1); }
      else { commit(); last = k; idx = 0; }
      let ch = chars[idx]; if (upper) ch = ch.toUpperCase();
      box.value += ch; changed();
      clearTimeout(timer); timer = setTimeout(commit, 900);
      beep(1100 + (+k) * 30);
    } else if (k === '*') { commit(); box.value = box.value.slice(0, -1); changed(); beep(900); }
    else if (k === '#') { commit(); upper = !upper; phone.classList.toggle('caps', upper); beep(1500); }
  }
  phone.querySelectorAll('.k').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('pointerdown', e => { e.preventDefault(); el.classList.add('hit'); setTimeout(() => el.classList.remove('hit'), 180); press(el.dataset.k); });
    ['pointerup', 'pointerleave'].forEach(t => el.addEventListener(t, () => el.classList.remove('hit')));
  });
  const soft = (sel, fn) => { const el = phone.querySelector(sel); if (el) { el.style.cursor = 'pointer'; el.addEventListener('pointerdown', e => { e.preventDefault(); beep(1300); fn(); }); } };
  soft('.nk.soft-l', () => { commit(); box.value = ''; changed(); });                 // Clear
  soft('.nk.end', () => { commit(); box.value = ''; changed(); });
  soft('.nk.soft-r', () => form.requestSubmit ? form.requestSubmit() : form.submit()); // Send
  soft('.nk.call', () => form.requestSubmit ? form.requestSubmit() : form.submit());
})();
