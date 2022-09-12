import { isGridPlayEvent, isNoWinnerEvent } from "./PlayGridEvent";
import { Subject, filter } from "rxjs";
import { winningCombinations, playerIcons } from "../util/constants";

export default class PlayGrid {
  constructor() {
    this._grid = new Array(9).fill({ value: null });
    this._eventBus = new Subject();

    this._eventBus.pipe(filter((e) => isGridPlayEvent(e))).subscribe((e) => {
      const { playerIcon } = e;

      this.isWinner(playerIcon);
    });

    this._eventBus
      .pipe(filter((e) => isNoWinnerEvent(e)))
      .subscribe(() => this.isFilled);
  }

  get grid() {
    return this._grid;
  }

  get changes$() {
    return this._eventBus.asObservable();
  }

  get isFilled() {
    if (this._grid.every((element) => element.value)) {
      this._eventBus.next({ event: "gridFilled" });
    }
  }

  addPlay(index, player) {
    const newGrid = [...this._grid];
    const playerIcon = playerIcons[player];

    newGrid[index] = { value: playerIcon };
    this._grid = newGrid;

    this._eventBus.next({ event: "gridPlay", playerIcon });

    return this;
  }

  isWinner(playerIcon) {
    // - optimize to return on first combination true
    if (
      winningCombinations
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
        .some((element) => element)
    ) {
      this._eventBus.next({ event: "gridWinner" });
    } else {
      this._eventBus.next({ event: "gridNoWinner" });
    }
  }
}
