import { useEffect, useRef } from "react";
import { StyledCanvas } from "./canvas.styled";
import GameCanvas from "./objects/CanvasClass";
import DraggableToken from "./objects/DraggableObject";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    const gameCanvas = new GameCanvas(canvasRef.current);
    const token1 = new DraggableToken();
    if (!gameCanvas.ctx) return;
    token1.drawToken(gameCanvas.ctx);
  };

  useEffect(() => {
    initializeCanvas();
  }, [canvasRef]);

  return <StyledCanvas ref={canvasRef} height={500} width={500} />;
}

export default Canvas;
