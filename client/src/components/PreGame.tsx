import { useLocation } from "react-router-dom";
import type { Game } from "../types/Types";
import { useEffect } from "react";
import { getFishbowlGameByCode } from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

export default function PreGame({
  game,
  setGame,
  user,
}: {
  game: Game | null;
  setGame: any;
  user: string;
}) {
  const location = useLocation();
  const gameCode = location.pathname.split("/").pop();

  useEffect(() => {
    if (!gameCode) return;

    let isCancelled = false;

    const getGameData = async () => {
      try {
        const gameData = await getFishbowlGameByCode(gameCode);
        const normalizedGameData = normalizeGameData(gameData);

        if (!isCancelled) {
          setGame(normalizedGameData);
        }
      } catch (error) {
        console.error("Failed to refresh game data:", error);
      }
    };

    void getGameData();
    const intervalId = window.setInterval(getGameData, 5000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [gameCode, setGame]);

  return (
    <div>
      <h1>PreGame Lobby</h1>
      <h2>Welcome, {user}!</h2>
      {game ? (
        <div>
          <h2>Game Code: {game.code}</h2>
          <h3>Hosted by: {game.hostName}</h3>
          <h3>Players:</h3>
          <div
            style={{
              margin: "auto",
              width: "50%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {game.players.map((player, index) => (
              <p key={index} style={{}}>
                {player}
              </p>
            ))}
          </div>
          <h3>Teams:</h3>
          <div
            style={{
              margin: "auto",
              width: "50%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {game.teams.map((team, index) => (
              <div key={index}>
                <h4>{team.name}</h4>
                <p>{team.players.join(", ")}</p>
              </div>
            ))}
          </div>
          <h3>Rules:</h3>
          <div>
            <h3>Rounds:</h3>
            <div>
              {game.settings.rounds.map((round, index) => (
                <p key={index}>
                  <b>Round {index + 1}:</b> {round}
                </p>
              ))}
            </div>
            <h3>Time per Round:</h3>
            <p>
              {game.settings.timePerRound.minutes} minutes and{" "}
              {game.settings.timePerRound.seconds} seconds
            </p>
            <h3>Words per Player:</h3>
            <p>{game.settings.wordsPerPlayer}</p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
