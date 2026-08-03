import { useState, useEffect } from "react";
import { CreateGame } from "./components/CreateGame";
import type { Game } from "./types/Types";

function App() {
  const [game, setGame] = useState<Game>({
    id: "",
    status: "Setup",
    host: "",
    rounds: [],
    players: [],
    words: [],
    teams: [],
  });

  const [user, setUser] = useState("");

  const handleNewUserSubmit = (e: any) => {
    e.preventDefault();
    console.log("new user input val: ", newUserInputVal);
    setUser(newUserInputVal);
  };

  const [newUserInputVal, setNewUserInputVal] = useState("");

  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);

  return (
    <div style={{ margin: "auto", textAlign: "center" }}>
      <h1>Welcome to Fishbowl</h1>
      {!user ? (
        <div>
          <h2>
            First, please enter your name<br></br>(as you'd like it to appear in
            game):
          </h2>
          <form onSubmit={handleNewUserSubmit}>
            <input
              type="text"
              value={newUserInputVal}
              onChange={(e) => setNewUserInputVal(e.target.value)}
            />
            <button>Submit</button>
          </form>
        </div>
      ) : (
        <div>
          <h1>Welcome, {user}!</h1>
          <h2>Would you like to create a game or join one?</h2>
          <button onClick={() => setShowCreateGame(true)}>Create a Game</button>
          <br></br>
          <br></br>
          <button onClick={() => setShowJoinGame(true)}>Join a Game</button>
        </div>
      )}

      {showCreateGame && <CreateGame user={user} game={game} setGame={setGame} />}

      {/* 
      <h2>Would you like to create a game or join one?</h2>
      <button onClick={() => setShowCreateGame(true)}>Create a Game</button>
      <br></br>
      <br></br>
      <button>Join a Game</button>

      {showCreateGame && <CreateGame user={user} game={game} setGame={setGame} />} */}

      {/* {user ? (
        <div>
          <div>
            <h2>Welcome, {user}!</h2>
            <button onClick={() => setUser("")}>Change Name</button>
          </div>
          <div>
            <h2>Game Setup</h2>
            {!showCreateGame ? (
              <button
                onClick={() => {
                  setShowCreateGame(true);
                  setGame({
                    id: generateGameId(),
                    status: "Setup",
                    players: [user],
                    host: user,
                    rounds: [
                      "Describe the word.",
                      "Charades: Act out the word (no sounds).",
                      "One word only.",
                    ],
                    words: [],
                    teams: [],
                  });
                }}
              >
                Setup Game
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowCreateGame(false);
                }}
              >
                Cancel
              </button>
            )}
            {showCreateGame && (
              <CreateGame user={user} game={game} setGame={setGame} />
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
      )} */}
    </div>
  );
}

export default App;
