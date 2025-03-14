import React, { useState, useEffect } from 'react';
import data from '../data/bones.json';

const Quiz = ({ playerName, difficulty, onEnd }) => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [options, setOptions] = useState([]);
  const [answered, setAnswered] = useState(false);

  const difficultySettings = {
    facile: { numberOfQuestions: 10, timerDuration: null },
    normal: { numberOfQuestions: 10, timerDuration: 20 },
    difficile: { numberOfQuestions: 20, timerDuration: 10 },
    expert: { numberOfQuestions: 30, timerDuration: 5 },
  };

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, settings.numberOfQuestions);
    setShuffledQuestions(shuffled);
    setTimer(settings.timerDuration);
  }, [difficulty]);

  const question = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    if (question) {
      const otherOptions = data.filter((bone) => bone.name !== question.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((bone) => bone.name);
      setOptions([...otherOptions, question.name].sort(() => Math.random() - 0.5));
    }
  }, [question]);

  useEffect(() => {
    if (timer === null) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timer === 0) {
      handleNextQuestion(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (answer) => {
    if (answered) return;
    setAnswered(true);

    if (answer === question.name) {
      setScore((prevScore) => prevScore + 1);
    }
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswered(false);
      setTimer(difficultySettings[difficulty].timerDuration);
    } else {
      onEnd(); // Appelle la fonction de fin
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen text-white flex flex-col items-center justify-center">
      <div className="w-11/12 max-w-3xl text-center">
        {question && (
          <>
            <h1 className="text-3xl font-bold mb-6">Quel est cet os ?</h1>
            <img
              src={question.image}
              alt="Os à identifier"
              className="w-1/2 mx-auto mb-6 rounded-lg shadow-lg"
            />
            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-6 text-lg">Score : {score}/{shuffledQuestions.length}</p>
            {timer !== null && <p className="text-sm mt-2">Temps restant : {timer} secondes</p>}

            {/* Bouton Quitter */}
            <button
              onClick={onEnd}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Quitter
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
