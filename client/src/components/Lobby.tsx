import { useLocation } from "react-router-dom";
import type { Game } from "../types/Types";
import { useEffect } from "react";
import { getFishbowlGameByCode } from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

export default function Lobby({
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

  const joinTeam = async (teamName: string) => {
    console.log(
      `Adding player ${user} to team ${teamName} in game ${gameCode}`,
    );
    try {
      const response = await fetch(
        `http://localhost:5555/games/${gameCode}/join-team`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerName: user, teamName }),
        },
      );
      if (!response.ok) {
        throw new Error(`Failed to join team: ${response.statusText}`);
      }
      const updatedGameData = await response.json();
      const normalizedGameData = normalizeGameData(updatedGameData);
      setGame(normalizedGameData);
    } catch (error) {
      console.error("Failed to join team:", error);
      alert("Failed to join team. Please try again.");
    }
  };

  return (
    <div>
      <h1>PreGame Lobby</h1>
      <h2>Welcome, {user}!</h2>
      {game ? (
        <div>
          <h2>Game Code: {game.code}</h2>
          <h3>Hosted by: {game.hostName}</h3>
          <h3>Teams:</h3>

          <div
            style={{
              margin: "auto",
              // width: "min-content",
              width: "50%",
              display: "flex",
              // flexDirection: "column",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
            }}
          >
            <div>
              <h3>Free Agents:</h3>
              {/* <p> */}
              {game.players.map((player, index) => {
                // Check all teams to see if the player is already on a team
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
