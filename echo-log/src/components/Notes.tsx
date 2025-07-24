import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

const getStored = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState(() => getStored("notes", ""));
  const [goals, setGoals] = useState(() => getStored("goals", ""));
  const [features, setFeatures] = useState(() => getStored("features", ""));

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("goals", JSON.stringify(goals));
    localStorage.setItem("features", JSON.stringify(features));
  }, [notes, goals, features]);

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="notes-sheet">
      <button onClick={handleBackClick} className="back-button">
        Назад
      </button>
      <div className="section">
        <h3 className="section-title">Нотатки</h3>
        <div className="description-label">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Введіть ваші нотатки..."
          />
        </div>
      </div>
      <div className="section">
        <h3 className="section-title">Цілі</h3>
        <div className="description-label">
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Введіть ваші цілі..."
          />
        </div>
      </div>
      <div className="section">
        <h3 className="section-title">Особливості/Здібності</h3>
        <div className="description-label">
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder="Введіть особливості або здібності..."
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;