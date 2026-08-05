export type Game = {
  id: string;
  code: string;
  status: "Pre-Game" | "Starting" | "Loading" | "Active" | "Completed" | "Inactive";

  hostName: string;
  players: string[];

  teams: { name: string; players: string[] }[];

  settings: {
    rounds: string[];
    timePerRound: {
      minutes: number;
      seconds: number;
    };
    wordsPerPlayer: number;
  };
  // rounds: string[];

  words: string[];
}

export type User = {
  name: string;
}