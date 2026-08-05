import { normalizeGameData } from "../utils/normalizeGameData";

export const getFishbowlGameByCode = async (gameCode: string) => {
  console.log("Fetching game data for code: ", gameCode);
  try {
    const response = await fetch(`http://localhost:5555/games/${gameCode}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const gameData = await response.json();
    console.log("Fetched game data: ", gameData);
    return gameData;
  } catch (error) {
    console.error("Error fetching game data:", error);
    alert(`${error instanceof Error ? error.message : error}`);
  }
};

export const createFishbowlGame = async (
  user: string,
  fishbowlSettings: any,
) => {
  try {
    const response = await fetch("http://localhost:5555/games/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostName: user, settings: fishbowlSettings }),
    });
    const gameData = await response.json();
    if (response.ok) {
      const normalizedGameData = normalizeGameData(gameData);
      return normalizedGameData;
    }
  } catch (error) {
    console.error("Error creating game:", error);
    alert("Error creating game. Please try again. " + error);
  }
};

export const joinGameByCode = async (gameCode: string, user: string) => {
  console.log("Fetching game data for code: ", gameCode);
  try {
    const response = await fetch(
      `http://localhost:5555/games/${gameCode}/join`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ playerName: user }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    const gameData = await response.json();
    console.log("Fetched game data: ", gameData);
    return gameData;
  } catch (error) {
    console.error("Error fetching game data:", error);
    alert(error instanceof Error ? error.message : error);
  }
};

export const joinFishbowlTeam = async (
  user: string,
  teamName: string,
  gameCode: string,
) => {
  console.log(`Adding player ${user} to team ${teamName} in game ${gameCode}`);
  try {
    const response = await fetch(
      `http://localhost:5555/games/${gameCode}/join-team`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName: user, teamName }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to join team: ${response.statusText}`);
    }
    const updatedGameData = await response.json();
    const normalizedGameData = normalizeGameData(updatedGameData);
    return normalizedGameData;
  } catch (error) {
    console.error("Failed to join team:", error);
    alert("Failed to join team. Please try again.");
  }
};

export const addFishbowlWordToGame = async (
  word: string,
  user: string,
  gameCode: string,
) => {
  try {
    const response = await fetch(
      `http://localhost:5555/games/${gameCode}/add-word`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ playerName: user, word: word }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to add word: ${response.statusText}`);
    }
    const updatedGameData = await response.json();
    const normalizedGameData = normalizeGameData(updatedGameData);
    return normalizedGameData;
    // setGame(normalizedGameData);
    // setNewWordInput("");
  } catch (error) {
    console.error("Failed to add word:", error);
    alert(error instanceof Error ? error.message : error);
    // alert("Failed to add word. Please try again.");
  }
};

export const setGameStatus = async (
  gameCode: string,
  user: string,
  status: string,
) => {
  try {
    const response = await fetch(
      `http://localhost:5555/games/${gameCode}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, status }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to set game status: ${response.statusText}`);
    }

    const updatedGameData = await response.json();
    const normalizedGameData = normalizeGameData(updatedGameData);
    return normalizedGameData;
  } catch (error) {
    console.error("Failed to set game status:", error);
    alert("Failed to set game status. Please try again.");
  }
};
