const express = require("express");
const cors = require("cors");
const socket = require('socket.io')
const userRoutes = require("./routers/userRoutes");

const app = express();
require("./db/mongoose");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("server is up on port " + port);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",   //whr client lives 
    credentials: true,
  },
});

io.on("connection", (socket, client)=> {
  console.log("New socket connected: " + socket.id)


  socket.on("join_game", async (socketId) => {
    const connectedSockets = io.sockets.adapter.rooms.get(socketId)
    console.log("number of connected socket: ", connectedSockets)

    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (
      socketRooms.length > 0 ||
      (connectedSockets && connectedSockets.size === 2)
    ) {
      socket.emit("room_join_error", {
        error: "Room is full. Please choose another room to play!",
      });
    } else {
      await socket.join(socketId);
      socket.emit("room_joined");
    }

    if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
      socket.emit("start_game", { start: true, symbol: "x" });
      socket
        .to(message.roomId)
        .emit("start_game", { start: false, symbol: "o" });
    }
  })


  // socket.on("join-room", (username) => {
  //   console.log(username)
  // })

  // client.emit("join-room", (username))

  // socket.on("add-user", (userId) => {
  //   onlineUsers.set(userId, socket.id);
  // });
})


