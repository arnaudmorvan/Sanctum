import type { ReactNode, Ref } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
import { type FieldProps } from "../field/field";
/**
 * FileUpload — a drag-and-drop file picker on Ark UI's FileUpload machine. It
 * renders a dashed dropzone with a browse button, then a list of accepted files
 * (each with an optional image thumbnail, name, human-readable size, and a
 * remove button). Drop, click-to-browse, keyboard, and the full ARIA model come
 * from Ark.
 *
 *   - Value is `File[]`; `onChange` hands you the accepted files directly,
 *     matching the kit's value-based `FormControlProps` contract.
 *   - `accept` (a MIME map / glob), `maxFiles`, and `maxFileSize` gate what the
 *     machine accepts; rejected files are dropped silently (read them off the
 *     `details` if you need them).
 *   - Label / description / error / required come from the built-in `Field`
 *     wrapper, so a `FileUpload` is accessible and complete on its own.
 *   - `name` wires the hidden native `<input type="file">` into form submission.
 *
 * Palette rides on `data-color` + the slot vars: the dropzone is palette-
 * independent at rest and only the drag-over accent (`--c-solid`) references the
 * active palette, so every color tints for free. `invalid` (or `error`) swaps
 * the border to red.
 */
type FileUploadClassNames = {
    field?: string;
    root?: string;
    dropzone?: string;
    itemGroup?: string;
    item?: string;
};
export type FileUploadProps = Pick<FieldProps, "label" | "description" | "error" | "required"> & WithTestId & {
    /** Controlled accepted files. */
    value?: File[];
    /** Fires with the accepted files whenever the selection changes. */
    onChange?: (files: File[]) => void;
    /** Fires on drop, return whether to accept or not */
    onDrop?: (files: File[]) => boolean;
    /** Accepted types — a MIME map (`{ "image/*": [".png"] }`) or a glob string. */
    accept?: Record<string, string[]> | string | string[];
    /** Show a button as call to action */
    withButton?: boolean;
    /** Max number of files. Defaults to `1` (single-file). */
    maxFiles?: number;
    /** Max size per file, in bytes. */
    maxFileSize?: number;
    /** Accept directories (webkit only). */
    directory?: boolean;
    /** Red invalid state, independent of (and OR'd with) `error`. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    size?: Size;
    color?: Color;
    /** Wires the hidden `<input type="file">` into native form submission. */
    name?: string;
    /** Explicit id for label association. */
    id?: string;
    /** Lands on the hidden `<input>` for focus-on-error. */
    ref?: Ref<HTMLInputElement>;
    /** Helper line inside the dropzone, beside the browse button. */
    hint?: ReactNode;
    className?: string;
    classNames?: FileUploadClassNames;
};
export declare const FileUpload: ({ value, onChange, accept, maxFiles, maxFileSize, directory, invalid, disabled, required, size, color, name, id, ref, label, description, error, withButton, hint, className, classNames, testId, }: FileUploadProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=file-upload.d.ts.map