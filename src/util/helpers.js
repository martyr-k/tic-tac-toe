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
