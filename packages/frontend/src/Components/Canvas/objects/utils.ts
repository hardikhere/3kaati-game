export const getDropablePoints = (height: number, width: number) => {
  return [
    {
      x: BOARD_PADDING,
      y: 0,
    },
    {
      x: BOARD_PADDING,
      y: height,
    },
    {
      x: BOARD_PADDING,
      y: height / 2,
    },
    {
      x: width / 2,
      y: 0,
    },
    {
      x: width / 2,
      y: height / 2,
    },
    {
      x: width / 2,
      y: height,
    },

    {
      x: width - BOARD_PADDING,
      y: 0,
    },
    {
      x: width - BOARD_PADDING,
      y: height / 2,
    },
    {
      x: width - BOARD_PADDING,
      y: height,
    },
  ];
};

export const getNearestDropableArea = (
  height: number,
  width: number,
  mousePos: any
) => {
  const dropableAreas = getDropablePoints(height, width);
  const { x: mouseX, y: mouseY } = mousePos;
  let minDistance = Number.MAX_SAFE_INTEGER;
  let result = dropableAreas[0];
  dropableAreas.forEach((point) => {
    let a = point.x - mouseX;
    let b = point.y - mouseY;
    const distance = Math.sqrt(a * a + b * b);
    if (minDistance >= distance) {
      minDistance = distance;
      result = point;
    }
  });
  return result;
};

export const BOARD_PADDING = 50;
