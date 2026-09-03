export interface UseLocalStorageOptions<T> {
    /** The `localStorage` key backing this value. Every hook instance — this
     *  tab or another — sharing this key reads/writes the same value and stays
     *  in sync with it. */
    key: string;
    /** Returned before the real stored value is read, whenever nothing is
     *  stored, or the stored value fails to deserialize. Captured once on
     *  mount, like a lazy `useState` initializer — a fresh object/array
     *  literal passed on a later render is ignored, so callers can pass
     *  `defaultValue={{}}` inline without creating an unstable reference every
     *  render. */
    defaultValue: T;
    /** @default JSON.stringify */
    serialize?: (value: T) => string;
    /** @default JSON.parse */
    deserialize?: (raw: string) => T;
}
export type UseLocalStorageReturnValue<T> = [
    T,
    /** Accepts a value or an updater resolved against the current value — the
     *  same shape react-table's own `OnChangeFn<T>` and this kit's
     *  `useUncontrolled` setter use, so it wires into e.g. `DataTable`'s
     *  `onColumnSizingChange` directly, no wrapper needed. */
    (value: T | ((previous: T) => T)) => void,
    /** Deletes the key; every instance on this key falls back to
     *  `defaultValue` until something is stored again. */
    () => void
];
/**
 * Persists a piece of state to `localStorage`, kept in sync across every
 * component using the same `key` — both within this tab (a write in one
 * instance is reflected in every other instance immediately) and across tabs
 * (via the native `storage` event). SSR-safe: `useSyncExternalStore`'s
 * `getServerSnapshot` guarantees the server-rendered and first-client-render
 * markup agree (always `defaultValue`), so there's no hydration mismatch to
 * guard against.
 *
 *   const [columnSizing, setColumnSizing] = useLocalStorage({
 *     key: "users-table",
 *     defaultValue: {},
 *   })
 *   <DataTable columnSizing={columnSizing} onColumnSizingChange={setColumnSizing} />
 */
export declare function useLocalStorage<T>({ key, defaultValue, serialize, deserialize, }: UseLocalStorageOptions<T>): UseLocalStorageReturnValue<T>;
//# sourceMappingURL=use-local-storage.d.ts.map