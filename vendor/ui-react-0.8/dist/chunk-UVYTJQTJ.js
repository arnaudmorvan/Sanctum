// src/lib/merge-refs.ts
function mergeRefs(...refs) {
  return (node) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

export { mergeRefs };
//# sourceMappingURL=chunk-UVYTJQTJ.js.map
//# sourceMappingURL=chunk-UVYTJQTJ.js.map