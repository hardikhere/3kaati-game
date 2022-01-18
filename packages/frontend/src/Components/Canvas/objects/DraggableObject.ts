import uuidv4 from "utils/uuidv4";

class DraggableToken {
  color: String;
  x: number;
  y: number;
  readonly id: number;
  readonly teamId: number;
  constructor(tokenInitOptions: ITokenInitOptions) {
    const { x, y, color, teamId } = tokenInitOptions;
    this.id = uuidv4();
    this.color = color;
    this.teamId = teamId;
    this.x = x;
    this.y = y;
    this.registerMouseEvent();
  }

  drawToken(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(0, this.y);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, 0);
    ctx.moveTo(this.x, this.y);
    ctx.closePath();
  }

  registerMouseEvent() {
    const self = this;
    window.addEventListener("mousedown", (event) => {
      self.x = event.x;
      self.y = event.y;
    });
  }
}

export default DraggableToken;

interface ITokenInitOptions {
  x: number;
  y: number;
  color: string;
  teamId: number;
}
