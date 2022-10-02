import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { allUsersRoute } from "../utils/APIRoutes";
import styles from "../styles/JoinGame.module.css";
import socket from "../socket/socket";
import { GameContext } from "../GameContext";
import NavBar from "../components/NavBar";

const JoinGame = () => {
  const { currentUser, isGameStarted, setGameStarted } =
    useContext(GameContext);

  const navigate = useNavigate();
  const errRef = useRef();

  const [rivalUsername, setRivalUsername] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const gameId = useRef();

  useEffect(() => {
    gameId.current.focus();
  }, []);

  const connect = () => {
    socket.on("connect", () => {
      console.log(`you connected with id: ${socket.id}`);
    });
  };

  useEffect(() => {
    connect();
  }, []);

  const handlecreateRoom = async (e) => {
    setIsJoining(true);
    e.preventDefault();

    try {
      // const token = localStorage.getItem("auth_token");
      const response = await axios.post(`${allUsersRoute}/${rivalUsername}`);

      if (rivalUsername === currentUser || !response.data.status) {
        setErrMsg("Please enter a valid username.");
        setIsJoining(false);
        gameId.current.focus();
        errRef.current.focus();
      } else {
        setErrMsg("");
        socket.emit("join_game", rivalUsername, currentUser);

        socket.on("room_joined", ({ isStartGame }) => {
          localStorage.setItem("rivalUsername", rivalUsername);
          setGameStarted(isStartGame);
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
    <main className="mainContainer">
      <NavBar title="  Join Game" aria-label="logout"/>
      <section className={styles.joinGameContainer}>
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
          type="text"
          aria-label="Enter username of opponent."
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
      </section>
    </main>
  );
};

export default JoinGame;
