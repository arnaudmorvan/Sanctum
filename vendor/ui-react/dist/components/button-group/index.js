import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { jsx } from 'react/jsx-runtime';

var buttonGroupVariants = cva(
  [
    "inline-flex isolate items-stretch",
    // Overlapped borders stack in DOM order; lift the active child on hover and
    // focus so its own border (all four sides) and its focus ring paint above its
    // neighbours. Without the lift the shared edge stays owned by the neighbour on
    // top, so a hover/focus border change wouldn't show on that side. The
    // double-sided seam keeps the divider symmetric regardless of which is on top.
    "*:relative",
    "[&>*:hover]:z-10",
    "[&>*:focus-visible]:z-10 [&>*:focus-within]:z-10",
    // Border changes are instant inside a group. Button/ActionIcon animate
    // border-color (via `transition-colors-radius`), but `z-index` can't
    // transition — so on hover-out the lifted child snaps back while its border
    // is still mid-fade, flashing the shared seams. Keep the bg/text fade, drop
    // the border(-radius) transition. Targets the children via their data-variant.
    "*:data-variant:[transition-property:color,background-color]"
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          "flex-row",
          // Equalize row heights to the tallest child. Buttons size themselves with
          // a fixed `h-*` (no vertical padding), which flexbox won't stretch — so
          // drop it (`h-auto`) and restore the size as a `min-height` floor keyed off
          // `data-size`, letting `items-stretch` grow shorter buttons to the tallest.
          // Same-size rows are unchanged; ActionIcon keeps its fixed square height.
          "*:data-size:h-auto",
          "*:data-[size=xs]:min-h-7 *:data-[size=sm]:min-h-8 *:data-[size=md]:min-h-9 *:data-[size=lg]:min-h-10 *:data-[size=xl]:min-h-12",
          "[&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none",
          "[&>*:not(:first-child)]:-ms-px",
          // Borderless variants have no border to collapse — draw an adaptive
          // currentColor seam on the shared inner edges instead. It goes on BOTH
          // sides (start of non-first, end of non-last) so whichever child ends
          // up on top after the z-10 hover/focus lift still owns a border on the
          // shared edge; a one-sided seam gets covered by the lifted child's fill.
          "[&>:is([data-variant=filled],[data-variant=subtle]):not(:first-child)]:border-s-current/20",
          "[&>:is([data-variant=filled],[data-variant=subtle]):not(:last-child)]:border-e-current/20",
          // The divider lives on the inline borders; zero the (transparent) block
          // borders so it has nothing to miter against — otherwise the seam's
          // top/bottom ends render as a 1px chamfer. box-sizing:border-box keeps
          // the height, so grouped filled/subtle stay aligned with bordered ones.
          "[&>:is([data-variant=filled],[data-variant=subtle])]:border-y-0"
        ],
        vertical: [
          "flex-col",
          "[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none",
          "[&>*:not(:first-child)]:-mt-px",
          "[&>:is([data-variant=filled],[data-variant=subtle]):not(:first-child)]:border-t-current/20",
          "[&>:is([data-variant=filled],[data-variant=subtle]):not(:last-child)]:border-b-current/20",
          "[&>:is([data-variant=filled],[data-variant=subtle])]:border-x-0"
        ]
      }
    },
    defaultVariants: { orientation: "horizontal" }
  }
);
var ButtonGroup = ({ className, orientation, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    role: "group",
    "data-orientation": orientation ?? "horizontal",
    className: cn(buttonGroupVariants({ orientation }), className),
    ...props({ "data-testid": testId }),
    ...rest
  }
);

export { ButtonGroup };
