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
    if (!form.getAttribute('action')) { e.preventDefault(); status.textContent = 'Thanks! The form is being connected. Please check back soon.'; }
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
      if (!form.getAttribute('action')) { sms.innerHTML = '✉ SAVED<br>Sending opens<br>soon. Thanks!'; sl.textContent = 'Back'; sr.textContent = 'OK'; return; }
      sms.innerHTML = '✉ SENDING<span class="caret"></span>'; sl.textContent = ''; sr.textContent = '';
    });
  })();
