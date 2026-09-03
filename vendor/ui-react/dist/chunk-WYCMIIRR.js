// src/lib/props.ts
function props(source) {
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    if (value) result[key] = value;
  }
  return result;
}

export { props };
