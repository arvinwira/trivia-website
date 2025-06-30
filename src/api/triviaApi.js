
import { decodeHtml } from "../utils";

const BASE_URL = import.meta.env.PROD ? 'https://opentdb.com' : '/api';

export const fetchToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api_token.php?command=request`);
    const data = await response.json();
    if (data.response_code === 0) {
      return data.token;
    }
    console.error("Could not fetch session token.");
    return null;
  } catch (err) {
    console.error("API token fetch failed:", err);
    return null;
  }
};

export const fetchTriviaQuestions = async (category, difficulty, token) => {
  const url = `${BASE_URL}/api.php?amount=10&category=${category.id}&difficulty=${difficulty}&type=multiple&token=${token}`;
  
  const response = await fetch(url);
  if (response.status === 429) {
    throw new Error("You have made a request too soon. Please wait a moment before trying again.");
  }
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
  
  // Proses data di sini agar komponen menerima data yang sudah bersih
  return data.results.map(q => ({
    ...q,
    answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map(decodeHtml),
    correct_answer: decodeHtml(q.correct_answer),
    question: decodeHtml(q.question)
  }));
};