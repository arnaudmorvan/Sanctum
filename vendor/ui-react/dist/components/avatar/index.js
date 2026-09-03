"use client";
import { props } from '../../chunk-WYCMIIRR.js';
import { cn } from '../../chunk-SAS62TWA.js';
import { Avatar as Avatar$1, ark } from '@ark-ui/react';
import { cva } from 'class-variance-authority';
import { UserRound } from 'lucide-react';
import { jsxs, jsx } from 'react/jsx-runtime';

var avatarVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
    "select-none border",
    // Neutral gray by default; a `data-color` tint overrides it with the
    // palette's soft surface + text + border — the same treatment Pill and
    // Badge's `light` variant use. No variant axis: an avatar is always this
    // one soft-surface look, just optionally tinted.
    "bg-gray-light-100 text-gray-light-700 border-brand-900/20",
    "dark:bg-gray-dark-800 dark:text-gray-dark-300 dark:border-white/15",
    "data-color:bg-(--c-soft) data-color:text-(--c-text) data-color:border-(--c-soft)",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ],
  {
    variants: {
      size: {
        xs: "size-6 text-[10px] [&_svg]:size-3.5",
        sm: "size-8 text-xs [&_svg]:size-4",
        md: "size-10 text-sm [&_svg]:size-5",
        lg: "size-12 text-base [&_svg]:size-6",
        xl: "size-16 text-lg [&_svg]:size-8"
      },
      radius: {
        xs: "rounded-xs",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
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
var Avatar = ({
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
  testId,
  ...rest
}) => {
  const resolvedColor = isAvatarNameMode(color) ? pickColor(color === "name" ? name ?? "" : name ? getInitials(name) : "", palette) : color;
  const computed = name ? display === "name" ? getLeadingLetter(name) : getInitials(name) : "";
  const fallback = children ?? (computed || /* @__PURE__ */ jsx(UserRound, {}));
  return /* @__PURE__ */ jsxs(
    Avatar$1.Root,
    {
      "data-color": resolvedColor,
      className: cn(avatarVariants({ size, radius }), className, classNames?.root),
      ...props({ "data-testid": testId }),
      ...rest,
      children: [
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
var AVATAR_GROUP_OVERLAP = {
  xs: "[&>*:not(:first-child)]:-ms-2",
  sm: "[&>*:not(:first-child)]:-ms-2.5",
  md: "[&>*:not(:first-child)]:-ms-3",
  lg: "[&>*:not(:first-child)]:-ms-3.5",
  xl: "[&>*:not(:first-child)]:-ms-4"
};
var AvatarGroup = ({
  spacing = "md",
  className,
  testId,
  ...rest
}) => /* @__PURE__ */ jsx(
  ark.div,
  {
    className: cn(
      "flex items-center",
      AVATAR_GROUP_OVERLAP[spacing],
      // There's no real "page background" token in this kit (the body rule
      // only ever sets text color) — this hardcodes the same light=white /
      // dark=gray-dark-900 guess Timeline's ring-offset bullet and Badge's
      // gradient border already make, so overlapping avatars read as cut out
      // against a typical page surface. Override via `className` if the page
      // background differs.
      "[&>*]:border-2 [&>*]:border-white dark:[&>*]:border-gray-dark-900",
      className
    ),
    ...props({ "data-testid": testId }),
    ...rest
  }
);

export { AVATAR_PALETTE, Avatar, AvatarGroup };
