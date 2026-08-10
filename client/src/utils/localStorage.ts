export const setLocalStoragePlayerName = (value: string) => {
   localStorage.setItem("playerName", JSON.stringify(value));
}

export const removeLocalStoragePlayerName = () => {
   localStorage.removeItem("playerName");
}

export const getLocalStoragePlayerName = () => {
   const storedPlayerName = localStorage.getItem("playerName");
   return storedPlayerName ? JSON.parse(storedPlayerName) : null;
}

export const setLocalStorageGameCode = (value: string) => {
   localStorage.setItem("gameCode", JSON.stringify(value));
}

export const removeLocalStorageGameCode = () => {
   localStorage.removeItem("gameCode");
}

export const getLocalStorageGameCode = () => {
   const storedGameCode = localStorage.getItem("gameCode");
   return storedGameCode ? JSON.parse(storedGameCode) : null;
}