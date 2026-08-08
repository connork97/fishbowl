import '../../App.css';

export default function PlayersAndTeams({ fishbowlSettings, setFishbowlSettings }: { fishbowlSettings: any; setFishbowlSettings: any }) {
  return (
    <div className="verticalWrapperMain" style={{ gap: "2rem" }}>
        <h3 className="headerMain">Teams</h3>
        <input
          className="inputMain"
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
          style={{fontSize: '1.5rem', width: '50%'}}
        />
        <h3 className="headerMain">
          Words Per Player
        </h3>
        <input
          className="inputMain"
          id="wordsPerPlayer"
          type="number"
          value={fishbowlSettings.wordsPerPlayer}
          onChange={(e) =>
            setFishbowlSettings({
              ...fishbowlSettings,
              wordsPerPlayer: Number(e.target.value),
            })
          }
          style={{fontSize: '1.5rem', width: '50%'}}
        />
    </div>
  );
}
