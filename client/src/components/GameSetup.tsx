import type { Game } from "../types/Types.ts";

export function GameSetup({
  user,
  game,
  setGame,
}: {
  user: any;
  game: Game;
  setGame: any;
}) {
  console.log(game);

  return (
    <div>
      <h1>Game Setup</h1>
      <h3>Rounds:</h3>
      <div style={{ margin: "auto", width: 'max-content' }}>
        {game.rounds.map((round, index) => (
          <p style={{ width: "max-content" }} key={index}>
            <b>Round {index + 1}:</b> {round}
            {/* {index < game.rounds.length - 1 ? ", " : ""} */}
          </p>
        ))}
      </div>
      {/* <div>
        <p>Game Status: {game.status}</p>
        <p>Players: {game.players.join(", ")}</p>
        <p>Words: {game.words.length}</p>
        <p>Teams: {game.teams.length > 0 ? game.teams.join(", ") : 'No teams'}</p>
      </div> */}
    </div>
  );
}
