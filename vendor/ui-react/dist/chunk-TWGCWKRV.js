import { createListCollection } from '@ark-ui/react/collection';

// src/lib/select-data.ts
var isGroup = (entry) => typeof entry === "object" && entry !== null && "group" in entry && "items" in entry;
var normalizeItem = (item) => typeof item === "string" ? {
  value: item,
  label: item,
  disabled: false,
  color: void 0,
  payload: void 0,
  testId: `item-${item}`
} : {
  value: item.value,
  label: item.label ?? item.value,
  disabled: item.disabled ?? false,
  color: item.color,
  payload: item.payload,
  testId: item.testId ?? `item-${item.value}`
};
function normalizeSelectData(data) {
  const first = data[0];
  const grouped = first !== void 0 && isGroup(first);
  const groups = grouped ? data.map((g) => ({
    group: g.group,
    items: g.items.map(normalizeItem)
  })) : null;
  const items = groups ? groups.flatMap((g) => g.items) : data.map(normalizeItem);
  return { collection: toCollection(items), items, groups };
}
var toCollection = (items) => createListCollection({
  items,
  itemToValue: (item) => item.value,
  itemToString: (item) => item.label,
  isItemDisabled: (item) => item.disabled
});
function filterSelectData(data, predicate) {
  const items = data.items.filter(predicate);
  const groups = data.groups ? data.groups.map((g) => ({ group: g.group, items: g.items.filter(predicate) })).filter((g) => g.items.length > 0) : null;
  return { collection: toCollection(items), items, groups };
}

export { filterSelectData, normalizeSelectData };
