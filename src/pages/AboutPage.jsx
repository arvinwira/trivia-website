import React from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const AboutPage = () => {
  useDocumentMeta(
    'About Us | Simply Trivial',
    'Learn more about Simply Trivial, your new home for fun and challenging trivia quizzes.'
  );

  return (
    <div className="bg-slate-800 p-8 rounded-lg max-w-4xl mx-auto text-left">
      <h1 className="text-4xl font-bold font-display text-white mb-6">About Simply Trivial</h1>
      <div className="text-slate-300 leading-relaxed space-y-4">
        <p>
          Welcome to Simply Trivial, the ultimate destination for trivia lovers and quiz enthusiasts! Our mission is to provide a free, fun, engaging, and challenging experience for everyone, whether you're looking to test your knowledge, learn something new, or just have a good time.
        </p>
        <p>
          Founded in 2025, Simply Trivial was born from a passion for knowledge and a love for friendly competition. We believe that learning can be exciting, and our wide range of categories—from General Knowledge and History to Video Games.
        </p>
        <p>
          Our platform is built with modern technology to ensure a smooth and enjoyable experience on any device. We are constantly updating our question database and adding new, exciting categories to keep the challenge fresh.
        </p>
        <p>
          Thank you for visiting. We hope you have a fantastic time playing! and don't forget to tell your friends about us!
        </p>
      </div>
    </div>
  );
};