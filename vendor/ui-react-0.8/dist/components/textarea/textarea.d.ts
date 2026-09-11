import { type HTMLArkProps } from "@ark-ui/react";
import type { Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
type TextareaClassNames = {
    /** The field wrapper (label / description / error). */
    field?: string;
    /** The shell `<div>` (also targeted by `className`). */
    root?: string;
    /** The inner `<textarea>` element. */
    input?: string;
};
export type TextareaProps = Omit<HTMLArkProps<"textarea">, "size" | "color" | "rows"> & Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Shell treatment: bordered (`default`), soft-filled, or chrome-less. */
    variant?: InputVariant;
    /** Height step / control font / slot icon size. */
    size?: InputSize;
    /** Shows the native drag handle for manual resizing, flush with the shell
     *  border. Off by default — the control already grows to fit its content. */
    resizable?: boolean;
    /** Focus-ring accent. Any kit palette or a consumer-defined one. */
    color?: Color;
    /** Red border + ring; also wires `aria-invalid`. OR'd with `error`. */
    invalid?: boolean;
    /** Dims the shell and disables the textarea. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    /** Minimum visible text rows; the control grows past it as content wraps.
     *  Defaults to `3`. Also forwarded as the native `rows` attribute for
     *  graceful degradation in browsers without `field-sizing` support. */
    minRows?: number;
    /** Caps auto-grow at this many visible rows; once content exceeds it the
     *  control stops growing and scrolls internally instead of clipping.
     *  Defaults to `3` (matching `minRows`), so an untouched control reads as
     *  a fixed multi-line box. `min-height` wins over `max-height` when they
     *  conflict, so raising `minRows` alone (without also raising `maxRows`)
     *  produces a fixed box at that height rather than a growing one. */
    maxRows?: number;
    /** Lands on the underlying `<textarea>` for focus-on-error. */
    ref?: Ref<HTMLTextAreaElement>;
    /** Styles the shell root. */
    className?: string;
    /** Per-part class overrides. */
    classNames?: TextareaClassNames;
};
export declare const Textarea: ({ label, description, error, required, disabled, size, classNames, ...control }: TextareaProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=textarea.d.ts.map