import React from 'react';

export const DifficultyBadge = ({ difficulty }) => {
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