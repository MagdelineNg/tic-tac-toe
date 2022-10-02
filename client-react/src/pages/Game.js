import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import socket from "../socket/socket";
import { GameContext } from "../GameContext";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Game.module.css";
import { pastGamesRoute } from "../utils/APIRoutes";
import axios from "axios";
import NavBar from "../components/NavBar";

//todo: move css to another file
const Separator = styled.div`
  height: 50px;
  padding: 20px;
  width: 100%
}`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin; 30px;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Cell = styled.div`
  border-top: ${({ borderTop }) => borderTop && "3px solid #ffaa0028;"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #ffaa0028;"};
  border-bottom: ${({ borderBottom }) =>
    borderBottom && "3px solid #ffaa0028;"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #ffaa0028;"};
  transition: all 270ms ease-in-out;
  &:hover {
    background-color: #ac894228;
  }
`;

const X = styled.span`
  font-size: 100px;
  color: grey;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: grey;
  &::after {
    content: "O";
  }
`;

const PastGamesContainer = styled.div`
  overflowy: scroll;
  height: 40%;
`;

const PastRowContainer = styled.span`
  width: 100%;
  height: 30%;
  display: flex;
`;

const PastCell = styled.div`
  border-top: ${({ borderTop }) => borderTop && "3px solid #ffaa0028;"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #ffaa0028;"};
  border-bottom: ${({ borderBottom }) =>
    borderBottom && "3px solid #ffaa0028;"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #ffaa0028;"};
  width: 50px;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`;

const PastX = styled.span`
  font-size: 50px;
  color: grey;
  &::after {
    content: "X";
  }
`;

const PastO = styled.span`
  font-size: 50px;
  color: grey;
  &::after {
    content: "O";
  }
`;

const Game = () => {
  const [pastGames, setPastGames] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [noPastGames, setNoPastGames] = useState(false);
  const [viewPastGames, setViewPastGames] = useState(false);

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
    currentUser,
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

  const updateGameMatrix = (column, row, symbol) => {
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === "" || newMatrix[row][column] === null) {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    socket.emit("update_game", newMatrix);
    const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);

    if (currentPlayerWon && otherPlayerWon) {
      const rival = localStorage.getItem("rivalUsername");
      const message = `You tied with ${rival}`;
      const rivalMessage = `You tied with ${currentUser}`;
      socket.emit("game_win", rivalMessage);
      socket.emit("save_game", { currentUser, message, matrix });
      setNoPastGames(false);
      alert(message);
    } else if (currentPlayerWon && !otherPlayerWon) {
      const otherMessage = `You lost to ${currentUser}`;
      socket.emit("game_win", otherMessage);
      setNoPastGames(false);
      const rival = localStorage.getItem("rivalUsername");

      const message = `You won against ${rival}`;
      socket.emit("save_game", { currentUser, message, matrix });
      alert(message);
    }
    setPlayerTurn(false);
  };

  const handleGameWin = () => {
    socket.on("on_game_win", (message) => {
      socket.emit("save_game", { currentUser, message, matrix });
      setPlayerTurn(false);
      alert(message);
    });
  };

  const handleGameStart = () => {
    if (playerSymbol === "x") {
      setPlayerTurn(true);
    }

    socket.on("start_game", ({ symbol, start }) => {
      setGameStarted(true);
      setPlayerSymbol(symbol);
      if (start) {
        setPlayerTurn(true);
      } else {
        setPlayerTurn(false);
      }
    });
  };

  const handleGameUpdate = () => {
    socket.on("on_game_update", (newMatrix) => {
      setMatrix(newMatrix);
      checkGameState(newMatrix);
      setPlayerTurn(true);
    });
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  const viewPastGamesHandler = async () => {
    const token = localStorage.getItem("auth_token");
    const allGames = await axios.post(`${pastGamesRoute}/${currentUser}`, {
      token,
    });
    if (allGames.data.allMatrix.length === 0) {
      setNoPastGames(true);
    } else {
      setNoPastGames(false);
      setPastResults(allGames.data.result);
      setPastGames(allGames.data.allMatrix);
    }
    setViewPastGames(true);
  };

  return (
    <React.Fragment>
      <NavBar title="  Join Game" aria-label="logout" />
      <Separator />
      <GameContainer>
        {!isGameStarted && (
          <h2>Waiting for Other Player to Join to Start the Game!</h2>
        )}
        {isGameStarted && (
          <h2 aria-live="Both players have joined.Let's play!">
            Both players have joined. Let's play!
          </h2>
        )}
        <Separator />
        {matrix.map((row, rowIdx) => {
          return (
            <RowContainer
              aria-live={
                isGameStarted
                  ? "Click on the board to make your move"
                  : "Board is not clickable until both players have joined"
              }
              style={
                isPlayerTurn && isGameStarted
                  ? { pointerEvents: "auto" }
                  : { pointerEvents: "none" }
              }
            >
              {row.map((column, columnIdx) => (
                <Cell
                  className={styles.cell}
                  borderRight={columnIdx < 2}
                  borderLeft={columnIdx > 0}
                  borderBottom={rowIdx < 2}
                  borderTop={rowIdx > 0}
                  onClick={() =>
                    updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                  }
                >
                  {column && column !== "" ? (
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
        <span className={styles.buttonContainer}>
          <button
            className={styles.pastGamesButton}
            onClick={viewPastGamesHandler}
          >
            View past games
          </button>
        </span>
        {noPastGames && (
          <h2 className={styles.pastGamesHeader}>You have no past games!</h2>
        )}
        {setViewPastGames && (
          <PastGamesContainer>
            {pastGames.map((game, i) => {
              return (
                <div key={i}>
                  <ul>
                    {game.map((row, rowIdx) => {
                      return (
                        <PastRowContainer>
                          {row.map((column, columnIdx) => (
                            <PastCell
                              className={styles.pastcell}
                              borderRight={columnIdx < 2}
                              borderLeft={columnIdx > 0}
                              borderBottom={rowIdx < 2}
                              borderTop={rowIdx > 0}
                            >
                              {column && column !== "" ? (
                                column === "x" ? (
                                  <PastX />
                                ) : (
                                  <PastO />
                                )
                              ) : null}
                            </PastCell>
                          ))}
                        </PastRowContainer>
                      );
                    })}
                    {
                      <React.Fragment>
                        Game {i}: {pastResults[i]}
                      </React.Fragment>
                    }
                  </ul>
                </div>
              );
            })}
          </PastGamesContainer>
        )}
      </GameContainer>
    </React.Fragment>
  );
};

export default Game;
