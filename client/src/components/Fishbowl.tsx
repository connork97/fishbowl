import { getFishbowlGameByCode } from "../api/fetch";
import type { Game } from "../types/Types";
import { normalizeGameData } from "../utils/normalizeGameData";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Fishbowl({
  game,
  setGame,
}: {
  game: Game | null;
  setGame: any;
}) {
  const location = useLocation();
  const gameCode = location.pathname.split("/").pop();

  useEffect(() => {
    const fetchGameData = async () => {
      if (!gameCode) return;

      const gameData = await getFishbowlGameByCode(gameCode);
      const normalizedGameData = normalizeGameData(gameData);
      setGame(normalizedGameData);
    };

    fetchGameData();
  }, [gameCode, setGame]);

  return (
    <div>
      <h1>Game Component</h1>
      {game ? (
        <div>
          <h2>Game Code: {game.code}</h2>
          <h3>Hosted by: {game.hostName}</h3>
          <h3>Players:</h3>
          <ul>
            {game.teams.map((team) => (
              <li key={team.name}>
                {team.name}: {team.players.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading game data...</p>
      )}
    </div>
  );
}
