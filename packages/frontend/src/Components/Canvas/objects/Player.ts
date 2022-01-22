import store from "store";
import DraggableToken from "./DraggableObject";
import { initToken } from "store/reducers/tokensSlice";
import { nanoid } from "@reduxjs/toolkit";

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
    this._id = nanoid(10);
    this.color = color;
    this.ctx = ctx;
    this.position = position;
  }

  initializeTokens() {
    const tokensAllowed = 3;
    Array.from({ length: tokensAllowed }).forEach((_, index) => {
      const tokenData = {
        color: this.color,
        ctx: this.ctx,
        teamId: this._id,
        x: this.position === "left" ? 25 : this.ctx.canvas.width - 25,
        y: 60 * index + 50,
      };
      const token = new DraggableToken(tokenData);
      this.tokens.push(token);
      const { x, y, teamId } = tokenData;
      store.dispatch(
        initToken({ x, y, teamId, row: null, col: null, tokenId: token.id })
      );
    });
    this.tokens.forEach((token) => token.drawToken());
  }

  get playerTokens() {
    return this.tokens;
  }
}
