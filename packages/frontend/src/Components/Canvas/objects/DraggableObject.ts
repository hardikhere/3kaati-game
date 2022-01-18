class DraggableToken {
  color: String;
  readonly id: number;
  readonly teamId: number;
  constructor() {
    // TODO: temp change it later
    this.id = Math.random();
    this.color = "red";
    this.teamId = 1;
  }

  drawToken(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

export default DraggableToken;
