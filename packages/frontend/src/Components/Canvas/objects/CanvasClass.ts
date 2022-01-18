class GameCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  private static isInitializedOnce = false;
  constructor(ref: HTMLCanvasElement) {
    if (GameCanvas.isInitializedOnce)
      throw new Error("Game Canvas is singleton class");
    if (!ref) throw new Error("ref can not be falsy");
    this.ctx = ref.getContext("2d");
    GameCanvas.isInitializedOnce = true;
    const { ctx } = this;
    ctx?.moveTo(0, 0);
    ctx?.lineTo(200, 100);
    ctx?.stroke();
  }
}
export default GameCanvas;
