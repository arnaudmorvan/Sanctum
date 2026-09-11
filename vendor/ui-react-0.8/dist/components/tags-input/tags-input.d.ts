import { type FocusEvent, type ReactNode, type Ref } from "react";
import type { Color } from "../../lib/colors";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
import { type InputSize, type InputVariant } from "../input/input";
/**
 * TagsInput — free-form, creatable tags on Ark UI's TagsInput machine. Unlike
 * MultiSelect there's no fixed option list: the user types and presses Enter (or
 * a delimiter) to mint a tag. Each tag renders as a Pill-styled preview with a
 * delete button; tags are editable (double-click) and paste-aware.
 *
 *   - `value` is `string[]`. `maxTags`, `allowDuplicates`, `splitChars`
 *     (delimiter), and `addOnPaste` map straight to the Ark machine.
 *   - Reuses the wrapping pills shell, the Pill chip styling, and the input
 *     control reset, so it sits visually alongside MultiSelect.
 *   - Label / description / error come from the built-in `Field`.
 */
type TagsInputClassNames = {
    field?: string;
    control?: string;
    input?: string;
    tag?: string;
    tagRemove?: string;
};
export type TagsInputProps = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Controlled tags. */
    value?: string[];
    /** Uncontrolled initial tags. */
    defaultValue?: string[];
    /** Fires with the full tag list on every add / remove / edit. */
    onChange?: (value: string[]) => void;
    /** Placeholder shown while the field is empty. */
    placeholder?: string;
    /** Show a button that clears all tags. */
    clearable?: boolean;
    /** Cap the number of tags. */
    maxTags?: number;
    /** Cap the tags at N rows; the rest collapse into a static "+N" counter. */
    maxLines?: number;
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the clear button. */
    endSlot?: ReactNode;
    /** Allow the same tag more than once. */
    allowDuplicates?: boolean;
    /** Character (or pattern) that splits typed/pasted text into tags. */
    splitChars?: string | RegExp;
    /** Add tags when text is pasted. */
    addOnPaste?: boolean;
    size?: InputSize;
    variant?: InputVariant;
    color?: Color;
    disabled?: boolean;
    readOnly?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Name for the hidden inputs (form submission). */
    name?: string;
    /** Forwarded to the main input; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    /** Lands on the main `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    className?: string;
    classNames?: TagsInputClassNames;
};
export declare const TagsInput: ({ value, defaultValue, onChange, placeholder, clearable, maxTags, maxLines, startSlot, endSlot, allowDuplicates, splitChars, addOnPaste, size, variant, color, disabled, readOnly, required, invalid, name, onBlur, ref, label, description, error, className, classNames, testId, }: TagsInputProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=tags-input.d.ts.map