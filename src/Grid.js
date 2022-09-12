import { useEffect, useState } from "react";
import { filter } from "rxjs";
import Element from "./Element";
import PlayGrid from "./domains/PlayGrid";
import { isGameOverEvent } from "./domains/PlayGridEvent";
import "./styles/Grid.css";

export default function Grid() {
  const [playGrid, setPlayGrid] = useState(new PlayGrid());
  const [player, setPlayer] = useState(1);
  const [gameOver, setGameOver] = useState({ value: false, message: null });

  useEffect(() => {
    const subscription = playGrid.changes$
      .pipe(filter((e) => isGameOverEvent(e)))
      .subscribe((ev) => {
        setGameOver({ value: true, message: ev.event });
      });

    return () => subscription.unsubscribe();
  });

  const handleNewGame = () => {
    setPlayGrid(new PlayGrid());
    setPlayer(1);
    setGameOver({ value: false, message: null });
  };

  const onPlay = (index) => {
    if (gameOver.value) return;

    const newPlayGrid = playGrid.addPlay(index, player);

    setPlayGrid(newPlayGrid);
    setPlayer((player) => (player === 1 ? 2 : 1));
  };

  return (
    <>
      <p>
        {gameOver.value
          ? `Game Over! ${gameOver.message}`
          : `Current Player: ${player}`}
      </p>
      {gameOver.value && <button onClick={handleNewGame}>New Game</button>}
      <div className="Grid-container">
        {playGrid.grid.map((element, index) => {
          return (
            <Element
              key={index}
              index={index}
              value={element.value}
              handlePlay={onPlay}
            />
          );
        })}
      </div>
    </>
  );
}
