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
         playerIndex: team.player_index,
      })),
      settings: {
         rounds: apiGameData.settings.rounds,
         roundIndex: apiGameData.settings.round_index,
         teamIndex: apiGameData.settings.team_index,
         wordsPerPlayer: apiGameData.settings.words_per_player,
         timePerRound: {
            minutes: apiGameData.settings.time_per_round.minutes,
            seconds: apiGameData.settings.time_per_round.seconds,
         },
         remainingTime: apiGameData.settings.remaining_time
      },
      words: apiGameData.words,
      availableWords: apiGameData.available_words,
   };

   return normalizedGameData;
}