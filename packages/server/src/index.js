const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors")
app.use(cors())

const activeRooms = new Map();

const httpServer = createServer(app);
// the io variable can be used to do all the necessary things regarding Socket
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:3000"
  }
})

io.on("connection", (socket) => {
  console.log(`User Connected ${socket.id}`)
  console.log("a user connected", socket.id);
  socket.on("CREATE_ROOM", (data) => {
    console.log("creacted room");
    activeRooms.set(data.roomId, [
      {
        ...data,
      },
    ]);
    socket.join(data.roomId);
  });

  socket.on("JOIN_ROOM", (data) => {
    const { roomId } = data;
    console.log("🚀 ~ file: index.ts ~ line 37 ~ socket.on ~ data", data);
    console.log(`${socket.id} joining `, roomId);
    const playersInRoom = activeRooms.get(roomId);
    socket.send({ data: playersInRoom, type: "present_users" });
    socket.join(roomId);
    if (activeRooms.has(roomId)) {
      if (playersInRoom?.length === 2) {
        socket.send({ type: "limit_exceeded" });
        socket.disconnect();
        return;
      }
      activeRooms.set(roomId, [...activeRooms.get(roomId), { ...data }]);
    }
    io.in(roomId).emit("JOINED_ROOM", data);
  });

  socket.on("MOVE", (data) => {
    const { roomId } = data;
    io.in(roomId).emit("MOVED", data);
  });

  socket.on("WIN", (data) => {
    const { roomId } = data;
    io.in(roomId).emit("WON", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(8000, () => {
  console.log("the server is running on port 8800")
})