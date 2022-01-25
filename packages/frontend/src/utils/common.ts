export const getMouseCoords = (
  canvas: HTMLCanvasElement,
  event: MouseEvent
) => {
  let canvasCoords = canvas.getBoundingClientRect();
  return {
    x: event.pageX - canvasCoords.left,
    y: event.pageY - canvasCoords.top,
  };
};

export const getOffsetCoords = (mouse: MouseEvent, rect: any) => {
  return {
    x: mouse.x - rect.x,
    y: mouse.y - rect.y,
  };
};

export const cursorInRect = (
  mouseX: number,
  mouseY: number,
  rectX: number,
  rectY: number,
  rectW: number,
  rectH: number
) => {
  let xLine = mouseX > rectX && mouseX < rectX + rectW;
  let yLine = mouseY > rectY && mouseY < rectY + rectH;

  return xLine && yLine;
};

export function getLink() {
  if (process.env.NODE_ENV === "production") {
    return "https://teenkaate.herokuapp.com";
  } else return "http://localhost:3000";
}
