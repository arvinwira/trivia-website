import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Helper function to decode HTML entities from the API response
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// Custom Hook for confetti effect
const useConfetti = () => {
  const [isConfettiActive, setConfettiActive] = useState(false);

  const startConfetti = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 4000); // Stop after 4 seconds
  };

  const Confetti = () => {
    if (!isConfettiActive) return null;

    const confettiPieces = useMemo(() => {
      const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'];
      return Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
      }));
    }, []);

    return (
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-50 pointer-events-none">
        {confettiPieces.map(piece => (
          <div
            key={piece.id}
            className="absolute w-2 h-4"
            style={{
              backgroundColor: piece.color,
              left: piece.left,
              animation: `fall ${piece.animationDuration} linear ${piece.animationDelay} infinite`,
            }}
          ></div>
        ))}
      </div>
    );
  };

  return { Confetti, startConfetti };
};


// Main App Component
export default function App() {
  // State variables to manage the game
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { Confetti, startConfetti } = useConfetti();

  // Fetches trivia questions from the Open Trivia Database API
  const fetchTriviaQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();
      // Combine correct and incorrect answers and shuffle them
      const formattedQuestions = data.results.map(q => {
        const answers = [...q.incorrect_answers, q.correct_answer];
        const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
        return {
          ...q,
          answers: shuffledAnswers.map(ans => decodeHtml(ans)),
          correct_answer: decodeHtml(q.correct_answer),
          question: decodeHtml(q.question)
        };
      });
      setQuestions(formattedQuestions);
      setGameState('playing');
    } catch (err) {
      setError(err.message);
      setGameState('start'); // Go back to start on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Resets the game to its initial state
  const handlePlayAgain = () => {
    setGameState('start');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };
  
  // Starts the game
  const handleStartGame = () => {
    fetchTriviaQuestions();
  }

  // Handles click on an answer button
  const handleAnswerClick = (answer) => {
    if (isAnswered) return; // Prevent multiple answers

    setIsAnswered(true);
    setSelectedAnswer(answer);

    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(prevScore => prevScore + 1);
    }

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };
  
  useEffect(() => {
      if (gameState === 'finished') {
          const finalScore = (score / questions.length) * 100;
          if(finalScore > 60) {
            startConfetti();
          }
      }
  }, [gameState, score, questions.length, startConfetti])


  // Helper function to determine button styling based on its state
  const getButtonClass = (answer) => {
    if (isAnswered) {
      if (answer === questions[currentQuestionIndex].correct_answer) {
        return 'bg-green-500 hover:bg-green-600'; // Correct answer is always green
      }
      if (answer === selectedAnswer) {
        return 'bg-red-500 hover:bg-red-600'; // Selected incorrect answer is red
      }
      return 'bg-slate-700 hover:bg-slate-700 opacity-50'; // Other incorrect answers are faded
    }
    return 'bg-sky-600 hover:bg-sky-700'; // Default state
  };
  
  const getResultMessage = () => {
      const percentage = (score / questions.length) * 100;
      if (percentage === 100) return "Perfect Score! You're a Trivia Master! 🏆";
      if (percentage >= 80) return "Excellent Job! You really know your stuff! ✨";
      if (percentage >= 60) return "Great Work! You did very well! 👍";
      if (percentage >= 40) return "Not bad! Keep practicing! 😊";
      return "Better luck next time! Keep learning! 📚";
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@400;500&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #1e293b; }
        h1, h2, h3 { font-family: 'Poppins', sans-serif; }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      <div className="bg-slate-800 text-white min-h-screen flex items-center justify-center p-4">
        <Confetti/>
        <div className="bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-10 transition-all duration-500">
          
          {/* Start Screen */}
          {gameState === 'start' && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome to Trivia Fun!</h1>
              <p className="text-slate-400 mb-8 text-lg">Test your knowledge and have a blast.</p>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button 
                onClick={handleStartGame}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 disabled:bg-slate-500"
              >
                {loading ? 'Loading Questions...' : 'Start Trivia'}
              </button>
            </div>
          )}

          {/* Playing Screen */}
          {gameState === 'playing' && questions.length > 0 && (
            <div>
              {/* Progress Bar and Score */}
              <div className="mb-6">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-sky-400 font-bold text-lg">Question {currentQuestionIndex + 1} / {questions.length}</span>
                    <span className="bg-slate-800 text-white font-bold py-1 px-3 rounded-full">Score: {score}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                    <div 
                        className="bg-sky-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
              </div>

              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">{questions[currentQuestionIndex].question}</h2>
              
              {/* Answers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestionIndex].answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={isAnswered}
                    className={`p-4 rounded-lg text-white font-medium text-lg transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${getButtonClass(answer)}`}
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Finished Screen */}
          {gameState === 'finished' && (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Trivia Complete!</h1>
              <p className="text-slate-300 text-2xl mb-2">Your Final Score is:</p>
              <p className="text-6xl font-extrabold text-sky-400 mb-6">{score} / {questions.length}</p>
              <p className="text-xl text-slate-400 mb-8">{getResultMessage()}</p>
              <button 
                onClick={handlePlayAgain}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
