import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { CreateGame } from "./components/CreateGame";
import type { Game } from "./types/Types";
import Home from "./components/Home";
import Lobby from "./components/Lobby";
import Fishbowl from "./components/Fishbowl";
import { socket } from "./socket";
import { normalizeGameData } from "./utils/normalizeGameData";

function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [user, setUser] = useState("");

  // * Connect to Socket Effect * //
  const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);

  useEffect(() => {
    // if (!game) return;
    const onConnect = () => {
      setSocketIsConnected(true);
      // socket.emit("join_game", game?.code);
    };

    const onDisconnect = () => {
      setSocketIsConnected(false);
    };

    const onGameData = (rawGame: any) => {
      const normalizedGame = normalizeGameData(rawGame);
      setGame(normalizedGame);
      console.log("Received game_data event", normalizedGame);
    };

    // const onJoinGame = (rawGame: any) => {
      // const normalizedGame = normalizeGameData(rawGame);
      // setGame(normalizedGame);
      // console.log("Received join_game event", normalizedGame);
    // };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("game_data", onGameData);
    // socket.on("join_game", onJoinGame);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("game_data", onGameData);
      // socket.off("join_game", onJoinGame);
    };
  }, []);

  return (
    <BrowserRouter>
      <div style={{ margin: "auto", textAlign: "center" }}>
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
            element={<Fishbowl game={game} setGame={setGame} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
