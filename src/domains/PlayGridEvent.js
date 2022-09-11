import { Subject, filter } from "rxjs";

const eventBus = new Subject();

export const isGridPlayEvent = (e) => e.event === "gridPlay";

const isNoWinnerEvent = (e) => e.event === "gridNoWinner";

export const isGameOverEvent = (e) =>
  e.event === "gridWinner" || e.event === "gridFilled";

eventBus.pipe(filter((e) => isGridPlayEvent(e))).subscribe((e) => {
  const { playGrid, playerIcon } = e;

  playGrid.isWinner(playerIcon);
});

eventBus.pipe(filter((e) => isNoWinnerEvent(e))).subscribe((e) => {
  const { playGrid } = e;

  playGrid.isFilled;
});

export default eventBus;
