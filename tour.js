/**
 * Save Morgan Valley - Spotlight Tour (v2)
 * Runs on home page only. Highlights each nav item with a dark overlay.
 * Shows once per visitor via localStorage.
 * Suppressed on mobile (< 768px).
 */

(function () {
  const TOUR_KEY = 'smv_tour_complete';

  const steps = [
    {
      navHref: null, // No nav highlight for welcome
      title: 'Welcome to Save Morgan Valley',
      body: 'A 720MW natural gas power plant is proposed in our community. Let us show you what is available on this site and how you can help stop it.',
      nextLabel: 'Next: Petition →'
    },
    {
      navHref: 'petition.html',
      title: '✍️ Petition',
      body: 'Sign the physical petition against the plant. Physical signatures carry real weight with decision-makers.',
      nextLabel: 'Next: Volunteer →'
    },
    {
      navHref: 'volunteer.html',
      title: '🤝 Volunteer',
      body: 'Help with door-to-door outreach, event support, or other efforts to protect our community.',
      nextLabel: 'Next: Info/FAQ →'
    },
    {
      navHref: 'information.html',
      title: '📋 Info/FAQ',
      body: 'Get the facts: projected emissions, health impacts, property concerns, and answers to common questions about the plant.',
      nextLabel: 'Next: Calendar →'
    },
    {
      navHref: 'calendar.html',
      title: '📅 Calendar',
      body: 'Come meet your neighbors at one of our petition signing events and show your support in person.',
      nextLabel: 'Next: Meetings →'
    },
    {
      navHref: 'meetings.html',
      title: '🏛️ Meetings',
      body: 'Upcoming government meetings where this project is being decided. Showing up sends a powerful message.',
      nextLabel: 'Next: Representatives →'
    },
    {
      navHref: 'representatives.html',
      title: '📞 Representatives',
      body: 'Contact your local, county, and state representatives directly. Let them know where you stand.',
      nextLabel: 'Next: Social →'
    },
    {
      navHref: 'social.html',
      title: '📣 Social',
      body: 'Follow us on social media and help spread the word to friends and neighbors.',
      nextLabel: 'Next: Contact →'
    },
    {
      navHref: 'contact-us.html',
      title: '📬 Contact',
      body: 'Have questions or want to get more involved? Reach out and we are here to help.',
      nextLabel: 'Done - Back to Top ✓'
    }
  ];

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

  function clearSpotlight() {
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function spotlightElement(el) {
    clearSpotlight();
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const pad = 6;

    overlay = document.createElement('div');
    overlay.id = 'smv-spotlight';

    // Full page dark overlay with a box-shadow cutout around the target
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9998;
      pointer-events: none;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.65);
      border-radius: 6px;
      top: ${rect.top - pad + window.scrollY}px;
      left: ${rect.left - pad}px;
      width: ${rect.width + pad * 2}px;
      height: ${rect.height + pad * 2}px;
      outline: 3px solid #ff6b35;
      outline-offset: 0px;
      box-shadow: 0 0 0 9999px rgba(0,0,0,0.65), 0 0 0 3px #ff6b35;
    `;

    document.body.appendChild(overlay);
  }

  function createCard() {
    const existing = document.getElementById('smv-tour-card');
    if (existing) existing.remove();

    const step = steps[currentIndex];
    const total = steps.length;

    const dots = steps.map((_, i) => {
      const active = i === currentIndex;
      return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;margin:0 2px;background:${active ? '#ff6b35' : '#e0e0e0'};"></span>`;
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
        <div>${dots}</div>
        <div style="font-size:11px;color:#aaa;">${currentIndex + 1} of ${total}</div>
      </div>
      <div style="font-weight:700;font-size:0.95rem;color:#333;margin-bottom:6px;">${step.title}</div>
      <div style="font-size:0.85rem;color:#555;line-height:1.5;margin-bottom:14px;">${step.body}</div>
      <button id="smv-tour-next" style="display:block;width:100%;background:#ff6b35;color:white;text-align:center;padding:9px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:bold;font-size:0.85rem;"
        onmouseover="this.style.background='#e55a25'" onmouseout="this.style.background='#ff6b35'">
        ${step.nextLabel}
      </button>
    `;

    document.body.appendChild(card);

    document.getElementById('smv-tour-skip').addEventListener('click', finish);

    document.getElementById('smv-tour-next').addEventListener('click', function () {
      currentIndex++;
      if (currentIndex >= steps.length) {
        finish();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        advance();
      }
    });
  }

  function advance() {
    const step = steps[currentIndex];
    const navEl = getNavLink(step.navHref);

    if (navEl) {
      navEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => {
        spotlightElement(navEl);
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

    // Only run on home page
    const path = window.location.pathname;
    if (!(path === '/' || path === '' || path.endsWith('index.html'))) return;

    // Inject animation style
    const style = document.createElement('style');
    style.textContent = `
      @keyframes smvSlideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      advance();
    }, 900);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
