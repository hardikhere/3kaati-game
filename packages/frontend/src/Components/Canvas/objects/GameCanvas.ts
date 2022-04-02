import boardImg from "assets/board.jpg";
import store from "store";
import { cursorInRect, getMouseCoords, getOffsetCoords } from "utils/common";
import { slope } from "./utils";

class GameCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  // TODO: add types below later
  players: Array<any> = [];
  currentTeam = 1;
  boardDetails = defaultBoardDetails;
  boardImg = new Image();
  static isInitializedOnce = false;
  isDrawingWinningLine = false;
  winningLinePath = {
    till: { x: 0, y: 0 },
    from: { x: 0, y: 0 },
  };
  constructor(ref: HTMLCanvasElement) {
    if (GameCanvas.isInitializedOnce)
      throw new Error("Game Canvas is singleton class");
    if (!ref) throw new Error("ref can not be falsy");
    this.ctx = ref.getContext("2d");
    if (!this.ctx) throw new Error("unable to get 2D context ");
    this.boardImg.onload = () => {
      this.renderBoardImage();
    };
    this.boardImg.src = boardImg;
    GameCanvas.isInitializedOnce = true;
    this.subscribeMethodsToRedux();
  }

  subscribeMethodsToRedux() {
    store.subscribe(this.checkIfAnyoneWon.bind(this));
  }

  checkIfAnyoneWon() {
    // TODO: change this logic
    if (this.currentTeam === 1) {
      const state = Object.values(store.getState().tokens);
      const playerAtokens = Object.values(state[0]);
      if (playerAtokens.length < 3) return;

      const { x: x1, y: y1, row } = playerAtokens[0];
      if (row === null) return;
      const { x: x2, y: y2 } = playerAtokens[1];
      const { x: x3, y: y3 } = playerAtokens[2];
      const slopeA = slope(x1, y1, x2, y2);
      const slopeB = slope(x2, y2, x3, y3);
      if (slopeA === slopeB) {
        // TODO: handle win here
        console.log("player A won");

        this.winningLinePath = {
          till: {
            x: x3,
            y: y3,
          },
          from: { x: x1, y: y1 },
        };
        this.isDrawingWinningLine = true;
      }
    }
  }

  drawWinningLine(_) {
    if (!this.ctx) return;
    const { winningLinePath, ctx } = this;
    let { from, till } = winningLinePath;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#0086DE";
    ctx.moveTo(from.x, from.y);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#F4FFDA";
    ctx.stroke();
    ctx.lineTo(till.x, till.y);
    ctx.shadowBlur = 0;
    ctx.closePath();
  }

  getAllTokens() {
    const teamATokens = this.players[0].playerTokens;
    const teamBTokens = this.players[1].playerTokens;
    const tokens = [...teamATokens, ...teamBTokens];
    return tokens;
  }

  startAnimation() {
    // clear Canvas
    const { ctx } = this;
    if (!ctx) throw new Error("ctx must be defined before starting animation");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    this.renderBoardImage();
    if (this.isDrawingWinningLine) {
      this.drawWinningLine(this.winningLinePath);
    }
    const tokens = this.getAllTokens();
    tokens.forEach((token) => {
      token.drawToken();
    });
    window.requestAnimationFrame(() => this.startAnimation());
  }

  getPlayerTokens() {
    if (this.players.length === 0) throw new Error("register players first");
    if (this.currentTeam === 1) return this.players[0].playerTokens;
    return this.players[1].playerTokens;
  }

  registerCanvasEvents() {
    const { ctx } = this;

    if (!ctx) throw new Error("Ctx must be defined before registering events");
    const { canvas } = ctx;

    const tokens = this.getAllTokens();
    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      let mouse = getMouseCoords(canvas, e);

      tokens.forEach((e) => {
        if (e.selected) {
          e.x = mouse.x - e.offset.x;
          e.y = mouse.y - e.offset.y;
        }

        if (
          cursorInRect(
            mouse.x,
            mouse.y,
            e.x - e.radius,
            e.y - e.radius,
            e.radius * 2,
            e.radius * 2
          )
        ) {
          document.body.style.cursor = "pointer";
          if (!e.active) e.activate();
        } else {
          e.active = false;
          document.body.style.cursor = "default";
        }
      });
    });

    canvas.addEventListener("mousedown", (e) => {
      let mouse = getMouseCoords(canvas, e);
      tokens.forEach((e) => {
        if (
          cursorInRect(
            mouse.x,
            mouse.y,
            e.x - e.radius,
            e.y - e.radius,
            e.radius * 2,
            e.radius * 2
          )
        ) {
          e.selected = true;
          e.offset = getOffsetCoords(mouse as any, e);
        } else {
          e.selected = false;
        }
      });
    });

    canvas.addEventListener("mouseup", () => {
      tokens.forEach((token) => {
        if (token.selected) {
          // TODO: add checks if token can be placed or not
          if (token.isTokenPlacable) token.placeToken();
          else token.takeBackToPrevPos();
        }
        token.selected = false;
      });
    });
  }

  registerPlayer(player) {
    this.players.push(player);
  }

  renderBoardImage() {
    this.ctx?.drawImage(
      this.boardImg,
      this.boardDetails.offset.x,
      this.boardDetails.offset.y,
      this.boardDetails.width,
      this.boardDetails.height
    );
  }
}
export default GameCanvas;

export const defaultBoardDetails = {
  offset: {
    x: 300,
    y: 150,
  },
  height: 400,
  width: 400,
};
