export type Game = {
  id: string;
  code: string;
  status: "Pre-Game" | "Starting" | "Loading" | "Active" | "Completed" | "Inactive";

  hostName: string;
  players: string[];

  teams: { name: string; players: string[]; score: number }[];

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
  availableWords: string[];
}

export type User = {
  name: string;
}