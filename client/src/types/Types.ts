export type Game = {
  id: string;
  code: string;
  status: string;
  hostName: string;

  rounds: string[];

  players: string[];
  words: string[];
  teams: string[];
}

export type User = {
  name: string;
}