import { React, useState } from "react";
import { GameContext } from "./GameContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JoinGame from "./pages/JoinGame";
import Game from "./pages/Game";
import socket from "./socket/socket";

function App() {
  const [isGameStarted, setGameStarted] = useState(false);
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState("x");
  const [currentUser, setCurrentUser] = useState("")
  const [isInRoom, setisInRoom] = useState(false)
  const roomId = null

  //store sessionID in localStorage
  socket.on("session", ({ sessionID, userID }) => {
    // attach the session ID to the next reconnection attempts
    socket.auth = { sessionID };
    // store it in the localStorage
    // localStorage.setItem("sessionID", sessionID);
    // save the ID of the user
    socket.userID = userID;
  });

  const gameContextValue = {
    isGameStarted,
    setGameStarted,
    isPlayerTurn,
    setPlayerTurn,
    playerSymbol,
    setPlayerSymbol,
    currentUser,
    setCurrentUser,
    isInRoom,
    setisInRoom,
    roomId,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/joingame" element={<JoinGame />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </GameContext.Provider>
  );
}

export default App;
