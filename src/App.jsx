import React, { useState } from 'react';
import Quiz from './components/Quizz'; // Assure-toi du bon chemin
import quizImage from './assets/quiz-intro.png'; // Ton image PNG

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const startQuiz = () => {
    if (!playerName.trim() || !difficulty) {
      alert('Veuillez entrer un nom et choisir une difficulté.');
      return;
    }
    setIsPlaying(true);
  };

  return (
    <div className="relative bg-gray-100 min-h-screen flex flex-col items-center justify-center px-4">
  {!isPlaying ? (
    <>
      {/* Conteneur global */}
      <div className="relative w-full flex flex-col items-center max-w-screen-md">
        {/* Conteneur image + texte */}
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
          {/* Image */}
          <img
            src={quizImage}
            alt="Quiz sur les os humains"
            className="w-full rounded-lg"
          />
          {/* Texte superposé */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">
              Bienvenue au Quiz sur les os humains
            </h1>
          </div>
        </div>

        {/* Contenu en dessous */}
        <div className="relative z-10 text-center mt-6">
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 mb-4 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-4">
            Choisissez un niveau de difficulté :
          </h2>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 mb-6 w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Sélectionnez --</option>
            <option value="facile">Facile</option>
            <option value="normal">Normal</option>
            <option value="difficile">Difficile</option>
            <option value="expert">Expert</option>
          </select>
          <button
            onClick={startQuiz}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 w-full max-w-sm"
          >
            Commencer le quiz
          </button>
        </div>
      </div>
    </>
  ) : (
    <Quiz playerName={playerName} difficulty={difficulty} onEnd={() => setIsPlaying(false)} />
  )}
</div>

  );
};

export default App;
