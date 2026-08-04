export const joinGameByCode = async (gameCode: string, user: string) => {
    console.log("Fetching game data for code: ", gameCode);
    try {
      const response = await fetch(`http://localhost:5555/games/${gameCode}/join`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerName: user }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gameData = await response.json();
      console.log("Fetched game data: ", gameData);
      return gameData;
    } catch (error) {
      console.error("Error fetching game data:", error);
      alert(
        "Error fetching game data. Please check the game code and try again.",
      );
    }
  };

export const getFishbowlGameByCode = async (gameCode: string) => {
    console.log("Fetching game data for code: ", gameCode);
    try {
      const response = await fetch(`http://localhost:5555/games/${gameCode}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const gameData = await response.json();
      console.log("Fetched game data: ", gameData);
      return gameData;
    } catch (error) {
      console.error("Error fetching game data:", error);
      alert(
        "Error fetching game data. Please check the game code and try again.",
      );
    }
  };

