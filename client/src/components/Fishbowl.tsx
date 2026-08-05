import type { Game } from "../types/Types";

export default function Fishbowl({
  game,
  setGame,
}: {
  game: Game | null;
  setGame: any;
}) {


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
