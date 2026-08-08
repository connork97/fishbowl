import "../../App.css";

export default function Time({
  fishbowlSettings,
  setFishbowlSettings,
}: {
  fishbowlSettings: any;
  setFishbowlSettings: any;
}) {
  return (
    <div className="verticalWrapperMain">
      <h3 className="headerMain">Time Per Round:</h3>
      <div className="horizontalWrapperMain" >
        <div className="verticalWrapperMain">
          <label className="inputLabelMain" htmlFor="minutesPerRound">
            Minutes
          </label>
          <input
            className="inputMain"
            id="minutesPerRound"
            type="number"
            value={fishbowlSettings.timePerRound.minutes}
            onChange={(e) =>
              setFishbowlSettings({
                ...fishbowlSettings,
                timePerRound: {
                  ...fishbowlSettings.timePerRound,
                  minutes: Number(e.target.value),
                },
              })
            }
          style={{fontSize: '1.5rem', width: '50%'}}
          />
        </div>
        <div className="verticalWrapperMain">
          <label className="inputLabelMain" htmlFor="secondsPerRound">
            Seconds
          </label>
          <input
            className="inputMain"
            id="secondsPerRound"
            type="number"
            value={fishbowlSettings.timePerRound.seconds}
            onChange={(e) =>
              setFishbowlSettings({
                ...fishbowlSettings,
                timePerRound: {
                  ...fishbowlSettings.timePerRound,
                  seconds: Number(e.target.value),
                },
              })
            }
          style={{fontSize: '1.5rem', width: '50%'}}
          />
        </div>
      </div>
    </div>
  );
}
