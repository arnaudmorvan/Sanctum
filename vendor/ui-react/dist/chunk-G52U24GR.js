// src/lib/placement.ts
function resolveLogicalPlacement(position, dir) {
  if (position === "start") return dir === "rtl" ? "right" : "left";
  if (position === "end") return dir === "rtl" ? "left" : "right";
  return position;
}

export { resolveLogicalPlacement };
