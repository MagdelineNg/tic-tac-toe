const express = require("express");
const cors = require("cors");
const socket = require("socket.io");
const userRoutes = require("./routers/userRoutes");
const User = require("./model/userModel");
const cookieParser = require('cookie-parser')

const app = express();
require("./db/mongoose");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/api/auth", userRoutes);

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log("server is up on port " + port);
});

const io = socket(server, {
  cors: {
    origin: process.eventNames.PORT, //whr client lives
    credentials: true,
  },
});

io.on("connection", (socket, client) => {
  console.log("New socket connected: " + socket.id);
  socket.emit("session", {
    sessionId: socket.sessionID,
    userID: socket.userID,
  });

  socket.on("join_game", async (rivalUsername, currentUser) => {
    const connectedSockets = io.sockets.adapter.rooms.get(rivalUsername);


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
      //first player waiting in room
      if (connectedSockets && connectedSockets.size === 1) {
        await socket.join(rivalUsername);

        socket.emit("room_joined", {
          isStartGame: true,
          roomId: rivalUsername,
        });

        if (io.sockets.adapter.rooms.get(rivalUsername).size === 2) {
          //send to second player
          socket.emit("start_game", { start: true, symbol: "x" });
          //send to first player
          socket
            .to(rivalUsername)
            .emit("start_game", { start: false, symbol: "o" });
        }
      } else {
        //you are first player
        socket.emit("room_joined", { isStartGame: false, roomId: currentUser });
        socket.join(currentUser);
      }
    }
  });

  socket.on("update_game", (newMatrix) => {
    const roomId = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    socket.to(roomId[0]).emit("on_game_update", newMatrix);
  });

  socket.on("game_win", (message) => {
    const roomId = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    socket.to(roomId).emit("on_game_win", message);
  });

  socket.on("save_game", async ({ currentUser, message, matrix }) => {
    const user = await User.updateOne(
      { user: currentUser },
      {
        $push: { allMatrix: matrix, result: message },
      }
    );
  })
});
