import { useEffect, useRef } from "react";
import { StyledCanvas } from "./canvas.styled";
import GameCanvas from "./objects/GameCanvas";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const initializeCanvas = () => {
    if (!canvasRef.current) return;
    const gameCanvas = new GameCanvas(canvasRef.current);
    gameCanvas.startAnimation();
  };

  useEffect(() => {
    initializeCanvas();
  }, [canvasRef]);

  return <StyledCanvas ref={canvasRef} height={500} width={600} />;
}

export default Canvas;
