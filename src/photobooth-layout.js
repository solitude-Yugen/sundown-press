export const CELL_WIDTH = 134;
export const CELL_HEIGHT = 170;
export const MIN_ZOOM = 0.6;
export const MAX_ZOOM = 1.8;
export const clampZoom = value => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
export const positiveMod = (value, size) => ((value % size) + size) % size;

// Recycle a bounded tile pool around the camera, even after very long drags.
export function galleryTiles(width, height, x, y, zoom, count) {
  const columns = Math.ceil(width / (CELL_WIDTH * zoom)) + 3;
  const rows = Math.ceil(height / (CELL_HEIGHT * zoom)) + 3;
  const firstCol = Math.floor(-x / CELL_WIDTH) - Math.ceil(columns / 2);
  const firstRow = Math.floor(-y / CELL_HEIGHT) - Math.ceil(rows / 2);
  const tiles = [];
  for (let row = firstRow; row < firstRow + rows; row++) {
    for (let col = firstCol; col < firstCol + columns; col++) {
      tiles.push({
        key: `${col}:${row}`,
        image: positiveMod(col + row * 3, count),
        x: width / 2 + (col * CELL_WIDTH + x) * zoom,
        y: height / 2 + (row * CELL_HEIGHT + y) * zoom,
        tilt: positiveMod(col * 7 + row * 11, 9) - 4,
      });
    }
  }
  return tiles;
}
