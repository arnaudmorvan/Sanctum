/**
 * A local, debounced echo of a committed value — the shared pattern behind
 * the text-filter and global-search header controls (RFC §6): typing updates
 * the input immediately, but the expensive commit (`column.setFilterValue`,
 * `onGlobalFilterChange`) only fires `delay`ms after the last keystroke, so a
 * keystroke storm never reaches `filters` / the `queryKey`. Re-syncs from
 * `value` when it changes externally (e.g. a "clear filters" action).
 */
export declare function useDebouncedCommit<T>(value: T, delay: number, onCommit: (value: T) => void): [T, (value: T) => void];
//# sourceMappingURL=data-table-state.d.ts.map