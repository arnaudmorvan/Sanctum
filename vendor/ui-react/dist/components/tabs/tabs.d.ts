import { Tabs as Ark } from "@ark-ui/react/tabs";
import { type VariantProps } from "class-variance-authority";
import type { Color } from "../../lib/colors";
import type { Size } from "../../lib/sizes";
import type { WithTestId } from "../../lib/test-id";
/**
 * Tabs — a navigation control on Ark UI's Tabs machine: a row (or column) of
 * triggers, each revealing its own content panel, with a pill that slides to
 * the active trigger. Visually it's `SegmentGroup`'s twin — the same
 * filled/light/outline/subtle/default variant × color system and the same
 * sliding-indicator mechanics — but built for real content panels instead of
 * a single-choice value, and with no `Field` integration (Tabs is navigation,
 * not a form control, so there's no label/description/error/name).
 *
 * Two ways to use it:
 *
 *   // 1. Data-driven — the common case
 *   <Tabs
 *     variant="filled"
 *     color="brand"
 *     defaultValue="overview"
 *     data={[
 *       { value: "overview", label: "Overview", content: <Overview /> },
 *       { value: "activity", label: "Activity", content: <Activity /> },
 *     ]}
 *   />
 *
 *   // 2. Compound — for anything the data array can't express
 *   <Tabs.Root color="brand" defaultValue="overview">
 *     <Tabs.List variant="filled">
 *       <Tabs.Indicator />
 *       <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
 *       <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
 *     </Tabs.List>
 *     <Tabs.Content value="overview"><Overview /></Tabs.Content>
 *     <Tabs.Content value="activity"><Activity /></Tabs.Content>
 *   </Tabs.Root>
 *
 * `color` lives on `Root` — a `data-color` attribute, which cascades as CSS
 * custom properties to both the `List` branch and every `Content` panel.
 * `variant` and `size` live on `List` (shared context) and apply to the tray,
 * every trigger, and the indicator — set them once on `List` rather than
 * repeating them on each `Trigger`.
 */
/** The tray. `filled` is a heavier neutral fill so the colored pill pops;
 *  `light` / `default` frame the pill with the same translucent surface as
 *  `Input`'s own `default` shell (`bg-white/4` + the hairline
 *  `border-brand-900/20 dark:border-white/15`) rather than an opaque gray
 *  step, so the tray reads correctly on any host background; `outline` /
 *  `subtle` are chromeless (their cue lives on the sliding pill instead). */
declare const tabsList: (props?: ({
    variant?: "light" | "default" | "filled" | "outline" | "subtle" | null | undefined;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type TabsVariant = NonNullable<VariantProps<typeof tabsList>["variant"]>;
export type TabsRootProps = Ark.RootProps & WithTestId & {
    /** Palette for the sliding indicator + active-trigger text. Sets `data-color`
     *  on the root, so it cascades to both the `List` and `Content` branches. */
    color?: Color;
};
declare const Root: ({ orientation, color, testId, ...rest }: TabsRootProps) => import("react").JSX.Element;
export type TabsListProps = Ark.ListProps & WithTestId & {
    variant?: TabsVariant;
    size?: Size;
};
declare const List: ({ variant, size, className, testId, ...rest }: TabsListProps) => import("react").JSX.Element;
export type TabsTriggerProps = Ark.TriggerProps & WithTestId;
declare const Trigger: ({ className, testId, ...rest }: TabsTriggerProps) => import("react").JSX.Element;
export type TabsContentProps = Ark.ContentProps & WithTestId;
declare const Content: ({ className, testId, ...rest }: TabsContentProps) => import("react").JSX.Element;
export type TabsIndicatorProps = Ark.IndicatorProps & WithTestId;
/** The sliding pill. Ark sets `position: absolute` + `--left`/`--top`/
 *  `--width`/`--height` (the selected trigger's rect) inline, so it sits
 *  behind the labels (`z-0`).
 *
 *  We drive the slide transition ourselves rather than via Ark's gated
 *  `animateIndicator` flag — the same fix `SegmentGroup` uses: Ark sets
 *  `transition-property: none` whenever that flag is false, including the
 *  instant it receives the `transitionend` of ANY animated property. With
 *  several properties of differing end-times (a `left` redirected by an
 *  interrupting click vs. a color/width that already settled), that early end
 *  would null the transition and snap the pill mid-slide. Overriding the real
 *  `transition-*` props (our `style` wins via Ark's `mergeProps`) keeps the
 *  transition always on, so interruptions re-target smoothly. */
declare const Indicator: ({ className, style, testId, ...rest }: TabsIndicatorProps) => import("react").JSX.Element;
export { Content, Indicator, List, Root, Trigger };
export declare const Context: (props: Ark.ContextProps) => import("react").ReactNode;
//# sourceMappingURL=tabs.d.ts.map