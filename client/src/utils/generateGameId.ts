export const generateGameId = (length = 4): string => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ2346789";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));

  const gameId = Array.from(
    randomValues,
    (value) => characters[value % characters.length],
  ).join("");

  return gameId;
};