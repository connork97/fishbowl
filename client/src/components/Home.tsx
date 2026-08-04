import { useState } from "react";
import { useNavigate } from "react-router";
import { joinGameByCode } from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

export default function Home({ user, setUser, setGame }: any) {
  const navigate = useNavigate();

  const handleNewUserSubmit = (e: any) => {
    e.preventDefault();
    console.log("new user input val: ", newUserInputVal);
    setUser(newUserInputVal);
  };

  const [newUserInputVal, setNewUserInputVal] = useState("");

  const [joinGameInput, setJoinGameInput] = useState("");

  const joinGame = async (gameCode: string) => {
    const gameData = await joinGameByCode(gameCode, user);
    const normalizedGameData = normalizeGameData(gameData);
    setGame(normalizedGameData);
    navigate(`/lobby/${gameCode}`);
  };

  return (
    <div>
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
          <button onClick={() => navigate('/create-game')}>Create a Game</button>
          <h2>or enter game code below</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Joining game with code: ", joinGameInput);
              joinGame(joinGameInput);
            }}
          >
            <input
              type="text"
              placeholder="Ex) 2XBZ"
              value={joinGameInput}
              onChange={(e) => setJoinGameInput(e.target.value)}
            />
            <br></br>
            <br></br>
            <button type="submit">Join Game</button>
          </form>
        </div>
      )}
    </div>
  );
}
