import test from 'node:test';
import assert from 'node:assert/strict';
import { pageTurn, paperStrip, catalogueState } from '../src/catalogue/timeline.js';

test('pages turn sequentially without exceeding their hinges', () => {
  for (let progress = 0; progress <= 7; progress += 0.025) {
    const turns = Array.from({ length: 5 }, (_, i) => pageTurn(progress, i));
    assert.ok(turns.every(v => v >= 0 && v <= 1));
    assert.ok(turns.filter(v => v > 0 && v < 1).length <= 1);
    for (let i = 1; i < 5; i++) assert.ok(turns[i] <= turns[i - 1]);
  }
});
test('reverse and rapid seeks produce deterministic geometry', () => {
  const seeks = [0, 4.7, 1.1, 7, 0.3, 6.4, 2.8, 0];
  for (const progress of seeks) for (let i = 0; i < 5; i++) {
    const expected = Math.min(1, Math.max(0, (progress - i - 0.15) / 0.85));
    assert.equal(pageTurn(progress, i), expected);
  }
  assert.equal(catalogueState(5.5), 'back-cover');
  assert.equal(catalogueState(6.5), 'departing');
  assert.equal(catalogueState(7), 'handoff');
});
test('paper curls continuously and returns to a flat sheet at rest', () => {
  for (const turn of [0, 0.2, 0.5, 0.8, 1]) {
    for (let strip = 0; strip < 9; strip++) {
      const a = paperStrip(turn, strip), b = paperStrip(turn, strip + 1);
      const angle = a.angle * Math.PI / 180;
      assert.ok(Math.abs(a.x + Math.cos(angle) / 10 - b.x) < 1e-10);
      assert.ok(Math.abs(a.z - Math.sin(angle) / 10 - b.z) < 1e-10);
    }
  }
  assert.ok(paperStrip(0.5, 9).z > 0.25, 'free edge should visibly lift during a turn');
  for (const turn of [0, 1]) assert.ok(Math.abs(paperStrip(turn, 9).z) < 1e-10);
});
test('each navigation stop leaves the previous page fully flat', () => {
  for (let stop = 1; stop <= 5; stop++) {
    assert.equal(pageTurn(stop, stop - 1), 1);
    assert.equal(pageTurn(stop, stop), 0);
  }
});
