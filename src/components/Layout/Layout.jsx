import React from 'react';

export const Layout = ({ children, onGoHome }) => {
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