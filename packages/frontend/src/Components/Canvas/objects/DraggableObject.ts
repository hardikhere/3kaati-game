import uuidv4 from "utils/uuidv4";
import { getNearestDropableArea } from "./utils";

class DraggableToken {
  color: String;
  x: number;
  y: number;
  radius = 20;
  ctx: CanvasRenderingContext2D | null = null;
  offset = { x: 0, y: 0 };
  active = false;
  selected = false;
  readonly id: number;
  readonly teamId: number;
  nextDropPos = { x: 0, y: 0 };
  constructor(tokenInitOptions: ITokenInitOptions) {
    const { x, y, color, teamId, ctx } = tokenInitOptions;
    this.id = uuidv4();
    this.color = color;
    this.teamId = teamId;
    this.x = x;
    this.y = y;
    this.ctx = ctx;
  }

  drawToken() {
    const { ctx } = this;
    if (!ctx) return;
    ctx?.beginPath();
    ctx?.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (this.active) {
      ctx.fillStyle = "#155280";
      ctx.fill();
    }
    ctx?.stroke();

    if (!this.selected) return;
    // look for dropable areas
    const nearestPoint = getNearestDropableArea(
      ctx.canvas.height,
      ctx.canvas.width,
      { x: this.x, y: this.y }
    );

    ctx.closePath();
    // draw nearest point here
    this.drawDroppableSuggesion(nearestPoint);
  }

  drawDroppableSuggesion({ x, y }: any) {
    const { ctx } = this;
    this.nextDropPos = { x, y };
    if (!ctx) return;
    ctx.beginPath();
    ctx?.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#82FC7D";
    ctx.fill();
    ctx.closePath();
  }

  activate() {
    this.active = !this.active;
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
  teamId: number;
  ctx: CanvasRenderingContext2D | null;
}
