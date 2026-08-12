import { useState, useEffect, useRef } from 'react';

// ─── Static data outside component (never recreated on re-render) ───
const CLONE_COUNT = 5;

const THEMES = [
  { id: 'light',   name: 'Light',   heading: 'Light',   desc: 'Clean, crisp, and easy on the eyes.',    btnText: 'Explore', previewClass: 'light-preview'   },
  { id: 'dark',    name: 'Dark',    heading: 'Dark',    desc: 'Deep, comfortable, and modern.',          btnText: 'Explore', previewClass: 'dark-preview'    },
  { id: 'space',   name: 'Space',   heading: 'Space',   desc: 'Pure black, infinite, and contrasty.',    btnText: 'Explore', previewClass: 'space-preview'   },
  { id: 'forest',  name: 'Forest',  heading: 'Forest',  desc: 'Calm, natural, and grounded.',            btnText: 'Explore', previewClass: 'forest-preview'  },
  { id: 'ocean',   name: 'Ocean',   heading: 'Ocean',   desc: 'Deep, calm, and refreshing.',             btnText: 'Explore', previewClass: 'ocean-preview'   },
  { id: 'fire',    name: 'Fire',    heading: 'Fire',    desc: 'Bold, warm, and full of energy.',         btnText: 'Explore', previewClass: 'fire-preview'    },
  { id: 'sakura',  name: 'Rose',    heading: 'Rose',    desc: 'Soft, elegant, and playful.',             btnText: 'Explore', previewClass: 'sakura-preview'  },
  { id: 'grape',   name: 'Grape',   heading: 'Grape',   desc: 'Mysterious, rich, and creative.',         btnText: 'Explore', previewClass: 'grape-preview'   },
  { id: 'ice',     name: 'Ice',     heading: 'Ice',     desc: 'Cool, clean, and crystalline.',           btnText: 'Explore', previewClass: 'ice-preview'     },
  { id: 'volcano', name: 'Volcano', heading: 'Volcano', desc: 'Intense, raw, and high contrast.',        btnText: 'Explore', previewClass: 'volcano-preview' },
  { id: 'desert',  name: 'Desert',  heading: 'Desert',  desc: 'Warm, textured, and organic.',            btnText: 'Explore', previewClass: 'desert-preview'  },
  { id: 'gold',    name: 'Gold',    heading: 'Gold',    desc: 'Luxury, refined, and prestigious.',       btnText: 'Explore', previewClass: 'gold-preview'    },
  { id: 'moon',    name: 'Moon',    heading: 'Moon',    desc: 'Sleek, metallic, and reflective.',        btnText: 'Explore', previewClass: 'moon-preview'    },
];

const LEN = THEMES.length;

function getInitialIndex() {
  const saved = localStorage.getItem('theme') || 'light';
  const idx = THEMES.findIndex(t => t.id === saved);
  return idx !== -1 ? idx : 0;
}

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Simple clamped index — stops at 0 and LEN-1, no looping
  const [focusedIndex, setFocusedIndex] = useState(getInitialIndex);
  const focusedTheme = THEMES[focusedIndex];

  const carouselRef = useRef(null);
  const dragStart   = useRef(null);
  const lastWheel   = useRef(0);
  const DRAG_THRESHOLD = 50;

  // Apply theme class to <body>/<html>
  useEffect(() => {
    const classes = THEMES.map(t => t.id + '-theme');
    document.body.classList.remove(...classes);
    document.documentElement.classList.remove(...classes);
    document.body.classList.add(theme + '-theme');
    document.documentElement.classList.add(theme + '-theme');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Non-passive wheel listener
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || currentPage !== 'settings') return;
    const onWheel = (e) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current < 400) return;
      if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
        lastWheel.current = now;
        const delta = (e.deltaY > 0 || e.deltaX > 0) ? 1 : -1;
        setFocusedIndex(prev => Math.max(0, Math.min(LEN - 1, prev + delta)));
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [currentPage]);

  const toggleMenu      = () => setIsMenuOpen(p => !p);
  const handleLinkClick = (page) => { setCurrentPage(page); setIsMenuOpen(false); };
  const handlePrev      = () => setFocusedIndex(prev => Math.max(0, prev - 1));
  const handleNext      = () => setFocusedIndex(prev => Math.min(LEN - 1, prev + 1));

  // Touch / mouse drag
  const onTouchStart = (e) => { dragStart.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > DRAG_THRESHOLD) diff > 0 ? handleNext() : handlePrev();
    dragStart.current = null;
  };
  const onMouseDown = (e) => { dragStart.current = e.clientX; };
  const onMouseUp   = (e) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.clientX;
    if (Math.abs(diff) > DRAG_THRESHOLD) diff > 0 ? handleNext() : handlePrev();
    dragStart.current = null;
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">Hero Harshit</div>
        {currentPage === 'home' ? (
          <>
            <button
              className={`hamburger ${isMenuOpen ? 'active' : ''}`}
              id="hamburger"
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="nav-links">
              <button onClick={() => handleLinkClick('settings')}>Settings</button>
            </div>
          </>
        ) : (
          <button className="back-btn" onClick={() => setCurrentPage('home')}>
            ← Back
          </button>
        )}
      </nav>

      {currentPage === 'home' && (
        <main style={{ marginTop: '7rem', padding: '2rem', textAlign: 'center' }}>
        </main>
      )}

      {currentPage === 'settings' && (
        <main className="settings-container">
          <h1 className="settings-title">Settings</h1>

          <div className="settings-card">

            <div className="setting-info" style={{ marginBottom: '1.5rem' }}>
              <h3>Theme</h3>
              <p>Choose your preferred interface theme</p>
            </div>

            {/* ── Carousel ── */}
            <div
              ref={carouselRef}
              className="carousel-container"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              style={{ cursor: 'grab' }}
            >
              <button className="carousel-arrow carousel-arrow-left" onClick={handlePrev} aria-label="Previous theme">
                ‹
              </button>

              <div className="carousel-viewport">
                <div
                  className="carousel-track-fluid"
                  style={{
                    transform: `translateX(calc(-${focusedIndex} * var(--card-step) + var(--track-offset)))`,
                  }}
                >
                  {THEMES.map((t, i) => {
                    const offset     = i - focusedIndex;
                    const isCenter   = offset === 0;
                    const isAdjacent = Math.abs(offset) === 1;
                    const isNear     = Math.abs(offset) === 2;

                    let cardClass = 'fluid-card';
                    if (isCenter)        cardClass += ' fluid-card--center';
                    else if (isAdjacent) cardClass += ' fluid-card--adjacent';
                    else if (isNear)     cardClass += ' fluid-card--near';
                    else                 cardClass += ' fluid-card--far';

                    return (
                      <div
                        key={t.id}
                        className={cardClass}
                        onClick={() => { if (!isCenter) setFocusedIndex(i); }}
                      >
                        <div className={`theme-preview ${t.previewClass}`}>
                          <div className="preview-heading">{t.heading}</div>
                          <p className="preview-desc">{t.desc}</p>
                          <button className="preview-button">{t.btnText}</button>
                          {theme === t.id && (
                            <div className="selected-badge">✓ Selected</div>
                          )}
                        </div>
                        <span className={`theme-name${isCenter ? ' font-bold' : ''}`}>
                          {t.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button className="carousel-arrow carousel-arrow-right" onClick={handleNext} aria-label="Next theme">
                ›
              </button>
            </div>

            {/* Dot indicators */}
            <div className="carousel-dots">
              {THEMES.map((t, i) => (
                <button
                  key={t.id}
                  className={`carousel-dot${i === focusedIndex ? ' active' : ''}`}
                  onClick={() => setFocusedIndex(i)}
                  aria-label={`Select ${t.name} theme`}
                />
              ))}
            </div>

            {/* Focused theme info & apply button */}
            <div className="focused-details">
              <span className="selected-status-label">
                {theme === focusedTheme.id ? '✓ Currently Active' : 'Previewing'}
              </span>
              <h2 className="focused-theme-name">{focusedTheme.name}</h2>
              <p className="focused-theme-desc">"{focusedTheme.desc}"</p>

              <button
                className={`use-theme-btn ${theme === focusedTheme.id ? 'selected' : ''}`}
                onClick={() => setTheme(focusedTheme.id)}
                disabled={theme === focusedTheme.id}
              >
                {theme === focusedTheme.id ? 'Selected' : `Use ${focusedTheme.name}`}
              </button>
            </div>

          </div>
        </main>
      )}
    </>
  );
}

export default App;
