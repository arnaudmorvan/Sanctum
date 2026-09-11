/**
 * Shared tree model + pure helpers for the hierarchical pickers (TreeSelect,
 * TreeMultiSelect). `data` is a tree of `{ value, label, disabled?, children? }`;
 * a node with `children` is a *branch*, one without is a *leaf*. These helpers
 * are selection-agnostic — the single / multi cascade logic lives in each
 * component (mirrors `lib/select-data.ts` for the flat pickers).
 *
 * A node may carry an arbitrary, optional `payload`. Selection ignores it
 * (value / label / disabled drive everything) but it flows through to a tree
 * picker's `renderItem` as `node.payload`.
 */
import type { ReactNode } from "react";
export type TreeNodeData<P = unknown> = {
    value: string;
    label: string;
    disabled?: boolean;
    children?: TreeNodeData<P>[];
    /** Arbitrary extra data, surfaced to `renderItem`. */
    payload?: P;
    /** `data-testid` on the rendered row. Defaults to `` `item-${value}` `` —
     *  set it explicitly when `value` isn't a safe/stable test selector on its
     *  own. Unlike the Ark-machine-backed pickers, this tree is hand-rolled, so
     *  there's no free `data-part` / `data-value` here — `testId` is the row's
     *  only stable selector. */
    testId?: string;
};
/**
 * A tree picker's `data` shape. Not generic over the node payload here (a
 * component generic over both `Data` and `P` independently defeats payload
 * inference — see `TreePayload` below); `TreeNodeData`'s own `P` still drives
 * autocomplete, extracted structurally from `Data` when needed.
 */
export type TreeSelectData = ReadonlyArray<TreeNodeData>;
/**
 * Extract the literal value union from a tree of `TreeNodeData` — the tree
 * analogue of `lib/select-data.ts`'s `SelectValue`, walking every node's
 * `value` plus its `children` (recursively) so a `const`-typed `data` prop
 * narrows `value` / `onChange` to the tree's actual node values instead of
 * plain `string`.
 */
export type TreeValue<Nodes extends ReadonlyArray<TreeNodeData>> = TreeNodeValue<Nodes[number]>;
type TreeNodeValue<N> = N extends TreeNodeData ? N["value"] | (N["children"] extends ReadonlyArray<TreeNodeData> ? TreeValue<N["children"]> : never) : never;
/**
 * Extract the `payload` type carried by a tree — read structurally off every
 * node's own `payload` property (robust against generic-instantiation
 * inference, same approach as `lib/select-data.ts`'s `SelectPayload`),
 * recursing into `children`. Payload-less nodes contribute `never`; a
 * homogeneous payload resolves precisely, a mixed one to the union.
 */
export type TreePayload<Nodes extends ReadonlyArray<TreeNodeData>> = TreeNodePayload<Nodes[number]>;
type TreeNodePayload<N> = N extends TreeNodeData ? (N extends {
    payload: infer P;
} ? P : never) | (N["children"] extends ReadonlyArray<TreeNodeData> ? TreePayload<N["children"]> : never) : never;
/**
 * Live node state passed alongside the node to a tree picker's `renderItem`.
 * `depth` is 0-based (the row renders `aria-level={depth + 1}`); `leaf`
 * distinguishes selectable leaves from organizational branches.
 */
export type TreeSelectItemState = {
    selected: boolean;
    leaf: boolean;
    disabled: boolean;
    depth: number;
};
/** Tri-state variant for `TreeMultiSelect` — branches cascade to `indeterminate`. */
export type TreeMultiSelectItemState = {
    checked: boolean;
    indeterminate: boolean;
    leaf: boolean;
    disabled: boolean;
    depth: number;
};
/**
 * Render a node's content yourself. The component keeps owning the row
 * (treeitem role, indent rails, roving focus, click); the callback fills the
 * content after the rails and receives the node (including its typed `payload`).
 * In an RSC tree the function must live in a `"use client"` module so the
 * boundary serializes it as a client reference.
 */
export type RenderTreeSelectItem<P = unknown> = (node: TreeNodeData<P>, state: TreeSelectItemState) => ReactNode;
export type RenderTreeMultiSelectItem<P = unknown> = (node: TreeNodeData<P>, state: TreeMultiSelectItemState) => ReactNode;
export declare const isLeaf: (node: TreeNodeData) => boolean;
/** value → label (trigger display) and value → node (toggling from keyboard / filtered rows). */
export declare const buildMaps: <P>(nodes: ReadonlyArray<TreeNodeData<P>>) => {
    labelMap: Map<string, string>;
    nodeMap: Map<string, TreeNodeData<P>>;
};
/** Pre-order list of node values + inherited-disabled flag — drives roving focus. */
export declare const flattenTree: (nodes: ReadonlyArray<TreeNodeData>, inheritedDisabled: boolean, acc?: {
    value: string;
    disabled: boolean;
}[]) => {
    value: string;
    disabled: boolean;
}[];
/** Keep nodes whose label (or a descendant's) matches `query`; preserves ancestors. */
export declare const filterTree: <P>(nodes: ReadonlyArray<TreeNodeData<P>>, query: string) => TreeNodeData<P>[];
export {};
//# sourceMappingURL=tree-data.d.ts.map