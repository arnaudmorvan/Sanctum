import type { FocusEvent, Ref } from "react";
/**
 * `FormControlProps` — the kit's *library-agnostic* contract for a form control.
 *
 * The kit ships no form-library adapter: this contract **is** the integration.
 * Every control exposes the same controlled surface, so react-hook-form,
 * TanStack Form, Formik, or a plain `<form>` can bind it with no kit-specific
 * glue. There are two flavours of `onChange`, by design — they map 1:1 onto how
 * the form libraries themselves split native vs. composite controls:
 *
 *   - **Custom controls** (`Select`, `MultiSelect`, `Checkbox`, …) are
 *     **value-based**: `onChange(value)` receives the next value directly. This
 *     is the shape of RHF's `<Controller>` `field.onChange` and TanStack's
 *     `field.handleChange`, so binding is `onChange={field.onChange}` /
 *     `onChange={field.handleChange}`. These controls implement
 *     `FormControlProps<T>`.
 *   - **Native controls** (`Input`, `Textarea`, `PasswordInput`) are
 *     **event-based**: `onChange(event)` is forwarded straight to the DOM
 *     element, so RHF's `{...register(name)}` and a native event handler work as
 *     usual. These do *not* implement this type — they extend the native element
 *     props instead.
 *
 * Three members are load-bearing for the target libraries and every control must
 * honour them:
 *
 *   - `onBlur` — drives "touched"/"blurred" validation (RHF `mode: "onBlur"`,
 *     TanStack `field.handleBlur`). Forward it to the control's focusable element.
 *   - `ref` — must land on the **focusable element** (the trigger / first input),
 *     so RHF's `shouldFocusError` / `setFocus` can focus the offending control.
 *   - `name` — must produce a **submittable** value (a real or hidden input /
 *     `<select>`), so a native `<form>` submit includes the field.
 *
 * `invalid` is independent of the `Field` `error` slot: a control reads it as
 * `invalid || error != null || fieldContext.invalid`, so a form library can flip
 * the red state from `fieldState.invalid` even when the message lives elsewhere.
 *
 * Generic controls (`Select<Data>`, `Slider<V>`, …) can't all literally
 * `extends FormControlProps<T>` without awkward `T` plumbing — they pick the
 * matching members and reference this type in their docs. Non-generic controls
 * (`Checkbox`, `Switch`, `RadioGroup`, …) extend it directly for compile-time
 * conformance. It is a type + authoring checklist, never a runtime dependency.
 *
 * @typeParam T  The control's natural value type (`string | null`, `string[]`,
 *               `number`, `boolean`, `File[]`, …).
 * @typeParam El The focusable element `ref`/`onBlur` target (defaults to
 *               `HTMLElement`; narrow it to e.g. `HTMLButtonElement`).
 */
export interface FormControlProps<T, El extends HTMLElement = HTMLElement> {
    /** Controlled value. `undefined` means uncontrolled; `null` is a real value. */
    value?: T;
    /** Uncontrolled initial value. Ignored once `value` is provided. */
    defaultValue?: T;
    /** Fires with the next *value* (not a DOM event). */
    onChange?: (value: T) => void;
    /** Forwarded to the focusable element; drives touched/blurred validation. */
    onBlur?: (event: FocusEvent<El>) => void;
    /** Field name for native form submission and form-library field identity. */
    name?: string;
    /** Lands on the focusable element (trigger/input) for focus-on-error. */
    ref?: Ref<El>;
    /** Red invalid state, OR'd with `error != null` and `Field` context. */
    invalid?: boolean;
    /** Dims and blocks interaction. */
    disabled?: boolean;
    /** Keeps full contrast but blocks edits. */
    readOnly?: boolean;
    /** Semantic required flag (and, in a `Field`, the required indicator). */
    required?: boolean;
    /** Explicit id for label association when composing `Field` manually. */
    id?: string;
}
//# sourceMappingURL=form-control.d.ts.map