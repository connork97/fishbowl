import { useEffect } from "react";
import type { Game, User } from "../types/Types.ts";

import { generateGameId } from "../utils/generateGameId.ts";

export function CreateGame({
  user,
  game,
  setGame,
}: {
  user: any;
  game: Game;
  setGame: any;
}) {
  console.log(game);

  const handleCreateGame = () => {
    const newGame: Game = {
      ...game,
      id: generateGameId(),
      status: "Setup",
      host: user, // Replace with actual host name
      rounds: ["Describe the word.", "Charades: Act out the word.", "One word only."], // Example rounds
      players: [],
      words: [],
      teams: [],
    };
    setGame(newGame);
    console.log("New game created: ", newGame);
  };

  useEffect(() => {
    handleCreateGame();
    console.log("game state changed: ", game);
  }, []);

  return (
    <div>
      <h1>Game Setup</h1>
      <h3>Rounds:</h3>
      <div style={{ margin: "auto", width: 'max-content' }}>
        {game.rounds.map((round, index) => (
          <p style={{ width: "max-content" }} key={index}>
            <b>Round {index + 1}:</b> {round}
          </p>
        ))}
      </div>

    </div>
  );
}
