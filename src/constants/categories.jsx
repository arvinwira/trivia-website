import React from 'react'; 

import { 
    IconGeneral,
    IconGamepad,
    IconHistory,
    IconMusic,
    IconFilm,
    IconScience,
    IconSports,
    IconMythology,
    IconAnimals,
    IconOverwatch,
    IconFormula1,
    IconMarvel
} from '../components/Icons'; 

export const allCategories = [
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

export const moreCategories = [
    { id: 'overwatch-2', name: 'Overwatch 2 Quiz', icon: <IconOverwatch /> },
    { id: 'formula-1', name: 'Formula 1 Quiz', icon: <IconFormula1/> },
    { id: 'marvel', name: 'Marvel Cinematic Universe Quiz', icon: <IconMarvel/> },

    
  ];