import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { CreateGame } from "./components/CreateGame";
import type { Game } from "./types/Types";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Fishbowl from "./components/Fishbowl";
import { socket } from "./socket";
import { normalizeGameData } from "./utils/normalizeGameData";

import "./App.css";

function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [user, setUser] = useState("");

  // * Connect to Socket Effect * //
  useEffect(() => {
    const onConnect = () => {
      console.log("Socket connected", socket);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
    };

    const onGameData = (rawGame: any) => {
      const normalizedGame = normalizeGameData(rawGame);
      setGame(normalizedGame);
      console.log("Received game_data event", normalizedGame);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("game_data", onGameData);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("game_data", onGameData);
    };
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Home user={user} setUser={setUser} setGame={setGame} />}
          />
          <Route
            path="/create-game"
            element={<CreateGame user={user} setGame={setGame} />}
          />
          <Route
            path="/lobby/:gameCode"
            element={<Lobby game={game} setGame={setGame} user={user} />}
          />
          <Route
            path="/game/:gameCode"
            element={<Fishbowl user={user} game={game} setGame={setGame} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
