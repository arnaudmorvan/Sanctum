import { Clipboard as Ark } from "@ark-ui/react/clipboard";
import type { ComponentProps, ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * Clipboard — a styled compound over Ark UI's Clipboard machine, for the
 * "read-only value + copy button" field pattern (share links, API keys,
 * invite codes). `Object.assign`-free parts namespace only, no bare-invocation
 * convenience form — matches `Popover`'s shape, since a rich field like this
 * isn't a single-prop drop-in the way `Copy` (this package's simple icon-button
 * preset) is.
 *
 *   <Clipboard.Root value={link}>
 *     <Clipboard.Label>Share link</Clipboard.Label>
 *     <Clipboard.Input>
 *       <Clipboard.Trigger asChild>
 *         <ActionIcon variant="subtle" aria-label="Copy link">
 *           <Clipboard.Indicator copied={<CheckIcon />}>
 *             <CopyIcon />
 *           </Clipboard.Indicator>
 *         </ActionIcon>
 *       </Clipboard.Trigger>
 *     </Clipboard.Input>
 *   </Clipboard.Root>
 *
 * For the common "just an icon button, no visible value" case, reach for
 * `Copy` instead — it composes this same machine with `ActionIcon` internally.
 */
/** Ark's own `translations` prop type, derived structurally rather than imported
 *  by name — `IntlTranslations` lives in `@zag-js/clipboard`, a transitive
 *  dependency of the `@ark-ui/react` peer dep, not one this package declares
 *  itself (same derivation `Calendar` uses for its own translations type).
 *  Unlike `Calendar`'s translations, this shape is already fully partial (a
 *  single optional `triggerLabel`) and Ark's own machine merges it over its own
 *  English default internally, so — unlike `Calendar` — no default-merging
 *  helper is needed here; `Root` forwards it straight through. */
export type ClipboardTranslations = NonNullable<ComponentProps<typeof Ark.Root>["translations"]>;
export type ClipboardRootProps = Omit<ComponentProps<typeof Ark.Root>, "onChange" | "onValueChange" | "onStatusChange"> & WithTestId & {
    /** Flattened from Ark's `onValueChange` — the next clipboard value. */
    onChange?: (value: string) => void;
    /** Flattened from Ark's `onStatusChange` — fires `true` once the value is
     *  copied. Ark's machine only emits this on copy, not on the automatic
     *  revert to idle after `timeout` — read `Clipboard.Indicator` (or its
     *  `copied` render prop) for the live state instead. */
    onCopiedChange?: (copied: boolean) => void;
};
export type ClipboardInputProps = Omit<ComponentProps<typeof Ark.Input>, "size" | "readOnly"> & WithTestId & {
    /** Shell treatment — same scale as `Input`'s. */
    variant?: InputVariant;
    /** Height step — same scale as `Input`'s. */
    size?: InputSize;
    /** The copy `Trigger`, rendered as a real sibling of the input inside the
     *  shell — pass it as `children`, not via a decorative `endSlot` (whose
     *  wrapper is `aria-hidden` and would hide an interactive trigger from
     *  assistive tech; see `PasswordInput`'s reveal toggle for the same call). */
    children?: ReactNode;
    classNames?: {
        root?: string;
        input?: string;
    };
};
export declare const Clipboard: {
    Root: ({ onChange, onCopiedChange, testId, ...rest }: ClipboardRootProps) => import("react").JSX.Element;
    /** Ark's raw `Label` part — a real `<label>`; unstyled by default, size/style
     *  it like any other field label (or reuse `Field`'s own `fieldLabel`). */
    Label: import("react").ForwardRefExoticComponent<Ark.LabelProps & import("react").RefAttributes<HTMLLabelElement>>;
    /** Ark's raw `Control` part — wraps `Input` (+ `Trigger`) when you want a
     *  different shell than `InputBase`; carries `data-copied` for that case. */
    Control: import("react").ForwardRefExoticComponent<Ark.ControlProps & import("react").RefAttributes<HTMLDivElement>>;
    Input: ({ variant, size, className, classNames, children, testId, ...rest }: ClipboardInputProps) => import("react").JSX.Element;
    /** Ark's raw `Trigger` part — a real `<button>`; `asChild` to swap in
     *  `ActionIcon` or any other trigger element. */
    Trigger: import("react").ForwardRefExoticComponent<Ark.TriggerProps & import("react").RefAttributes<HTMLButtonElement>>;
    /** Ark's raw `Indicator` part — pass `copied={<CheckIcon />}` to swap content
     *  once the value is copied, reverting once the state returns to idle. */
    Indicator: import("react").ForwardRefExoticComponent<Ark.IndicatorProps & import("react").RefAttributes<HTMLDivElement>>;
    /** Ark's raw `ValueText` part — renders the live value as plain (non-input)
     *  text, for a read-only display that isn't a form control. */
    ValueText: import("react").ForwardRefExoticComponent<Ark.ValueTextProps & import("react").RefAttributes<HTMLDivElement>>;
};
//# sourceMappingURL=clipboard.d.ts.map