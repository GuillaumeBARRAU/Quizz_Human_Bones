import React from 'react';

const EndGameModal = ({ finalScore, totalQuestions, onRestart, onViewStats, onEnd }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 w-11/12 max-w-md text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Quiz Terminé !</h2>
        <p className="text-lg font-semibold text-center mb-6">
          Votre score : {finalScore}/{totalQuestions}
        </p>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={onRestart}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
          >
            Nouvelle Partie
          </button>
          <button
            onClick={onViewStats}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
          >
            Voir les Statistiques
          </button>
          <button
            onClick={onEnd}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
          >
            Fin
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndGameModal;
