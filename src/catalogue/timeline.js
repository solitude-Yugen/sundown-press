export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const PAGE_COUNT = 5;
export const END = 7;
export const pageTurn = (progress, index) => clamp((progress - index - 0.15) / 0.85);
// Integrate connected paper strips, so the free edge curls instead of acting
// like one rigid rectangle. At either resting position the sheet is flat.
export function paperStrip(turn, index, count = 10) {
  const bend = -Math.sin(Math.PI * clamp(turn)) * Math.PI * 0.24;
  let x = 0, z = 0;
  for (let i = 0; i < index; i++) {
    const angle = bend * (i + 0.5) / count;
    x += Math.cos(angle) / count;
    z -= Math.sin(angle) / count;
  }
  const angle = bend * (index + 0.5) / count;
  return { x, z, angle: angle * 180 / Math.PI, shade: Math.abs(Math.sin(angle)) * 0.24 };
}
export function catalogueState(progress) {
  if (progress >= 6.95) return 'handoff';
  if (progress >= 6) return 'departing';
  if (progress >= 5.25) return 'back-cover';
  if (progress >= 4) return 'final-page';
  return progress % 1 > 0.25 ? 'page-turn' : 'active';
}
