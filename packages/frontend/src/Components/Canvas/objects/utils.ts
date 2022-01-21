export const getDropablePoints = (height: number, width: number) => {
  return [
    {
      x: BOARD_PADDING,
      y: 0,
      row: 1,
      col: 1,
    },
    {
      x: width / 2,
      y: 0,
      row: 1,
      col: 2,
    },
    {
      x: width - BOARD_PADDING,
      y: 0,
      row: 1,
      col: 3,
    },
    {
      x: BOARD_PADDING,
      y: height / 2,
      row: 2,
      col: 1,
    },
    {
      x: width / 2,
      y: height / 2,
      row: 2,
      col: 2,
    },
    {
      x: width - BOARD_PADDING,
      y: height / 2,
      row: 2,
      col: 3,
    },
    {
      x: BOARD_PADDING,
      y: height,
      row: 3,
      col: 1,
    },
    {
      x: width / 2,
      y: height,
      row: 3,
      col: 2,
    },

    {
      x: width - BOARD_PADDING,
      y: height,
      row: 3,
      col: 3,
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
  let indexReturned = 0;
  dropableAreas.forEach((point, index) => {
    let a = point.x - mouseX;
    let b = point.y - mouseY;
    const distance = Math.sqrt(a * a + b * b);
    if (minDistance >= distance) {
      minDistance = distance;
      indexReturned = index;
    }
  });
  return dropableAreas[indexReturned];
};

export const BOARD_PADDING = 50;
