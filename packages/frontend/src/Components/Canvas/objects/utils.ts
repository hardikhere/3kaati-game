import store from "store";
import { defaultBoardDetails } from "./GameCanvas";

export const getDropablePoints = () => {
  const { offset, height, width } = defaultBoardDetails;
  return [
    {
      x: offset.x,
      y: offset.y,
      row: 1,
      col: 1,
    },
    {
      x: offset.x + width / 2,
      y: offset.y,
      row: 1,
      col: 2,
    },
    {
      x: width + offset.x,
      y: offset.y,
      row: 1,
      col: 3,
    },
    {
      x: offset.x,
      y: offset.y + height / 2,
      row: 2,
      col: 1,
    },
    {
      x: offset.x + width / 2,
      y: offset.y + height / 2,
      row: 2,
      col: 2,
    },
    {
      x: width + offset.x,
      y: height / 2 + offset.y,
      row: 2,
      col: 3,
    },
    {
      x: offset.x,
      y: height + offset.y,
      row: 3,
      col: 1,
    },
    {
      x: width / 2 + offset.x,
      y: height + offset.y,
      row: 3,
      col: 2,
    },

    {
      x: width + offset.x,
      y: height + offset.y,
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
  const dropableAreas = getDropablePoints();
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

export const BOARD_PADDING = 100;

export const isAnyTokenAlreadyPlaced = ({ row, col }) => {
  const state = store.getState();
  const tokensState = Object.values(state.tokens);
  for (let team of tokensState) {
    const tokens = Object.values(team);
    for (let token of tokens) {
      if (token.row === row && token.col === col) {
        return true;
      }
    }
  }
  return false;
};
