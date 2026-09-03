// src/lib/tree-data.ts
var isLeaf = (node) => !node.children || node.children.length === 0;
var buildMaps = (nodes) => {
  const labelMap = /* @__PURE__ */ new Map();
  const nodeMap = /* @__PURE__ */ new Map();
  const walk = (ns) => {
    for (const n of ns) {
      labelMap.set(n.value, n.label);
      nodeMap.set(n.value, n);
      if (n.children) walk(n.children);
    }
  };
  walk(nodes);
  return { labelMap, nodeMap };
};
var flattenTree = (nodes, inheritedDisabled, acc = []) => {
  for (const n of nodes) {
    const nodeDisabled = inheritedDisabled || !!n.disabled;
    acc.push({ value: n.value, disabled: nodeDisabled });
    if (n.children) flattenTree(n.children, nodeDisabled, acc);
  }
  return acc;
};
var filterTree = (nodes, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return nodes;
  const recurse = (ns) => {
    const out = [];
    for (const n of ns) {
      const selfMatch = n.label.toLowerCase().includes(q);
      if (isLeaf(n)) {
        if (selfMatch) out.push(n);
      } else if (selfMatch) {
        out.push(n);
      } else if (n.children) {
        const kids = recurse(n.children);
        if (kids.length > 0) out.push({ ...n, children: kids });
      }
    }
    return out;
  };
  return recurse(nodes);
};

export { buildMaps, filterTree, flattenTree, isLeaf };
