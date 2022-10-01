import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import socket from "../socket/socket";
import { GameContext } from "../GameContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Game.module.css";
import { pastGamesRoute } from "../utils/APIRoutes";
import axios from "axios";

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const Cell = styled.div`
border-top: ${({ borderTop }) => borderTop && "3px solid #ffaa0028;"};
border-left: ${({ borderLeft }) => borderLeft && "3px solid #ffaa0028;"};
border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #ffaa0028;"};
border-right: ${({ borderRight }) => borderRight && "3px solid #ffaa0028;"};
transition: all 270ms ease-in-out;
&:hover {
  background-color: #ac894228;
}
`

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

const X = styled.span`
  font-size: 100px;
  color: #9b6144;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: #9b6144;
  &::after {
    content: "O";
  }
`;

const Game = () => {
  const navigate = useNavigate();
  const [showPastGames, setShowPastGames] = useState(false)

  const [matrix, setMatrix] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const {
    isGameStarted,
    setGameStarted,
    isPlayerTurn,
    setPlayerTurn,
    playerSymbol,
    setPlayerSymbol,
    currentUser
  } = useContext(GameContext);

  const checkGameState = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== ""))) {
      return [true, true];
    }

    return [false, false];
  };

  // useEffect(() => {
  //   checkGameState(matrix)
  // }, [matrix])

  const updateGameMatrix = (column, row, symbol) => {
    console.log("symbol: ", symbol);
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === "" || newMatrix[row][column] === null) {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    console.log("matrix outside update_game: ", newMatrix);
    socket.emit("update_game", newMatrix);
    const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
    if (currentPlayerWon && otherPlayerWon) {
      socket.emit("game_win",  "The Game is a TIE!");
      alert("The Game is a TIE!");
    } else if (currentPlayerWon && !otherPlayerWon) {
      socket.emit("game_win", "You lost the game!");
      alert("You Won!");
    }
    setPlayerTurn(false);
  };

  const handleGameStart = () => {
    //second player does not catch socket
    if (playerSymbol === "x") {
      setPlayerTurn(true);
    }
    console.log("BEFORE isPLayerTurn: ", isPlayerTurn);
    console.log("isGameStarted: ", isGameStarted);
    console.log("symbol:", playerSymbol);
    console.log("isPlayerturn: ", isPlayerTurn);
    //first player
    // if (playerSymbol==="o"){
    //   setPlayerTurn(true);
    //   console.log("AFTER IF isPlayerTurn: ", isPlayerTurn);
    // }

    //only first player enters
    socket.on("start_game", ({ symbol, start }) => {
      console.log("symbol and start passed: ", symbol, start);
      setGameStarted(true);
      console.log("value of isGameStarted in handlegamestart: ", isGameStarted);
      setPlayerSymbol(symbol);
      console.log("value of playerSYmbol in handlegamestart: ", playerSymbol);
      if (start) {
        setPlayerTurn(true);
      } else {
        setPlayerTurn(false);
      }
      console.log("AFTER SOCKET isPlayerTurn: ", isPlayerTurn);
    });
  };

  const handleGameUpdate = () => {
    console.log("in handleGameUpdate");
    socket.on("on_game_update", (newMatrix) => {
      console.log("receive game update !! ", newMatrix);
      setMatrix(newMatrix);
      checkGameState(newMatrix);
      setPlayerTurn(true);
      console.log(isPlayerTurn);
      console.log(isGameStarted);
    });
  };

  const handleGameWin = () => {
    socket.on("on_game_win", (message) => {
      console.log("here", message);
      setPlayerTurn(false);
      alert(message);
    });
  };

  const viewPastGames = async () => {
    console.log("current user in viewpastgames: ", currentUser)
    const pastGames = await axios.get(`${pastGamesRoute}/${currentUser}`);
    setShowPastGames(true)
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  return (
    <div>
      <GameContainer>
        {!isGameStarted && (
          <h2>Waiting for Other Player to Join to Start the Game!</h2>
        )}
        {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
        {matrix.map((row, rowIdx) => {
          return (
            <RowContainer>
              {row.map((column, columnIdx) => (
                <Cell className={styles.cell}
                  borderRight={columnIdx < 2}
                  borderLeft={columnIdx > 0}
                  borderBottom={rowIdx < 2}
                  borderTop={rowIdx > 0}
                  onClick={() =>
                    updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                  }
                >
                  {column && column !== "null" ? (
                    column === "x" ? (
                      <X />
                    ) : (
                      <O />
                    )
                  ) : null}
                </Cell>
              ))}
            </RowContainer>
          );
        })}
      </GameContainer>
      <span className={styles.buttonContainer}>
        <button className={styles.pastGamesButton} onClick={viewPastGames}>
          View past games
        </button>
      </span>
    </div>
  );
};

export default Game;
