import { cn } from '../../chunk-SAS62TWA.js';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';

var AmbientBackground = ({
  glow = true,
  noise = true,
  classNames
}) => /* @__PURE__ */ jsxs(Fragment, { children: [
  glow && /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: cn(
        "pointer-events-none fixed inset-0 -z-10 forced-colors:hidden",
        classNames?.glow
      ),
      style: { backgroundImage: "var(--ambient-glow)" }
    }
  ),
  noise && /* @__PURE__ */ jsx(
    "div",
    {
      "aria-hidden": "true",
      className: cn(
        "pointer-events-none fixed inset-0 -z-10 bg-repeat forced-colors:hidden",
        classNames?.noise
      ),
      style: { backgroundImage: "var(--ambient-noise)" }
    }
  )
] });

export { AmbientBackground };
