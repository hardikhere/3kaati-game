import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
const server = http.createServer(app);
const PORT = 8000;
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://3kaati.vercel.app/"],
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
    socket.join(roomId);
    if (activeRooms.has(roomId)) {
      const playersInRoom = activeRooms.get(roomId);
      if (playersInRoom?.length === 2) {
        socket.send({ type: "limit_exceeded" });
        socket.disconnect();
        return;
      }
      activeRooms.set(roomId, [...activeRooms.get(roomId), { ...data }]);
    }
    const present = activeRooms.get(roomId);
    socket.send({ data: present, type: "present_users" });
    io.in(roomId).emit("JOINED_ROOM", activeRooms.get(roomId));
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
