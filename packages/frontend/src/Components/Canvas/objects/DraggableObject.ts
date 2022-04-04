import { getNearestDropableArea, isAnyTokenAlreadyPlaced } from "./utils";
import { socketio } from "utils/socket";
import blueToken from "assets/token1.png";
import redToken from "assets/token2.png";
import store from "store";
import { setToken } from "store/reducers/tokensSlice";

const placeAudio = require('assets/placeAudio.wav');
class DraggableToken {
  color: String;
  tokenImg = new Image();
  row: number | null = null;
  column: number | null = null;
  x: number;
  y: number;
  radius = 20;
  ctx: CanvasRenderingContext2D | null = null;
  offset = { x: 0, y: 0 };
  prevPos: IPrevPos = { row: null, col: null, x: null, y: null };
  active = false;
  selected = false;
  readonly id: string;
  readonly playerId: string;
  nextDropPos = { x: 0, y: 0 };
  constructor(tokenInitOptions: ITokenInitOptions) {
    const { x, y, color, playerId, ctx, tokenId } = tokenInitOptions;
    this.id = tokenId;
    this.color = color;
    this.playerId = playerId;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.tokenImg.onload = () => {
      this.drawToken();
    };
    if (this.color === "blue") this.tokenImg.src = blueToken;
    else this.tokenImg.src = redToken;
  }

  getNewPosition() {
    const { ctx } = this;
    if (!ctx) throw new Error("ctx is not initialized : getNewPosition");
    const newPoint = getNearestDropableArea(
      ctx?.canvas.height,
      ctx?.canvas.width,
      { x: this.x, y: this.y }
    );
    return newPoint;
  }

  get isTokenPlacable() {
    // according to rule no checks
    // regarding if that place is filled
    // of not
    // TODO: add check if that place is filled or not
    const newPos = this.getNewPosition();
    if (isAnyTokenAlreadyPlaced(newPos)) return false;
    const { prevPos } = this;
    if (prevPos.row === null) return true;
    if (prevPos.col === null) return true;
    if (prevPos.row === 2 && prevPos.col === 2) return true;
    if (
      Math.abs(prevPos.row - newPos.row) === 1 &&
      Math.abs(prevPos.col - newPos.col) === 0
    )
      return true;
    if (
      Math.abs(prevPos.col - newPos.col) === 1 &&
      Math.abs(prevPos.row - newPos.row) === 0
    )
      return true;

    if (newPos.row === 2 && newPos.col === 2) return true;

    return false;
  }

  takeBackToPrevPos() {
    this.x = this.prevPos.x || 0;
    this.y = this.prevPos.y || 0;
    this.row = this.prevPos.row || 0;
    this.column = this.prevPos.col || 0;
  }

  placeToken() {
    const { ctx, playerId, id: tokenId } = this;
    if (!ctx) return;
    const { x, y, row, col } = this.getNewPosition();
    this.x = x;
    this.y = y;
    this.row = row;
    this.column = col;
    this.prevPos = { row, col, x, y };
    const roomId = store.getState().players[playerId].roomId;
    const tokenDetails = { x, y, row, col, playerId, tokenId }
    store.dispatch(setToken(tokenDetails));
    socketio.emit("MOVE", { ...tokenDetails, roomId });
    const audio = new Audio(placeAudio);
    audio.play();
  }

  drawToken() {
    const { ctx } = this;
    if (!ctx) return;
    ctx.drawImage(
      this.tokenImg,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    if (!this.selected) return;
    // look for dropable areas
    const nearestPoint = getNearestDropableArea(
      ctx.canvas.height,
      ctx.canvas.width,
      { x: this.x, y: this.y }
    );

    ctx.closePath();

    // check here if we can place on that position or not
    // draw nearest point here
    this.drawDroppableSuggesion(nearestPoint);
  }

  drawDroppableSuggesion({ x, y }) {
    const { ctx } = this;
    this.nextDropPos = { x, y };
    if (!ctx) return;
    ctx.beginPath();
    ctx?.arc(x, y, 15, 0, 2 * Math.PI);
    if (this.isTokenPlacable) ctx.fillStyle = "#82FC7D";
    else ctx.fillStyle = "#dc143c";
    ctx.fill();
    ctx.closePath();
  }

  activate() {
    this.active = !this.active;
  }

  get hasChance() {
    return store.getState().players[this.playerId].hasChance;
  }

  get isMine() {
    return store.getState().players[this.playerId].isMe;
  }

  select() {
    this.selected = !this.selected;
  }
}

export default DraggableToken;

interface ITokenInitOptions {
  x: number;
  y: number;
  color: string;
  playerId: string;
  ctx: CanvasRenderingContext2D | null;
  tokenId: string;
}

export interface IPrevPos {
  row: null | number;
  col: null | number;
  x: null | number;
  y: null | number;
}
