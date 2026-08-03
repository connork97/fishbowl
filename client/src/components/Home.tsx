import { useState } from "react";
import { useNavigate } from "react-router";

export default function Home({ user, setUser } : any) {
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
          <h2>Would you like to create a game or join one?</h2>
          <button onClick={() => navigateToCreateGame()}>Create a Game</button>
          <br></br>
          <br></br>
          <button>Join a Game</button>
        </div>
      )}
    </div>
  );
}
