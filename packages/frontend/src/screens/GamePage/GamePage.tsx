import usePlayers from "hooks/usePlayers";
import Canvas from "../../Components/Canvas";
import { WhosChance } from "./gamePageStyle";

function GamePage() {
  const { currentChance } = usePlayers();

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <WhosChance>{currentChance?.userName}'s Turn</WhosChance>
      <Canvas />
    </div>
  );
}

export default GamePage;
