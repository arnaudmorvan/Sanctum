// src/lib/control-open.ts
function controlOpenProps(open) {
  return {
    onPointerDown(event) {
      if (event.target.closest("button, input, [role='button']")) return;
      event.preventDefault();
      event.currentTarget.querySelector("input")?.focus();
      open();
    }
  };
}

export { controlOpenProps };
