export function hideBorder(index) {
  const left = [0, 3, 6];
  const right = [2, 5, 8];
  const top = [0, 1, 2];
  const bottom = [6, 7, 8];
  const style = {};

  if (left.includes(index)) {
    style.borderLeft = "none";
  }
  if (right.includes(index)) {
    style.borderRight = "none";
  }
  if (top.includes(index)) {
    style.borderTop = "none";
  }
  if (bottom.includes(index)) {
    style.borderBottom = "none";
  }

  return style;
}

export function checkBoard(grid, value) {
  const winningCombinations = [
    [0, 1, 2],
    [0, 3, 6],
    [6, 7, 8],
    [2, 5, 8],
    [1, 4, 7],
    [0, 4, 8],
    [2, 4, 6],
    [3, 4, 5]
  ];

  // - optimize to return on first true
  return winningCombinations
    .map((combination) => {
      if (
        grid[combination[0]].value === value &&
        grid[combination[1]].value === value &&
        grid[combination[2]].value === value
      ) {
        return true;
      }
      return false;
    })
    .some((element) => element);
}

export function isBoardFilled(grid) {
  return grid.every((element) => element.value);
}
