"use client";
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Avatar as Avatar$1, ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { UserRound } from 'lucide-react';
import { useId } from 'react';
import { jsxs, jsx } from 'react/jsx-runtime';

var avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "select-none",
    // Neutral gray by default; a `data-color` tint overrides it with the
    // palette's soft surface + text — the same treatment Pill and Badge's
    // `light` variant use. No variant axis: an avatar is always this one
    // soft-surface look, just optionally tinted. No border either: it used
    // to be border-(--c-soft) once tinted, i.e. always the exact same color
    // as its own background — invisible for every `color`, visible only for
    // the untinted default (border-brand-900/20 against bg-gray-light-100,
    // two different colors) — so whether an avatar showed a border at all
    // used to depend on `color`, not on any actual design intent.
    "bg-gray-light-100 text-gray-light-700",
    "dark:bg-gray-dark-800 dark:text-gray-dark-300",
    "data-color:bg-(--c-soft) data-color:text-(--c-text)",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ],
  {
    variants: {
      // `--avatar-r` (this avatar's own radius, in px, as a unitless number)
      // rides along with `size` — it's read by `Avatar.Group`'s notch/margin
      // CSS (see AVATAR_GROUP_NOTCH below) so the notch always matches
      // *this* avatar's actual rendered radius, not whatever radius
      // `Avatar.Group`'s own `spacing` happens to assume. `spacing` only
      // ever controls `--avatar-o` (the overlap amount) — a mismatched
      // `size`/`spacing` pairing (e.g. `md` avatars in a `spacing="xs"`
      // group) still gets a correctly-sized notch, just more or less
      // overlap.
      size: {
        xs: "size-6 text-[10px] [&_svg]:size-3.5 [--avatar-r:12]",
        sm: "size-8 text-xs [&_svg]:size-4 [--avatar-r:16]",
        md: "size-10 text-sm [&_svg]:size-5 [--avatar-r:20]",
        lg: "size-12 text-base [&_svg]:size-6 [--avatar-r:24]",
        xl: "size-16 text-lg [&_svg]:size-8 [--avatar-r:32]"
      },
      // `--avatar-corner-r` also rides along with `radius`: it's the other
      // half of `Avatar.Group`'s notch for a non-circular avatar (see
      // AVATAR_GROUP_NOTCH and AvatarNotchMaskDefs below). A gradient can
      // only cut a circle/ellipse, never a true rounded rect, so
      // `radius="full"` keeps using a mask-image ellipse (the shape it
      // actually needs), but every other radius instead cuts a real
      // rounded-rect *hole* via a per-instance SVG `<mask>`, using this
      // avatar's own actual radius token (`theme.css`'s
      // `--radius-xs`..`--radius-xl`, in px) as that hole's corner radius.
      // `"full"` deliberately has no `--avatar-corner-r` and never renders
      // that SVG mask at all — its radius (50% of the box) isn't a fixed px
      // value the way the others are, so there's nothing meaningful to plug
      // in here; the mask-image ellipse already handles it correctly.
      radius: {
        xs: "rounded-xs [--avatar-corner-r:4]",
        sm: "rounded-sm [--avatar-corner-r:6]",
        md: "rounded-md [--avatar-corner-r:8]",
        lg: "rounded-lg [--avatar-corner-r:10]",
        xl: "rounded-xl [--avatar-corner-r:12]",
        full: "rounded-full"
      }
    },
    defaultVariants: {
      size: "md",
      // Unlike ThemeIcon (a square icon surface), an avatar reads as
      // circular by default — matching Mantine's own default.
      radius: "full"
    }
  }
);
var AVATAR_PALETTE = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
  "pink"
];
var getInitials = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const [first, ...rest] = parts;
  if (!first) return "";
  const last = rest.at(-1);
  return (last ? first.charAt(0) + last.charAt(0) : first.slice(0, 2)).toUpperCase();
};
var getLeadingLetter = (name) => name.trim().charAt(0).toUpperCase();
var hashString = (input) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) hash = hash * 31 + input.charCodeAt(i) | 0;
  return Math.abs(hash);
};
var pickColor = (input, pool) => input && pool.length > 0 ? pool[hashString(input) % pool.length] : void 0;
var isAvatarNameMode = (value) => value === "name" || value === "initials";
var AvatarNotchHole = ({ x }) => /* @__PURE__ */ jsx(
  "rect",
  {
    style: {
      x,
      y: "-2px",
      width: "calc((2 * var(--avatar-r) + 4) * 1px)",
      height: "calc((2 * var(--avatar-r) + 4) * 1px)",
      rx: "calc((var(--avatar-corner-r) + 2) * 1px)"
    },
    fill: "black"
  }
);
var AvatarNotchMaskDefs = ({ id }) => /* @__PURE__ */ jsx("svg", { "aria-hidden": "true", className: "absolute size-0", children: /* @__PURE__ */ jsxs("defs", { children: [
  /* @__PURE__ */ jsxs(
    "mask",
    {
      id: `${id}-ltr`,
      maskUnits: "userSpaceOnUse",
      x: -1e3,
      y: -1e3,
      width: 2e3,
      height: 2e3,
      children: [
        /* @__PURE__ */ jsx("rect", { x: -1e3, y: -1e3, width: 2e3, height: 2e3, fill: "white" }),
        /* @__PURE__ */ jsx(AvatarNotchHole, { x: "calc((2 * var(--avatar-r) - var(--avatar-o) - 2) * 1px)" })
      ]
    }
  ),
  /* @__PURE__ */ jsxs(
    "mask",
    {
      id: `${id}-rtl`,
      maskUnits: "userSpaceOnUse",
      x: -1e3,
      y: -1e3,
      width: 2e3,
      height: 2e3,
      children: [
        /* @__PURE__ */ jsx("rect", { x: -1e3, y: -1e3, width: 2e3, height: 2e3, fill: "white" }),
        /* @__PURE__ */ jsx(AvatarNotchHole, { x: "calc((var(--avatar-o) - 2 * var(--avatar-r) - 2) * 1px)" })
      ]
    }
  )
] }) });
var AvatarComponent = ({
  src,
  alt,
  size,
  radius,
  color,
  palette = AVATAR_PALETTE,
  name,
  display = "initials",
  children,
  className,
  classNames,
  style,
  testId,
  ...rest
}) => {
  const resolvedColor = isAvatarNameMode(color) ? pickColor(color === "name" ? name ?? "" : name ? getInitials(name) : "", palette) : color;
  const computed = name ? display === "name" ? getLeadingLetter(name) : getInitials(name) : "";
  const fallback = children ?? (computed || /* @__PURE__ */ jsx(UserRound, {}));
  const needsNotchMask = (radius ?? "full") !== "full";
  const maskId = useId().replace(/:/g, "");
  const notchMaskStyle = needsNotchMask ? {
    "--avatar-notch-mask": `url(#${maskId}-ltr)`,
    "--avatar-notch-mask-rtl": `url(#${maskId}-rtl)`
  } : {};
  return /* @__PURE__ */ jsxs(
    Avatar$1.Root,
    {
      "data-color": resolvedColor,
      className: cn(avatarVariants({ size, radius }), className, classNames?.root),
      style: { ...notchMaskStyle, ...style },
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
        needsNotchMask && /* @__PURE__ */ jsx(AvatarNotchMaskDefs, { id: maskId }),
        src && /* @__PURE__ */ jsx(
          Avatar$1.Image,
          {
            src,
            alt,
            className: cn("size-full object-cover", classNames?.image)
          }
        ),
        /* @__PURE__ */ jsx(
          Avatar$1.Fallback,
          {
            className: cn(
              "flex items-center justify-center font-medium leading-none",
              classNames?.fallback
            ),
            children: fallback
          }
        )
      ]
    }
  );
};
var AVATAR_GROUP_OVERLAP_PX = { xs: 8, sm: 10, md: 12, lg: 14, xl: 16 };
var avatarGroupSpacingStyle = (spacing) => ({ "--avatar-o": AVATAR_GROUP_OVERLAP_PX[spacing] });
var AVATAR_GROUP_MARGIN = "[&>*:not(:first-child)]:[margin-inline-start:calc(var(--avatar-o)*-1px)]";
var AVATAR_GROUP_NOTCH = cn(
  "[&>*:not(:last-child).rounded-full]:[mask-image:radial-gradient(ellipse_calc((50_+_100_/_var(--avatar-r))_*_1%)_calc((50_+_100_/_var(--avatar-r))_*_1%)_at_calc((150_-_(var(--avatar-o)_/_(2_*_var(--avatar-r)))_*_100)_*_1%)_50%,transparent_100%,black_100%)]",
  "rtl:[&>*:not(:last-child).rounded-full]:[mask-image:radial-gradient(ellipse_calc((50_+_100_/_var(--avatar-r))_*_1%)_calc((50_+_100_/_var(--avatar-r))_*_1%)_at_calc(((var(--avatar-o)_/_(2_*_var(--avatar-r)))_*_100_-_50)_*_1%)_50%,transparent_100%,black_100%)]",
  "[&>*:not(:last-child):not(.rounded-full)]:[mask-image:var(--avatar-notch-mask)]",
  "rtl:[&>*:not(:last-child):not(.rounded-full)]:[mask-image:var(--avatar-notch-mask-rtl)]"
);
var AvatarGroup = ({ spacing = "md", className, style, testId, ...rest }) => /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn("flex items-center", AVATAR_GROUP_MARGIN, AVATAR_GROUP_NOTCH, className),
    style: { ...avatarGroupSpacingStyle(spacing), ...style },
    ...props({ "data-testid": testId }),
    ...rest
  }
);
var Avatar = Object.assign(AvatarComponent, { Group: AvatarGroup });

export { AVATAR_PALETTE, Avatar };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map