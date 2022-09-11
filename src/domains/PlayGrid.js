import eventBus from "./PlayGridEvent";
import { winningCombinations, playerIcons } from "../util/constants";

export default class PlayGrid {
  constructor() {
    this._grid = new Array(9).fill({ value: null });
  }

  get grid() {
    return this._grid;
  }

  addPlay(index, player) {
    const newGrid = [...this._grid];
    const playerIcon = playerIcons[player];

    newGrid[index] = { value: playerIcon };
    this._grid = newGrid;

    if (this.isWinner(playerIcon)) {
      eventBus.next({ event: "winnerFound" });
    } else if (this.isFilled) {
      eventBus.next({ event: "boardFilled" });
    }

    return this;
  }

  get isFilled() {
    return this._grid.every((element) => element.value);
  }

  isWinner(playerIcon) {
    // - optimize to return on first combination true
    return winningCombinations
      .map((combination) => {
        if (
          this._grid[combination[0]].value === playerIcon &&
          this._grid[combination[1]].value === playerIcon &&
          this._grid[combination[2]].value === playerIcon
        ) {
          return true;
        }
        return false;
      })
      .some((element) => element);
  }
}
