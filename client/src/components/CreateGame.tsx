import { useState } from "react";
import { useNavigate } from "react-router";

import { createFishbowlGame } from "../api/fetch";

type FishbowlSettings = {
  teams: { name: string; players: string[]; }[];
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Creating game with settings: ", fishbowlSettings);
        if (!user) return alert("Please go back and enter your name before creating a game.");
        createGame();
      }}
    >
      <h1>Game Setup</h1>
      <h3>Rounds:</h3>
      <div style={{ margin: "auto", width: "max-content" }}>
        {fishbowlSettings.rounds.map((round, index) => (
          <p style={{ width: "max-content" }} key={index}>
            <b>Round {index + 1}:</b>{" "}
            <input
              onChange={(e) => {
                const newRounds = [...fishbowlSettings.rounds];
                newRounds[index] = e.target.value;
                setFishbowlSettings({ ...fishbowlSettings, rounds: newRounds });
              }}
              value={round}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                const newRounds = fishbowlSettings.rounds.filter(
                  (_, i) => i !== index,
                );
                setFishbowlSettings({ ...fishbowlSettings, rounds: newRounds });
              }}
            >
              X
            </button>
          </p>
        ))}
        <button
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
      <h3>Number of Teams:</h3>
      <input
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
      <h3>Words Per Player</h3>
      <input
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
      <h3>Time Per Round:</h3>

      <label htmlFor="minutesPerRound">
        Minutes:
        <input
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
      </label>
      <br></br>
      <label htmlFor="secondsPerRound">
        Seconds:
        <input
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
      </label>
      <br></br>
      <br></br>
      <button type="submit">Create Game</button>
    </form>
  );
}
