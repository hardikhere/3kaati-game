import Line from "./LineClass";
import boardImg from "assets/board.jpg";
import { cursorInRect, getMouseCoords, getOffsetCoords } from "utils/common";

class GameCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  // TODO: add types below later
  players: Array<any> = [];
  currentTeam = 1;
  boardDetails = defaultBoardDetails;
  boardImg = new Image();
  static isInitializedOnce = false;
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
  }

  drawLines() {
    const { ctx } = this;
    if (!ctx) throw new Error("ctx can not be null");
    const { boardDetails } = this;
    const { offset, height, width } = boardDetails;
    const L1 = new Line(offset.x, offset.y, offset.x, offset.y + height, ctx);
    L1.drawLine();

    const L2 = new Line(
      offset.x + width,
      offset.y,
      offset.x + width,
      offset.y + height,
      ctx
    );
    L2.drawLine();

    const L3 = new Line(offset.x, offset.y, offset.x + width, offset.y, ctx);
    L3.drawLine();

    const L4 = new Line(
      offset.x,
      offset.y + height,
      offset.x + width,
      offset.y + height,
      ctx
    );
    L4.drawLine();
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
          if (!e.active) e.activate();
        } else {
          e.active = false;
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

  registerPlayers(player1, player2) {
    this.players = [player1, player2];
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
