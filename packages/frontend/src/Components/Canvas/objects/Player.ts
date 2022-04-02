import store from "store";
import DraggableToken from "./DraggableObject";
import { initToken } from "store/reducers/tokensSlice";
import { changeTurn } from "store/reducers/playersSlice";

export default class Player {
  _id: string;
  // Array of three tokens
  // TODO: define Interface later
  tokens: Array<any> = [];
  color: string;
  // TODO: Make it enum
  position: string = "left";
  ctx: CanvasRenderingContext2D | null;
  constructor({ color, ctx, position, playerId }: IPlayerProps) {
    this._id = playerId;
    this.color = color;
    if (!ctx) throw new Error("CTX can not be null")
    this.ctx = ctx;
    this.position = position;
  }

  initializeTokens() {
    const tokensAllowed = 3;
    const { ctx } = this;
    if (!ctx) throw new Error("CTX is required");
    if (!this.ctx) return;
    Array.from({ length: tokensAllowed }).forEach((_, index) => {
      const tokenData = {
        color: this.color,
        ctx: this.ctx,
        playerId: this._id,
        x: this.position === "left" ? 25 : ctx.canvas.width - 25,
        y: 60 * index + 50,
      };
      const token = new DraggableToken(tokenData);
      this.tokens.push(token);
      const { x, y, playerId } = tokenData;
      store.dispatch(
        initToken({ x, y, playerId, row: null, col: null, tokenId: token.id })
      );
    });
    this.tokens.forEach((token) => token.drawToken());
  }

  get playerTokens() {
    return this.tokens;
  }

  giveChance() {
    store.dispatch(changeTurn(this._id))
  }
}
export interface IPlayerProps {
  ctx: CanvasRenderingContext2D | null,
  color: "red" | "blue",
  playerId: string;
  position: "left" | "right"
}