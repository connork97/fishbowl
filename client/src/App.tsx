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

  // const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);

  // * Connect to Socket Effect * //
  // useEffect(() => {
  //   const onConnect = () => {
  //     setSocketIsConnected(true);
  //     console.log("Socket connected:", socket.id);
  //   };

  //   const onDisconnect = () => {
  //     setSocketIsConnected(false);
  //     console.log("Socket disconnected");
  //   };

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, []);
  // useEffect(() => {
  //   const onConnect = () => {
  //     setSocketIsConnected(true);
  //     socket.emit("get_first_game");
  //   };

  //   const onDisconnect = () => {
  //     setSocketIsConnected(false);
  //   };

  //   function onFirstGameEvent(rawGame: any) {
  //     const normalizedGame = normalizeGameData(rawGame);
  //     setGame(normalizedGame);
  //     setFooEvents((previous) => [...previous, normalizedGame.code]);
  //     console.log("Received first game", normalizedGame);
  //   }

  //   socket.on("connect", onConnect);
  //   socket.on("disconnect", onDisconnect);
  //   socket.on("get_first_game", onFirstGameEvent);

  //   console.log("SOCKET DATA: ", socket);
  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //     socket.off("get_first_game", onFirstGameEvent);
  //   };
  // }, [socketIsConnected]);

  // if (!socketIsConnected) {
  //   return <h1 style={{textAlign: 'center', marginTop: '20%'}}>Connecting to server...</h1>;
  // }

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
