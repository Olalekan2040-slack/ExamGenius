import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div id="landing-page" className="screen">
      {/* Header */}
      <header className="landing-header">
        <div className="container">
          <div className="logo" onClick={() => window.scrollTo(0, 0)} style={{ cursor: 'pointer' }}>
            <img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" />
            <span>EduLab ExamPrep</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#points">Points System</a>
            <a href="#about">About</a>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
          </nav>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay show" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <nav className="mobile-nav-menu">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <button className="btn btn-outline btn-block" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</button>
              <button className="btn btn-primary btn-block" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Get Started</button>
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-image" style={{ backgroundImage: "url('/images/image (5).jpg')" }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-star"></i> Nigeria's #1 JAMB Prep Platform
            </div>
            <h1>Ace Your JAMB With<br /><span className="highlight">Confidence</span></h1>
            <p className="hero-subtitle">
              Step-by-step lessons, 4,000+ past questions (2010–2024), full CBT simulations, and a reward system that keeps you motivated.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary btn-lg hero-btn-main" onClick={() => navigate('/register')}>
                <i className="fas fa-rocket"></i> Start for Free
              </button>
              <button className="btn btn-hero-ghost btn-lg" onClick={() => navigate('/login')}>
                <i className="fas fa-sign-in-alt"></i> Sign In
              </button>
            </div>
            <div className="hero-trust">
              <span><i className="fas fa-shield-alt"></i> 100% Free</span>
              <span><i className="fas fa-mobile-alt"></i> Works on Any Device</span>
              <span><i className="fas fa-bolt"></i> Runs Locally</span>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-stats-stack">
              {[
                { icon: 'fa-file-alt', color: 'yellow', label: '4,115+', sub: 'Past Questions' },
                { icon: 'fa-calendar-check', color: 'blue', label: '2010 – 2024', sub: 'Years Covered' },
                { icon: 'fa-brain', color: 'green', label: '10 Subjects', sub: 'With Lessons' },
                { icon: 'fa-trophy', color: 'purple', label: 'Points & Badges', sub: 'Stay Motivated' },
              ].map((s, i) => (
                <div key={i} className="hero-stat-pill">
                  <div className={`pill-icon ${s.color}`}><i className={`fas ${s.icon}`}></i></div>
                  <div><strong>{s.label}</strong><span>{s.sub}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="container stats-bar-inner">
          {[
            { icon: 'fa-book', strong: '4,115+', span: 'Questions' },
            null,
            { icon: 'fa-clock', strong: '15 Years', span: 'of Past Papers' },
            null,
            { icon: 'fa-graduation-cap', strong: '10 Subjects', span: 'Covered' },
            null,
            { icon: 'fa-book-open', strong: 'Step-by-Step', span: 'Explanations' },
            null,
            { icon: 'fa-star', strong: 'Free Forever', span: 'No Hidden Costs' },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="stats-bar-divider"></div>
            ) : (
              <div key={i} className="stats-bar-item">
                <i className={`fas ${item.icon}`}></i>
                <strong>{item.strong}</strong>
                <span>{item.span}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-label">WHAT YOU GET</div>
          <h2 className="section-title">Everything You Need to <span className="yellow-text">Score High</span></h2>
          <p className="section-subtitle">Built from the ground up for JAMB success — every feature designed to match how UTME is structured.</p>
          <div className="features-split">
            <div className="features-image-col">
              <img src="/images/image (13).jpg" alt="Student studying with EduLab ExamPrep" className="features-photo" />
              <div className="features-photo-badge">
                <i className="fas fa-check-circle"></i>
                <span>Learn → Practice → Excel</span>
              </div>
            </div>
            <div className="features-list-col">
              {[
                { icon: 'fa-route', bg: '#FFF9E6', color: '#D97706', title: 'Guided Learning', desc: 'Learn each objective step-by-step with clear explanations, then immediately practise JAMB-style questions on the same concept.' },
                { icon: 'fa-calendar-alt', bg: '#EFF6FF', color: '#1D4ED8', title: 'Year-by-Year Practice', desc: 'Drill specific exam years from 2010–2024. Understand trends, recurring topics, and exactly what JAMB tests.' },
                { icon: 'fa-laptop-code', bg: '#F0FDF4', color: '#15803D', title: 'Full CBT Simulation', desc: '160 questions across 4 subjects, 3-hour countdown timer, question flagging, and instant score analysis — just like the real UTME.' },
                { icon: 'fa-chart-bar', bg: '#FDF4FF', color: '#7C3AED', title: 'Performance Analytics', desc: 'Track accuracy by topic, spot weak areas, and monitor your score trajectory over time with visual dashboards.' },
                { icon: 'fa-fire-alt', bg: '#FFF1F2', color: '#BE123C', title: 'Streaks & Progress Tracking', desc: 'Build daily study habits. Your streak keeps you consistent — missing a day resets it, so stay on top of your game.' },
              ].map((f, i) => (
                <div key={i} className="feature-row">
                  <div className="feature-row-icon" style={{ background: f.bg, color: f.color }}>
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <div><h3>{f.title}</h3><p>{f.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="container">
          <div className="section-label">THE PROCESS</div>
          <h2 className="section-title">Study Smarter in <span className="yellow-text">3 Steps</span></h2>
          <div className="how-steps">
            {[
              { img: '/images/image (14).jpg', n: 1, title: 'Choose a Subject & Topic', desc: 'Pick any of the 10 JAMB subjects. Browse topics aligned to the official JAMB syllabus.' },
              null,
              { img: '/images/image (15).jpg', n: 2, title: 'Learn, Then Practise', desc: 'Read the explanation for each objective, then answer a JAMB-style question before moving on.' },
              null,
              { img: '/images/image (16).jpg', n: 3, title: 'Simulate & Score', desc: 'Take a full CBT simulation or year practice. Review your results and improve your weaknesses.' },
            ].map((s, i) =>
              s === null ? (
                <div key={i} className="how-arrow"><i className="fas fa-chevron-right"></i></div>
              ) : (
                <div key={i} className="how-step">
                  <div className="how-step-img">
                    <img src={s.img} alt={s.title} />
                    <div className="step-number">{s.n}</div>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Points System */}
      <section id="points" className="points-section">
        <div className="container">
          <div className="points-inner">
            <div className="points-text-col">
              <div className="section-label light">GAMIFICATION</div>
              <h2 className="section-title light">Earn Points as You <span className="yellow-text">Study</span></h2>
              <p className="section-subtitle light">EduLab ExamPrep rewards every step of your learning journey. The more you study and the better you perform, the more points you earn.</p>
              <div className="points-table">
                <div className="points-row header-row"><span>Activity</span><span>Points</span></div>
                {[
                  { icon: 'fa-book-open', color: '#F59E0B', label: 'Complete a learning objective', pts: '+10 pts', cls: 'yellow' },
                  { icon: 'fa-check-circle', color: '#10B981', label: 'Answer a practice question correctly', pts: '+5 pts bonus', cls: 'green' },
                  { icon: 'fa-layer-group', color: '#3B82F6', label: 'Complete a full subtopic', pts: '+25 pts', cls: 'blue' },
                  { icon: 'fa-flag-checkered', color: '#8B5CF6', label: 'Finish an entire topic', pts: '+50 pts', cls: 'purple' },
                  { icon: 'fa-fire', color: '#EF4444', label: 'Score 80%+ on topic completion', pts: '+30 pts bonus', cls: 'red' },
                  { icon: 'fa-medal', color: '#F59E0B', label: 'Score 60–79% on topic completion', pts: '+15 pts bonus', cls: 'yellow' },
                ].map((r, i) => (
                  <div key={i} className="points-row">
                    <div className="points-activity">
                      <i className={`fas ${r.icon}`} style={{ color: r.color }}></i>
                      <span>{r.label}</span>
                    </div>
                    <div className={`points-badge-pill ${r.cls}`}>{r.pts}</div>
                  </div>
                ))}
              </div>
              <div className="points-tip">
                <i className="fas fa-lightbulb"></i>
                <p><strong>Pro tip:</strong> A student who completes a full topic with 80%+ accuracy earns up to <strong>130+ points</strong> in a single session!</p>
              </div>
            </div>
            <div className="points-visual-col">
              <div className="points-card-display">
                <div className="points-card-top">
                  <img src="/images/image (12).jpg" alt="Student earning points" className="points-photo" />
                  <div className="points-overlay">
                    <div className="points-score-badge"><i className="fas fa-star"></i><span>+130 pts</span></div>
                  </div>
                </div>
                <div className="points-card-body">
                  <h4>Why does this matter?</h4>
                  <p>Points reflect your commitment and mastery. They help you track how much you've covered — and remind you to keep going when motivation dips.</p>
                  <div className="points-badges-row">
                    <div className="point-badge-chip"><i className="fas fa-star"></i> Motivated Learner</div>
                    <div className="point-badge-chip"><i className="fas fa-brain"></i> Topic Master</div>
                    <div className="point-badge-chip"><i className="fas fa-fire"></i> On a Roll</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="about-section-new">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-col">
              <div className="about-image-wrapper">
                <img src="/images/image (12).jpg" alt="Students using EduLab ExamPrep" className="about-photo" />
                <div className="about-photo-card">
                  <div className="about-card-icon"><i className="fas fa-trophy"></i></div>
                  <div><strong>Built for JAMB</strong><span>Nigeria's UTME preparation platform</span></div>
                </div>
              </div>
            </div>
            <div className="about-text-col">
              <div className="section-label">ABOUT EDULAB EXAMPREP</div>
              <h2 className="section-title">Why Thousands of Students <span className="yellow-text">Choose Us</span></h2>
              <p className="about-para">EduLab ExamPrep is Nigeria's most comprehensive JAMB preparation platform, built specifically for students who want to excel in the UTME examination.</p>
              <div className="about-features-list">
                {[
                  { icon: 'fa-database', title: 'Authentic Past Questions', desc: '4,115+ questions verified from official JAMB papers from 2010 to 2024' },
                  { icon: 'fa-brain', title: 'Structured Learning', desc: 'Every topic has clear explanations, worked examples, and instant feedback' },
                  { icon: 'fa-mobile-alt', title: 'Mobile-First Design', desc: 'Study anywhere, anytime — optimised for phones, tablets, and computers' },
                  { icon: 'fa-gift', title: 'Completely Free', desc: 'No subscriptions, no paywalls — every feature is available to every student at no cost' },
                ].map((f, i) => (
                  <div key={i} className="about-feature-item">
                    <div className="about-feature-icon"><i className={`fas ${f.icon}`}></i></div>
                    <div><strong>{f.title}</strong><p>{f.desc}</p></div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
                <i className="fas fa-user-plus"></i> Create Free Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-bg" style={{ backgroundImage: "url('/images/image (16).jpg')" }}></div>
        <div className="cta-overlay"></div>
        <div className="container cta-inner">
          <h2>Ready to Start Your JAMB Prep?</h2>
          <p>Join now and get access to 4,115+ questions, explanations, and full CBT simulations — all free.</p>
          <div className="cta-btns">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              <i className="fas fa-rocket"></i> Get Started Now — It's Free
            </button>
            <button className="btn btn-hero-ghost btn-lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              <i className="fas fa-play-circle"></i> See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section footer-brand">
              <div className="logo"><img src="/images/edulab-icon.png" alt="EduLab ExamPrep logo" className="brand-logo" /><span>EduLab ExamPrep</span></div>
              <p>Nigeria's most comprehensive JAMB preparation platform. Study smarter, score higher.</p>
              <div className="footer-social">
                <a href="#" title="Twitter/X"><i className="fab fa-x-twitter"></i></a>
                <a href="#" title="Instagram"><i className="fab fa-instagram"></i></a>
                <a href="#" title="WhatsApp"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#points">Points System</a>
              <a href="#about">About</a>
            </div>
            <div className="footer-section">
              <h4>Study</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Guided Learning</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Year Practice</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>CBT Simulation</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Analytics</a>
            </div>
            <div className="footer-section">
              <h4>Account</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Create Account</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 EduLab ExamPrep. All rights reserved. Built for Nigerian students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
