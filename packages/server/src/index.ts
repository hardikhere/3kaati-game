import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express().use(cors);
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// TODO: replace it with redis
// string --> users[]
const activeRooms = new Map();

io.on("connection", (socket) => {
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

  socket.on('MOVE', (data) => {
    const { roomId } = data;
    io.in(roomId).emit("MOVED", data);
  });

  socket.on('WIN', (data) => {
    const { roomId } = data;
    io.in(roomId).emit("WON", data);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
