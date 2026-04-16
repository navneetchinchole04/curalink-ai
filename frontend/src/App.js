import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [disease, setDisease] = useState("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!disease || !query) return;

    const userMessage = {
      type: "user",
      text: `${disease} - ${query}`
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://curalink-ai-z514.onrender.com/api/search", // ✅ your backend
        {
          disease,
          query
        }
      );

      const botMessage = {
        type: "bot",
        summary: res.data.summary,
        papers: res.data.papers
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
  setMessages(prev => [
    ...prev,
    {
      type: "bot",
      summary: "Backend error. Please try again.",
      papers: []
    }
  ]);
}

    setLoading(false);
    setDisease("");
    setQuery("");
  };

  return (
    <div className="chat-app">

      {/* HEADER */}
      <div className="header">
        <h1>🧠 CuraLink AI</h1>
      </div>

      {/* CHAT */}
      <div className="chat-box">

        {messages.length === 0 && (
          <div className="empty">
            <p>Try searching:</p>
            <p><i>lung cancer treatment</i></p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>

            {msg.type === "user" && (
              <p>{msg.text}</p>
            )}

            {msg.type === "bot" && (
              <>
                <h3>📄 Summary</h3>
                <p>{msg.summary}</p>

                <h3>📚 Papers</h3>
                {msg.papers.map((p, i) => (
                  <div key={i} className="paper">
                    <strong>{p.title}</strong>
                    <p>Year: {p.publication_year}</p>
                  </div>
                ))}
              </>
            )}

          </div>
        ))}

        {loading && <p className="loading">Thinking...</p>}
      </div>

      {/* INPUT */}
      <div className="input-area">
        <input
          type="text"
          placeholder="Disease"
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
        />

        <input
          type="text"
          placeholder="Query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch}>Send</button>
      </div>

    </div>
  );
}

export default App;