import React, { useState, useEffect } from "react";
import "./App.css";

const flashcards = [
  { question: "Bilakah Malaysia dibentuk?", answer: "16 September 1963" },
  { question: "Siapakah tokoh penting dalam pembentukan Malaysia?", answer: "Tunku Abdul Rahman, Tun Mustapha, Stephen Kalong Ningkan" },
  { question: "Apakah nama negara baharu yang dicadangkan sebelum Malaysia dibentuk?", answer: "Malaysia" },
  { question: "Negara manakah yang menyertai Malaysia pada tahun 1963?", answer: "Sabah, Sarawak, dan Singapura" },
  { question: "Apakah sebab utama pembentukan Malaysia?", answer: "Keselamatan, kemerdekaan, dan perpaduan" }
];

const LOCAL_STORAGE_KEY = "haziq_flashcards_unit1";

function App() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  const today = new Date().toISOString().split("T")[0];

  const getNextDueCard = () => {
    const dueCards = flashcards.filter((_, i) => {
      const dueDate = schedule[i]?.next;
      return !dueDate || dueDate <= today;
    });
    return dueCards.length ? flashcards.findIndex((card) => dueCards.includes(card)) : -1;
  };

  useEffect(() => {
    const next = getNextDueCard();
    if (next !== -1) setIndex(next);
  }, [schedule]);

  const handleResponse = (isCorrect) => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + (isCorrect ? 2 : 1));
    const updated = {
      ...schedule,
      [index]: { next: nextDate.toISOString().split("T")[0] }
    };
    setSchedule(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setShowAnswer(false);
    const next = getNextDueCard();
    if (next !== -1) setIndex(next);
  };

  const card = flashcards[index];

  return (
    <div className="App">
      <h2>Flashcard Sejarah: Haziq Zikri (Unit 1)</h2>
      <div className="card">
        <p>{showAnswer ? card.answer : card.question}</p>
      </div>
      <button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "Lihat Soalan" : "Lihat Jawapan"}
      </button>
      {showAnswer && (
        <div className="controls">
          <button className="betul" onClick={() => handleResponse(true)}>Betul</button>
          <button className="salah" onClick={() => handleResponse(false)}>Salah</button>
        </div>
      )}
    </div>
  );
}

export default App;
