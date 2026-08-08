import { useState } from "react";
import { useNavigate } from "react-router";
import { joinGameByCode } from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

import "../App.css";

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
    <div className="containerMain">
      {!user ? (
        <>
          <form onSubmit={handleNewUserSubmit} className="verticalWrapperMain" style={{ gap: '2rem'}}>
            <h1 className="titleMain">Welcome to Fishbowl</h1>
            <label htmlFor="newUserInput" className="inputLabelMain">
              First, please enter your name
            </label>
            <input
              id="newUserInput"
              className="inputMain"
              type="text"
              value={newUserInputVal}
              onChange={(e) => setNewUserInputVal(e.target.value)}
              style={{fontSize: '1.5rem', width: '75%'}}
            />
            <button type="submit" className="buttonMain">
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="verticalWrapperMain"
              style={{ gap: '3rem'}}
          >
            <h1 className="titleMain">Welcome, {user}!</h1>
            <form
              className="verticalWrapperMain"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="joinGameButton" className="inputLabelMain">
                Create a New Game:
              </label>
              <button
                className="buttonMain"
                onClick={() => navigate("/create-game")}
              >
                Create a Game
              </button>
            </form>
            {/* <h2>Or Join One By Code:</h2> */}
            <form
              className="verticalWrapperMain"
              onSubmit={(e) => {
                e.preventDefault();
                if (!joinGameInput) {
                  alert("Please enter a game code to join a game.");
                  return;
                }
                console.log("Joining game with code: ", joinGameInput);
                joinGame(joinGameInput);
              }}
            >
              <label htmlFor="joinGameInput" className="inputLabelMain">
                Join a Game by Code:
              </label>
              <input
                id="joinGameInput"
                className="inputMain"
                type="text"
                placeholder="Ex) 2XBZ"
                value={joinGameInput}
                onChange={(e) => setJoinGameInput(e.target.value)}
                style={{ fontSize: '1.5rem', width: '50%'}}
              />
              <button type="submit" className="buttonMain">
                Join Game
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
