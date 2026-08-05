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
  // const randomizedWordsArr = game?.words ? randomizeArray(game.words) : [];
  const [successfullyGuessedWords, setSuccessfullyGuessedWords] = useState<
    string[]
  >([]);
  // const availableWords = game?.available_words ?? [];
  // const [randomizedWordsArr, setRandomizedWordsArr] = useState<string[]>([]);
  const availableWords = game?.availableWords ?? [];

  useEffect(() => {
    if (game?.availableWords) {
      const randomizedAvailableWords = randomizeArray(game.availableWords);
      setGame((prevGame: Game | null) => ({
        ...prevGame,
        availableWords: randomizedAvailableWords,
      }));
    }
  }, []);

  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeRoundIndex, setActiveRoundIndex] = useState(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const currentRound = game?.settings.rounds[activeRoundIndex];
  const currentPlayer = game?.teams[activeTeamIndex].players[activePlayerIndex];
  const currentTeam = game?.teams[activeTeamIndex].name;
  const currentWord = availableWords[activeWordIndex];

  const [roundHasStarted, setRoundHasStarted] = useState(false);
  const [roundTimerIsActive, setRoundTimerIsActive] = useState(false);
  const [roundTimer, setRoundTimer] = useState(
    (game?.settings?.timePerRound?.minutes ?? 0) * 60 +
      (game?.settings?.timePerRound?.seconds ?? 0) || 60,
  );

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

  const handleRoundEnd = () => {
    // setRoundHasStarted(false);
    setRoundTimerIsActive(false);
  };

  useEffect(() => {
    if (availableWords.length === 0 || roundTimer <= 0) {
      handleRoundEnd();
    }
  }, [availableWords, roundTimer]);

  const handlePassWord = () => {
    let nextWordIndex = activeWordIndex + 1;
    if (nextWordIndex >= availableWords.length) {
      nextWordIndex = 0; // Loop back to the first word
    }
    setActiveWordIndex(nextWordIndex);
  };

  const handleRoundStart = () => {
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
          <h2>Score: {successfullyGuessedWords.length}</h2>
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
