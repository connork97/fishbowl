import type { Game } from '../types/Types';

export const normalizeGameData = (apiGameData: any): Game => {
   const normalizedGameData: Game = {
      id: apiGameData.id,
      code: apiGameData.code,
      status: apiGameData.status,
      hostName: apiGameData.host_name,
      players: apiGameData.players,
      teams: apiGameData.teams.map((team: any) => ({
         name: team.name,
         players: team.players,
         score: team.score,
      })),
      settings: {
         rounds: apiGameData.settings.rounds,
         timePerRound: {
            minutes: apiGameData.settings.time_per_round?.minutes || 1,
            seconds: apiGameData.settings.time_per_round?.seconds || 0,
         },
         wordsPerPlayer: apiGameData.settings.words_per_player,
      },
      words: apiGameData.words,
      availableWords: apiGameData.available_words,
   };

   return normalizedGameData;
}