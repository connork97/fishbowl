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

  const freeAgents = game?.players.filter((player) => {
    return !game.teams.some((team) => team.players.includes(player));
  });

  const renderFreeAgents =
    freeAgents &&
    (freeAgents?.length > 0 ? (
      freeAgents?.map((player, index) => <p key={index}>{player}</p>)
    ) : (
      <p>No free agents</p>
    ));

  const renderTeams = game?.teams.map((team, index) => {
    if (team.players.length === 0) {
      return (
        <div key={index} className="verticalWrapperMain">
          <h3 className="headerMain">{team.name}</h3>
          <p>No players</p>
        </div>
      );
    } else {
      return (
        <div key={index} className="verticalWrapperMain">
          <h3 className="headerMain">{team.name}</h3>
          {team.players.map((player, playerIndex) => (
            <p key={playerIndex}>{player}</p>
          ))}
        </div>
      );
    }
  });

  const minutesPerRound = game?.settings.timePerRound.minutes ?? 0;
  const secondsPerRound = game?.settings.timePerRound.seconds ?? 0;

  let timePerRoundString = "";

  if (minutesPerRound > 0) {
    timePerRoundString += `${minutesPerRound} Minute${
      minutesPerRound > 1 ? "s" : ""
    }`;
  }
  if (secondsPerRound > 0) {
    if (timePerRoundString) timePerRoundString += " and ";
    timePerRoundString += `${secondsPerRound} second${
      secondsPerRound > 1 ? "s" : ""
    }`;
  }

  timePerRoundString += " Per Round";

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
            position: "absolute",
            top: 0,
            left: 0,
            height: "100dvh",
            width: "100dvw",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
            <h1
              className="titleMain"
              style={{ width: "max-content", textAlign: "center" }}
            >
              {game.status === "Starting" && "Game starting soon..."}
              {game.status === "Active" && `Redirecting in ${redirectTimer}...`}
            </h1>
          </div>
        </div>
      )}
      {game.status !== "Starting" && game.status !== "Active" && (
        <>
          <div className="verticalWrapperMain" style={{ gap: 0 }}>
            <h1 className="titleMain">{game.hostName}'s Fishbowl Lobby</h1>
            <h1 className="titleMain">Game Code: {game.code}</h1>
            {user === game.hostName && (
              <button
                className="buttonMain"
                onClick={() => startGame()}
                style={{ scale: 1.25, margin: "1rem auto" }}
              >
                Start Game
              </button>
            )}
            <div className="verticalWrapperMain">
              <div className="verticalWrapperMain">
                <h3 className="headerMain">Free Agents:</h3>
                <div className="horizontalWrapperMain">{renderFreeAgents}</div>
              </div>
              <div
                className="horizontalWrapperMain"
                style={{ height: "max-content", gap: "2rem", flexWrap: "wrap" }}
              >
                {renderTeams}
              </div>
              <div
                className="horizontalWrapperMain"
                style={{
                  height: "max-content",
                  gap: "2rem",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}
              >
                {game.teams.map((team, index) => (
                  <button
                    key={index}
                    className="buttonMain buttonSmall"
                    onClick={() => joinTeam(team.name)}
                  >
                    Join Team
                  </button>
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
              <h1 className="headerMain">
                {game.words.length} Words out of{" "}
                {game.settings.wordsPerPlayer * game.players.length}
              </h1>

              <input
                className="inputMain"
                type="text"
                value={newWordInput}
                onChange={(e) => setNewWordInput(e.target.value)}
                style={{ height: "2rem", width: "20rem" }}
              />
              <button type="submit" className="buttonMain">
                Add Word
              </button>
            </form>
            <div style={{marginTop: '1rem', padding: '2rem', borderRadius: '0.5rem', background: 'rgba(0, 0, 0, 0.5)'}}>
              <h3 className="headerMain" style={{textAlign: 'center'}}><u>Additional Settings:</u></h3>
            <div className="verticalWrapperMain" style={{ marginTop: "1rem" }}>
              {game.settings.rounds.map((round, index) => (
                <p key={index} className="alignLeft" style={{ fontSize: "1.5rem" }}>
                  <b>Round {index + 1}:</b>{" "}
                  <span style={{ marginLeft: "0.5rem" }}>{round}</span>
                </p>
              ))}
            </div>
            <div className="verticalWrapperMain" style={{ marginTop: "1rem" }}>
              <h3 className="headerMain alignLeft">{timePerRoundString}</h3>
              <h3 className="headerMain alignLeft">
                {game.settings.wordsPerPlayer} Words Per Player
              </h3>
            </div>
              </div>
          </div>
        </>
      )}
    </div>
  );
}
