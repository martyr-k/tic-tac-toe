import { useEffect, useState } from "react";
import { filter } from "rxjs";
import Element from "./Element";
import PlayGrid from "./domains/PlayGrid";
import eventBus, { isGameOverEvent } from "./domains/PlayGridEvent";
import "./styles/Grid.css";

export default function Grid() {
  const [playGrid, setPlayGrid] = useState(new PlayGrid());
  const [player, setPlayer] = useState(1);
  const [gameOver, setGameOver] = useState({ value: false, message: null });

  useEffect(() => {
    const subscription = eventBus
      .pipe(filter((e) => isGameOverEvent(e)))
      .subscribe((v) => {
        setGameOver({ value: true, message: v.event });
      });

    return () => subscription.unsubscribe();
  });

  const handleNewGame = () => {
    setPlayGrid(new PlayGrid());
    setPlayer(1);
    setGameOver(false);
  };

  const onPlay = (index) => {
    if (gameOver.value) return;

    setPlayGrid(playGrid.addPlay(index, player));
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
