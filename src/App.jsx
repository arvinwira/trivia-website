import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';

// --- Custom Hook for SEO (with Structured Data) ---
const useDocumentMeta = (title, description, schemaData) => {
  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const existingScript = document.getElementById('schema-json');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'schema-json';
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [title, description, schemaData]);
};


// --- Icon Components (Inline SVG for Coloring) ---
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
const IconSports = () => (
  <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);
const IconMythology = () => (
    <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
const IconAnimals = () => (
    <svg className="w-12 h-12 mx-auto mb-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 9.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 15h6a1 1 0 011 1v1a3 3 0 01-3 3H8a3 3 0 01-3-3v-1a1 1 0 011-1z"></path><path d="M9 9h.01M15 9h.01"></path></svg>
);


// --- DifficultyBadge Component ---
const DifficultyBadge = ({ difficulty }) => {
  const badgeClasses = {
    easy: 'bg-green-500/20 text-green-300',
    medium: 'bg-yellow-500/20 text-yellow-300',
    hard: 'bg-red-500/20 text-red-300',
  };

  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${badgeClasses[difficulty] || 'bg-gray-500/20 text-gray-300'}`}>
      {difficulty}
    </span>
  );
};


// --- Layout Component ---
const Layout = ({ children, onGoHome }) => {
  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans">
      <header className="bg-slate-800 shadow-lg">
        <nav className="container mx-auto px-6 py-4">
          <h1 onClick={onGoHome} className="text-3xl font-bold text-white font-display cursor-pointer transition-colors hover:text-sky-400">
            Simply Trivial
          </h1>
        </nav>
      </header>
      
      <main className="flex-grow container mx-auto px-6 py-12 flex items-center">
        <div className="w-full">
          {children}
        </div>
      </main>

      <footer className="bg-slate-800 py-6 text-center text-slate-400">
        <p>&copy; {new Date().getFullYear()} Simply Trivial. All Rights Reserved.</p>
      </footer>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [token, setToken] = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchToken = async () => {
      const baseUrl = import.meta.env.PROD ? 'https://opentdb.com' : '/api';
      const url = `${baseUrl}/api_token.php?command=request`;

      try {
        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();
        if (data.response_code === 0) setToken(data.token);
        else console.error("Could not fetch session token.");
      } catch (err) {
        if (err.name !== 'AbortError') console.error("API token fetch failed:", err);
      } finally {
        if (!controller.signal.aborted) setTokenLoading(false);
      }
    };
    fetchToken();
    return () => controller.abort();
  }, []);

  return (
    <Layout onGoHome={() => navigate('/')}>
      <Routes>
        <Route path="/" element={<HomePage tokenLoading={tokenLoading} />} />
        <Route path="/quiz/:categorySlug/:difficulty" element={<TriviaGame token={token} />} />
      </Routes>
    </Layout>
  );
}

// --- Helper function to create URL-friendly slugs ---
const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const allCategories = [
    { id: 9, name: 'General Knowledge', icon: <IconGeneral /> },
    { id: 15, name: 'Video Games', icon: <IconGamepad /> },
    { id: 23, name: 'History', icon: <IconHistory /> },
    { id: 12, name: 'Music', icon: <IconMusic /> },
    { id: 11, name: 'Film', icon: <IconFilm /> },
    { id: 17, name: 'Science & Nature', icon: <IconScience /> },
    { id: 21, name: 'Sports', icon: <IconSports /> },
    { id: 20, name: 'Mythology', icon: <IconMythology /> },
    { id: 27, name: 'Animals', icon: <IconAnimals /> },
];

// --- HomePage Component ---
const HomePage = ({ tokenLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  useDocumentMeta(
    'Simply Trivial - FREE Trivia Quiz Game',
    'Challenge your knowledge with a free trivia quiz game. Choose from dozens of categories like History, Music, Science, and more!'
  );

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const difficultyButtonClasses = {
      Easy: 'bg-green-600 hover:bg-green-700',
      Medium: 'bg-yellow-500 hover:bg-yellow-600',
      Hard: 'bg-red-600 hover:bg-red-700',
  };

  if (tokenLoading) {
    return <div className="text-center"><p className="text-lg">Connecting to Trivia Server...</p></div>;
  }
  
  if (selectedCategory) {
    return (
        <div className="text-center">
            <h2 className="text-4xl font-bold font-display mb-2">Category: {selectedCategory.name}</h2>
            <p className="text-slate-400 mb-8 text-lg">Now, select a difficulty.</p>
            <div className="flex justify-center gap-4 mb-8">
                {difficulties.map(diff => (
                    <Link
                        key={diff} 
                        to={`/quiz/${slugify(selectedCategory.name)}/${diff.toLowerCase()}`}
                        className={`${difficultyButtonClasses[diff]} text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105`}
                    >
                        {diff}
                    </Link>
                ))}
            </div>
            <button onClick={() => setSelectedCategory(null)} className="text-slate-400 hover:text-white transition">
                &larr; Back to Categories
            </button>
        </div>
    );
  }

  return (
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">Test Your Knowledge</h1>
        <p className="text-slate-400 mb-12 text-lg">Select a category to start the challenge.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="bg-slate-800 p-6 rounded-lg text-white font-semibold text-lg transition-all duration-300 transform hover:bg-sky-600 hover:-translate-y-2 shadow-lg"
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700/50 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">The Ultimate Online Trivia Destination</h3>
            <p className="text-slate-400 leading-relaxed">
                Welcome to Simply Trivial, your new home for free online trivia and quiz questions! Test your knowledge across a huge range of categories including General Knowledge, History, Music, Film, Video Games, and more. Choose your difficulty from easy, medium, or hard. Our quiz game is perfect for a quick brain teaser or a challenging test of your expertise. Play now for free!
            </p>
        </div>
      </div>
  );
};


// --- TriviaGame Component ---
const TriviaGame = ({ token }) => {
  const { categorySlug, difficulty } = useParams();
  const navigate = useNavigate();

  const category = allCategories.find(c => slugify(c.name) === categorySlug);

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
    if (!token) {
        setError("Missing API session token. Please return to the main menu to refresh the session.");
        setLoading(false);
        return;
    }
    
    const controller = new AbortController();
    const fetchTriviaQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.PROD ? 'https://opentdb.com' : '/api';
        const url = `${baseUrl}/api.php?amount=10&category=${category.id}&difficulty=${difficulty}&type=multiple&token=${token}`;
        
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Failed to connect to the trivia server.');
        
        const data = await response.json();
        
        if (data.response_code !== 0) {
            const apiErrors = {
                1: "The API doesn't have enough questions for this category/difficulty. Please try another.",
                2: "The request contains invalid parameters. Please try again.",
                3: "There was a session token error. Please return to the main menu to refresh.",
                4: "There was a session token error. Please return to the main menu to refresh.",
                5: "Too many requests. Please wait a moment and try again."
            };
            throw new Error(apiErrors[data.response_code] || "An unknown API error occurred.");
        }
  
        if (!controller.signal.aborted) {
          setQuestions(data.results.map(q => ({
            ...q,
            answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map(decodeHtml),
            correct_answer: decodeHtml(q.correct_answer),
            question: decodeHtml(q.question)
          })));
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    
    fetchTriviaQuestions();
    return () => controller.abort();
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
    if (questions.length === 0 && !loading) return "No questions were loaded.";
    const percentage = score > 0 ? (score / questions.length) * 100 : 0;
    if (percentage === 100) return "Perfect Score! You're a Trivia Master!";
    if (percentage >= 80) return "Excellent Job! You really know your stuff!";
    if (percentage >= 60) return "Great Work! You did very well!";
    if (percentage >= 40) return "Not bad! Keep practicing!";
    return "Better luck next time! Keep learning!";
  };

  const handleGoHome = () => navigate('/');

  if (!category && !loading) {
    return (
        <div className="text-center bg-slate-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">An Error Occurred</h2>
          <p className="text-slate-400 mb-6">{error || `Category "${categorySlug}" not found.`}</p>
          <button onClick={handleGoHome} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-lg text-lg">Back to Home</button>
        </div>
    );
  }

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
      {questions.length > 0 ? (
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


// --- Helper Functions ---
const decodeHtml = (html) => {
  if (!html) return '';
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};