import { useState, useRef } from 'react';

// src/lib/use-uncontrolled.ts
var resolveUpdater = (updater, previous) => typeof updater === "function" ? updater(previous) : updater;
function useUncontrolled({
  value,
  defaultValue,
  finalValue,
  onChange = () => {
  }
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue !== void 0 ? defaultValue : finalValue
  );
  const uncontrolledRef = useRef(uncontrolledValue);
  uncontrolledRef.current = uncontrolledValue;
  const handleUncontrolledChange = (updater, ...payload) => {
    const resolved = resolveUpdater(updater, uncontrolledRef.current);
    uncontrolledRef.current = resolved;
    setUncontrolledValue(resolved);
    onChange?.(resolved, ...payload);
  };
  if (value !== void 0) {
    return [
      value,
      (updater, ...payload) => onChange?.(resolveUpdater(updater, value), ...payload),
      true
    ];
  }
  return [uncontrolledValue, handleUncontrolledChange, false];
}

export { useUncontrolled };
