import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const quotes = [
  "The force will be with you always",
  "Do or do not there is no try",
  "In my experience there is no such thing as luck",
  "Never tell me the odds",
  "Your focus determines your reality"
];

export default function TypingTest() {
  const [quote, setQuote] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const intervalRef = useRef(null);

  // Pick a random quote on mount
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Calculate WPM and Accuracy on input change
  useEffect(() => {
    if (input.length === 0) return;

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === quote[i]) correctChars++;
    }
    const accuracyCalc = (correctChars / quote.length) * 100;
    setAccuracy(Math.max(0, Math.round(accuracyCalc)));

    // Calculate WPM
    const wordsTyped = input.length / 5;
    const minutes = timer / 60;
    if (minutes > 0) {
      setWpm(Math.round(wordsTyped / minutes));
    } else {
      setWpm(0);
    }

    // Check if done
    if (input === quote) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }, [input, timer, quote]);

  const handleInputChange = (e) => {
    if (!isRunning) {
      setIsRunning(true);
      setStartTime(Date.now());
      setTimer(0);
    }
    setInput(e.target.value);
  };

  const resetTest = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setInput("");
    setTimer(0);
    setIsRunning(false);
    setWpm(0);
    setAccuracy(100);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", fontFamily: "sans-serif", color: "#eee", background: "#222", padding: 20, borderRadius: 10 }}>
      <h2>Typing Test</h2>
      <p style={{ fontSize: 20 }}>{quote}</p>
      <textarea
        value={input}
        onChange={handleInputChange}
        rows={4}
        style={{ width: "100%", fontSize: 18, padding: 10, borderRadius: 8 }}
        placeholder="Start typing here..."
      />
      <div style={{ marginTop: 20 }}>
        <p>Time: {timer}s</p>
        <p>WPM: {wpm}</p>
        <p>Accuracy: {accuracy}%</p>
        <button onClick={resetTest} style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer" }}>Restart</button>
      </div>
    </div>
  );
}
