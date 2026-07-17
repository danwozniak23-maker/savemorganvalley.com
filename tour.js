/**
 * Save Morgan Valley - Spotlight Tour (v2)
 * Runs on home page only. Highlights elements with a dark overlay.
 * Shows once per visitor via localStorage.
 * Suppressed on mobile (< 768px).
 * Dots are clickable to jump to any step.
 */

(function () {
  const TOUR_KEY = 'smv_tour_complete';

  // elementId: DOM id to spotlight (null = no spotlight)
  // navHref: nav link to spotlight (alternative to elementId)
  const steps = [
    {
      elementId: null,
      navHref: null,
      title: 'Welcome to Save Morgan Valley',
      body: 'A 720MW natural gas power plant is proposed in our community. Let us show you what is available on this site and how you can help stop it.',
      link: null,
      nextLabel: 'Start Tour →'
    },
    {
      elementId: 'smv-alert-banner',
      navHref: null,
      title: '📢 Important Alert',
      body: 'This banner highlights our most urgent upcoming event or announcement. Check it every time you visit.',
      link: null,
      nextLabel: 'Next: Petition →'
    },
    {
      elementId: null,
      navHref: 'petition.html',
      title: '✍️ Petition',
      body: 'Sign the physical petition against the plant. Physical signatures carry real weight with decision-makers.',
      link: 'petition.html',
      nextLabel: 'Next: Volunteer →'
    },
    {
      elementId: null,
      navHref: 'volunteer.html',
      title: '🤝 Volunteer',
      body: 'Help with door-to-door outreach, event support, or other efforts to protect our community.',
      link: 'volunteer.html',
      nextLabel: 'Next: Info/FAQ →'
    },
    {
      elementId: null,
      navHref: 'information.html',
      title: '📋 Info/FAQ',
      body: 'Get the facts: projected emissions, health impacts, property concerns, and answers to common questions about the plant.',
      link: 'information.html',
      nextLabel: 'Next: Calendar →'
    },
    {
      elementId: 'smv-event-ticker',
      navHref: 'calendar.html',
      title: '📅 Calendar & Events',
      body: 'Upcoming petition signing events near you. The ticker above shows the next event. View the full calendar for all dates.',
      link: 'calendar.html',
      nextLabel: 'Next: Meetings →'
    },
    {
      elementId: null,
      navHref: 'meetings.html',
      title: '🏛️ Meetings',
      body: 'Upcoming government meetings where this project is being decided. Showing up sends a powerful message.',
      link: 'meetings.html',
      nextLabel: 'Next: Representatives →'
    },
    {
      elementId: null,
      navHref: 'representatives.html',
      title: '📞 Representatives',
      body: 'Contact your local, county, and state representatives directly. Let them know where you stand.',
      link: 'representatives.html',
      nextLabel: 'Next: Social →'
    },
    {
      elementId: null,
      navHref: 'social.html',
      title: '📣 Social',
      body: 'Follow us on social media and help spread the word to friends and neighbors.',
      link: 'social.html',
      nextLabel: 'Next: Contact →'
    },
    {
      elementId: null,
      navHref: 'contact-us.html',
      title: '📬 Contact',
      body: 'Have questions or want to get more involved? Reach out and we are here to help.',
      link: 'contact-us.html',
      nextLabel: "I'm ready to help →"
    }
  ];

  const TOTAL = steps.length;
  let currentIndex = 0;
  let overlay = null;
  let card = null;

  function getNavLink(href) {
    if (!href) return null;
    const links = document.querySelectorAll('#navLinks a');
    for (const link of links) {
      if (link.getAttribute('href') === href) return link;
    }
    return null;
  }

  let currentSpotlightEl = null;

  function clearSpotlight() {
    if (overlay) { overlay.remove(); overlay = null; }
    currentSpotlightEl = null;
    window.removeEventListener('scroll', updateSpotlightPosition);
    window.removeEventListener('resize', updateSpotlightPosition);
  }

  function updateSpotlightPosition() {
    if (!overlay || !currentSpotlightEl) return;
    const rect = currentSpotlightEl.getBoundingClientRect();
    const pad = 6;
    overlay.style.top = `${rect.top - pad}px`;
    overlay.style.left = `${rect.left - pad}px`;
    overlay.style.width = `${rect.width + pad * 2}px`;
    overlay.style.height = `${rect.height + pad * 2}px`;
  }

  function spotlightElement(el) {
    clearSpotlight();
    if (!el) return;

    currentSpotlightEl = el;
    const rect = el.getBoundingClientRect();
    const pad = 6;

    overlay = document.createElement('div');
    overlay.id = 'smv-spotlight';
    overlay.style.cssText = `
      position: fixed;
      z-index: 9998;
      pointer-events: none;
      border-radius: 6px;
      top: ${rect.top - pad}px;
      left: ${rect.left - pad}px;
      width: ${rect.width + pad * 2}px;
      height: ${rect.height + pad * 2}px;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.65), 0 0 0 3px #ff6b35;
      outline: 3px solid #ff6b35;
    `;

    document.body.appendChild(overlay);

    // Keep spotlight locked to element on scroll/resize
    window.addEventListener('scroll', updateSpotlightPosition, { passive: true });
    window.addEventListener('resize', updateSpotlightPosition, { passive: true });
  }

  function createCard() {
    const existing = document.getElementById('smv-tour-card');
    if (existing) existing.remove();

    const step = steps[currentIndex];

    // Clickable dots
    const dots = steps.map((_, i) => {
      const active = i === currentIndex;
      return `<span 
        data-idx="${i}"
        style="display:inline-block;width:${active ? '10px' : '7px'};height:${active ? '10px' : '7px'};border-radius:50%;margin:0 3px;background:${active ? '#ff6b35' : '#ccc'};cursor:pointer;vertical-align:middle;transition:all 0.2s;"
        title="Go to stop ${i + 1}"
      ></span>`;
    }).join('');

    card = document.createElement('div');
    card.id = 'smv-tour-card';
    card.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 24px;
      width: 280px;
      background: white;
      border: 2px solid #ff6b35;
      border-radius: 12px;
      padding: 16px 18px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      z-index: 9999;
      font-family: 'Segoe UI', system-ui, sans-serif;
      animation: smvSlideIn 0.3s ease;
    `;

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#ff6b35;">Let us show you around</div>
        <button id="smv-tour-skip" style="background:none;border:none;color:#999;cursor:pointer;font-size:18px;line-height:1;padding:0;margin-top:-2px;" title="Skip tour">×</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div id="smv-dots">${dots}</div>
        <div style="font-size:11px;color:#aaa;">${currentIndex + 1} of ${TOTAL}</div>
      </div>
      <div style="font-weight:700;font-size:0.95rem;color:#333;margin-bottom:6px;">${step.title}</div>
      ${currentIndex === 0 ? `<div style="font-size:10px;color:#aaa;margin-bottom:6px;letter-spacing:0.5px;">${TOTAL} stops &bull; takes about 2 minutes</div>` : ''}
      <div style="font-size:0.85rem;color:#555;line-height:1.5;margin-bottom:${step.link ? '8px' : '14px'};">${step.body}</div>
      ${step.link ? `<a href="${step.link}" style="display:block;font-size:0.8rem;color:#ff6b35;text-decoration:underline;margin-bottom:12px;">Visit this page →</a>` : ''}
      <button id="smv-tour-next" style="display:block;width:100%;background:#ff6b35;color:white;text-align:center;padding:9px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;font-size:0.85rem;"
        onmouseover="this.style.background='#e55a25'" onmouseout="this.style.background='#ff6b35'">
        ${step.nextLabel}
      </button>
    `;

    document.body.appendChild(card);

    // Dot click handlers
    document.getElementById('smv-dots').querySelectorAll('span').forEach(dot => {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-idx'));
        currentIndex = idx;
        advance();
      });
      dot.addEventListener('mouseover', function () { this.style.background = '#ff6b35'; });
      dot.addEventListener('mouseout', function () {
        const idx = parseInt(this.getAttribute('data-idx'));
        this.style.background = idx === currentIndex ? '#ff6b35' : '#ccc';
      });
    });

    document.getElementById('smv-tour-skip').addEventListener('click', finish);

    document.getElementById('smv-tour-next').addEventListener('click', function () {
      currentIndex++;
      if (currentIndex >= TOTAL) {
        finish();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        advance();
      }
    });
  }

  function advance() {
    const step = steps[currentIndex];

    // Determine what to spotlight
    let targetEl = null;
    if (step.elementId) {
      targetEl = document.getElementById(step.elementId);
    }
    if (!targetEl && step.navHref) {
      targetEl = getNavLink(step.navHref);
    }

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        spotlightElement(targetEl);
        createCard();
      }, 150);
    } else {
      clearSpotlight();
      createCard();
    }
  }

  function finish() {
    localStorage.setItem(TOUR_KEY, '1');
    clearSpotlight();
    if (card) { card.remove(); card = null; }
  }

  function init() {
    if (localStorage.getItem(TOUR_KEY)) return;
    if (window.innerWidth < 768) return;

    const path = window.location.pathname;
    if (!(path === '/' || path === '' || path.endsWith('index.html'))) return;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes smvSlideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(advance, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
