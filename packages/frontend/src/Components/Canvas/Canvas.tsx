import usePlayers from "hooks/usePlayers";
import { socketio } from "utils/socket";
import { useEffect, useRef, useState } from "react";
import { StyledCanvas } from "./canvas.styled";
import GameCanvas from "./objects/GameCanvas";
import Player from "./objects/Player";
import Confetti from "react-confetti";

const winAudio = require("assets/winAudio.wav");

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { playersArr, winner } = usePlayers();

  useEffect(() => {
    let timer;
    if (winner) {
      setShowConfetti(true);
      const win = new Audio(winAudio);
      win.play();
      timer = setTimeout(() => {
        setShowConfetti(false);
        window.location.href = "/";
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [winner]);

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
      if (player.color === "red") playerInstance.giveChance();
    });

    gameCanvas.registerCanvasEvents();
    gameCanvas.startAnimation();
  };

  useEffect(() => {
    initializeCanvas();
    socketio?.open();
  }, [canvasRef]);

  return (
    <>
      <StyledCanvas ref={canvasRef} height={600} width={1000} />
      {showConfetti && <Confetti />}
    </>
  );
}

export default Canvas;
