import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Impor dari file-file yang sudah kita buat
import { allCategories, moreCategories } from '../constants/categories';
import { slugify } from '../utils';
import { fetchTriviaQuestions } from '../api/triviaApi';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { DifficultyBadge } from '../components/DifficultyBadge/DifficultyBadge';

export const TriviaGame = ({ token }) => {
  const { categorySlug, difficulty } = useParams();
  const navigate = useNavigate();

  const allGameCategories = [...allCategories, ...moreCategories];

  
  const category = allGameCategories.find(c => slugify(c.name) === categorySlug);

  const [questions, setQuestions] = useState([]);
  const [gameState, setGameState] = useState('playing'); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = category ? `${category.name} Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} | Simply Trivial` : 'Quiz | Simply Trivial';
  const description = category ? `Test your knowledge with our ${difficulty} ${category.name} trivia quiz. Play for free now!` : 'Play a fun trivia quiz!';

  const quizSchema = (category && questions.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `${category.name} Quiz - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
    "description": description,
    "hasPart": questions.map((q, index) => ({
      "@type": "Question",
      "name": `Question ${index + 1}`,
      "text": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.correct_answer
      }
    }))
  } : null;

  useDocumentMeta(title, description, quizSchema);

  useEffect(() => {
    if (!category) {
      setError("Invalid category specified.");
      setLoading(false);
      return;
    }
    if (typeof category.id === 'number' && !token) {
      setError("Missing API session token. Please return to the main menu to refresh the session.");
      setLoading(false);
      return;
    }

    const getQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedQuestions = await fetchTriviaQuestions(category, difficulty, token);
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getQuestions();
  }, [category, difficulty, token]);

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

  const getButtonClass = (answer) => {
    if (!isAnswered) return 'bg-sky-600 hover:bg-sky-700';
    if (answer === questions[currentQuestionIndex].correct_answer) return 'bg-green-500 hover:bg-green-600';
    if (answer === selectedAnswer) return 'bg-red-500 hover:bg-red-600';
    return 'bg-slate-700 hover:bg-slate-700 opacity-50';
  };

  const getResultMessage = () => {
    if (!questions || questions.length === 0) return "No questions were loaded.";
    const percentage = score > 0 ? (score / questions.length) * 100 : 0;
    if (percentage === 100) return "Perfect Score! You're a Trivia Master!";
    if (percentage >= 80) return "Excellent Job! You really know your stuff!";
    if (percentage >= 60) return "Great Work! You did very well!";
    if (percentage >= 40) return "Not bad! Keep practicing!";
    return "Better luck next time! Keep learning!";
  };

  const handleGoHome = () => navigate('/');

  if (loading) return <div className="text-center"><h2 className="text-2xl font-bold">Loading Questions...</h2></div>;
  
  if (error) return (
    <div className="text-center bg-slate-800 p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
      <p className="text-slate-400 mb-6">{error}</p>
      <button onClick={handleGoHome} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg text-lg">Back to Home</button>
    </div>
  );

  if (gameState === 'finished') {
    return (
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Trivia Complete!</h1>
        <div className="flex justify-center items-center gap-2 mb-4">
          <p className="text-slate-400 text-lg">Category: {category.name}</p>
          <DifficultyBadge difficulty={difficulty} />
        </div>
        <p className="text-slate-300 text-2xl mb-2">Your Final Score is:</p>
        <p className="text-6xl font-extrabold text-sky-400 mb-6">{score} / {questions.length}</p>
        <p className="text-xl text-slate-400 mb-8">{getResultMessage()}</p>
        <button onClick={handleGoHome} className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-transform transform hover:scale-105">Play Another Game</button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto relative">
      {questions && questions.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sky-400 font-bold text-lg">Question {currentQuestionIndex + 1} / {questions.length}</span>
            <div className="flex items-center gap-4">
              <DifficultyBadge difficulty={difficulty} />
              <span className="bg-slate-700 text-white font-bold py-1 px-3 rounded-full">Score: {score}</span>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
            <div className="bg-sky-500 h-3 rounded-full transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center" dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions[currentQuestionIndex].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  disabled={isAnswered}
                  className={`p-4 rounded-lg text-white font-medium text-lg transition-all duration-300 disabled:cursor-not-allowed ${getButtonClass(answer)}`}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center">No questions loaded for this category. Please try another one.</div>
      )}
    </div>
  );
};