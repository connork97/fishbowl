import '../../App.css';

export default function PlayersAndTeams({ fishbowlSettings, setFishbowlSettings }: { fishbowlSettings: any; setFishbowlSettings: any }) {
  return (
    <div className="verticalWrapperMain" style={{ gap: "2rem" }}>
      <div className="horizontalWrapperMain" style={{ alignContent: "center" }}>
        <h3 className="headerMain">Teams</h3>
        <input
          className="inputMain inputSmall"
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
      </div>
      <div className="horizontalWrapperMain" style={{}}>
        <h3 className="headerMain" style={{}}>
          Words Per Player
        </h3>
        <input
          className="inputMain inputSmall"
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
      </div>
    </div>
  );
}
