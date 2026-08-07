import { useState } from "react";
import { useNavigate } from "react-router";

import { createFishbowlGame } from "../api/fetch";

import "../App.css";
import Rounds from "./GameSetup/Rounds";
import PlayersAndTeams from "./GameSetup/PlayersAndTeams";
import Time from "./GameSetup/Time";

type FishbowlSettings = {
  teams: { name: string; players: string[] }[];
  wordsPerPlayer: number;

  rounds: string[];
  timePerRound: {
    minutes: number;
    seconds: number;
  };
};

export function CreateGame({ user, setGame }: { user: any; setGame: any }) {
  const navigate = useNavigate();
  const [fishbowlSettings, setFishbowlSettings] = useState<FishbowlSettings>({
    teams: [
      { name: `Team 1`, players: [user] },
      { name: "Team 2", players: [] },
    ],
    wordsPerPlayer: 3,
    rounds: ["Description", "Act It Out", "One Word"],
    timePerRound: { minutes: 1, seconds: 0 },
  });

  const createGame = async () => {
    const normalizedGameData = await createFishbowlGame(user, fishbowlSettings);
    if (!normalizedGameData) {
      alert("Error creating game. Please try again.");
      return;
    }
    setGame(normalizedGameData);
    navigate(`/lobby/${normalizedGameData.code}`);
  };

  return (
    <div className="containerMain">
      <form
        className="verticalWrapperMain"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Creating game with settings: ", fishbowlSettings);
          if (!user)
            return alert(
              "Please go back and enter your name before creating a game.",
            );
          createGame();
        }}
      >
        {/* <div style={{ margin: "auto", width: "max-content" }}> */}
        <h1 className="titleMain">Game Setup</h1>
        <Rounds
          fishbowlSettings={fishbowlSettings}
          setFishbowlSettings={setFishbowlSettings}
        />
        <PlayersAndTeams
          fishbowlSettings={fishbowlSettings}
          setFishbowlSettings={setFishbowlSettings}
        />
        <Time
          fishbowlSettings={fishbowlSettings}
          setFishbowlSettings={setFishbowlSettings}
        />
        <button className="buttonMain buttonSubmit" type="submit">
          Create Game
        </button>
      </form>
    </div>
  );
}
