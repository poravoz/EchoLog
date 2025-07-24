import CharacterSheet from "./components/CharacterSheet";
import { Routes, Route } from "react-router-dom";
import { Other } from "./components/other";
import "./index.css";
import  Notes from "./components/Notes";

function App() {
  return (
    <div style={{ backgroundColor: "#222", minHeight: "100vh", color: "#fefefe", padding: "20px" }}>
      <Routes>
        <Route path="/" element={<CharacterSheet />} />
        <Route path="/backpack" element={<Other />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </div>
  );
}

export default App;
