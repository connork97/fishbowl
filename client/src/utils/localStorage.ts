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
