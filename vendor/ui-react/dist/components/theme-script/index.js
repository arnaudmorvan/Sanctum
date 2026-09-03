import { buildThemeInitScript } from '../../chunk-EEMRRRYS.js';
import { jsx } from 'react/jsx-runtime';

function ThemeScript({
  storageKey,
  defaultColorScheme,
  forceColorScheme,
  attribute,
  nonce
} = {}) {
  return /* @__PURE__ */ jsx(
    "script",
    {
      nonce,
      dangerouslySetInnerHTML: {
        __html: buildThemeInitScript({
          storageKey,
          defaultColorScheme,
          forceColorScheme,
          attribute
        })
      }
    }
  );
}

export { ThemeScript };
