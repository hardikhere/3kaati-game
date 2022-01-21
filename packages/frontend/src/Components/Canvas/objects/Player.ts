import uuidv4 from "utils/uuidv4";
import DraggableToken from "./DraggableObject";

export default class Player {
  _id: string;
  // Array of three tokens
  // TODO: define Interface later
  tokens: Array<any> = [];
  color: string;
  // TODO: Make it enum
  position: string = "left";
  ctx: CanvasRenderingContext2D;
  constructor({ color, ctx, position }) {
    this._id = uuidv4();
    this.color = color;
    this.ctx = ctx;
    this.position = position;
  }

  initializeTokens() {
    const tokensAllowed = 3;
    Array.from({ length: tokensAllowed }).forEach((_, index) => {
      this.tokens.push(
        new DraggableToken({
          color: this.color,
          ctx: this.ctx,
          teamId: this._id,
          x: this.position === "left" ? 25 : this.ctx.canvas.width - 25,
          y: 60 * index + 50,
        })
      );
    });
    this.tokens.forEach((token) => token.drawToken());
  }

  get playerTokens() {
    return this.tokens;
  }
}
