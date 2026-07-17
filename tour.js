/**
 * Save Morgan Valley — Guided Site Tour
 * Shows once per visitor (localStorage). Small floating card, lower-left.
 * Tour: Home → Petition → Calendar → Meetings → Donate → Info/FAQ → Social → Contact Us
 */

(function () {
  const TOUR_KEY = 'smv_tour_complete';
  const TOTAL = 8;

  const steps = [
    {
      pageMatch: ['/', '/index.html', ''],
      title: 'Welcome to Save Morgan Valley',
      body: 'A 720MW natural gas power plant is proposed in our community. Let us show you around and how you can help.',
      next: 'petition.html',
      nextLabel: 'Petition →',
      index: 1
    },
    {
      pageMatch: ['/petition.html'],
      title: '✍️ Sign the Petition',
      body: 'Physical signatures carry real weight with decision-makers. Sign in person or have us come to you.',
      next: 'calendar.html',
      nextLabel: 'Calendar →',
      index: 2
    },
    {
      pageMatch: ['/calendar.html'],
      title: '📅 Upcoming Events',
      body: 'Come meet your neighbors at one of our petition signing events and show your support in person.',
      next: 'meetings.html',
      nextLabel: 'Meetings →',
      index: 3
    },
    {
      pageMatch: ['/meetings.html'],
      title: '🏛️ Meetings That Matter',
      body: 'Show up to the government meetings where this project is being decided. Your presence is powerful.',
      next: 'index.html#donate',
      nextLabel: 'Donate →',
      index: 4
    },
    {
      pageMatch: ['/#donate', '/index.html#donate'],
      title: '💚 Support the Cause',
      body: 'Help fund yard signs, legal fees, and outreach to protect our community.',
      next: 'information.html',
      nextLabel: 'Info/FAQ →',
      index: 5
    },
    {
      pageMatch: ['/information.html'],
      title: '📋 Info & FAQ',
      body: 'Get the facts — emissions data, health impacts, property concerns, and answers to common questions.',
      next: 'social.html',
      nextLabel: 'Social →',
      index: 6
    },
    {
      pageMatch: ['/social.html'],
      title: '📣 Follow & Share',
      body: 'Follow us on social media and help spread the word to friends and neighbors.',
      next: 'contact-us.html',
      nextLabel: 'Contact Us →',
      index: 7
    },
    {
      pageMatch: ['/contact-us.html'],
      title: '📬 Get in Touch',
      body: 'Have questions or want to get involved? Reach out — we\'re here to help.',
      next: null,
      nextLabel: 'Done ✓',
      index: 8
    }
  ];

  function getCurrentStep() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Donate is a special case — same page as home but with hash
    if ((path === '/' || path === '' || path.endsWith('index.html')) && hash === '#donate') {
      return steps[4];
    }

    for (const step of steps) {
      for (const match of step.pageMatch) {
        if (match.includes('#')) continue; // handled above
        if (match === '' || match === '/') {
          if (path === '/' || path === '' || path.endsWith('/') && !path.endsWith('html')) return step;
        } else if (path.endsWith(match)) {
          return step;
        }
      }
    }
    return null;
  }

  function createCard(step) {
    // Remove existing card if any
    const existing = document.getElementById('smv-tour-card');
    if (existing) existing.remove();

    const card = document.createElement('div');
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
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      z-index: 9999;
      font-family: 'Segoe UI', system-ui, sans-serif;
      animation: smvSlideIn 0.3s ease;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes smvSlideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    // Progress dots
    const dots = Array.from({ length: TOTAL }, (_, i) => {
      const active = i + 1 === step.index;
      return `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;margin:0 2px;background:${active ? '#ff6b35' : '#e0e0e0'};"></span>`;
    }).join('');

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#ff6b35;">Let us show you around</div>
        <button id="smv-tour-skip" style="background:none;border:none;color:#999;cursor:pointer;font-size:18px;line-height:1;padding:0;margin-top:-2px;" title="Skip tour">×</button>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        <div>${dots}</div>
        <div style="font-size:11px;color:#aaa;">${step.index} of ${TOTAL}</div>
      </div>
      <div style="font-weight:700;font-size:0.95rem;color:#333;margin-bottom:6px;">${step.title}</div>
      <div style="font-size:0.85rem;color:#555;line-height:1.5;margin-bottom:14px;">${step.body}</div>
      <a id="smv-tour-next" href="${step.next || '#'}" style="display:block;background:#ff6b35;color:white;text-align:center;padding:9px 12px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:0.85rem;"
        onmouseover="this.style.background='#e55a25'" onmouseout="this.style.background='#ff6b35'">
        ${step.nextLabel}
      </a>
    `;

    document.body.appendChild(card);

    document.getElementById('smv-tour-skip').addEventListener('click', function () {
      localStorage.setItem(TOUR_KEY, '1');
      card.remove();
    });

    document.getElementById('smv-tour-next').addEventListener('click', function (e) {
      if (!step.next) {
        e.preventDefault();
        localStorage.setItem(TOUR_KEY, '1');
        card.remove();
      } else if (step.next === 'index.html#donate') {
        // Same page navigation — handle scroll
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
          e.preventDefault();
          card.remove();
          setTimeout(() => {
            const donate = document.getElementById('donate');
            if (donate) donate.scrollIntoView({ behavior: 'smooth' });
            // Recreate card for donate step after scroll
            setTimeout(() => createCard(steps[4]), 600);
          }, 100);
        }
        // Otherwise let normal navigation happen — tour.js will show donate step on arrival
      }
    });
  }

  function init() {
    if (localStorage.getItem(TOUR_KEY)) return;

    const step = getCurrentStep();
    if (!step) return;

    setTimeout(() => createCard(step), 800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
