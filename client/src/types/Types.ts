export type Game = {
  id: string;
  code: string;
  status:
    | "Pre-Game"
    | "Starting"
    | "Loading"
    | "Active"
    | "Completed"
    | "Inactive";

  hostName: string;
  players: string[];
  teams: {
    name: string;
    players: string[];
    playerIndex: number;
    score: number;
  }[];

  settings: {
    rounds: string[];
    roundIndex: number;
    teamIndex: number;
    wordsPerPlayer: number;
    timePerRound: {
      minutes: number;
      seconds: number;
    };
    remainingTime: number;
  };

  words: string[];
  availableWords: string[];
};

export type User = {
  name: string;
};
