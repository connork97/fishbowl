import { useState } from "react";
import { useNavigate } from "react-router";

import { createFishbowlGame } from "../api/fetch";

import "../App.css";

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
        <div className="verticalWrapperMain">
          <h1 className="titleMain">Game Setup</h1>
          <h3 className="headerMain">Rounds:</h3>
          {fishbowlSettings.rounds.map((round, index) => (
            <div key={index}>
              <p key={index}>
                <b>Round {index + 1}:</b>{" "}
              </p>
              <div className="horizontalWrapperMain">
              <input
                className="inputMain"
                onChange={(e) => {
                  const newRounds = [...fishbowlSettings.rounds];
                  newRounds[index] = e.target.value;
                  setFishbowlSettings({
                    ...fishbowlSettings,
                    rounds: newRounds,
                  });
                }}
                value={round}
              />
              <button
                className="buttonSquare delete"
                onClick={(e) => {
                  e.preventDefault();
                  const newRounds = fishbowlSettings.rounds.filter(
                    (_, i) => i !== index,
                  );
                  setFishbowlSettings({
                    ...fishbowlSettings,
                    rounds: newRounds,
                  });
                }}
              >
                X
              </button>
              </div>
            </div>
          ))}
          <button
            className="buttonMain"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setFishbowlSettings({
                  ...fishbowlSettings,
                  rounds: [...fishbowlSettings.rounds, ""],
                });
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              setFishbowlSettings({
                ...fishbowlSettings,
                rounds: [...fishbowlSettings.rounds, ""],
              });
            }}
          >
            Add Round
          </button>
        </div>
        <div className="horizontalWrapperMain" style={{gap: '2rem'}}>
          <div className="verticalWrapperMain">
            <h3 className="headerMain">Teams</h3>
            <input
              className="inputMain inputSmall"
              type="number"
              value={fishbowlSettings.teams.length}
              onChange={(e) => {
                const newTeamCount = Number(e.target.value);
                const newTeams = [...fishbowlSettings.teams];
                if (newTeamCount > newTeams.length) {
                  for (let i = newTeams.length; i < newTeamCount; i++) {
                    newTeams.push({ name: `Team ${i + 1}`, players: [] });
                  }
                } else {
                  newTeams.splice(newTeamCount);
                }
                setFishbowlSettings({ ...fishbowlSettings, teams: newTeams });
              }}
            />
          </div>
          <div className="verticalWrapperMain">
            <h3 className="headerMain">Players</h3>
            <input
              className="inputMain inputSmall"
              id="wordsPerPlayer"
              type="number"
              value={fishbowlSettings.wordsPerPlayer}
              onChange={(e) =>
                setFishbowlSettings({
                  ...fishbowlSettings,
                  wordsPerPlayer: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="verticalWrapperMain">
          <h3 className="headerMain">Time Per Round:</h3>
          <div className="horizontalWrapperMain" style={{gap: '2rem'}}>
            <div className="verticalWrapperMain">
              <label className="inputLabelMain" htmlFor="minutesPerRound">
                Minutes
              </label>
              <input
                className="inputMain inputSmall"
                id="minutesPerRound"
                type="number"
                value={fishbowlSettings.timePerRound.minutes}
                onChange={(e) =>
                  setFishbowlSettings({
                    ...fishbowlSettings,
                    timePerRound: {
                      ...fishbowlSettings.timePerRound,
                      minutes: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
            <div className="verticalWrapperMain">
              <label className="inputLabelMain" htmlFor="secondsPerRound">
                Seconds
              </label>
              <input
                className="inputMain inputSmall"
                id="secondsPerRound"
                type="number"
                value={fishbowlSettings.timePerRound.seconds}
                onChange={(e) =>
                  setFishbowlSettings({
                    ...fishbowlSettings,
                    timePerRound: {
                      ...fishbowlSettings.timePerRound,
                      seconds: Number(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
        <button className="buttonMain buttonSubmit" type="submit">
          Create Game
        </button>
      </form>
    </div>
  );
}
