import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const PORT = 8000;
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// TODO: replace it with redis
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("CREATE_ROOM", (data) => {
    console.log("got data ", data);
    socket.join(socket.id);
  });

  socket.on("JOIN_ROOM", (roomId) => {
    console.log(`${socket.id} joining `, roomId);
    socket.join(roomId);
    io.in(roomId).emit("JOINED_ROOM", Array.from(socket.rooms.values()));
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
