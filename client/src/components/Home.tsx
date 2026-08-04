import { useState } from "react";
import { useNavigate } from "react-router";
import { joinGameByCode } from "../api/fetch";

export default function Home({ user, setUser, setGame }: any) {
  const navigate = useNavigate();
  const navigateToCreateGame = () => {
    navigate("/create-game");
  };
  const handleNewUserSubmit = (e: any) => {
    e.preventDefault();
    console.log("new user input val: ", newUserInputVal);
    setUser(newUserInputVal);
  };

  const [newUserInputVal, setNewUserInputVal] = useState("");

  const [joinGameInput, setJoinGameInput] = useState("");

  //   const fetchGameData = async (gameCode: string) => {
  //    console.log("Fetching game data for code: ", typeof gameCode);
  //    try {
  //       const response = await fetch(`http://localhost:5555/games/${gameCode}`);
  //       // if (!response.ok) {
  //       //   throw new Error(`HTTP error! status: ${response.status}`);
  //       // }
  //       const gameData = await response.json();
  //       console.log("Fetched game data: ", gameData);
  //       return gameData;
  //     } catch (error) {
  //       console.error("Error fetching game data:", error);
  //       alert("Error fetching game data. Please check the game code and try again.");
  //     }
  //   };

  const joinGame = async (gameCode: string) => {
   const gameData = await joinGameByCode(gameCode, user);
   //  console.log("Fetching game data for code: ", typeof gameCode);
   //  try {
   //    const response = await fetch(`http://localhost:5555/games/${gameCode}/join`, {
   //      method: "POST",
   //      headers: {
   //        "Content-Type": "application/json",
   //      },
   //      body: JSON.stringify({ playerName: user }),
   //    });
   //    if (!response.ok) {
   //      throw new Error(`HTTP error! status: ${response.status}`);
   //    }
   //    const gameData = await response.json();
   //    console.log("Fetched game data: ", gameData);
      setGame({
         id: gameData.id,
         code: gameData.code,
         hostName: gameData.host_name,
         players: gameData.players,
         teams: gameData.teams,
         words: gameData.words,
         settings: {
           rounds: gameData.settings.rounds,
           wordsPerPlayer: gameData.settings.words_per_player,
           timePerRound: gameData.settings.time_per_round,
         },
      });
      navigate(`/lobby/${gameCode}`);

   //    navigate(`/lobby/${gameCode}`);
   //    return gameData;
   //  } catch (error) {
   //    console.error("Error fetching game data:", error);
   //    alert(
   //      "Error fetching game data. Please check the game code and try again.",
   //    );
   //  }
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
          <button onClick={() => navigateToCreateGame()}>Create a Game</button>
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
