import { useLocation, useNavigate } from "react-router-dom";
import type { Game } from "../types/Types";
import { useEffect, useState } from "react";
import {
  joinFishbowlTeam,
  addFishbowlWordToGame,
  setGameStatus,
} from "../api/fetch";

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
  const timerDelay = 1;

  const navigate = useNavigate();
  const location = useLocation();
  const gameCode = location.pathname.split("/").pop() ?? "";

  useEffect(() => {
    if (!gameCode) return;
    socket.emit("join_game", gameCode);
  }, [gameCode]);

  const [redirectTimer, setRedirectTimer] = useState<number>(timerDelay);

  useEffect(() => {
    const redirectToGame = () => navigate(`/game/${gameCode}`);
    // set redirectTimer to 5, decrementing every second
    if (game?.status === "Active") {
      for (let i = timerDelay; i > 0; i--) {
        setTimeout(
          () => {
            setRedirectTimer(i);
          },
          (timerDelay - i) * 1000,
        );
      }
      setTimeout(redirectToGame, timerDelay * 1000);
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
      }, timerDelay * 1000);
    }
  };

  if (!game && !user) {
    return <h1>Loading game and user...</h1>;
  } else if (!game) {
    return <h1>Finding game...</h1>;
  } else if (!user) {
    return <h1>Finding user...</h1>;
  }

  return (
    <div
      className="containerMain"
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
            height: "100%",
            width: "100%",
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
              {game.status === "Active" && `Redirecting in ${redirectTimer}...`}
            </h1>
          </div>
        </div>
      )}
      <div className="verticalWrapperMain">
        <h1 className="titleMain">{game.hostName}'s Fishbowl Lobby</h1>
        <h1 className="titleMain">Game Code: {game.code}</h1>
        {/* {user ? (
          <h2 className="headerMain">Welcome, {user}!</h2>
        ) : (
          <h2 className="headerMain">Uh oh, we don't know your name.</h2>
        )} */}
        <h2 className="headerMain">Game Status: {game.status}</h2>
        {user === game.hostName && (
          <button className="buttonMain" onClick={() => startGame()}>
            Start Game
          </button>
        )}
        <div className="verticalWrapperMain">
          <h2 className="titleMain">Teams:</h2>
          <div
            className="horizontalWrapperMain"
            style={{ height: "max-content", gap: "1rem", flexWrap: "wrap" }}
          >
            <div className="verticalWrapperMain">
              <h3 className="headerMain">Free Agents</h3>
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
              <div
                key={index}
                className="verticalWrapperMain"
                style={{ height: "100%" }}
              >
                <h3 className="headerMain">{team.name}</h3>
                {team.players.map((player, playerIndex) => (
                  <p key={playerIndex}>{player}</p>
                ))}
                <button
                  className="buttonMain buttonSmall"
                  onClick={() => joinTeam(team.name)}
                >
                  Join Team
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="verticalWrapperMain">
        <form
          className="verticalWrapperMain"
          onSubmit={(e) => {
            e.preventDefault();
            submitNewWord();
          }}
        >
          <h1 className="titleMain">
            {game.words.length} Words out of{" "}
            {game.settings.wordsPerPlayer * game.players.length}
          </h1>

          <input
            type="text"
            value={newWordInput}
            onChange={(e) => setNewWordInput(e.target.value)}
          />
          <button type="submit" className="buttonMain">
            Add Word
          </button>
        </form>
      </div>
      <div className="horizontalWrapperMain">
        <div className="verticalWrapperMain">
          <h3 className="headerMain">Rounds:</h3>
          {game.settings.rounds.map((round, index) => (
            <p key={index}>
              <b>Round {index + 1}:</b> <p>{round}</p>
            </p>
          ))}
        </div>
        <div className="verticalWrapperMain">
          <h3 className="headerMain">Time per Round:</h3>
          <p>
            {game.settings.timePerRound.minutes} minutes and{" "}
            {game.settings.timePerRound.seconds} seconds
          </p>
        </div>
        <div className="verticalWrapperMain">
          <h3 className="headerMain">Words per Player:</h3>
          <p>{game.settings.wordsPerPlayer}</p>
        </div>
      </div>
    </div>
  );
}
