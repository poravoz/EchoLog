import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Notes.css";

interface NotesData {
  notes: string;
  goals: string;
  features: string;
}

const defaultNotesData: NotesData = {
  notes: "",
  goals: "",
  features: "",
};

const Notes: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<string>(defaultNotesData.notes);
  const [goals, setGoals] = useState<string>(defaultNotesData.goals);
  const [features, setFeatures] = useState<string>(defaultNotesData.features);
  const loadFileInputRef = useRef<HTMLInputElement>(null);

  const saveToJson = () => {
    const notesData: NotesData = { notes, goals, features };
    const blob = new Blob([JSON.stringify(notesData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: NotesData = JSON.parse(e.target?.result as string);
          setNotes(data.notes);
          setGoals(data.goals);
          setFeatures(data.features);
        } catch (error) {
          alert("Помилка завантаження файлу JSON");
        }
      };
      reader.readAsText(file);
      if (loadFileInputRef.current) loadFileInputRef.current.value = "";
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="notes-sheet">
      <div className="notes-controls">
        <button onClick={handleBackClick} className="back-button">
          Назад
        </button>
        <button onClick={saveToJson} className="back-button">
          Зберегти JSON
        </button>
        <button onClick={() => loadFileInputRef.current?.click()} className="back-button">
          Завантажити JSON
        </button>
        <input
          type="file"
          accept="application/json"
          onChange={loadFromJson}
          ref={loadFileInputRef}
          style={{ display: "none" }}
        />
      </div>
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