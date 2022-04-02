import { useSocket } from "contexts/Socketio/SocketIoContext";
import usePlayers from "hooks/usePlayers";
import { useEffect, useRef } from "react";
import { StyledCanvas } from "./canvas.styled";
import GameCanvas from "./objects/GameCanvas";
import Player from "./objects/Player";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketio = useSocket();
  const { playersArr } = usePlayers();

  useEffect(() => {
    socketio?.on("connect", () => {
      console.log("open");
    });
  }, []);

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    const gameCanvas = new GameCanvas(canvasRef.current);
    playersArr.forEach((player) => {
      const playerInstance = new Player({ ...player, ctx: gameCanvas.ctx });
      playerInstance.initializeTokens();
      gameCanvas.registerPlayer(playerInstance);
    });

    gameCanvas.registerCanvasEvents();
    gameCanvas.startAnimation();
  };

  useEffect(() => {
    initializeCanvas();
    socketio?.open();
  }, [canvasRef]);

  return <StyledCanvas ref={canvasRef} height={600} width={1000} />;
}

export default Canvas;
