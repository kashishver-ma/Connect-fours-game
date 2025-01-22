"use client";

import { useState, useEffect } from "react";
import { Grid } from "./components/Grid";
import { ScoreBoard } from "./components/ScoreBoard";

enum GridPosition {
  EMPTY,
  YELLOW,
  RED,
}

interface Player {
  name: string;
  piece: GridPosition;
}

export default function Home() {
  const ROWS = 6;
  const COLS = 7;
  const CONNECT_N = 4;
  // const TARGET_SCORE = 10;

  const [grid, setGrid] = useState<GridPosition[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    name: "Player 1",
    piece: GridPosition.YELLOW,
  });
  const [scores, setScores] = useState({
    "Player 1": 0,
    "Player 2": 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const players: Player[] = [
    { name: "Player 1", piece: GridPosition.YELLOW },
    { name: "Player 2", piece: GridPosition.RED },
  ];

  const initGrid = () => {
    const newGrid = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(GridPosition.EMPTY));
    setGrid(newGrid);
    setGameOver(false);
    setWinner(null);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const checkWin = (row: number, col: number, piece: GridPosition): boolean => {
    let count = 0;

    // Horizontal check
    for (let c = 0; c < COLS; c++) {
      if (grid[row][c] === piece) {
        count++;
      } else {
        count = 0;
      }
      if (count === CONNECT_N) return true;
    }

    // Vertical check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      if (grid[r][col] === piece) {
        count++;
      } else {
        count = 0;
      }
      if (count === CONNECT_N) return true;
    }

    // Diagonal check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      const c = row + col - r;
      if (c >= 0 && c < COLS && grid[r][c] === piece) {
        count++;
      } else {
        count = 0;
      }
      if (count === CONNECT_N) return true;
    }

    // Anti-diagonal check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      const c = col - row + r;
      if (c >= 0 && c < COLS && grid[r][c] === piece) {
        count++;
      } else {
        count = 0;
      }
      if (count === CONNECT_N) return true;
    }

    return false;
  };

  const placePiece = (column: number) => {
    if (gameOver) return;

    const newGrid = [...grid];

    // Find the lowest empty row in the selected column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newGrid[r][column] === GridPosition.EMPTY) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full

    newGrid[row][column] = currentPlayer.piece;
    setGrid(newGrid);

    // Check for win
    if (checkWin(row, column, currentPlayer.piece)) {
      const newScores = { ...scores };
      // newScores[currentPlayer.name]++;
      setScores(newScores);

      // if (newScores[currentPlayer.name] >= TARGET_SCORE) {
      //   setWinner(currentPlayer.name);
      //   setGameOver(true);
      //   return; // Exit the function early
      // }

      // If the target score is not reached, game continues
      setWinner(currentPlayer.name);
      setGameOver(true);
      return;
    }

    // Switch players
    setCurrentPlayer(
      players[currentPlayer.piece === GridPosition.YELLOW ? 1 : 0]
    );
  };

  const startNewGame = () => {
    // Reset the grid and game-over state, but keep scores intact
    initGrid();
    setGameOver(false);
    setWinner(null);
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-300">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">
          Connect Four
        </h1>

        {/* Show current player's turn */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">
            Its {currentPlayer.name}s turn!
          </h2>
        </div>

        {/* Display scoreboard */}
        <ScoreBoard scores={scores} currentPlayer={currentPlayer.name} />
        <Grid grid={grid} onColumnClick={placePiece} />

        {/* Game Over Message */}
        {gameOver && winner && (
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-black-600 mb-4">
              {winner} wins the game!
            </h2>
            {/* <p className="text-xl">Score: {scores[winner]}</p> */}
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          {/* "New Game" button */}
          <div className="ml-4">
            {" "}
            <button
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-300"
              onClick={startNewGame}
            >
              New Game
            </button>{" "}
          </div>
        </div>
      </div>
    </main>
  );
}
