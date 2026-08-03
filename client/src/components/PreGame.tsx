import type { Game } from "../types/Types";

export default function PreGame({ game, user }: { game: Game | null; user: string }) {
  return (
    <div>
      <h1>PreGame Lobby</h1>
      <h2>Welcome, {user}!</h2>
      {game ? (
        <div>
          <h2>Game Code: {game.code}</h2>
          <h3>Hosted by: {game.hostName}</h3>
          <h3>Players:</h3>
          <div style={{margin: 'auto', width: '50%', display: 'flex', justifyContent: 'space-evenly'}}>
            {game.players.map((player, index) => (
              <p key={index} style={{}}>{player}</p>
            ))}
          </div>
            <h3>Teams:</h3>
            <div style={{margin: 'auto', width: '50%', display: 'flex', justifyContent: 'space-evenly'}}>
               {game.teams.map((team, index) => (
                 <div key={index}>
                   <h4>{team.name}</h4>
                   <p>{team.players.join(", ")}</p>
                 </div>
               ))}
            </div>
            <h3>Rules:</h3>
            <div>
               <h3>Rounds:</h3>
               <div>
                   {game.settings.rounds.map((round, index) => (
                     <p key={index}>
                       <b>Round {index + 1}:</b> {round}
                     </p>
                   ))}
               </div>
               <h3>Time per Round:</h3>
               <p>{game.settings.timePerRound.minutes} minutes and {game.settings.timePerRound.seconds} seconds</p>
               <h3>Words per Player:</h3>
               <p>{game.settings.wordsPerPlayer}</p>
            </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
