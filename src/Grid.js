import { useState } from "react";

import Element from "./Element";
import { checkBoard, isBoardFilled } from "./util/helpers";
import "./styles/Grid.css";

const initialGrid = new Array(9).fill({ value: null });
const playerIcon = { 1: "X", 2: "O" };

export default function Grid() {
  const [grid, setGrid] = useState(initialGrid);
  const [player, setPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const isGameOver = (newGrid) => {
    if (checkBoard(newGrid, playerIcon[player]) || isBoardFilled(newGrid)) {
      setGameOver(true);
    }
  };

  const handleNewGame = () => {
    setGrid(initialGrid);
    setPlayer(1);
    setGameOver(false);
  };

  const handlePlay = (index) => {
    if (gameOver) return;

    const newGridState = [...grid];
    newGridState[index] = { value: playerIcon[player] };

    isGameOver(newGridState);

    setGrid(newGridState);
    setPlayer((player) => (player === 1 ? 2 : 1));
  };

  return (
    <>
      <p>{gameOver ? "Game Over!" : `Current Player: ${player}`}</p>
      {gameOver && <button onClick={handleNewGame}>New Game</button>}
      <div className="Grid-container">
        {grid.map((element, index) => {
          return (
            <Element
              key={index}
              index={index}
              value={element.value}
              handlePlay={handlePlay}
            />
          );
        })}
      </div>
    </>
  );
}
