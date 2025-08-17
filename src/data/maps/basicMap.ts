export interface BasicMap {
  cols: number;
  rows: number;
}

export function basicMap(cols: number, rows: number): BasicMap {
  return { cols, rows };
}
