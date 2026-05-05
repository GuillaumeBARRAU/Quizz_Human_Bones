import React, { useState, useEffect } from 'react';
import Quiz from './components/Quizz';
import quizImage from './assets/quiz-intro.png';

/* ── Particules flottantes (bougies / os) ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  symbol: ['🕯️','💀','🦴','✦','·','∴'][i % 6],
  left: `${5 + (i * 17) % 90}%`,
  delay: `${(i * 0.7) % 6}s`,
  duration: `${8 + (i * 1.3) % 8}s`,
  size: `${0.7 + (i % 3) * 0.4}rem`,
}));

const difficultyMeta = {
  facile:    { label: 'Facile',    sub: '10 questions · Sans limite de temps',  color: '#4ade80' },
  normal:    { label: 'Normal',    sub: '10 questions · 20 s par question',     color: '#facc15' },
  difficile: { label: 'Difficile', sub: '20 questions · 10 s par question',     color: '#f97316' },
  expert:    { label: 'Expert',    sub: '30 questions · 5 s par question',      color: '#ef4444' },
};

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPlaying, setIsPlaying]   = useState(false);
  const [revealed, setRevealed]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  const startQuiz = () => {
    if (!playerName.trim() || !difficulty) {
      alert('Veuillez entrer un nom et choisir un niveau.');
      return;
    }
    setIsPlaying(true);
  };

  if (isPlaying) {
    return <Quiz playerName={playerName} difficulty={difficulty} onEnd={() => setIsPlaying(false)} />;
  }

  const chosen = difficultyMeta[difficulty];

  return (
    <>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&display=swap');

        :root {
          --bone:    #d4c5a9;
          --amber:   #c8860a;
          --ember:   #ff6b1a;
          --dark:    #0d0b08;
          --surface: #1a1510;
          --card:    #211c15;
          --border:  #4a3c28;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: var(--dark); }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%, #3d2a0a33 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, #1a0d0022 0%, transparent 60%),
            var(--dark);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Cinzel', serif;
          color: var(--bone);
          position: relative;
          overflow: hidden;
        }

        /* grain overlay */
        .page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0;
        }

        /* ── Particules ── */
        .particle {
          position: fixed;
          animation: floatUp linear infinite;
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          user-select: none;
        }
        @keyframes floatUp {
          0%   { transform: translateY(110vh) rotate(0deg);   opacity: 0; }
          10%  { opacity: 0.35; }
          90%  { opacity: 0.15; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* ── Card principale ── */
        .card {
          position: relative; z-index: 2;
          width: 100%; max-width: 480px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 2px;
          box-shadow:
            0 0 0 1px #0006,
            0 0 40px #c8860a18,
            0 20px 60px #00000090;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .card.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* coin ornements */
        .card::before, .card::after {
          content: '✦';
          position: absolute;
          color: var(--amber);
          font-size: 1.1rem;
          opacity: 0.6;
        }
        .card::before { top: 10px; left: 14px; }
        .card::after  { bottom: 10px; right: 14px; }

        /* ── Image hero ── */
        .hero {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
        }
        .hero img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          filter: sepia(20%) contrast(1.05);
        }
        /* vignette sur l'image */
        .hero::after {
          content: '';
          position: absolute; inset: 0;
          background:
            linear-gradient(to bottom, transparent 50%, var(--card) 100%),
            linear-gradient(to right,  #00000040 0%, transparent 30%, transparent 70%, #00000040 100%);
        }
        /* titre sur l'image */
        .hero-title {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 2;
          text-align: center;
          padding: 1.5rem 1rem 1rem;
          font-family: 'Cinzel Decorative', serif;
          font-size: clamp(1rem, 3.5vw, 1.35rem);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 20px #c8860a, 0 2px 8px #000;
          letter-spacing: 0.04em;
          line-height: 1.3;
        }

        /* ── Séparateur ── */
        .divider {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0 1.5rem;
          margin: 1.25rem 0 1rem;
          color: var(--amber);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, var(--amber), transparent);
        }

        /* ── Formulaire ── */
        .form-area {
          padding: 0 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 0.35rem;
          opacity: 0.85;
        }

        .input-field {
          width: 100%;
          background: #15110d;
          border: 1px solid var(--border);
          border-radius: 2px;
          color: var(--bone);
          font-family: 'IM Fell English', serif;
          font-size: 1rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .input-field::placeholder { color: #6b5840; font-style: italic; }
        .input-field:focus {
          border-color: var(--amber);
          box-shadow: 0 0 0 2px #c8860a22;
        }

        /* ── Sélection de difficulté ── */
        .diff-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .diff-btn {
          background: #15110d;
          border: 1px solid var(--border);
          border-radius: 2px;
          color: #a89070;
          font-family: 'Cinzel', serif;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          padding: 0.6rem 0.5rem 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
          line-height: 1.4;
        }
        .diff-btn:hover {
          border-color: var(--amber);
          color: var(--bone);
          background: #1f180f;
        }
        .diff-btn.active {
          border-color: var(--ember);
          color: #fff;
          background: #221508;
          box-shadow: 0 0 12px #ff6b1a30;
        }
        .diff-btn .diff-label { font-weight: 600; display: block; }
        .diff-btn .diff-sub {
          font-size: 0.62rem;
          opacity: 1;
          color: #c8a87a;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          display: block;
          margin-top: 3px;
        }
        .diff-btn.active .diff-sub { color: #e8c89a; }

        /* indicateur couleur difficulté */
        .diff-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          margin-right: 5px;
          vertical-align: middle;
          margin-bottom: 1px;
        }

        /* ── Bouton CTA ── */
        .cta {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, #8a5c0a 0%, #c8860a 50%, #8a5c0a 100%);
          background-size: 200% 100%;
          border: none;
          border-radius: 2px;
          color: #0d0b08;
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.9rem 1.5rem;
          cursor: pointer;
          overflow: hidden;
          transition: background-position 0.4s, transform 0.15s, box-shadow 0.3s;
          box-shadow: 0 4px 20px #c8860a40;
          margin-top: 0.25rem;
        }
        .cta:hover {
          background-position: 100% 0;
          box-shadow: 0 6px 30px #c8860a60;
          transform: translateY(-1px);
        }
        .cta:active { transform: translateY(0); }
        /* shimmer */
        .cta::after {
          content: '';
          position: absolute;
          top: -50%; left: -60%;
          width: 40%; height: 200%;
          background: linear-gradient(105deg, transparent 40%, #ffffff30 50%, transparent 60%);
          transform: skewX(-20deg);
          animation: shimmer 3s infinite 1.5s;
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 160%; }
        }

        /* ── Footer ── */
        .footer-note {
          margin-top: 1.25rem;
          font-family: 'IM Fell English', serif;
          font-style: italic;
          font-size: 0.72rem;
          color: #5a4a35;
          text-align: center;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="page">

        {/* Particules flottantes */}
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              bottom: '-10vh',
              fontSize: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          >
            {p.symbol}
          </span>
        ))}

        {/* Card principale */}
        <div className={`card ${revealed ? 'revealed' : ''}`}>

          {/* Hero image */}
          <div className="hero">
            <img src={quizImage} alt="Squelette aux chandelles" />
            <div className="hero-title">
              Ostéologie<br />
              <span style={{ fontSize: '0.75em', opacity: 0.85, fontWeight: 400 }}>
                Le Cabinet des Os
              </span>
            </div>
          </div>

          <div className="divider">✦ &nbsp; Identification &nbsp; ✦</div>

          {/* Formulaire */}
          <div className="form-area">

            {/* Nom */}
            <div>
              <label htmlFor="playerName">Votre nom</label>
              <input
                id="playerName"
                type="text"
                className="input-field"
                placeholder="Anatomiste en herbe…"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startQuiz()}
              />
            </div>

            {/* Difficulté */}
            <div>
              <label>Niveau d'épreuve</label>
              <div className="diff-grid">
                {Object.entries(difficultyMeta).map(([key, meta]) => (
                  <button
                    key={key}
                    className={`diff-btn ${difficulty === key ? 'active' : ''}`}
                    onClick={() => setDifficulty(key)}
                  >
                    <span className="diff-label">
                      <span
                        className="diff-dot"
                        style={{ background: meta.color }}
                      />
                      {meta.label}
                    </span>
                    <span className="diff-sub">{meta.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button className="cta" onClick={startQuiz}>
              ☽ &nbsp; Commencer l'épreuve &nbsp; ☾
            </button>
          </div>
        </div>

        {/* Note de bas de page */}
        <p className="footer-note">
          « Connais-toi toi-même, os par os. »
        </p>
      </div>
    </>
  );
};

export default App;