/* Retro arrow cursor, elevated: the classic 1980s pointer shape with a pastel pearl finish.
   Only on devices with a precise mouse; text fields keep the normal text cursor.
   Trail dot and click ripple turn off with the Animation switch (html.no-motion) or reduced motion. */
(function () {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const css = `
  html.tt-cursor, html.tt-cursor *{cursor:none!important}
  html.tt-cursor input, html.tt-cursor textarea, html.tt-cursor select, html.tt-cursor [contenteditable]{cursor:text!important}
  .ttc{position:fixed;left:0;top:0;z-index:10000;pointer-events:none;opacity:0;transition:opacity .2s;will-change:transform}
  .ttc.on{opacity:1}
  .ttc svg{display:block;width:26px;height:30px;overflow:visible;transform-origin:3px 2px;transition:transform .14s cubic-bezier(.2,0,.2,1);filter:drop-shadow(0 2px 5px #07051a99) drop-shadow(0 0 8px #c9b6ff66)}
  html.ttc-hover .ttc svg{transform:rotate(-14deg) scale(1.12);filter:drop-shadow(0 3px 8px #07051aaa) drop-shadow(0 0 12px #ffb3d9aa)}
  html.ttc-down .ttc svg{transform:rotate(-4deg) scale(.9)}
  html.ttc-text .ttc{opacity:0}
  .ttc-dot{position:fixed;left:0;top:0;z-index:9999;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;pointer-events:none;background:#ffb3d9;box-shadow:0 0 8px 2px #c9b6ff99;opacity:0;transition:opacity .2s,width .2s,height .2s,background .2s}
  .ttc-dot.on{opacity:1}
  html.ttc-hover .ttc-dot{width:10px;height:10px;margin:-5px 0 0 -5px;background:#fff1a6}
  .ttc-ring{position:fixed;left:0;top:0;z-index:9998;width:0;height:0;border-radius:50%;pointer-events:none;border:2px solid #c9b6ff;transform:translate(-50%,-50%);opacity:0}
  .ttc-ring.go{animation:ttcring .45s ease-out}
  @keyframes ttcring{from{width:4px;height:4px;opacity:.9}to{width:46px;height:46px;opacity:0}}
  html.no-motion .ttc-dot, html.no-motion .ttc-ring{display:none}
  @media (prefers-reduced-motion: reduce){.ttc-dot,.ttc-ring{display:none}.ttc svg{transition:none}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const wrap = document.createElement('div'); wrap.className = 'ttc'; wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `<svg viewBox="0 0 24 28" fill="none">
    <defs>
      <linearGradient id="ttcFill" x1="3" y1="2" x2="19" y2="26" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#e9dcff"/><stop offset=".8" stop-color="#ffc9e4"/><stop offset="1" stop-color="#a8d8ff"/></linearGradient>
      <linearGradient id="ttcEdge" x1="3" y1="2" x2="19" y2="26" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c9b6ff"/></linearGradient>
    </defs>
    <path d="M3 2L3 22L8.5 17L12.5 26L15 25L11 16L19 16L3 2Z" fill="#1a1033" stroke="#1a1033" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M4 3.6L4 20.4L8.8 15.8L13 25.1L14.4 24.5L10.2 15.2L17.8 15.2L4 3.6Z" fill="url(#ttcFill)" stroke="url(#ttcEdge)" stroke-width=".5" stroke-linejoin="round"/>
    <path d="M4 3.6L4 20.4L6.4 18.1L4 3.6Z" fill="#fff" opacity=".55"/>
    <path d="M15.5 4.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="#fff1a6"/>
  </svg>`;
  const dot = document.createElement('div'); dot.className = 'ttc-dot'; dot.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('div'); ring.className = 'ttc-ring'; ring.setAttribute('aria-hidden', 'true');

  function start() {
    document.body.append(wrap, dot, ring);
    document.documentElement.classList.add('tt-cursor');
    let x = -100, y = -100, dx = x, dy = y;
    const H = 'a,button,[role="button"],summary,label,.pass,.work-strip a,figure img';
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      wrap.style.transform = `translate(${x - 3}px,${y - 2}px)`;
      wrap.classList.add('on'); dot.classList.add('on');
      const t = e.target;
      document.documentElement.classList.toggle('ttc-hover', !!(t.closest && t.closest(H)));
      document.documentElement.classList.toggle('ttc-text', !!(t.closest && t.closest('input:not([type=radio]):not([type=checkbox]),textarea,select,[contenteditable]')));
    }, { passive: true });
    document.addEventListener('mouseleave', () => { wrap.classList.remove('on'); dot.classList.remove('on'); });
    addEventListener('mousedown', () => {
      document.documentElement.classList.add('ttc-down');
      ring.style.left = x + 'px'; ring.style.top = y + 'px';
      ring.classList.remove('go'); void ring.offsetWidth; ring.classList.add('go');
    });
    addEventListener('mouseup', () => document.documentElement.classList.remove('ttc-down'));
    (function trail() { dx += (x - dx) * .18; dy += (y - dy) * .18; dot.style.transform = `translate(${dx}px,${dy}px)`; requestAnimationFrame(trail); })();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
