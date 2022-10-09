import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { filter } from "rxjs";
import Element from "./Element";
import PlayGrid from "./domains/PlayGrid";
import { isGameOverEvent } from "./domains/PlayGridEvent";
import "./styles/Grid.css";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

export default function Grid() {
  const [playGrid, setPlayGrid] = useState(new PlayGrid());
  const [player, setPlayer] = useState();
  const [playerInput, setPlayerInput] = useState("");
  const [activePlayer, setActivePlayer] = useState();
  const [gameOver, setGameOver] = useState({ value: false, message: null });

  useEffect(() => {
    const subscription = playGrid.changes$
      .pipe(filter(isGameOverEvent))
      .subscribe((e) => {
        setGameOver({ value: true, message: e.event });
      });

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    // add player to game
    if (playerInput) {
      socket.connect();
      socket.emit("player join", playerInput);
    }
  }, [playerInput]);

  useEffect(() => {
    // set player number
    socket.on("set player", (data) => {
      setPlayer(data);
    });

    // set active player
    socket.on("set active player", (data) => {
      setActivePlayer(data);
    });

    // initiate new game
    socket.on("start new game", () => {
      setPlayGrid(new PlayGrid());
      setGameOver({ value: false, message: null });
    });

    return () => {
      socket.disconnect();
      socket.off("set active player");
      socket.off("set player");
      socket.off("start new game");
    };
  }, []);

  useEffect(() => {
    // add play to grid
    socket.on("add play", ({ index, activePlayer }) => {
      const newPlayGrid = playGrid.addPlay(index, activePlayer);

      setPlayGrid(newPlayGrid);
    });

    return () => {
      socket.off("add play");
    };
  }, [playGrid]);

  const onNewGame = () => {
    socket.emit("new game");
  };

  const onPlay = (index) => {
    if (gameOver.value || activePlayer !== player) return;

    socket.emit("play", { index, activePlayer });
  };

  const onSetPlayerInput = (e) => {
    setPlayerInput(e.target.value);
  };

  return (
    <>
      {!player ? (
        <>
          <label>Enter Name: </label>
          <input value={playerInput} onChange={onSetPlayerInput} />
        </>
      ) : (
        <>
          <p>
            {gameOver.value
              ? `Game Over! ${gameOver.message}`
              : `You are player: ${player} Current Player: ${activePlayer}`}
          </p>
          {gameOver.value && <button onClick={onNewGame}>New Game</button>}
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
      )}
    </>
  );
}
