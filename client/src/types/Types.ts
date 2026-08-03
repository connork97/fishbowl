export type Game = {
  id: string;
  code: string;

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