import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getFishbowlGameByCode, joinGameByCode } from "../api/fetch";
import { normalizeGameData } from "../utils/normalizeGameData";

import "../App.css";
import { getLocalStorageGameCode, setLocalStoragePlayerName } from "../utils/localStorage";

export default function Home({ playerName, setPlayerName, setGame }: any) {
  const navigate = useNavigate();

  const handleNewPlayerSubmit = (e: any) => {
    e.preventDefault();
    console.log("new player input val: ", newPlayerInputVal);
    setPlayerName(newPlayerInputVal);
    setLocalStoragePlayerName(newPlayerInputVal);
  };

  const [newPlayerInputVal, setNewPlayerInputVal] = useState("");

  const [joinGameInput, setJoinGameInput] = useState("");

  const joinGame = async (gameCode: string) => {
    const gameData = await joinGameByCode(gameCode, playerName);
    const normalizedGameData = normalizeGameData(gameData);
    setGame(normalizedGameData);
    navigate(`/lobby/${gameCode}`);
  };

  
  const checkLastGameCode = async () => {
    const lastGameCode = getLocalStorageGameCode();
    console.log("lastGameCode: ", lastGameCode);
    if (lastGameCode) {
      const lastGameData = await getFishbowlGameByCode(lastGameCode);
      if (!lastGameData) return;
      if (lastGameData.status !== 'Complete' && window.confirm(`You have a saved game with code ${lastGameCode}. Would you like to resume it?`)) {
        setGame(lastGameData);
        navigate(`/lobby/${lastGameCode}`);
      }
    }
  }

  useEffect(() => {
    if (!playerName) return;
    checkLastGameCode();
  }, [playerName]);

  return (
    <div className="containerMain">
      {!playerName ? (
        <>
          <form onSubmit={handleNewPlayerSubmit} className="verticalWrapperMain" style={{ gap: '2rem'}}>
            <h1 className="titleMain">Welcome to Fishbowl</h1>
            <label htmlFor="newPlayerInput" className="inputLabelMain">
              First, please enter your name
            </label>
            <input
              id="newPlayerInput"
              className="inputMain"
              type="text"
              value={newPlayerInputVal}
              onChange={(e) => setNewPlayerInputVal(e.target.value)}
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
            <h1 className="titleMain">Welcome, {playerName}!</h1>
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
