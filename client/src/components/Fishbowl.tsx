import { updateFishbowlGame } from "../api/fetch";
import type { Game } from "../types/Types";
import { randomizeArray } from "../utils/randomizeArray";
import { useEffect, useState } from "react";

import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Fishbowl({
  game,
  setGame,
  user,
}: {
  game: Game | null;
  setGame: any;
  user: string;
}) {
  const navigate = useNavigate();

  const [successfullyGuessedWords, setSuccessfullyGuessedWords] = useState<
    string[]
  >([]);
  const availableWords = game?.availableWords ?? [];

  const randomizeAvailableWords = () => {
    const randomizedWords = randomizeArray(game?.availableWords ?? []);
    setGame((prevGame: Game | null) => ({
      ...prevGame,
      availableWords: randomizedWords,
    }));
  };

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const activeRoundIndex = game?.settings.roundIndex || 0;
  let activeTeamIndex = game?.settings.teamIndex || 0;
  const activeTeam = game?.teams[activeTeamIndex];
  let activePlayerIndex = activeTeam?.playerIndex || 0;

  const currentRound = game?.settings.rounds[activeRoundIndex];
  const currentPlayer = game?.teams[activeTeamIndex].players[activePlayerIndex];
  const currentTeam = game?.teams[activeTeamIndex].name;
  const currentWord = availableWords[activeWordIndex];

  const [roundHasStarted, setRoundHasStarted] = useState(false);
  const [roundTimerIsActive, setRoundTimerIsActive] = useState(false);
  const roundTimerInSeconds =
    game?.settings?.remainingTime ||
    (game?.settings?.timePerRound?.minutes ?? 0) * 60 +
      (game?.settings?.timePerRound?.seconds ?? 0) ||
    60;

  const [roundTimer, setRoundTimer] = useState(roundTimerInSeconds);

  useEffect(() => {
    if (!roundHasStarted || !roundTimerIsActive || roundTimer <= 0) return;

    const timeoutId = window.setTimeout(() => {
      setRoundTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [roundHasStarted, roundTimerIsActive, roundTimer]);

  const handleSuccessfulGuess = () => {
    setSuccessfullyGuessedWords((prev) => [...prev, currentWord]);
    const filteredAvailableWords = availableWords.filter(
      (word) => word !== currentWord,
    );
    setGame((prevGame: Game | null) => ({
      ...prevGame,
      availableWords: filteredAvailableWords,
    }));

    if (!filteredAvailableWords[activeWordIndex]) {
      setActiveWordIndex(0);
    } else {
      let nextWordIndex = activeWordIndex + 1;
      if (nextWordIndex >= filteredAvailableWords.length) {
        nextWordIndex = 0; // Loop back to the first word
      }
      setActiveWordIndex(nextWordIndex);
    }
  };

  const prePauseCleanup = () => {
    setRoundTimerIsActive(false);
    setRoundHasStarted(false);
    setActiveWordIndex(0);
  }

  const handleRoundEnd = async () => {
    prePauseCleanup();

    if (!game) return console.error("Game data is null or undefined");

    const remainingTime = roundTimer;

    const updatedSettings = {
      ...game?.settings,
      roundIndex: activeRoundIndex + 1,
      remainingTime: remainingTime,
    };

    const updatedTeams = [...game?.teams];
    updatedTeams[activeTeamIndex] = {
      ...updatedTeams[activeTeamIndex],
      score:
        updatedTeams[activeTeamIndex].score + successfullyGuessedWords.length,
    };

    const updatedGame = {
      ...game,
      settings: updatedSettings,
      teams: updatedTeams,
      availableWords: game.words,
    };

    let nextRoundIndex = activeRoundIndex + 1;
    if (nextRoundIndex >= (game?.settings.rounds.length ?? 0)) {
      updatedGame.status = "Complete";
    }
    setGame(updatedGame);
    await updateFishbowlGame(updatedGame);
    setSuccessfullyGuessedWords([]);
  };

  useEffect(() => {
    if (!roundHasStarted) return;
    if (availableWords.length === 0 && roundTimer > 0) {
      handleRoundEnd();
    }
    if (roundTimer === 0 && availableWords.length > 0) {
      handleOutOfTime();
    }
  }, [availableWords, roundTimer]);

  const changeTurn = async (updatedGame: Game) => {
    if (!updatedGame?.code) return;

    prePauseCleanup();

    const updatedGameData = await updateFishbowlGame(updatedGame);

    setGame(updatedGameData);

    setRoundTimer(roundTimerInSeconds);
    setSuccessfullyGuessedWords([]);
  };

  const handleOutOfTime = async () => {
    if (!activeTeam) return console.error("Active team is null or undefined");
    if (!game) return console.error("Game data is null or undefined");

    // * Once the current team's turn is over, set the next player in line for their next turn
    let nextPlayerIndex = activePlayerIndex + 1;
    if (activeTeam?.players.length <= nextPlayerIndex) {
      nextPlayerIndex = 0;
    }

    let currentTeamIndex = activeTeamIndex;
    let nextTeamIndex = activeTeamIndex + 1;

    // * Switch to the next team in line
    if (nextTeamIndex >= game?.teams.length) {
      nextTeamIndex = 0;
    }

    // * Create a copy of the game state, and update teams, settings, and availableWords for the rest of the round
    const updatedTeams = [...game.teams];
    updatedTeams[currentTeamIndex] = {
      ...updatedTeams[currentTeamIndex],
      score:
        updatedTeams[currentTeamIndex].score + successfullyGuessedWords.length,
      playerIndex: nextPlayerIndex,
    };

    const updatedSettings = {
      ...game.settings,
      teamIndex: nextTeamIndex,
    };

    // * Final updated game, updating both state and sending to backend
    const updatedGame = {
      ...game,
      teams: updatedTeams,
      settings: updatedSettings,
      availableWords: availableWords,
    };

    setGame(updatedGame);
    changeTurn(updatedGame);
  };

  const handlePassWord = () => {
    let nextWordIndex = activeWordIndex + 1;
    if (nextWordIndex >= availableWords.length) {
      nextWordIndex = 0;
    }
    setActiveWordIndex(nextWordIndex);
  };

  const handleRoundStart = () => {
    randomizeAvailableWords();
    setRoundHasStarted(true);
    setRoundTimerIsActive(true);
  };

  if (game?.status === "Complete") {
    return (
      <div className="containerMain">
        <div className="verticalWrapperMain">
          <h1 className="titleMain">Game Over</h1>
          <h2 className="titleMain">Final Scores:</h2>
          {game.teams.map((team, index) => (
            <div key={index}>
              <h3 className="titleMain">{team.name}</h3>
              <p className="headerMain">Score: {team.score}</p>
            </div>
          ))}
          <button className="buttonMain" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="containerMain">
        <h1 className="titleMain">Loading game data...</h1>
      </div>
    );
  }

  return (
    <div className="containerMain">
      <h1 className="titleMain">Game Component</h1>
      <div className="verticalWrapperMain">
        {user !== currentPlayer ? (
          <>
            <h2 className="headerMain">
              Round {activeRoundIndex + 1}: {currentRound}
            </h2>
            <h2 className="headerMain">Team: {currentTeam}</h2>
            <h2 className="headerMain">Player: {currentPlayer}</h2>
            <h2 className="headerMain">
              Score:{" "}
              {successfullyGuessedWords.length + (activeTeam?.score ?? 0)}
            </h2>
          </>
        ) : (
          <>
            <h1>You're up {user}</h1>
          </>
        )}
        {user === currentPlayer && (
          <div>
            {!roundHasStarted ? (
              <button
                className="buttonMain"
                style={{ marginTop: "50%" }}
                onClick={handleRoundStart}
              >
                Start Round
              </button>
            ) : (
              <div>
                <h3 className="headerMain">
                  Time Remaining: {roundTimer} seconds
                </h3>
                <h3 className="headerMain">
                  Words Remaining: {availableWords.length}
                </h3>
                {availableWords.length > 0 && (
                  <div className="verticalWrapperMain" style={{ gap: "5rem" }}>
                    <h3 className="titleMain">Current Word: {currentWord}</h3>
                    <div
                      className="verticalWrapperMain"
                      style={{ gap: "5rem" }}
                    >
                      <button
                        className="guessWordButton successButton"
                        onClick={handleSuccessfulGuess}
                      >
                        Got it
                      </button>
                      {availableWords.length > 1 && (
                        <button
                          className="guessWordButton passButton"
                          onClick={handlePassWord}
                        >
                          Pass
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
