"use client";
import { Context, SubContent, SubTrigger, Sub, RadioItem, RadioGroup, CheckboxItem, Separator, Divider, ItemGroupLabel, ItemGroup, Label, Item, Content, ContextTrigger, Trigger, Root } from '../../chunk-MZ5E3U67.js';
import '../../chunk-G52U24GR.js';
import '../../chunk-PRHZ6FHV.js';
import '../../chunk-IG7FBZVM.js';
import '../../chunk-WYCMIIRR.js';
import '../../chunk-SAS62TWA.js';
import { match } from 'ts-pattern';
import { jsxs, jsx } from 'react/jsx-runtime';

var isDivider = (entry) => typeof entry === "object" && "type" in entry && entry.type === "divider";
var isGroup = (entry) => typeof entry === "object" && "group" in entry && "items" in entry;
var isSub = (entry) => typeof entry === "object" && "items" in entry && !("group" in entry);
var isString = (entry) => typeof entry === "string";
var renderEntry = (entry, key) => {
  return match(entry).when(isString, (entry2) => /* @__PURE__ */ jsx(Item, { value: entry2, testId: entry2, children: entry2 }, key)).when(isDivider, () => /* @__PURE__ */ jsx(Divider, {}, key)).when(isGroup, (entry2) => /* @__PURE__ */ jsxs(ItemGroup, { children: [
    /* @__PURE__ */ jsx(ItemGroupLabel, { prefix: entry2.prefix, children: entry2.group }),
    entry2.items.map((child, i) => renderEntry(child, `${key}.${i}`))
  ] }, key)).when(isSub, (entry2) => /* @__PURE__ */ jsxs(Sub, { children: [
    /* @__PURE__ */ jsx(
      SubTrigger,
      {
        startSection: entry2.startSection,
        color: entry2.color,
        testId: entry2.testId ?? key,
        children: entry2.label
      }
    ),
    /* @__PURE__ */ jsx(SubContent, { children: entry2.items.map((child, i) => renderEntry(child, `${key}.${i}`)) })
  ] }, key)).otherwise((entry2) => /* @__PURE__ */ jsx(
    Item,
    {
      value: entry2.value ?? key,
      onClick: entry2.onClick,
      startSection: entry2.startSection,
      endSection: entry2.endSection,
      color: entry2.color,
      disabled: entry2.disabled,
      testId: entry2.testId ?? entry2.value ?? key,
      children: entry2.label
    },
    key
  ));
};
var renderEntries = (items) => items.map((entry, i) => renderEntry(entry, `menu-${i}`));
var MenuComponent = ({
  data,
  children,
  onSelect,
  ...root
}) => /* @__PURE__ */ jsxs(
  Root,
  {
    onSelect: onSelect ? ({ value }) => onSelect(value) : void 0,
    ...root,
    children: [
      /* @__PURE__ */ jsx(Trigger, { asChild: true, children }),
      /* @__PURE__ */ jsx(Content, { children: renderEntries(data) })
    ]
  }
);
var Menu = Object.assign(MenuComponent, {
  Root,
  Trigger,
  ContextTrigger,
  Content,
  Item,
  Label,
  ItemGroup,
  ItemGroupLabel,
  Divider,
  Separator,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Sub,
  SubTrigger,
  SubContent,
  Context
});

export { Menu };
