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
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8l7 8 7-8z" fill="currentColor"/></svg>'
  };

  const css = `
  .ico{display:inline-grid;width:1.05em;height:1.05em;margin-right:.4em;vertical-align:-.15em}
  .ico svg{width:100%;height:100%}
  .dock{display:none}
  @media (max-width:820px){
    header.top [data-ico]{display:none!important}
    header.top .spy .ind{display:none}
    .dock{position:fixed;z-index:30;left:max(10px,env(safe-area-inset-left,0px));right:max(10px,env(safe-area-inset-right,0px));bottom:calc(10px + env(safe-area-inset-bottom,0px));
      display:flex;gap:4px;padding:6px;border-radius:22px;background:linear-gradient(180deg,#ffffffeb,#e7defce0);box-shadow:0 12px 28px #000b,inset 0 0 0 2px #fff;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
    .dock a,.dock button{position:relative;flex:1;display:grid;justify-items:center;align-content:center;gap:2px;min-height:52px;padding:4px 0;border:0;border-radius:15px;background:none;color:#3a2a6e;font:700 .72rem "Space Grotesk",system-ui,sans-serif;text-decoration:none;cursor:pointer;transition:background .2s,transform .15s}
    .dock .ico{width:22px;height:22px;margin:0}
    .dock a:active,.dock button:active{transform:scale(.94)}
    .dock a[aria-current]{background:#3a2a6e;color:#fff}
    .dock a[aria-current]::after{content:"";position:absolute;bottom:-5px;left:50%;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:#ffb3d9;box-shadow:0 0 8px #ffb3d9}
    .dock a.dock-cta{background:#ffb3d9;color:#2a0d22}
    .dock a.dock-cta[aria-current]{background:#3a2a6e;color:#fff}
    .dock .sep{flex:0 0 1px;align-self:stretch;margin:8px 2px;background:#3a2a6e33}
    body{padding-bottom:calc(84px + env(safe-area-inset-bottom,0px))}
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function start() {
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
    const next = document.getElementById('nextBtn');
    if (next) {
      dock.insertAdjacentHTML('beforeend', '<span class="sep" aria-hidden="true"></span><button type="button" aria-label="Next stop"><span class="ico">' + ICONS.next + '</span>Next</button>');
      dock.lastElementChild.addEventListener('click', () => next.click());
    }
    document.body.appendChild(dock);
    // keep the "you are here" highlight identical in both places
    const sync = () => pairs.forEach(([a, d]) => a.hasAttribute('aria-current') ? d.setAttribute('aria-current', a.getAttribute('aria-current')) : d.removeAttribute('aria-current'));
    sync();
    new MutationObserver(sync).observe(document.querySelector('header.top'), { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
