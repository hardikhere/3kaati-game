import usePlayers from "hooks/usePlayers";
import Canvas from "../../Components/Canvas";
import { StyledWinnerAnouncement, WhosChance } from "./gamePageStyle";

function GamePage() {
  const { currentChance, winner } = usePlayers();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <WhosChance>{currentChance?.userName}'s Turn</WhosChance>
      <Canvas />
      {winner?.hasWon && (
        <StyledWinnerAnouncement as={"div"} className="zoom-in">
          {winner?.userName} Won!
        </StyledWinnerAnouncement>
      )}
    </div>
  );
}

export default GamePage;
