import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host, allUsersRoute, gameRoomRoute } from "../utils/APIRoutes";
import styles from "../styles/JoinGame.module.css";
import socket from "../socket/socket";
import { GameContext } from "../GameContext";
import NavBar from "../components/NavBar";

const JoinGame = () => {
  const { currentUser, isInRoom, setisInRoom, isGameStarted, setGameStarted } =
    useContext(GameContext);

  const navigate = useNavigate();
  const errRef = useRef();

  //const [enterGameRoom, setEnterGameRoom] = useState(false)
  const [rivalUsername, setRivalUsername] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const gameId = useRef();
  //const [socketId, setSocketId] = useState("")

  useEffect(() => {
    gameId.current.focus();
  }, []);

  const connect = () => {
    socket.on("connect", () => {
      console.log(`you connected with id: ${socket.id}`);
      //setSocketId(socket.id)
    });
  };

  useEffect(() => {
    connect();
  }, []);

  const handlecreateRoom = async (e) => {
    setIsJoining(true);
    e.preventDefault();

    console.log("rival: ", rivalUsername);
    try {
      // const token = localStorage.getItem("auth_token");
      // console.log('JOIN GAME: ', {token})
      const response = await axios.post(`${allUsersRoute}/${rivalUsername}`);

      console.log("JOIN GAME RESPONSE FROM AXIOS: ", response.data);
      console.log("current User: ", currentUser);

      if (rivalUsername === currentUser || !response.data.status) {
        setErrMsg("Please enter a valid username.");
        setIsJoining(false);
        gameId.current.focus();
        errRef.current.focus();
      } else {
        setErrMsg("");
        //const joined = await gameService.joinGameRoom(socket, roomName)
        // console.log("current socket id: ", socketId)
        // const ownSocketId = localStorage.getItem("sessionID")
        socket.emit("join_game", rivalUsername, currentUser);

        socket.on("room_joined", ({ isStartGame }) => {
          // setisInRoom(true);
          localStorage.setItem("rivalUsername", rivalUsername);
          console.log("isSTartGame value passed by room_joined: ", isStartGame);
          setGameStarted(isStartGame);
          console.log(
            "is game started changed by room_joined? ",
            isGameStarted
          );
          navigate("/game");
        });

        socket.on("room_join_error", ({ error }) => {
          setErrMsg(error);
          errRef.current.focus();
        });
      }
      setIsJoining(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="mainContainer">
      <nav>
      <NavBar aria-label="logout"/>
      </nav>
      <div className={styles.joinGameContainer}>
        <h1 className={styles.createGame}> Create Game </h1>
        <p
          ref={errRef}
          className={errMsg ? "warning" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <input
          ref={gameId}
          className={styles.rivalInput}
          placeholder="Username of rival..."
          value={rivalUsername}
          onChange={(event) => setRivalUsername(event.target.value)}
        />
        <button
          type="button"
          className={styles.joinButton}
          onClick={handlecreateRoom}
          disabled={isJoining}
        >
          {isJoining ? "Joining..." : "Join"}
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
