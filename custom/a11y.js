// Keyboard and screen-reader layer for the Þingvangur preview. The Vantra export toggles its menu, sub-menus and FAQ rows from
// click handlers on <div>s: not focusable, not operable by keyboard, and the closed menu's links stay in the tab order.
// This script only adds semantics and key handlers; it never touches a timeline, a style or the original scripts, so the
// motion stays the system's. Pointer behaviour is unchanged (no programmatic focus on a pointer open, see _tools/focus-guard).
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const press = (el, e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); return true; } return false; };

  const btn = $('.nav_menu-button'), panel = $('.nav_panel'), scrim = $('.header-bg');
  if (btn && panel && scrim) {
    panel.id = panel.id || 'nav-panel';
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-controls', panel.id);
    const isOpen = () => +getComputedStyle(scrim).opacity > 0.5;
    const subRows = $$('.nav_menu-row[data-submenu-action]');
    subRows.forEach((row, i) => {
      const wrap = row.parentElement.querySelector('[data-submenu-action="content"]');
      if (!wrap) return;
      wrap.id = wrap.id || `nav-sub-${i}`;
      row.setAttribute('role', 'button'); row.setAttribute('tabindex', '0'); row.setAttribute('aria-controls', wrap.id);
      row.addEventListener('keydown', e => press(row, e));
    });
    const sync = () => {
      const open = isOpen();
      btn.setAttribute('aria-expanded', String(open));
      panel.toggleAttribute('inert', !open);          // a closed menu has no tabbable links
      subRows.forEach(r => { const w = $('#' + r.getAttribute('aria-controls')); if (w) r.setAttribute('aria-expanded', String(w.getBoundingClientRect().height > 2)); });
    };
    sync(); setInterval(sync, 150);
    btn.addEventListener('keydown', e => {
      if (!press(btn, e)) return;
      // keyboard open only: put focus on the first item once the panel is open (never on a pointer open)
      setTimeout(() => { sync(); if (isOpen()) $('.nav_menu-row', panel)?.focus(); }, 700);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen()) { btn.click(); btn.focus(); }
    });
  }

  // FAQ: the row head is the control; the click bubbles to the original row handler
  $$('.faq_row').forEach((row, i) => {
    const head = $('.faq_row-head', row), answer = $('.faq_answer', row);
    if (!head || !answer) return;
    answer.id = answer.id || `faq-answer-${i}`;
    head.setAttribute('role', 'button'); head.setAttribute('tabindex', '0'); head.setAttribute('aria-controls', answer.id);
    const sync = () => head.setAttribute('aria-expanded', String(answer.getBoundingClientRect().height > 2));
    sync(); setInterval(sync, 200);
    head.addEventListener('keydown', e => press(head, e));
  });
})();
