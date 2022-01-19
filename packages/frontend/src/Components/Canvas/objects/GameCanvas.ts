import DraggableToken from "./DraggableObject";
import { BOARD_PADDING } from "./utils";
import Line from "./LineClass";
import { cursorInRect, getMouseCoords, getOffsetCoords } from "utils/common";

class GameCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  height: number;
  width: number;
  // TODO: add types below later
  teamATokens: Array<any>;
  teamBTokens: Array<any>;
  currentTeam = 1;
  private static isInitializedOnce = false;
  constructor(ref: HTMLCanvasElement) {
    if (GameCanvas.isInitializedOnce)
      throw new Error("Game Canvas is singleton class");
    if (!ref) throw new Error("ref can not be falsy");
    this.ctx = ref.getContext("2d");
    if (!this.ctx) throw new Error("unable to get 2D context ");

    this.width = this.ctx?.canvas.width - BOARD_PADDING * 2;
    this.height = this.ctx?.canvas.height;

    GameCanvas.isInitializedOnce = true;

    // register tokens
    this.teamATokens = [];
    this.teamBTokens = [];
    // TODO: register actual tokens this is temp
    [1].forEach((el) => {
      this.teamATokens.push(
        new DraggableToken({
          color: "red",
          teamId: 1,
          x: 25,
          y: 34,
          ctx: this.ctx,
        })
      );
    });

    [1].forEach((el) => {
      this.teamATokens.push(
        new DraggableToken({
          color: "blue",
          teamId: 2,
          x: 25,
          y: 134,
          ctx: this.ctx,
        })
      );
    });

    this.registerCanvasEvents();
  }

  drawLines() {
    const { ctx } = this;
    if (!ctx) throw new Error("ctx can not be null");
    const L1 = new Line(0, this.width / 2, this.height, this.width / 2, ctx);
    L1.drawLine();

    const L2 = new Line(this.width / 2, 0, this.width / 2, this.height, ctx);
    L2.drawLine();

    const L3 = new Line(this.width, 0, 0, this.height, ctx);
    L3.drawLine();

    const L4 = new Line(0, 0, this.height, this.width, ctx);
    L4.drawLine();

    const L5 = new Line(0, 0, 0, this.height, ctx);
    L5.drawLine();

    const L6 = new Line(this.width, 0, this.width, this.height, ctx);
    L6.drawLine();
  }

  startAnimation() {
    // clear Canvas
    const { ctx, teamATokens, teamBTokens } = this;
    if (!ctx) throw new Error("ctx must be defined before starting animation");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    this.drawLines();

    const tokens = [...teamATokens, ...teamBTokens];
    tokens.forEach((token) => {
      token.drawToken();
    });
    window.requestAnimationFrame(() => this.startAnimation());
  }

  getPlayerTokens() {
    if (this.currentTeam === 1) return this.teamATokens;
    return this.teamBTokens;
  }

  registerCanvasEvents() {
    const { ctx } = this;

    if (!ctx) throw new Error("Ctx must be defined before registering events");
    const { canvas } = ctx;

    const tokens = this.getPlayerTokens();
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
      tokens.forEach((e) => {
        if (e.selected) {
          // TODO: add checks if token can be placed or not
          e.x = e.nextDropPos.x;
          e.y = e.nextDropPos.y;
        }
        e.selected = false;
      });
    });
  }
}
export default GameCanvas;
