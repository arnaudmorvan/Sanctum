"use client";
import { usePillOverflow, PillOverflowCounter, pillsContent, pillsShell } from '../../chunk-MPZOVOA3.js';
import { pillRemove, pill } from '../../chunk-3YVX2KOL.js';
import { popoverClearTrigger } from '../../chunk-PRHZ6FHV.js';
import { inputSlot, inputControlClasses, inputShell } from '../../chunk-MWXEQ5QX.js';
import { FieldShell, fieldA11yProps } from '../../chunk-AL57HMNZ.js';
import { CloseIcon } from '../../chunk-IG7FBZVM.js';
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { useFieldContext } from '@ark-ui/react/field';
import { TagsInput as TagsInput$1 } from '@ark-ui/react/tags-input';
import { useState, useEffect } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var TagsInputField = ({
  ref,
  onBlur,
  invalid,
  placeholder,
  className,
  testId
}) => {
  const field = useFieldContext();
  return /* @__PURE__ */ jsx(
    TagsInput$1.Input,
    {
      "data-overflow-field": true,
      ref,
      onBlur,
      "aria-invalid": invalid || void 0,
      ...fieldA11yProps(field),
      placeholder,
      ...props({ "data-testid": testId }),
      className
    }
  );
};
var TagsInput = ({
  value,
  defaultValue,
  onChange,
  placeholder,
  clearable,
  maxTags,
  maxLines,
  startSlot = null,
  endSlot = null,
  allowDuplicates,
  splitChars,
  addOnPaste,
  size = "md",
  variant = "default",
  color,
  disabled,
  readOnly,
  required,
  invalid,
  name,
  onBlur,
  ref,
  label,
  description,
  error,
  className,
  classNames,
  testId
}) => {
  const isInvalid = invalid || error != null;
  const [tagCount, setTagCount] = useState((value ?? defaultValue ?? []).length);
  useEffect(() => {
    if (value != null) setTagCount(value.length);
  }, [value]);
  const { containerRef, visibleCount, hiddenCount, measuring } = usePillOverflow({
    maxLines,
    count: tagCount
  });
  const control = /* @__PURE__ */ jsxs(
    TagsInput$1.Root,
    {
      value,
      defaultValue,
      onValueChange: (details) => {
        setTagCount(details.value.length);
        onChange?.(details.value);
      },
      max: maxTags,
      allowDuplicates,
      delimiter: splitChars,
      addOnPaste,
      disabled,
      readOnly,
      name,
      "data-color": color,
      className: cn("w-full group/input", className),
      children: [
        /* @__PURE__ */ jsxs(
          TagsInput$1.Control,
          {
            className: cn(inputShell({ size, variant }), pillsShell, classNames?.control),
            ...props({
              "data-invalid": isInvalid,
              "data-with-start-slot": startSlot != null,
              // Reserved for the whole time the field is clearable, not just
              // while it has tags — otherwise the clear button mounting/
              // unmounting shifts the field's width.
              "data-with-end-slot": endSlot != null || Boolean(clearable) && !disabled && !readOnly
            }),
            children: [
              startSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, "aria-hidden": true, children: startSlot }),
              /* @__PURE__ */ jsxs("div", { ref: containerRef, className: pillsContent({ size }), children: [
                /* @__PURE__ */ jsx(TagsInput$1.Context, { children: (api) => api.value.slice(0, visibleCount).map((val, index) => /* @__PURE__ */ jsxs(
                  TagsInput$1.Item,
                  {
                    index,
                    value: val,
                    "data-overflow-item": true,
                    ...props({ "data-testid": testId && `${testId}-tag-${index}` }),
                    className: "flex flex-row items-center justify-center",
                    children: [
                      /* @__PURE__ */ jsxs(TagsInput$1.ItemPreview, { className: cn(pill({ size }), "pe-0.5", classNames?.tag), children: [
                        /* @__PURE__ */ jsx(TagsInput$1.ItemText, { className: "truncate", children: val }),
                        !readOnly && /* @__PURE__ */ jsx(
                          TagsInput$1.ItemDeleteTrigger,
                          {
                            className: cn(pillRemove({ size }), classNames?.tagRemove),
                            children: /* @__PURE__ */ jsx(CloseIcon, {})
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(TagsInput$1.ItemInput, { className: cn(inputControlClasses, "w-auto") })
                    ]
                  },
                  val
                )) }),
                (hiddenCount > 0 || measuring && maxLines != null) && /* @__PURE__ */ jsx(
                  PillOverflowCounter,
                  {
                    count: measuring ? tagCount : hiddenCount,
                    size,
                    className: measuring ? "invisible" : void 0
                  }
                ),
                /* @__PURE__ */ jsx(
                  TagsInputField,
                  {
                    ref,
                    onBlur,
                    invalid: isInvalid,
                    placeholder,
                    testId,
                    className: cn(inputControlClasses, "w-auto min-w-16", classNames?.input)
                  }
                )
              ] }),
              endSlot != null && /* @__PURE__ */ jsx("span", { className: inputSlot, children: endSlot }),
              clearable && !disabled && !readOnly && /* @__PURE__ */ jsx(TagsInput$1.Context, { children: (api) => {
                const showClear = api.value.length > 0;
                return (
                  // The machine's own `getClearTriggerProps` sets `hidden` off
                  // `empty` — override it so the button stays mounted (and its
                  // box reserved) even when there's nothing to clear yet.
                  /* @__PURE__ */ jsx(
                    TagsInput$1.ClearTrigger,
                    {
                      hidden: false,
                      "aria-hidden": !showClear,
                      tabIndex: showClear ? 0 : -1,
                      className: cn(popoverClearTrigger, !showClear && "invisible"),
                      children: /* @__PURE__ */ jsx(CloseIcon, {})
                    }
                  )
                );
              } })
            ]
          }
        ),
        /* @__PURE__ */ jsx(TagsInput$1.HiddenInput, {})
      ]
    }
  );
  return /* @__PURE__ */ jsx(
    FieldShell,
    {
      label,
      description,
      error,
      required,
      disabled,
      size,
      className: classNames?.field,
      children: control
    }
  );
};

export { TagsInput };
