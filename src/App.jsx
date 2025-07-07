import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { TriviaGame } from './pages/TriviaGame';
import { Layout } from './components/Layout/Layout';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import { fetchToken } from './api/triviaApi';

import './index.css';

export default function App() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      const sessionToken = await fetchToken();
      if (sessionToken) {
        setToken(sessionToken);
      }
      setIsLoading(false);
    };
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex justify-center items-center">
        <p className="text-lg">Connecting to Trivia Server...</p>
      </div>
    );
  }

  return (
    <Layout onGoHome={() => navigate('/')}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/quiz/:categorySlug/:difficulty" 
          element={<TriviaGame token={token} />} 
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}