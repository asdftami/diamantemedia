/* Consistent navigation on every page and screen size (NN/g heuristic #4).
   Desktop: the top bar. Phones (≤ 820px): a glossy bottom dock built from the SAME links,
   so items, order, labels, icons and the "you are here" highlight always match.
   Header links opt in with data-ico="work|about|contact". */
(function () {
  // Every page opens at the top (consistent, predictable). Links that name a section (#contact) land on it.
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  const toTop = () => { if (!location.hash) scrollTo(0, 0); };
  toTop(); addEventListener('load', toTop); addEventListener('pageshow', e => { if (e.persisted) toTop(); });

  const ICONS = {
    work: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.2" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="12" cy="12" rx="11" ry="3.6" fill="none" stroke="currentColor" stroke-width="1.6" transform="rotate(-18 12 12)"/></svg>',
    about: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="1.3" fill="currentColor"/><circle cx="15" cy="10" r="1.3" fill="currentColor"/><path d="M8 14.2c1 1.6 2.4 2.4 4 2.4s3-.8 4-2.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    contact: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8l7 8 7-8z" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 16l7-8 7 8z" fill="currentColor"/></svg>'
  };

  const css = `
  .switch{position:relative;display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 4px;border:0;background:none;color:#d6cef0;font:inherit;font-size:.92rem;font-weight:500;cursor:pointer;white-space:nowrap;transition:color .2s}
  .switch::after{content:"";position:absolute;left:0;right:0;top:50%;height:44px;transform:translateY(-50%)}
  .switch:hover{color:#f7f3ff}.switch:hover .track{box-shadow:0 0 0 3px #81d8d044}
  .switch .track{width:34px;height:20px;border-radius:999px;background:#81d8d0;position:relative;transition:background .2s}
  .switch .knob{position:absolute;top:2px;left:16px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .2s}
  .switch[aria-pressed="false"] .track{background:#5d5878}.switch[aria-pressed="false"] .knob{left:2px}
  @media (max-width:820px){.switch .state-txt{display:none}.switch .track{width:30px;height:18px}.switch .knob{width:14px;height:14px}.switch[aria-pressed="true"] .knob{left:14px}}
  .ico{display:inline-grid;width:1.05em;height:1.05em;margin-right:.4em;vertical-align:-.15em}
  .ico svg{width:100%;height:100%}
  .dock{display:none}
  @media (max-width:820px){
    header.top [data-ico]{display:none!important}
    header.top .spy .ind{display:none}
    .dock{position:fixed;z-index:30;left:0;right:0;bottom:0;
      display:flex;gap:4px;padding:6px max(8px,env(safe-area-inset-right,0px)) calc(6px + env(safe-area-inset-bottom,0px)) max(8px,env(safe-area-inset-left,0px));
      border-radius:20px 20px 0 0;background:linear-gradient(180deg,#ffffff,#ece5fd);box-shadow:0 -8px 24px #0009,inset 0 2px 0 #fff}
    .dock .step{flex:.8}
    .dock a,.dock button{position:relative;flex:1;display:grid;justify-items:center;align-content:center;gap:2px;min-height:52px;padding:4px 0;border:0;border-radius:15px;background:none;color:#3a2a6e;font:700 .72rem "Space Grotesk",system-ui,sans-serif;text-decoration:none;cursor:pointer;transition:background .2s,transform .15s}
    .dock .ico{width:22px;height:22px;margin:0}
    .dock a:active,.dock button:active{transform:scale(.94)}
    .dock a[aria-current]{background:#3a2a6e;color:#fff}
    .dock a[aria-current]::after{content:"";position:absolute;bottom:4px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#ffb3d9;box-shadow:0 0 8px #ffb3d9}
    .dock a.dock-cta{background:#ffb3d9;color:#2a0d22}
    .dock a.dock-cta[aria-current]{background:#3a2a6e;color:#fff}
    .dock .sep{flex:0 0 1px;align-self:stretch;margin:8px 2px;background:#3a2a6e33}
    body{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function motionSwitch() {
    if (document.getElementById('motionToggle')) return;            // the homepage has its own
    const nav = document.querySelector('header.top nav.actions'); if (!nav) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let on; try { const v = localStorage.getItem('tt-motion'); on = v === null ? !reduce.matches : v === 'on'; } catch (e) { on = !reduce.matches; }
    const b = document.createElement('button');
    b.className = 'switch'; b.id = 'motionToggle'; b.type = 'button';
    b.innerHTML = '<span class="track" aria-hidden="true"><span class="knob"></span></span><span>Animation<span class="state-txt"> <span class="st"></span></span></span>';
    const apply = () => {
      document.documentElement.classList.toggle('no-motion', !on);
      b.setAttribute('aria-pressed', on); b.querySelector('.st').textContent = on ? 'on' : 'off';
      document.dispatchEvent(new CustomEvent('tt-motion', { detail: on }));
    };
    b.addEventListener('click', () => { on = !on; try { localStorage.setItem('tt-motion', on ? 'on' : 'off'); } catch (e) {} apply(); });
    nav.appendChild(b); apply();
  }

  function start() {
    motionSwitch();
    const links = [...document.querySelectorAll('header.top [data-ico]')];
    if (!links.length) return;
    links.forEach(a => {
      if (!a.querySelector('.ico')) a.insertAdjacentHTML('afterbegin', '<span class="ico">' + ICONS[a.dataset.ico] + '</span>');
    });
    const dock = document.createElement('nav');
    dock.className = 'dock'; dock.setAttribute('aria-label', 'Main');
    const pairs = links.map(a => {
      const d = document.createElement('a');
      d.href = a.getAttribute('href');
      ['data-resume', 'data-nav'].forEach(k => a.hasAttribute(k) && d.setAttribute(k, a.getAttribute(k) || ''));
      if (a.classList.contains('cta') || a.classList.contains('navcta')) d.className = 'dock-cta';
      d.innerHTML = '<span class="ico">' + ICONS[a.dataset.ico] + '</span>' + a.textContent.replace('↗', '').trim();
      dock.appendChild(d);
      return [a, d];
    });
    // the homepage keeps its "next stop" step in the dock (the pet navigator is desktop-only)
    // ▲ ▼ are on every page so the dock never changes: timeline stops on the homepage, section headings elsewhere
    dock.insertAdjacentHTML('beforeend', '<span class="sep" aria-hidden="true"></span>' +
      '<button type="button" class="step" data-dir="-1" aria-label="Previous section"><span class="ico">' + ICONS.prev + '</span>Up</button>' +
      '<button type="button" class="step" data-dir="1" aria-label="Next section"><span class="ico">' + ICONS.next + '</span>Down</button>');
    const homePrev = document.getElementById('prevBtn'), homeNext = document.getElementById('nextBtn');
    const targets = () => [document.body, ...document.querySelectorAll('main h2, section[id] h2, .hero h1')].filter((el, i, a) => a.indexOf(el) === i);
    const step = dir => {
      if (homeNext) return (dir > 0 ? homeNext : homePrev).click();
      const head = 90, list = targets().map(el => el === document.body ? 0 : el.getBoundingClientRect().top + scrollY - head).sort((x, y) => x - y);
      const y = scrollY, smooth = document.documentElement.classList.contains('no-motion') ? 'auto' : 'smooth';
      const to = dir > 0 ? list.find(t => t > y + 8) : [...list].reverse().find(t => t < y - 8);
      scrollTo({ top: to === undefined ? (dir > 0 ? document.body.scrollHeight : 0) : to, behavior: smooth });
    };
    dock.querySelectorAll('.step').forEach(b => b.addEventListener('click', () => step(+b.dataset.dir)));
    document.body.appendChild(dock);
    // keep the "you are here" highlight identical in both places
    const sync = () => pairs.forEach(([a, d]) => a.hasAttribute('aria-current') ? d.setAttribute('aria-current', a.getAttribute('aria-current')) : d.removeAttribute('aria-current'));
    sync();
    new MutationObserver(sync).observe(document.querySelector('header.top'), { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
