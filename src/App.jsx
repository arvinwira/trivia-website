import React, { useState, useEffect, useCallback, useMemo } from 'react';

const IconGeneral = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
);
const IconGamepad = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5a2 2 0 112.828-2.828L11 11.172l5.172-5.172a2 2 0 112.828 2.828L13 15V5a2 2 0 00-4 0v10z M6 13a2 2 0 110-4 2 2 0 010 4z M18 13a2 2 0 110-4 2 2 0 010 4z"></path></svg>
);
const IconHistory = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-8.494h18M5 12.747h14M4 15.253h16M3 17.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16v12H4z"></path></svg>
);
const IconMusic = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l10-3v13M9 19a4 4 0 11-4-4 4 4 0 014 4zm10-13a4 4 0 11-4-4 4 4 0 014 4z"></path></svg>
);
const IconFilm = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 4h16v16H4z"></path></svg>
);
const IconScience = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a9 9 0 015.657 15.343A9 9 0 016.343 8.657 9 9 0 0112 3z"></path><path d="M12 12s2.121-5.657 6-6M12 12s-5.657 2.121-6 6"></path></svg>
);


export default function App() {
  const [view, setView] = useState('home'); 
  const [category, setCategory] = useState(null); 
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchToken = async () => {
      try {
        const response = await fetch('https://opentdb.com/api_token.php?command=request', { signal: controller.signal });
        const data = await response.json();
        if (data.response_code === 0) {
          setToken(data.token);
        } else {
          console.error("Could not fetch session token.");
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Failed to connect to trivia API to get token.", err);
        }
      } finally {
        setTokenLoading(false);
      }
    };
    fetchToken();
    
    return () => {
      controller.abort();
    };
  }, []);

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setView('playing');
  };

  const handleGameFinish = () => {
    setView('home');
    setCategory(null);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {view === 'home' && <HomePage onCategorySelect={handleCategorySelect} tokenLoading={tokenLoading} />}
        {view === 'playing' && <TriviaGame category={category} token={token} onGameFinish={handleGameFinish} />}
      </div>
    </div>
  );
}

const HomePage = ({ onCategorySelect, tokenLoading }) => {
  const categories = [
    { id: 9, name: 'General Knowledge', icon: <IconGeneral /> },
    { id: 15, name: 'Video Games', icon: <IconGamepad /> },
    { id: 23, name: 'History', icon: <IconHistory /> },
    { id: 12, name: 'Music', icon: <IconMusic /> },
    { id: 11, name: 'Film', icon: <IconFilm /> },
    { id: 17, name: 'Science & Nature', icon: <IconScience /> },
  ];

  return (
    <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">Trivia Fun!</h1>
      <p className="text-slate-400 mb-12 text-lg">Select a category to start the challenge.</p>
      {tokenLoading ? (
        <p>Connecting to Trivia Server...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              className="bg-slate-800 p-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 transform hover:bg-sky-600 hover:-translate-y-2"
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


const TriviaGame = ({ category, token, onGameFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState('playing'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { Confetti, startConfetti } = useConfetti();

  // This useEffect now correctly handles cleanup to prevent race conditions.
  useEffect(() => {
    // Create a controller for this specific fetch call
    const controller = new AbortController();

    const fetchTriviaQuestions = async () => {
      if (!token) {
          setLoading(false);
          setError("Missing an API session token. Please return to the homepage.");
          return;
      }
  
      setLoading(true);
      setError(null);
      try {
        const url = `https://opentdb.com/api.php?amount=10&category=${category.id}&type=multiple&token=${token}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to connect to the trivia server. Check your internet connection.');
        
        const data = await response.json();
        
        if (data.response_code === 1) throw new Error("The API doesn't have enough questions for this category. Please try another one.");
        if (data.response_code === 3 || data.response_code === 4) throw new Error("Your trivia session has expired. Please return to the main menu.");
        if (data.response_code !== 0) throw new Error("An unknown error occurred while fetching questions.");
  
        setQuestions(data.results.map(q => ({
          ...q,
          answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map(decodeHtml),
          correct_answer: decodeHtml(q.correct_answer),
          question: decodeHtml(q.question)
        })));

      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTriviaQuestions();

    return () => {
      controller.abort();
    };
  }, [category.id, token]); 

  const handleAnswerClick = (answer) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestionIndex].correct_answer) {
      setScore(prev => prev + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setGameState('finished');
      }
    }, 1500);
  };

  useEffect(() => {
    if (gameState === 'finished' && questions.length > 0) {
      if ((score / questions.length) * 100 > 60) {
        startConfetti();
      }
    }
  }, [gameState, score, questions.length, startConfetti]);

  const getButtonClass = (answer) => {
    if (!isAnswered) return 'bg-sky-600 hover:bg-sky-700';
    if (answer === questions[currentQuestionIndex].correct_answer) return 'bg-green-500 hover:bg-green-600';
    if (answer === selectedAnswer) return 'bg-red-500 hover:bg-red-600';
    return 'bg-slate-700 hover:bg-slate-700 opacity-50';
  };
  
  const getResultMessage = () => {
    if (questions.length === 0) return "No questions were loaded.";
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect Score! You're a Trivia Master!";
    if (percentage >= 80) return "Excellent Job! You really know your stuff!";
    if (percentage >= 60) return "Great Work! You did very well!";
    if (percentage >= 40) return "Not bad! Keep practicing!";
    return "Better luck next time! Keep learning!";
  };

  if (loading) {
    return <div className="text-center"><h2 className="text-2xl font-bold">Loading Questions for {category.name}...</h2></div>;
  }

  if (error) {
    return (
      <div className="text-center bg-slate-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={onGameFinish} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg text-lg">Back to Categories</button>
      </div>
    );
  }

  return (
    <>
      <Confetti />
      <div className="bg-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl">
        {gameState === 'playing' && questions.length > 0 && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sky-400 font-bold text-lg">Question {currentQuestionIndex + 1} / {questions.length}</span>
                <span className="bg-slate-700 text-white font-bold py-1 px-3 rounded-full">Score: {score}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div className="bg-sky-500 h-3 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">{questions[currentQuestionIndex].question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg text-white font-medium text-lg transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(answer)}`}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trivia Complete!</h1>
            <p className="text-slate-400 text-lg mb-4">Category: {category.name}</p>
            <p className="text-slate-300 text-2xl mb-2">Your Final Score is:</p>
            <p className="text-6xl font-extrabold text-sky-400 mb-6">{score} / {questions.length}</p>
            <p className="text-xl text-slate-400 mb-8">{getResultMessage()}</p>
            <button onClick={onGameFinish} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105">Play Another Category</button>
          </div>
        )}
      </div>
    </>
  );
};


const useConfetti = () => {
  const [isConfettiActive, setConfettiActive] = useState(false);

  const startConfetti = useCallback(() => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 4000);
  }, []);

  const Confetti = useMemo(() => {
    const MemoizedConfetti = React.memo(() => {
        if (!isConfettiActive) return null;
        const confettiPieces = Array.from({ length: 150 }).map((_, i) => ({
          id: i,
          color: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'][Math.floor(Math.random() * 15)],
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 3 + 2}s`,
          animationDelay: `${Math.random() * 2}s`,
        }));
        return (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-50 pointer-events-none">
            {confettiPieces.map(p => (
              <div key={p.id} className="absolute w-2 h-4" style={{ backgroundColor: p.color, left: p.left, animation: `fall ${p.animationDuration} linear ${p.animationDelay} infinite` }} />
            ))}
          </div>
        );
    });
    MemoizedConfetti.displayName = 'MemoizedConfetti';
    return MemoizedConfetti;
  }, [isConfettiActive]);

  return { Confetti, startConfetti };
};

const decodeHtml = (html) => {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};
