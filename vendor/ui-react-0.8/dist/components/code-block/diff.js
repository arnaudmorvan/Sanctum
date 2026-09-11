import { diffLines } from 'diff';

// src/components/code-block/diff.ts
function splitChunkLines(value) {
  const lines = value.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}
function toDiffNotation(oldCode, newCode, options) {
  const removedTag = options?.removedTag ?? "removed";
  const addedTag = options?.addedTag ?? "added";
  const lines = diffLines(oldCode, newCode).flatMap((chunk) => {
    const chunkLines = splitChunkLines(chunk.value);
    if (!chunk.added && !chunk.removed) return chunkLines;
    const tag = chunk.added ? addedTag : removedTag;
    return chunkLines.map((line) => `${line} // [!code ${tag}]`);
  });
  return lines.join("\n");
}

export { toDiffNotation };
//# sourceMappingURL=diff.js.map
//# sourceMappingURL=diff.js.map