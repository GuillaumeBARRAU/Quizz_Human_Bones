import React, { useState, useEffect, useRef, useCallback } from 'react';
import data from '../data/bones.json';
import EndGameModal from './EndGameModal';

const FEEDBACK_DELAY = 1200; // ms avant passage à la question suivante

const difficultySettings = {
  facile:    { numberOfQuestions: 10, timerDuration: null },
  normal:    { numberOfQuestions: 10, timerDuration: 20 },
  difficile: { numberOfQuestions: 20, timerDuration: 10 },
  expert:    { numberOfQuestions: 30, timerDuration: 5 },
};

// ─────────────────────────────────────────────
// Écran des statistiques détaillées
// ─────────────────────────────────────────────
const StatsScreen = ({ history, playerName, onRestart, onEnd }) => {
  const correct = history.filter((h) => h.wasCorrect).length;
  const total   = history.length;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-1">Statistiques</h2>
        <p className="text-center text-gray-400 mb-6">
          {playerName} — {correct}/{total} correctes
        </p>

        <div className="space-y-3 mb-8 max-h-[60vh] overflow-y-auto pr-1">
          {history.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-lg px-4 py-3 ${
                item.wasCorrect
                  ? 'bg-green-900/50 border border-green-700'
                  : 'bg-red-900/40 border border-red-700'
              }`}
            >
              <img
                src={item.image}
                alt={item.correctAnswer}
                className="w-14 h-14 object-contain rounded bg-white/10 p-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{item.correctAnswer}</p>
                {!item.wasCorrect && item.givenAnswer !== '__timeout__' && (
                  <p className="text-sm text-red-300">Ta réponse : {item.givenAnswer}</p>
                )}
                {item.givenAnswer === '__timeout__' && (
                  <p className="text-sm text-yellow-300">⏰ Temps écoulé</p>
                )}
              </div>
              <span className="text-xl flex-shrink-0">{item.wasCorrect ? '✅' : '❌'}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-500 font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Nouvelle Partie
          </button>
          <button
            onClick={onEnd}
            className="bg-gray-600 hover:bg-gray-500 font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Accueil
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Composant principal Quiz
// ─────────────────────────────────────────────
const Quiz = ({ playerName, difficulty, onEnd }) => {
  const settings = difficultySettings[difficulty];

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex]           = useState(0);
  const [options, setOptions]                     = useState([]);
  const [score, setScore]                         = useState(0);
  const [timeLeft, setTimeLeft]                   = useState(settings.timerDuration);
  const [selectedAnswer, setSelectedAnswer]       = useState(null);
  const [isAnswered, setIsAnswered]               = useState(false);
  const [history, setHistory]                     = useState([]); // détail de chaque réponse
  const [isFinished, setIsFinished]               = useState(false);
  const [showStats, setShowStats]                 = useState(false);

  const timerRef    = useRef(null);
  const feedbackRef = useRef(null);

  // ── Init questions ──────────────────────────
  useEffect(() => {
    const shuffled = [...data]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfQuestions);
    setShuffledQuestions(shuffled);
  }, []);

  // ── Génère les options à chaque nouvelle question ──
  useEffect(() => {
    if (!shuffledQuestions.length) return;
    const question = shuffledQuestions[currentIndex];
    const distractors = data
      .filter((b) => b.name !== question.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((b) => b.name);
    setOptions([...distractors, question.name].sort(() => Math.random() - 0.5));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(settings.timerDuration);
  }, [currentIndex, shuffledQuestions]);

  // ── Passage à la question suivante ──────────
  const goToNext = useCallback(() => {
    clearTimeout(feedbackRef.current);
    clearInterval(timerRef.current);
    if (currentIndex + 1 >= shuffledQuestions.length) {
      setIsFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, shuffledQuestions.length]);

  // ── Enregistre la réponse dans l'historique ──
  const recordAnswer = useCallback(
    (given, isCorrect) => {
      const question = shuffledQuestions[currentIndex];
      setHistory((prev) => [
        ...prev,
        {
          image:         question.image,
          correctAnswer: question.name,
          givenAnswer:   given,
          wasCorrect:    isCorrect,
        },
      ]);
    },
    [currentIndex, shuffledQuestions]
  );

  // ── Timeout (timer atteint 0) ────────────────
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer('__timeout__');
    recordAnswer('__timeout__', false);
    feedbackRef.current = setTimeout(goToNext, FEEDBACK_DELAY);
  }, [isAnswered, goToNext, recordAnswer]);

  // ── Timer stable ─────────────────────────────
  useEffect(() => {
    if (settings.timerDuration === null || isAnswered || !shuffledQuestions.length) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isAnswered, shuffledQuestions]);

  // ── Clic sur une réponse ─────────────────────
  const handleAnswer = (option) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    const isCorrect = option === shuffledQuestions[currentIndex].name;
    setIsAnswered(true);
    setSelectedAnswer(option);
    if (isCorrect) setScore((s) => s + 1);
    recordAnswer(option, isCorrect);
    feedbackRef.current = setTimeout(goToNext, FEEDBACK_DELAY);
  };

  // ── Restart depuis l'intérieur du Quiz ───────
  const handleRestart = () => {
    const shuffled = [...data]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.numberOfQuestions);
    setShuffledQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setHistory([]);
    setIsFinished(false);
    setShowStats(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(settings.timerDuration);
  };

  // ── Couleur des boutons ──────────────────────
  const getButtonClass = (option) => {
    const base =
      'font-bold py-4 px-6 rounded-lg shadow-md transition-all duration-300 text-white border-2 ';
    if (!isAnswered) {
      return base + 'bg-blue-700 border-blue-700 hover:bg-blue-500 hover:border-blue-500 cursor-pointer';
    }
    const correctName = shuffledQuestions[currentIndex]?.name;
    if (option === correctName)
      return base + 'bg-green-600 border-green-400 scale-105';
    if (option === selectedAnswer && option !== correctName)
      return base + 'bg-red-600 border-red-400';
    return base + 'bg-gray-700 border-gray-600 opacity-50';
  };

  // ── Barre timer ──────────────────────────────
  const timerPercent =
    settings.timerDuration && timeLeft !== null
      ? (timeLeft / settings.timerDuration) * 100
      : null;
  const timerColor =
    timerPercent > 50 ? 'bg-green-500' :
    timerPercent > 25 ? 'bg-yellow-400' :
    'bg-red-500';

  // ────────────────────────────────────────────
  // Rendu : écran stats
  // ────────────────────────────────────────────
  if (showStats) {
    return (
      <StatsScreen
        history={history}
        playerName={playerName}
        onRestart={handleRestart}
        onEnd={onEnd}
      />
    );
  }

  // ────────────────────────────────────────────
  // Rendu : modal de fin (par-dessus le fond)
  // ────────────────────────────────────────────
  if (isFinished) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex items-center justify-center">
        <EndGameModal
          finalScore={score}
          totalQuestions={shuffledQuestions.length}
          onRestart={handleRestart}
          onViewStats={() => setShowStats(true)}
          onEnd={onEnd}
        />
      </div>
    );
  }

  // ────────────────────────────────────────────
  // Rendu : chargement
  // ────────────────────────────────────────────
  if (!shuffledQuestions.length) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        Chargement...
      </div>
    );
  }

  const question = shuffledQuestions[currentIndex];

  // ────────────────────────────────────────────
  // Rendu : question en cours
  // ────────────────────────────────────────────
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">

        {/* Progression globale + score */}
        <div className="flex items-center justify-between mb-2 text-sm text-gray-400">
          <span>
            Question <strong className="text-white">{currentIndex + 1}</strong>{' '}
            / {shuffledQuestions.length}
          </span>
          <span>
            {playerName} · Score :{' '}
            <strong className="text-blue-400">{score}</strong>
          </span>
        </div>

        {/* Barre de progression globale */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${(currentIndex / shuffledQuestions.length) * 100}%` }}
          />
        </div>

        {/* Barre timer */}
        {timerPercent !== null && (
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${timerColor}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Question */}
        <h1 className="text-2xl font-bold text-center mb-6">Quel est cet os ?</h1>

        {/* Image */}
        <div className="flex justify-center mb-8">
          <img
            src={question.image}
            alt="Os à identifier"
            className="max-h-64 object-contain rounded-xl shadow-2xl bg-white/5 p-2"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
              className={getButtonClass(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Feedback texte */}
        {isAnswered && selectedAnswer !== '__timeout__' && (
          <p
            className={`text-center text-lg font-semibold ${
              selectedAnswer === question.name ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {selectedAnswer === question.name
              ? '✅ Bonne réponse !'
              : `❌ C'était : ${question.name}`}
          </p>
        )}
        {isAnswered && selectedAnswer === '__timeout__' && (
          <p className="text-center text-lg font-semibold text-yellow-400">
            ⏰ Temps écoulé ! C'était : {question.name}
          </p>
        )}

        {/* Quitter */}
        <div className="text-center mt-6">
          <button
            onClick={onEnd}
            className="text-gray-500 hover:text-red-400 text-sm underline transition duration-200"
          >
            Quitter le quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;