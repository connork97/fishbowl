export interface Game {
  id: string;
  status: string;
  host: string;

  rounds: string[];

  players: string[];
  words: string[];
  teams: string[];
}

export interface User {
  name: string;
}