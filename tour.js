/**
 * Save Morgan Valley — Guided Site Tour
 * Shows once per visitor (localStorage). Small floating card, lower-left.
 * Tour: Home → Petition → Meetings → Donate (index.html#donate)
 */

(function () {
  const TOUR_KEY = 'smv_tour_complete';
  const TOUR_STEP_KEY = 'smv_tour_step';

  const steps = [
    {
      page: 'index.html',
      pageMatch: ['/', '/index.html', ''],
      title: 'Welcome to Save Morgan Valley',
      body: 'A 720MW gas plant is proposed in our community. We\'ll show you the 3 most important things you can do right now.',
      next: 'petition.html',
      nextLabel: 'Next: Sign the Petition →',
      step: 0,
      total: 4
    },
    {
      page: 'petition.html',
      pageMatch: ['/petition.html'],
      title: '✍️ Step 1: Sign the Petition',
      body: 'Physical signatures carry real weight with decision-makers. Sign in person or have us come to you.',
      next: 'meetings.html',
      nextLabel: 'Next: Attend a Meeting →',
      step: 1,
      total: 4
    },
    {
      page: 'meetings.html',
      pageMatch: ['/meetings.html'],
      title: '🏛️ Step 2: Attend a Meeting',
      body: 'Show up to government meetings where this project is being decided. Your presence matters.',
      next: 'index.html#donate',
      nextLabel: 'Next: Support the Cause →',
      step: 2,
      total: 4
    },
    {
      page: 'index.html#donate',
      pageMatch: ['/#donate', '/index.html#donate'],
      title: '💚 Step 3: Donate',
      body: 'Help us fund yard signs, legal fees, and outreach materials to protect our community.',
      next: null,
      nextLabel: 'Finish Tour ✓',
      step: 3,
      total: 4
    }
  ];

  function getCurrentStep() {
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Check for donate step specifically
    if ((path.endsWith('index.html') || path === '/' || path === '') && hash === '#donate') {
      return steps[3];
    }

    for (const step of steps) {
      for (const match of step.pageMatch) {
        if (match === '' && (path === '/' || path === '' || path.endsWith('/'))) return step;
        if (match !== '' && !match.includes('#') && path.endsWith(match)) return step;
      }
    }
    return null;
  }

  function createCard(step) {
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
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
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
    const dots = Array.from({ length: step.total }, (_, i) => {
      const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 3px;background:${i === step.step ? '#ff6b35' : '#e0e0e0'};"></span>`;
      return dot;
    }).join('');

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <div style="font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#ff6b35;">Guided Tour</div>
        <button id="smv-tour-skip" style="background:none;border:none;color:#999;cursor:pointer;font-size:18px;line-height:1;padding:0;margin-top:-2px;" title="Skip tour">×</button>
      </div>
      <div style="margin-bottom:8px;">${dots}</div>
      <div style="font-weight:700;font-size:0.95rem;color:#333;margin-bottom:6px;">${step.title}</div>
      <div style="font-size:0.85rem;color:#555;line-height:1.5;margin-bottom:14px;">${step.body}</div>
      <a id="smv-tour-next" href="${step.next || '#'}" style="display:block;background:#ff6b35;color:white;text-align:center;padding:9px 12px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:0.85rem;transition:background 0.2s;"
        onmouseover="this.style.background='#e55a25'" onmouseout="this.style.background='#ff6b35'">
        ${step.nextLabel}
      </a>
    `;

    document.body.appendChild(card);

    // Skip button — marks tour complete and removes card
    document.getElementById('smv-tour-skip').addEventListener('click', function () {
      localStorage.setItem(TOUR_KEY, '1');
      card.remove();
    });

    // Next/Finish button
    document.getElementById('smv-tour-next').addEventListener('click', function () {
      if (!step.next) {
        // Last step — mark complete
        localStorage.setItem(TOUR_KEY, '1');
        card.remove();
        // Scroll to donate section
        const donate = document.getElementById('donate');
        if (donate) donate.scrollIntoView({ behavior: 'smooth' });
      } else {
        localStorage.setItem(TOUR_STEP_KEY, step.step + 1);
      }
    });
  }

  function init() {
    // If tour already completed, do nothing
    if (localStorage.getItem(TOUR_KEY)) return;

    const step = getCurrentStep();
    if (!step) return;

    // Small delay so page content loads first
    setTimeout(() => createCard(step), 800);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
