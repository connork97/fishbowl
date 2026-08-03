import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { CreateGame } from "./components/CreateGame";
import type { Game } from "./types/Types";
import Home from "./components/Home";

function App() {
  const [game, setGame] = useState<Game>({
    id: "",
    code: "",
    status: "Setup",
    hostName: "",
    players: [],
    words: [],
    teams: [],
    rounds: [],
  });

  const [user, setUser] = useState("");




  return (
    <BrowserRouter>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <Routes>
          <Route
            path="/"
            element={<Home user={user} setUser={setUser} />}
          />
          <Route
            path="/create-game"
            element={<CreateGame user={user} game={game} setGame={setGame} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
