import { useLocation, useNavigate } from "react-router-dom";
import type { Game } from "../types/Types";
import { useEffect, useState } from "react";
import {
  getFishbowlGameByCode,
  joinFishbowlTeam,
  addFishbowlWordToGame,
  setGameStatus,
} from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

import { socket } from "../socket";

export default function Lobby({
  game,
  setGame,
  user,
}: {
  game: Game | null;
  setGame: any;
  user: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const gameCode = location.pathname.split("/").pop() ?? "";

  const [socketIsConnected, setSocketIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => {
      setSocketIsConnected(true);
      socket.emit("join_game", gameCode);
    };

    const onJoinGame = (rawGame: any) => {
      const normalizedGame = normalizeGameData(rawGame);
      setGame(normalizedGame);
      console.log("Received join_game event", normalizedGame);
    };

    const onGameData = (rawGame: any) => {
      const normalizedGame = normalizeGameData(rawGame);
      setGame(normalizedGame);
      console.log("Received game_data event", normalizedGame);
    };
    
    socket.on("connect", onConnect);
    socket.on("join_game", onJoinGame);
    socket.on('game_data', onGameData);

    
    return () => {
      socket.off("connect", onConnect);
      socket.off("join_game", onJoinGame);
    };
  }, []);

  // useEffect(() => {
  //   if (!socketIsConnected) return;

  //   const onGameUpdate = (rawGame: any) => {
  //     const normalizedGame = normalizeGameData(rawGame);
  //     setGame(normalizedGame);
  //     console.log("Received game update", normalizedGame);
  //   };
  //   socket.on("game_update", onGameUpdate);

  //   return () => {
  //     socket.off("game_update", onGameUpdate);
  //   };
  // }, [socketIsConnected]);
  // Interval based fetch requests to refresh game data
  // useEffect(() => {
  //   if (!gameCode) return;

  //   let isCancelled = false;

  //   const getGameData = async () => {
  //     try {
  //       const gameData = await getFishbowlGameByCode(gameCode);
  //       const normalizedGameData = normalizeGameData(gameData);

  //       if (!isCancelled) {
  //         setGame(normalizedGameData);
  //       }
  //     } catch (error) {
  //       console.error("Failed to refresh game data:", error);
  //     }
  //   };

  //   getGameData();
  //   const intervalId = window.setInterval(getGameData, 10000);

  //   return () => {
  //     isCancelled = true;
  //     window.clearInterval(intervalId);
  //   };
  // }, [gameCode, setGame]);

  useEffect(() => {
    const redirectToGame = () => navigate(`/game/${gameCode}`);
    if (game?.status === "Active") {
      setTimeout(redirectToGame, 5000);
    }
  }, [game?.status]);

  const joinTeam = async (teamName: string) => {
    const updatedGameData = await joinFishbowlTeam(user, teamName, gameCode);
    if (updatedGameData) {
      setGame(updatedGameData);
    }
  };

  const [newWordInput, setNewWordInput] = useState("");

  const submitNewWord = async () => {
    const trimmedWord = newWordInput.trim();
    if (!trimmedWord) {
      alert("Word cannot be empty.");
      return;
    }
    const updatedGameData = await addFishbowlWordToGame(
      trimmedWord,
      user,
      gameCode,
    );
    if (updatedGameData) {
      setGame(updatedGameData);
      setNewWordInput("");
    }
  };

  const startGame = async () => {
    if (user !== game?.hostName) {
      alert("Only the host can start the game.");
      return;
    }
    if (!window.confirm("Are you sure you want to start the game?")) return;
    const setGameStartingData = await setGameStatus(gameCode, user, "Starting");
    if (setGameStartingData) {
      setGame(setGameStartingData);
      setTimeout(async () => {
        const setGameActiveData = await setGameStatus(gameCode, user, "Active");
        if (setGameActiveData) {
          setGame(setGameActiveData);
        }
      }, 5000);
    }
  };

  return (
    <>
      {game && user ? (
        <div
          style={{
            pointerEvents:
              game.status === "Starting" || game.status === "Active"
                ? "none"
                : "auto",
          }}
        >
          {(game.status === "Starting" || game.status === "Active") && (
            <div
              style={{
                height: "100dvh",
                width: "100dvw",
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  margin: "auto",
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <h1>
                  {game.status === "Starting" && "Game starting soon..."}
                  {game.status === "Active" && "Redirecting..."}
                </h1>
              </div>
            </div>
          )}
          <h1>{game.hostName}'s Fishbowl Lobby</h1>
          <h1>
            Game Code:{" "}
            <b>
              <u>
                <em>{game.code}</em>
              </u>
            </b>
          </h1>
          {user ? (
            <h2>Welcome, {user}!</h2>
          ) : (
            <h2>Uh oh, we don't know your name.</h2>
          )}
          <h2>Game Status: {game.status}</h2>
          {user === game.hostName && (
            <button onClick={() => startGame()}>Start Game</button>
          )}
          <h1>Teams:</h1>

          <div
            className="flexRow evenly"
            style={{
              margin: "auto",
              width: "50%",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>Free Agents:</h3>
              {game.players.map((player, index) => {
                const isOnTeam = game.teams.some((team) =>
                  team.players.includes(player),
                );
                if (!isOnTeam) {
                  return <p key={index}>{player}</p>;
                }
              })}
            </div>
            {game.teams.map((team, index) => (
              <div key={index}>
                <h3>{team.name}</h3>
                {team.players.map((player, playerIndex) => (
                  <p key={playerIndex}>{player}</p>
                ))}
                <button onClick={() => joinTeam(team.name)}>Join Team</button>
              </div>
            ))}
          </div>
          <div
            className="flexRow evenly"
            style={{ margin: "auto", width: "50%" }}
          >
            <form
              className="flexColumn"
              onSubmit={(e) => {
                e.preventDefault();
                submitNewWord();
              }}
            >
              <h1>
                {game.words.length} Words out of{" "}
                {game.settings.wordsPerPlayer * game.players.length}
              </h1>

              <input
                type="text"
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
              />
              <button type="submit">Add Word</button>
            </form>
          </div>
          <div
            className="flexRow evenly"
            style={{ margin: "auto", width: "50%" }}
          >
            <div className="flexColumn">
              <h3>Rounds:</h3>
              <div>
                {game.settings.rounds.map((round, index) => (
                  <p key={index}>
                    <b>Round {index + 1}:</b> {round}
                  </p>
                ))}
              </div>
            </div>
            <div className="flexColumn">
              <h3>Time per Round:</h3>
              <p>
                {game.settings.timePerRound.minutes} minutes and{" "}
                {game.settings.timePerRound.seconds} seconds
              </p>
            </div>
            <div className="flexColumn">
              <h3>Words per Player:</h3>
              <p>{game.settings.wordsPerPlayer}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {!user ? (
            <h1 style={{ marginTop: "30vh" }}>
              Please go back and enter your name.
            </h1>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      )}
    </>
  );
}
