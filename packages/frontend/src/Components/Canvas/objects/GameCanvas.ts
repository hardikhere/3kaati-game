import boardImg from "assets/board.jpg";
import store from "store";
import { setWinner } from "store/reducers/playersSlice";
import { setToken } from "store/reducers/tokensSlice";
import { cursorInRect, getMouseCoords, getOffsetCoords } from "utils/common";
import { socketio } from "utils/socket";
import Player from "./Player";
import { slope } from "./utils";

class GameCanvas {
  ctx: CanvasRenderingContext2D | null = null;
  // TODO: add types below later
  players: Array<Player> = [];
  currentTeam = 1;
  boardDetails = defaultBoardDetails;
  boardImg = new Image();
  static isInitializedOnce = false;
  isDrawingWinningLine = false;
  winningLinePath = {
    till: { x: 0, y: 0 },
    from: { x: 0, y: 0 },
  };
  constructor(ref: HTMLCanvasElement) {
    if (GameCanvas.isInitializedOnce)
      throw new Error("Game Canvas is singleton class");
    if (!ref) throw new Error("ref can not be falsy");
    this.ctx = ref.getContext("2d");
    if (!this.ctx) throw new Error("unable to get 2D context ");
    this.boardImg.onload = () => {
      this.renderBoardImage();
    };
    this.boardImg.src = boardImg;
    GameCanvas.isInitializedOnce = true;
    this.registerSocketEvents();
  }



  checkIfAnyoneWon() {
    console.log("RUNNINGGGGG");
    // find id of player which has current chance/turn
    const players = store.getState().players;
    let playerId;
    Object.values(players).forEach(playerDetails => {
      if (playerDetails.hasChance) playerId = playerDetails.playerId;
    })
    const currentPlayerTokens = store.getState().tokens?.[playerId] || {};
    const playerTokensArr = Object.values(currentPlayerTokens);
    if (playerTokensArr.length < 3) return;

    const { x: x1, y: y1, row } = playerTokensArr[0];
    if (row === null) return;
    const { x: x2, y: y2 } = playerTokensArr[1];
    const { x: x3, y: y3 } = playerTokensArr[2];
    const slopeA = slope(x1, y1, x2, y2);
    const slopeB = slope(x2, y2, x3, y3);
    if (slopeA === slopeB) {
      // TODO: handle win here
      console.log(`player ${playerId} won`);
      store.dispatch(setWinner(playerId));
      this.winningLinePath = {
        till: {
          x: x3,
          y: y3,
        },
        from: { x: x1, y: y1 },
      };
      this.isDrawingWinningLine = true;
    }

  }

  drawWinningLine(_) {
    if (!this.ctx) return;
    const { winningLinePath, ctx } = this;
    let { from, till } = winningLinePath;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#0086DE";
    ctx.moveTo(from.x, from.y);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#F4FFDA";
    ctx.stroke();
    ctx.lineTo(till.x, till.y);
    ctx.shadowBlur = 0;
    ctx.closePath();
  }

  getAllTokens() {
    const teamATokens = this.players[0].playerTokens;
    const teamBTokens = this.players[1].playerTokens;
    const tokens = [...teamATokens, ...teamBTokens];
    return tokens;
  }

  startAnimation() {
    // clear Canvas
    const { ctx } = this;
    if (!ctx) throw new Error("ctx must be defined before starting animation");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    this.renderBoardImage();
    if (this.isDrawingWinningLine) {
      this.drawWinningLine(this.winningLinePath);
    }
    const tokens = this.getAllTokens();
    tokens.forEach((token) => {
      token.drawToken();
    });
    window.requestAnimationFrame(() => this.startAnimation());
  }

  getPlayerTokens() {
    if (this.players.length === 0) throw new Error("register players first");
    if (this.currentTeam === 1) return this.players[0].playerTokens;
    return this.players[1].playerTokens;
  }

  registerCanvasEvents() {
    const { ctx } = this;

    if (!ctx) throw new Error("Ctx must be defined before registering events");
    const { canvas } = ctx;

    const tokens = this.getAllTokens();
    canvas.addEventListener("mousemove", (e: MouseEvent) => {
      let mouse = getMouseCoords(canvas, e);

      tokens.forEach((token) => {
        if (!token.hasChance && !token.isMine) return;
        if (token.selected) {
          token.x = mouse.x - token.offset.x;
          token.y = mouse.y - token.offset.y;
        }

        if (
          cursorInRect(
            mouse.x,
            mouse.y,
            token.x - token.radius,
            token.y - token.radius,
            token.radius * 2,
            token.radius * 2
          )
        ) {
          document.body.style.cursor = "pointer";
          if (!token.active) token.activate();
        } else {
          token.active = false;
          document.body.style.cursor = "default";
        }
      });
    });

    canvas.addEventListener("mousedown", (e) => {
      let mouse = getMouseCoords(canvas, e);
      tokens.forEach((token) => {
        if (!token.hasChance || !token.isMine) return;
        if (
          cursorInRect(
            mouse.x,
            mouse.y,
            token.x - token.radius,
            token.y - token.radius,
            token.radius * 2,
            token.radius * 2
          )
        ) {
          token.selected = true;
          token.offset = getOffsetCoords(mouse as any, token);
        } else {
          token.selected = false;
        }
      });
    });

    canvas.addEventListener("mouseup", () => {
      tokens.forEach((token) => {
        if (!token.hasChance && !token.isMine) return;
        if (token.selected) {
          // TODO: add checks if token can be placed or not
          if (token.isTokenPlacable) token.placeToken();
          else token.takeBackToPrevPos();
          this.checkIfAnyoneWon();
        }
        token.selected = false;
      });
    });
  }

  registerPlayer(player) {
    this.players.push(player);
  }

  movePlayer(playerData) {
    const player = this.players.find(p => p._id === playerData.playerId);
    if (!player) throw new Error("player not found");
    const token = player.getTokenById(playerData.tokenId);
    if (!token) throw new Error("token not found");
    token.x = playerData.x;
    token.y = playerData.y;
    token.row = playerData.row;
    token.column = playerData.col;
    store.dispatch(setToken(playerData));
    this.checkIfAnyoneWon();
  }

  registerSocketEvents() {
    socketio.on("MOVED", data => {
      this.movePlayer(data);
      const player = this.players.find(p => p._id !== data.playerId);
      player?.giveChance();
    })
  }

  renderBoardImage() {
    this.ctx?.drawImage(
      this.boardImg,
      this.boardDetails.offset.x,
      this.boardDetails.offset.y,
      this.boardDetails.width,
      this.boardDetails.height
    );
  }
}
export default GameCanvas;

export const defaultBoardDetails = {
  offset: {
    x: 300,
    y: 150,
  },
  height: 400,
  width: 400,
};
