import test from 'node:test';
import assert from 'node:assert/strict';
import { galleryTiles, clampZoom, MIN_ZOOM, MAX_ZOOM, CELL_WIDTH, CELL_HEIGHT } from '../src/photobooth-layout.js';

test('infinite gallery covers the screen after long drags at both zoom limits', () => {
  for (const zoom of [MIN_ZOOM, 0.95, MAX_ZOOM]) {
    for (const offset of [-1e7, -134, -0.1, 0, 170, 1e7]) {
      const tiles = galleryTiles(400, 310, offset, -offset, zoom, 10);
      assert.ok(tiles.length < 100, 'tile pool remains bounded');
      assert.equal(new Set(tiles.map(tile => tile.key)).size, tiles.length);
      assert.ok(tiles.every(tile => tile.image >= 0 && tile.image < 10));
      assert.ok(Math.min(...tiles.map(tile => tile.x)) <= 0);
      assert.ok(Math.max(...tiles.map(tile => tile.x)) + CELL_WIDTH * zoom >= 400);
      assert.ok(Math.min(...tiles.map(tile => tile.y)) <= 0);
      assert.ok(Math.max(...tiles.map(tile => tile.y)) + CELL_HEIGHT * zoom >= 310);
    }
  }
});

test('tiles retain their image across recycling boundaries', () => {
  const before = galleryTiles(400, 310, -133, 0, 1, 10);
  const after = new Map(galleryTiles(400, 310, -135, 0, 1, 10).map(tile => [tile.key, tile]));
  for (const tile of before) if (after.has(tile.key)) {
    assert.equal(tile.image, after.get(tile.key).image);
    assert.equal(after.get(tile.key).x, tile.x - 2);
  }
  assert.equal(clampZoom(0), MIN_ZOOM);
  assert.equal(clampZoom(100), MAX_ZOOM);
});
