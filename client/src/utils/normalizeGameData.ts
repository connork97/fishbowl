import type { Game } from '../types/Types';

export const normalizeGameData = (apiGameData: any): Game => {
   const normalizedGameData: Game = {
      id: apiGameData.id,
      code: apiGameData.code,
      hostName: apiGameData.host_name,
      players: apiGameData.players,
      teams: apiGameData.teams.map((team: any) => ({
         name: team.name,
         players: team.players,
      })),
      settings: {
         rounds: apiGameData.settings.rounds,
         timePerRound: {
            minutes: apiGameData.settings.time_per_round.minutes,
            seconds: apiGameData.settings.time_per_round.seconds,
         },
         wordsPerPlayer: apiGameData.settings.words_per_player,
      },
      words: apiGameData.words,
   };

   return normalizedGameData;
}