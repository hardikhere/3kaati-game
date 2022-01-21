export default class Line {
  p1: Point;
  p2: Point;
  ctx: CanvasRenderingContext2D;
  constructor(
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    ctx: CanvasRenderingContext2D
  ) {
    this.p1 = { x: p1x, y: p1y };
    this.p2 = { x: p2x, y: p2y };
    this.ctx = ctx;
  }

  drawLine() {
    const { ctx, p1, p2 } = this;
    ctx?.beginPath();
    ctx?.moveTo(p1.x, p1.y);
    ctx?.lineTo(p2.x, p2.y);
    ctx?.stroke();
    ctx.closePath();
  }
}

interface Point {
  x: number;
  y: number;
}
