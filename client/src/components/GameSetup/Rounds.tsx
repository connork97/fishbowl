import "../../App.css";

export default function Rounds({
  fishbowlSettings,
  setFishbowlSettings,
}: {
  fishbowlSettings: any;
  setFishbowlSettings: any;
}) {
  return (
    <div className="verticalWrapperMain">
      <h3 className="headerMain">Rounds:</h3>
      {fishbowlSettings.rounds.map((round: string, index: number) => (
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
                  (_: any, i: number) => i !== index,
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
  );
}
