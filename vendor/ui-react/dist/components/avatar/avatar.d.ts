import { Avatar as ArkAvatar, type HTMLArkProps } from "@ark-ui/react";
import { type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Avatar — circular (by default) image with an automatic fallback. Renders
 * `src` once it loads; falls back to `children` (custom initials or an icon)
 * when there's no image or it fails to load, or to initials/name derived from
 * `name`, or finally to a generic person icon. Wraps Ark's `Avatar` machine,
 * which already tracks image-load state (`loading → loaded/error`) — no
 * bespoke `onError` handling needed here.
 *
 *   <Avatar src={user.avatarUrl} name={user.fullName} color="brand" />
 *
 * `color="name"` / `color="initials"` deterministically hash `name` (or its
 * derived initials) into a pick from `palette` instead of a literal `Color` —
 * a stable, no-config accent per person. `display` independently controls
 * what the computed fallback shows: `"initials"` (default, two letters) or
 * `"name"` (a single leading letter — a full name would overflow the circle).
 *
 * No `asChild` — same reasoning as `Skeleton`: `children` is already
 * repurposed as fallback content, which conflicts with Ark's "single child to
 * render as" requirement for polymorphism.
 *
 * `AvatarGroup` overlaps a row of standalone `Avatar`s (Mantine-style stacked
 * avatars) with a page-colored cutout border. It's pure CSS layout, like
 * `ButtonGroup` — it doesn't resize or restyle its children, so set
 * `size`/`color` per `Avatar`.
 */
declare const avatarVariants: (props?: ({
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
    radius?: "xs" | "sm" | "md" | "lg" | "xl" | "full" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type AvatarSize = NonNullable<VariantProps<typeof avatarVariants>["size"]>;
export type AvatarRadius = NonNullable<VariantProps<typeof avatarVariants>["radius"]>;
/** Shared by `color`'s auto-computed modes and `display`'s content mode. */
export type AvatarNameMode = "name" | "initials";
/**
 * Default hash pool for `color="name"` / `color="initials"`. Excludes
 * `brand` (the kit's own primary/CTA identity color — auto-tinting a user
 * avatar with it would read as "official") and `gray`/`neutral` (muted, and
 * `neutral` is a composed-not-scaled tone per `lib/colors.ts`, so it would
 * just look washed-out for some names). Exported so a consumer can extend it,
 * e.g. `palette={[...AVATAR_PALETTE, "brand"]}`.
 */
export declare const AVATAR_PALETTE: Color[];
type AvatarClassNames = {
    root?: string;
    image?: string;
    fallback?: string;
};
export type AvatarProps = Omit<ComponentProps<typeof ArkAvatar.Root>, "color" | "asChild"> & VariantProps<typeof avatarVariants> & WithTestId & {
    /** Image source. Falls back automatically when unset or on load error. */
    src?: string;
    /** Alt text for the image. */
    alt?: string;
    /**
     * Accent palette. `"name"` / `"initials"` deterministically hash `name`
     * (or its derived initials) into a pick from `palette` instead of a
     * literal color. Re-exported as `Color` from `@42/ui-react`.
     */
    color?: Color | AvatarNameMode;
    /**
     * Colors eligible for `color="name"` / `color="initials"`'s hash.
     * Ignored otherwise. Defaults to `AVATAR_PALETTE`.
     */
    palette?: Color[];
    /**
     * Full name to derive initials/color from (e.g. "Ada Lovelace" → "AL")
     * when there's no image and no explicit `children`. Explicit `children`
     * always takes precedence over `name`.
     */
    name?: string;
    /**
     * What the computed fallback shows: `"initials"` (default, two letters)
     * or `"name"` (a single leading letter of `name`).
     */
    display?: AvatarNameMode;
    /**
     * Fallback content — shown until the image loads, or permanently when
     * there's no `src`. Overrides the `name`/`display`-derived content.
     */
    children?: ReactNode;
    classNames?: AvatarClassNames;
};
export declare const Avatar: ({ src, alt, size, radius, color, palette, name, display, children, className, classNames, testId, ...rest }: AvatarProps) => import("react").JSX.Element;
export type AvatarGroupProps = HTMLArkProps<"div"> & WithTestId & {
    /** Overlap amount between avatars — larger sizes overlap by more. */
    spacing?: Size;
};
export declare const AvatarGroup: ({ spacing, className, testId, ...rest }: AvatarGroupProps) => import("react").JSX.Element;
export {};
//# sourceMappingURL=avatar.d.ts.map