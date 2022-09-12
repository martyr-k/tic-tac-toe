export const isGridPlayEvent = (e) => e.event === "gridPlay";

export const isNoWinnerEvent = (e) => e.event === "gridNoWinner";

export const isGameOverEvent = (e) =>
  e.event === "gridWinner" || e.event === "gridFilled";
