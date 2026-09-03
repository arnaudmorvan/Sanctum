import { Field as Ark, type UseFieldContext } from "@ark-ui/react/field";
import { type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { WithTestId } from "../../lib/test-id";
/**
 * Field — label / description / error scaffold for any form control, on top of
 * Ark UI's `Field`. It is the *one* place the family wires accessible names and
 * descriptions: drop a field-aware control inside (the kit's `Input`, `Select`,
 * `Combobox`, … all qualify) and Ark hands it the right `id`,
 * `aria-describedby`, `aria-invalid`, `disabled`, and `required` through
 * context — no manual plumbing per control.
 *
 *   - `label` renders a `<label>` bound to the control (click-to-focus).
 *   - `description` (helper text) sits below the control. When an `error` is
 *     present it takes that same slot, replacing the description. Passing
 *     `error` flips the field to `invalid`, which both styles field-aware
 *     controls red and associates the message.
 *   - `required` adds the semantic flag and a red asterisk in the label.
 *   - `size` scales only the field's own typography; set the control's `size`
 *     separately (the family components forward both).
 *
 * Every other prop (incl. `disabled`, `readOnly`, `id`, `asChild`) forwards to
 * Ark's `Field.Root`.
 */
export declare const fieldRoot: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export declare const fieldLabel: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type FieldSize = NonNullable<VariantProps<typeof fieldRoot>["size"]>;
/**
 * `aria-describedby` / `aria-errormessage` for a control nested in a `Field`.
 * Points `aria-describedby` at the error text id directly once `invalid`,
 * rather than trusting `field.ariaDescribedby`'s own DOM-presence-tracked
 * inclusion of it (a `MutationObserver` check that doesn't reliably catch up
 * for every control) — and adds `aria-errormessage`, which Ark's field
 * getters never emit for any control.
 */
export declare const fieldA11yProps: (field: UseFieldContext) => {
    "aria-describedby": string | undefined;
    "aria-errormessage": string | undefined;
};
type FieldClassNames = {
    root?: string;
    label?: string;
    description?: string;
    error?: string;
    requiredIndicator?: string;
};
export type FieldProps = Omit<ComponentPropsWithoutRef<typeof Ark.Root>, "className"> & VariantProps<typeof fieldRoot> & WithTestId & {
    /** Accessible name, rendered as a `<label>` bound to the control. */
    label?: ReactNode;
    /** Helper text between the label and the control. */
    description?: ReactNode;
    /** Error message below the control; its presence sets `invalid`. */
    error?: ReactNode;
    /** Styles the field root (matching the kit's other components). */
    className?: string;
    classNames?: FieldClassNames;
};
/**
 * Wrap a control in a `Field` only when there's something to wire (label /
 * description / error / required) — otherwise render it bare. The data-driven
 * pickers all end with this, so it lives here instead of five copies. Bare is
 * important: an empty `Field` would still make Ark controls reference a label
 * that isn't rendered.
 */
export declare const FieldShell: ({ label, description, error, required, disabled, size, className, classNames, testId, children, }: Pick<FieldProps, "label" | "description" | "error" | "required" | "disabled" | "size" | "className" | "classNames" | "testId"> & {
    children: ReactNode;
}) => string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react").JSX.Element | null | undefined;
export declare const Field: ({ label, description, error, required, invalid, size, children, className, classNames, testId, ...rest }: FieldProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=field.d.ts.map