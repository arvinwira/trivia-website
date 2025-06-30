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
    IconAnimals
} from '../components/Icons'; // Path menunjuk ke file (tanpa .js)

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