export function getGap(gap: string) {
  const [row, col] = gap.split(' ');
  return {
    row,
    col,
  };
}
