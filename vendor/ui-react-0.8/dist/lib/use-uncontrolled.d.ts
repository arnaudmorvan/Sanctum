export interface UseUncontrolledOptions<T, P extends unknown[]> {
    /** Value for controlled state */
    value?: T;
    /** Initial value for uncontrolled state */
    defaultValue?: T;
    /**
     * Final value for uncontrolled state when value and defaultValue are not provided
     * This is used as the initial value for uncontrolled state where the component is uncontrolled,
     * but the author of the component has provided a default value to be used as the initial value.
     * This avoids the default value being used as the initial value for controlled state for components authors.
     */
    finalValue?: T;
    /** Controlled state onChange handler */
    onChange?: (value: T, ...payload: P) => void;
}
/** A value, or a function deriving the next value from the previous one —
 *  the same shape React's own `useState` setter (and react-table's
 *  `Updater<T>`) accepts. Supporting it here means every consumer of
 *  `useUncontrolled` gets functional updates for free. */
export type Updater<T> = T | ((previous: T) => T);
export type UseUncontrolledReturnValue<T, P extends unknown[] = unknown[]> = [
    T,
    /** Handler to update the state. Accepts a value or an updater function,
     *  resolves it against the current value, then passes the resolved value
     *  and `payload` to `onChange`. */
    (updater: Updater<T>, ...payload: P) => void,
    /** True if the state is controlled, false if uncontrolled */
    boolean
];
/**
 * A hook that manages the state of a value, either controlled or uncontrolled.
 *
 * Note: When `value` is provided, the state is controlled and `defaultValue` is ignored.
 * state is uncontrolled only when `value` is undefined.
 * `null` is treated as a valid value and should be used instead of `undefined` when the value is optional.
 *
 * @param options - The options for the hook.
 * @returns A tuple containing the value, a handler to update the state, and a boolean indicating if the state is controlled.
 */
export declare function useUncontrolled<T, P extends unknown[] = unknown[]>({ value, defaultValue, finalValue, onChange, }: UseUncontrolledOptions<T, P>): UseUncontrolledReturnValue<T, P>;
export declare namespace useUncontrolled {
    type Options<T, P extends unknown[] = unknown[]> = UseUncontrolledOptions<T, P>;
    type ReturnValue<T, P extends unknown[] = unknown[]> = UseUncontrolledReturnValue<T, P>;
}
//# sourceMappingURL=use-uncontrolled.d.ts.map