export interface UseDisclosureCallbacks {
    /** Called after the state changes to `true`. */
    onOpen?: () => void;
    /** Called after the state changes to `false`. */
    onClose?: () => void;
}
export interface UseDisclosureHandlers {
    /** Sets the state to `true`. */
    open: () => void;
    /** Sets the state to `false`. */
    close: () => void;
    /** Flips the state. */
    toggle: () => void;
}
export type UseDisclosureReturnValue = [boolean, UseDisclosureHandlers];
/**
 * Tracks an open/closed boolean with `open`/`close`/`toggle` handlers —
 * uncontrolled only, no `value` prop. Reach for this when wiring a custom
 * trigger's `aria-expanded`/`aria-controls` onto `Collapse` (or any other
 * boolean-driven UI) without pulling in a whole disclosure component.
 *
 * @example
 * const [opened, { toggle }] = useDisclosure()
 * <button aria-expanded={opened} aria-controls="details" onClick={toggle}>
 *   Show more
 * </button>
 * <Collapse id="details" open={opened}>...</Collapse>
 */
export declare function useDisclosure(initialOpen?: boolean, { onOpen, onClose }?: UseDisclosureCallbacks): UseDisclosureReturnValue;
export declare namespace useDisclosure {
    type Callbacks = UseDisclosureCallbacks;
    type Handlers = UseDisclosureHandlers;
    type ReturnValue = UseDisclosureReturnValue;
}
//# sourceMappingURL=use-disclosure.d.ts.map