/**
 * ExamGenius Onboarding Tour
 * Shown once to new users to explain dashboard components.
 * Stores completion in localStorage under 'eg_tour_done'.
 */

const TOUR_KEY = 'eg_tour_done';

const TOUR_STEPS = [
    {
        target: null,            // no spotlight — centre modal
        title: '👋 Welcome to ExamGenius!',
        text: "You're all set to start your JAMB preparation journey. Let us give you a quick tour of your dashboard so you know where everything is.",
        pos: 'center',
    },
    {
        target: '.stats-grid',
        title: '📊 Your Performance Stats',
        text: 'These four cards show your total points, overall accuracy, total correct answers, and how many days you have been active. Watch them grow as you study!',
        pos: 'bottom',
    },
    {
        target: '.learning-level-card',
        title: '🏆 Your Learning Level',
        text: 'Answer questions correctly to earn XP and level up — from Beginner all the way to Champion. Your level badge is your bragging right!',
        pos: 'bottom',
    },
    {
        target: '.streak-card',
        title: '🔥 Daily Streak',
        text: 'Study a little every day to keep your streak alive. Streak bonuses give you extra points, and the longer the streak the higher the reward!',
        pos: 'top',
    },
    {
        target: '.card.mt-3',   // first "Quick Actions" card
        title: '⚡ Quick Actions',
        text: 'Jump straight into Guided Learning (topic-by-topic), Year Practice (past JAMB questions), or a full timed CBT exam from these buttons.',
        pos: 'top',
        targetIndex: 0,
    },
    {
        target: '#sidebar',
        title: '🧭 Sidebar Navigation',
        text: 'Use this sidebar to move between Dashboard, Learn, Year Practice, CBT Practice, and your Profile at any time.',
        pos: 'right',
    },
];

class TourManager {
    constructor() {
        this.step = 0;
        this.overlay = null;
        this.spotlight = null;
        this.card = null;
        this._resizeHandler = () => this._positionStep();
    }

    /** Call this after dashboard renders — shows tour only to first-time users */
    maybeStart() {
        if (localStorage.getItem(TOUR_KEY)) return;
        // Desktop only — skip tour on mobile/tablet devices
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;
        // Small delay so the dashboard finishes painting
        setTimeout(() => this.start(), 600);
    }

    start() {
        this.step = 0;
        this._buildDOM();
        this._showStep();
        window.addEventListener('resize', this._resizeHandler);
    }

    _buildDOM() {
        // Full-screen click-blocking backdrop (pointer-events: auto blocks
        // accidental clicks reaching the dashboard while the tour is open)
        this.overlay = document.createElement('div');
        this.overlay.id = 'tour-overlay';
        Object.assign(this.overlay.style, {
            position: 'fixed', inset: '0',
            zIndex: '99990',
            pointerEvents: 'auto',   // blocks clicks to elements behind
            background: 'transparent',
        });

        // Spotlight box (purely visual — cut-out highlight around the target)
        this.spotlight = document.createElement('div');
        this.spotlight.id = 'tour-spotlight';
        Object.assign(this.spotlight.style, {
            position: 'fixed',
            borderRadius: '10px',
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
            transition: 'all 0.35s cubic-bezier(.4,0,.2,1)',
            zIndex: '99991',
            pointerEvents: 'none',
        });

        // Tooltip card — must be above the blocking overlay so buttons work
        this.card = document.createElement('div');
        this.card.id = 'tour-card';
        this.card.style.cssText = `
            position: fixed;
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.22);
            padding: 24px 26px 20px;
            max-width: 340px;
            min-width: 280px;
            z-index: 99993;
            pointer-events: auto;
            border-top: 4px solid var(--primary-yellow, #FFC107);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            transition: top 0.35s ease, left 0.35s ease, opacity 0.2s ease;
        `;

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.spotlight);
        document.body.appendChild(this.card);
    }

    _destroyDOM() {
        this.overlay?.remove();
        this.spotlight?.remove();
        this.card?.remove();
        this.overlay = this.spotlight = this.card = null;
        window.removeEventListener('resize', this._resizeHandler);
    }

    _getTarget(s) {
        if (!s.target) return null;
        const els = document.querySelectorAll(s.target);
        return els[s.targetIndex ?? 0] || null;
    }

    _showStep() {
        const s = TOUR_STEPS[this.step];
        const target = this._getTarget(s);
        const isLast = this.step === TOUR_STEPS.length - 1;

        // ── Build card HTML ──
        const progress = TOUR_STEPS.map((_, i) =>
            `<span style="
                display:inline-block;width:8px;height:8px;border-radius:50%;
                background:${i === this.step ? 'var(--primary-yellow,#FFC107)' : '#e0e0e0'};
                transition:background 0.2s;
            "></span>`
        ).join(' ');

        this.card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
                <h3 style="margin:0;font-size:1.05em;color:#212121;line-height:1.3">${s.title}</h3>
                <button id="tour-skip" style="
                    background:none;border:none;cursor:pointer;color:#9e9e9e;
                    font-size:18px;line-height:1;padding:0 0 0 12px;flex-shrink:0;
                " title="Skip tour">✕</button>
            </div>
            <p style="margin:0 0 20px;color:#555;font-size:0.92em;line-height:1.6">${s.text}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
                <div style="display:flex;gap:5px">${progress}</div>
                <div style="display:flex;gap:8px">
                    ${this.step > 0
                        ? `<button id="tour-prev" style="
                                background:#f5f5f5;color:#555;border:none;
                                padding:8px 16px;border-radius:8px;cursor:pointer;
                                font-size:0.88em;font-weight:600;
                            ">← Back</button>`
                        : ''}
                    <button id="tour-next" style="
                        background:var(--primary-yellow,#FFC107);color:#1a1a1a;
                        border:none;padding:8px 20px;border-radius:8px;
                        cursor:pointer;font-size:0.88em;font-weight:700;
                        box-shadow:0 2px 6px rgba(255,193,7,0.35);
                    ">${isLast ? '🎉 Finish' : 'Next →'}</button>
                </div>
            </div>
        `;

        // Bind buttons
        document.getElementById('tour-skip').onclick = () => this.finish(false);
        document.getElementById('tour-next').onclick = () => {
            if (isLast) this.finish(true);
            else { this.step++; this._showStep(); }
        };
        const prevBtn = document.getElementById('tour-prev');
        if (prevBtn) prevBtn.onclick = () => { this.step--; this._showStep(); };

        this._positionStep();
    }

    _positionStep() {
        if (!this.card || !this.spotlight) return;
        const s = TOUR_STEPS[this.step];
        const target = this._getTarget(s);
        const GAP = 16;

        if (!target || s.pos === 'center') {
            // ── Centred welcome modal — no spotlight ──
            Object.assign(this.spotlight.style, {
                top: '-200px', left: '-200px',
                width: '1px', height: '1px',
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            });
            const cw = 340;
            Object.assign(this.card.style, {
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                right: 'auto', bottom: 'auto',
            });
            return;
        }

        // ── Spotlight ──
        const r = target.getBoundingClientRect();
        const pad = 6;
        Object.assign(this.spotlight.style, {
            top:    (r.top    - pad) + 'px',
            left:   (r.left   - pad) + 'px',
            width:  (r.width  + pad * 2) + 'px',
            height: (r.height + pad * 2) + 'px',
            transform: 'none',
        });

        // ── Card ──
        this.card.style.transform = 'none';
        const ch = this.card.offsetHeight || 200;
        const cw = this.card.offsetWidth  || 320;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let top, left;

        if (s.pos === 'bottom') {
            top  = r.bottom + GAP + pad;
            left = Math.max(8, Math.min(r.left, vw - cw - 8));
        } else if (s.pos === 'top') {
            top  = r.top - pad - ch - GAP;
            left = Math.max(8, Math.min(r.left, vw - cw - 8));
        } else if (s.pos === 'right') {
            top  = Math.max(8, r.top);
            left = r.right + GAP + pad;
        } else { // left
            top  = Math.max(8, r.top);
            left = r.left - cw - GAP - pad;
        }

        // Clamp to viewport
        top  = Math.max(8, Math.min(top,  vh - ch - 8));
        left = Math.max(8, Math.min(left, vw - cw - 8));

        Object.assign(this.card.style, {
            top:    top  + 'px',
            left:   left + 'px',
            right:  'auto',
            bottom: 'auto',
        });
    }

    finish(completed) {
        localStorage.setItem(TOUR_KEY, '1');
        this._destroyDOM();
    }
}

// Singleton
const tourManager = new TourManager();
