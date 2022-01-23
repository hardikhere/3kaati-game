import { useSocket } from "contexts/Socketio/SocketIoContext";
import { useEffect, useRef } from "react";
import { StyledCanvas } from "./canvas.styled";
import GameCanvas from "./objects/GameCanvas";
import Player from "./objects/Player";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socketio = useSocket();

  useEffect(() => {
    socketio?.on("connect", () => {
      console.log("open");
    });
  }, []);

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    const gameCanvas = new GameCanvas(canvasRef.current);
    const player1 = new Player({
      color: "red",
      ctx: gameCanvas.ctx,
      position: "left",
    });
    const player2 = new Player({
      color: "blue",
      ctx: gameCanvas.ctx,
      position: "right",
    });

    player1.initializeTokens();
    player2.initializeTokens();
    gameCanvas.registerPlayers(player1, player2);
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
