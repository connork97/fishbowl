import { useState, useEffect } from "react";
import { GameSetup } from "./components/GameSetup";
import type { Game } from "./types/Types";

interface User {
  name: string;
}

const generateGameId = (length = 4): string => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ2346789";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));

  const gameId = Array.from(
    randomValues,
    (value) => characters[value % characters.length],
  ).join("");

  return gameId;
}

function App() {
  const [game, setGame] = useState<Game>({
    id: '',
    status: "Setup",
    host: '',
    players: [],
    words: [],
    teams: [],
  });


  const [user, setUser] = useState('');

  const handleNewUserSubmit = (e: any) => {
    e.preventDefault();
    console.log("new user input val: ", newUserInputVal);
    setUser(newUserInputVal);
  };

  const [newUserInputVal, setNewUserInputVal] = useState("");

  useEffect(() => {
    console.log("user state changed: ", user);
  }, [user]);

  const [showGameSetup, setShowGameSetup] = useState(false);

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h1>Fishbowl App</h1>
      {user ? (
        <div>
          <div>
            <h2>Welcome, {user}!</h2>
            <button onClick={() => setUser('')}>Change Name</button>
          </div>
          <div>
            <h2>Game Setup</h2>
            <button
              onClick={() => {
                setShowGameSetup(true);
                setGame({
                  id: generateGameId(),
                  status: "Setup",
                  players: [user],
                  host: user,
                  rounds: ['Describe the word.', 'Charades: Act out the word (no sounds).', 'One word only.'],
                  words: [],
                  teams: [],
                });
              }}
            >
              Create Game
            </button>
            {/* <button>Join Game</button> */}
            {showGameSetup && (
              <GameSetup user={user} game={game} setGame={setGame} />
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2>Please enter your name:</h2>
          <form onSubmit={handleNewUserSubmit}>
            <input
              type="text"
              value={newUserInputVal}
              onChange={(e) => setNewUserInputVal(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
