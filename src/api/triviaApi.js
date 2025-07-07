
import { decodeHtml } from '../utils';

const API_BASE_URL = 'https://opentdb.com';
const LOCAL_DATA_PATH = '/quiz-data';


export const fetchToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api_token.php?command=request`);
    const data = await response.json();
    return data.token || null;
  } catch (err) {
    console.error("API token fetch failed:", err);
    return null;
  }
};


export const fetchTriviaQuestions = async (category, difficulty, token) => {
  if (typeof category.id === 'number') {
    console.log("Fetching from online API for category:", category.name);
    
    const url = `${API_BASE_URL}/api.php?amount=10&category=${category.id}&difficulty=${difficulty.toLowerCase()}&type=multiple&token=${token}`;
    const response = await fetch(url);

    if (response.status === 429) {
      throw new Error("You are making requests too quickly. Please wait a moment and try again.");
    }
    if (!response.ok) {
      throw new Error('Failed to connect to the trivia server.');
    }
    
    const data = await response.json();
    
    if (data.response_code !== 0) {
        const apiErrors = {
            1: "The API does not have enough questions for this category/difficulty.",
            2: "The request contains invalid parameters.",
            3: "There was a session token error. Please return to the main menu.",
            4: "There was a session token error. Please return to the main menu.",
            5: "Too many requests. Please wait a moment."
        };
        throw new Error(apiErrors[data.response_code] || "Unknown API Error.");
    }
    
    return data.results.map(q => ({
      question: decodeHtml(q.question),
      correct_answer: decodeHtml(q.correct_answer),
      answers: [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random()).map(decodeHtml),
    }));

  } 
  else if (typeof category.id === 'string') {
    console.log("Fetching from local data for category:", category.name);

    const nicheKey = category.id;
    const difficultyKey = difficulty.toLowerCase();
    const filePath = `${LOCAL_DATA_PATH}/${nicheKey}-${difficultyKey}.json`;

    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Could not find quiz data file at: ${filePath}`);
      }
      const questions = await response.json();
      
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const selectedQuestions = shuffled.slice(0, 10);

      return selectedQuestions.map(q => ({
        ...q,
        answers: [...q.incorrect_answers, q.correct_answer].sort(() => 0.5 - Math.random()),
      }));
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to load local quiz data for ${category.name}.`);
    }

  } 
  else {
    throw new Error("Invalid category type provided.");
  }
};