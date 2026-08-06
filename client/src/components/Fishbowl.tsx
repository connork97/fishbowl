import type { Game } from "../types/Types";
import { randomizeArray } from "../utils/randomizeArray";
import { useEffect, useState } from "react";
export default function Fishbowl({
  game,
  setGame,
  user,
}: {
  game: Game | null;
  setGame: any;
  user: string;
}) {
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

  // useEffect(() => {
  //   if (game?.availableWords) {
  //     randomizeAvailableWords();
  //   }
  // }, []);

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
    (game?.settings?.timePerRound?.minutes ?? 0) * 60 +
      (game?.settings?.timePerRound?.seconds ?? 0) || 60;

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

  const changeTurn = async (updatedGame: Game) => {
    if (!updatedGame?.code) return;

    const response = await fetch(
      `http://localhost:5555/games/${updatedGame.code}/update`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedGame),
      },
    );

    if (!response.ok) {
      console.error(
        "change-turn request failed",
        response.status,
        response.statusText,
      );
    }
    setRoundHasStarted(false);
    setRoundTimerIsActive(false);
    setRoundTimer(roundTimerInSeconds);
    setSuccessfullyGuessedWords([]);
    setActiveWordIndex(0);
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

  useEffect(() => {
    if (roundHasStarted && roundTimer === 0) {
      handleOutOfTime();
    }
  }, [roundTimer]);

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

  return (
    <div style={{ margin: "auto" }}>
      <h1>Game Component</h1>
      {game ? (
        <div>
          <h2>
            Round {activeRoundIndex + 1}: {currentRound}
          </h2>
          <h2>Team: {currentTeam}</h2>
          <h2>Player: {currentPlayer}</h2>
          <h2>
            Score: {successfullyGuessedWords.length + (activeTeam?.score ?? 0)}
          </h2>
          {user === currentPlayer && (
            <div>
              {!roundHasStarted ? (
                <button onClick={handleRoundStart}>Start Round</button>
              ) : (
                <div>
                  <h3>Time Remaining: {roundTimer} seconds</h3>
                  <h3>Words Remaining: {availableWords.length}</h3>
                  {availableWords.length > 0 && (
                    <div className="flexColumn justifyCenter">
                      <h3>Current Word: {currentWord}</h3>
                      <div className="flexRow justifyCenter">
                        <button onClick={handleSuccessfulGuess}>Got it</button>
                        {availableWords.length > 1 && (
                          <button onClick={handlePassWord}>Pass</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Loading game data...</p>
      )}
    </div>
  );
}
