"use client";
import { InputBase, inputControlClasses } from '../../chunk-E2Y73U4Z.js';
import '../../chunk-FSC5UYO3.js';
import { ActionIcon } from '../../chunk-V47CYH4E.js';
import '../../chunk-RNXO7W2J.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Clipboard as Clipboard$1, useClipboardContext } from '@ark-ui/react/clipboard';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { CopyIcon, CheckIcon } from 'lucide-react';

var Root = ({ onChange, onCopiedChange, testId, ...rest }) => /* @__PURE__ */ jsx(
  Clipboard$1.Root,
  {
    onValueChange: onChange ? (details) => onChange(details.value) : void 0,
    onStatusChange: onCopiedChange ? (details) => onCopiedChange(details.copied) : void 0,
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Input = ({
  variant,
  size,
  className,
  classNames,
  children,
  testId,
  ...rest
}) => /* @__PURE__ */ jsxs(InputBase, { variant, size, readOnly: true, className: cn(className, classNames?.root), children: [
  /* @__PURE__ */ jsx(
    Clipboard$1.Input,
    {
      className: cn(inputControlClasses, classNames?.input),
      ...props({ "data-testid": testId }),
      ...rest
    }
  ),
  children
] });
var Clipboard = {
  Root,
  /** Ark's raw `Label` part — a real `<label>`; unstyled by default, size/style
   *  it like any other field label (or reuse `Field`'s own `fieldLabel`). */
  Label: Clipboard$1.Label,
  /** Ark's raw `Control` part — wraps `Input` (+ `Trigger`) when you want a
   *  different shell than `InputBase`; carries `data-copied` for that case. */
  Control: Clipboard$1.Control,
  Input,
  /** Ark's raw `Trigger` part — a real `<button>`; `asChild` to swap in
   *  `ActionIcon` or any other trigger element. */
  Trigger: Clipboard$1.Trigger,
  /** Ark's raw `Indicator` part — pass `copied={<CheckIcon />}` to swap content
   *  once the value is copied, reverting once the state returns to idle. */
  Indicator: Clipboard$1.Indicator,
  /** Ark's raw `ValueText` part — renders the live value as plain (non-input)
   *  text, for a read-only display that isn't a form control. */
  ValueText: Clipboard$1.ValueText
};
var CopyIndicator = () => {
  const { copied } = useClipboardContext();
  const state = copied ? "copied" : "idle";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CopyIcon, { "data-state": state, className: "data-[state=copied]:hidden" }),
    /* @__PURE__ */ jsx(CheckIcon, { "data-state": state, className: "not-data-[state=copied]:hidden" })
  ] });
};
var CopyRenderProp = ({ children }) => {
  const { copied, copy } = useClipboardContext();
  return children({ copied, copy });
};
var Copy = ({
  value,
  timeout,
  onCopiedChange,
  variant,
  size,
  radius,
  color,
  testId,
  children
}) => /* @__PURE__ */ jsx(Clipboard.Root, { value, timeout, onCopiedChange, children: typeof children === "function" ? /* @__PURE__ */ jsx(CopyRenderProp, { children }) : /* @__PURE__ */ jsx(Clipboard.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(ActionIcon, { variant, size, radius, color, testId, children: /* @__PURE__ */ jsx(CopyIndicator, {}) }) }) });

export { Clipboard, Copy };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map