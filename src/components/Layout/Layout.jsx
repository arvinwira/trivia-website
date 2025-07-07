import React from 'react';
import { Link } from 'react-router-dom';

export const Layout = ({ children, onGoHome }) => {
    const handleShare = async () => {
    const shareData = {
      title: 'Simply Trivial',
      text: 'Check out this awesome trivia quiz website!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans">
      <header className="bg-slate-800 shadow-lg sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          <h1 onClick={onGoHome} className="text-2xl md:text-3xl font-bold text-white font-display cursor-pointer transition-colors hover:text-sky-400">
            Simply Trivial
          </h1>

          <div className="flex items-center gap-x-4 md:gap-x-6">
            <Link to="/about" className="text-slate-300 hover:text-white font-semibold transition-colors">About</Link>
            <Link to="/contact" className="text-slate-300 hover:text-white font-semibold transition-colors">Contact</Link>
            <button 
              onClick={handleShare}
              className="text-slate-300 hover:text-sky-400 transition-colors font-semibold py-2 px-3 md:px-4 rounded-lg hover:bg-slate-700 border border-slate-600"
              aria-label="Share this website"
            >
              Share
            </button>
          </div>
        </nav>
      </header>
      
      <main className="flex-grow container mx-auto px-6 py-12">
        <div className="w-full">
          {children}
        </div>
      </main>

      <footer className="bg-slate-800 py-8 text-center text-slate-400">
        <div className="container mx-auto flex justify-center gap-x-6 gap-y-2 flex-wrap mb-4">
        </div>
        <p>&copy; {new Date().getFullYear()} Simply Trivial.</p>
      </footer>
    </div>
  );
};