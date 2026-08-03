import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { CreateGame } from "./components/CreateGame";
import type { Game } from "./types/Types";
import Home from "./components/Home";
import PreGame from "./components/PreGame";

function App() {
  const [game, setGame] = useState<Game | null>(null);
  // {
  // id: "",
  // code: "",
  // hostName: "",
  // players: [],
  // words: [],
  // teams: [],
  // settings: {
  //   rounds: ["Description", "Act It Out", "One Word"],
  //   timePerRound: { minutes: 1, seconds: 0 },
  //   wordsPerPlayer: 3,
  // }
  // }

  const [user, setUser] = useState("");

  return (
    <BrowserRouter>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <Routes>
          <Route path="/" element={<Home user={user} setUser={setUser} setGame={setGame} />} />
          <Route
            path="/create-game"
            element={<CreateGame user={user} setGame={setGame} />}
          />
          <Route
            path="/lobby/:gameCode"
            element={<PreGame game={game} user={user} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
