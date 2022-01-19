import uuidv4 from "utils/uuidv4";

class DraggableToken {
  color: String;
  x: number;
  y: number;
  radius = 50;
  ctx: CanvasRenderingContext2D | null = null;
  active = false;
  selected = false;
  readonly id: number;
  readonly teamId: number;
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
    console.log("here");
    ctx?.beginPath();
    ctx?.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    if (this.active) {
      ctx.fillStyle = "#155280";
      ctx.fill();
    }
    ctx?.stroke();
    ctx.closePath();
  }

  activate() {
    this.active = !this.active;
  }

  select() {
    this.selected = !this.selected;
  }

  clearToken() {
    const { ctx } = this;
    ctx?.beginPath();
    ctx?.clearRect(this.x, this.y, 100, 100);
    ctx?.stroke();
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
