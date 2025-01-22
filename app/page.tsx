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

  const [grid, setGrid] = useState<GridPosition[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    name: "You",
    piece: GridPosition.YELLOW,
  });
  const [scores, setScores] = useState({
    You: 0,
    Computer: 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const players: Player[] = [
    { name: "You", piece: GridPosition.YELLOW },
    { name: "Computer", piece: GridPosition.RED },
  ];

  useEffect(() => {
    initGrid();
  }, []);

  const initGrid = () => {
    setGrid(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(GridPosition.EMPTY))
    );
    setGameOver(false);
    setWinner(null);
    setCurrentPlayer(players[0]); // Always start with the human player
  };

  const checkWin = (
    grid: GridPosition[][],
    row: number,
    col: number,
    piece: GridPosition
  ): boolean => {
    let count = 0;

    // Horizontal check
    for (let c = 0; c < COLS; c++) {
      count = grid[row][c] === piece ? count + 1 : 0;
      if (count === CONNECT_N) return true;
    }

    // Vertical check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      count = grid[r][col] === piece ? count + 1 : 0;
      if (count === CONNECT_N) return true;
    }

    // Diagonal (↘) check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      const c = row + col - r;
      if (c >= 0 && c < COLS) count = grid[r][c] === piece ? count + 1 : 0;
      if (count === CONNECT_N) return true;
    }

    // Anti-diagonal (↙) check
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      const c = col - row + r;
      if (c >= 0 && c < COLS) count = grid[r][c] === piece ? count + 1 : 0;
      if (count === CONNECT_N) return true;
    }

    return false;
  };

  const getComputerMove = (grid: GridPosition[][]): number | null => {
    const availableColumns = [];
    for (let col = 0; col < COLS; col++) {
      if (grid[0][col] === GridPosition.EMPTY) availableColumns.push(col);
    }
    return availableColumns.length > 0
      ? availableColumns[Math.floor(Math.random() * availableColumns.length)]
      : null;
  };

  const placePiece = (column: number) => {
    if (gameOver || currentPlayer.name === "Computer") return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newGrid[r][column] === GridPosition.EMPTY) {
          row = r;
          break;
        }
      }
      if (row === -1) return prevGrid;

      newGrid[row][column] = currentPlayer.piece;

      if (checkWin(newGrid, row, column, currentPlayer.piece)) {
        setWinner(currentPlayer.name);
        setGameOver(true);
        return newGrid;
      }

      setCurrentPlayer(players[1]); // Switch to computer
      setTimeout(() => aiMove(newGrid), 500);
      return newGrid;
    });
  };

  const aiMove = (grid: GridPosition[][]) => {
    if (gameOver) return;

    const aiColumn = getComputerMove(grid);
    if (aiColumn === null) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newGrid[r][aiColumn] === GridPosition.EMPTY) {
          row = r;
          break;
        }
      }
      if (row === -1) return prevGrid;

      newGrid[row][aiColumn] = GridPosition.RED;

      if (checkWin(newGrid, row, aiColumn, GridPosition.RED)) {
        setWinner("Computer");
        setGameOver(true);
        return newGrid;
      }

      setCurrentPlayer(players[0]); // Switch back to human player
      return newGrid;
    });
  };

  return (
    <main className="min-h-screen p-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-300">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">
          Connect Four
        </h1>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold">
            It's {currentPlayer.name}'s turn!
          </h2>
        </div>
        <ScoreBoard scores={scores} currentPlayer={currentPlayer.name} />
        <Grid grid={grid} onColumnClick={placePiece} />
        {gameOver && winner && (
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-black-600 mb-4">
              {winner} wins the game!
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}
