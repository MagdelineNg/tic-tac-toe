import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { host, allUsersRoute, gameRoomRoute } from "../utils/APIRoutes";
import styles from "../styles/JoinGame.module.css";
import socket from "../socket/socket";
import { GameContext } from "../GameContext";

const JoinGame = () => {
  const { currentUser, isInRoom, setisInRoom, isGameStarted, setGameStarted } =
    useContext(GameContext);

  const navigate = useNavigate();
  const errRef = useRef();

  //const [enterGameRoom, setEnterGameRoom] = useState(false)
  const [rivalUsername, setRivalUsername] = useState("");
  const [errMsg, setErrMsg] = useState("")
  const [isJoining, setIsJoining] = useState(false);
  //const [socketId, setSocketId] = useState("")
  

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
      const response = await axios.get(`${allUsersRoute}/${rivalUsername}`);

      console.log(response.data);
      console.log("current User if type own name: ", currentUser);

      if (rivalUsername === currentUser || !response.data.status) {
        setErrMsg("Please enter a valid username.");
        errRef.current.focus();
      } else {
        setErrMsg("");
        //const joined = await gameService.joinGameRoom(socket, roomName)
        // console.log("current socket id: ", socketId)
        // const ownSocketId = localStorage.getItem("sessionID")
        socket.emit("join_game", rivalUsername, currentUser);

        socket.on("room_joined", ({ isStartGame, roomId }) => {
          // setisInRoom(true);
          console.log("isSTartGame value passed by room_joined: ", isStartGame)
          setGameStarted(isStartGame);
          console.log("is game started changed by room_joined? ", isGameStarted)
          navigate('/game')
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
      <div className={styles.joinGameContainer}>
        <h2 className={styles.createGame}> Create Game </h2>
        <p
          ref={errRef}
          className={errMsg ? "warning" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <input
          className={styles.rivalInput}
          placeholder="Username of rival..."
          value={rivalUsername}
          onChange={(event) => setRivalUsername(event.target.value)}
        />
        <button
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

//  FROM CHAT APP
// useEffect(async () => {
//   if (!localStorage.getItem("new-user-local")) {
//     navigate("/login");
//   } else {
//     setCurrentUser(await JSON.parse(localStorage.getItem("new-user-local")));
//   }
// }, []);

// useEffect(() => {
//   if (currentUser) {
//     socket.current = io(host);
//     console.log(currentUser + "connected")
//     socket.current.emit("add-user", currentUser._id);
//   }
// }, [currentUser]);
