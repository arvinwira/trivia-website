import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { allCategories } from '../constants/categories';
import { slugify } from '../utils';

export const HomePage = ({ tokenLoading }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
  
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Simply Trivial",
      "url": "https://simplytrivial.netlify.app/"
    };
    
    useDocumentMeta(
      'Simply Trivial - FREE Trivia Quiz Game',
      'Challenge your knowledge with a free trivia quiz game. Choose from dozens of categories like History, Music, Science, and more!',
      websiteSchema
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
  