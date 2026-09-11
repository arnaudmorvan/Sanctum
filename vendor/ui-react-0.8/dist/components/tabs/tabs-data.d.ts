import type { ReactNode } from "react";
import type { Size } from "../../lib/sizes";
import { type TabsRootProps, type TabsVariant } from "./tabs";
/**
 * Data-driven Tabs — the convenience wrapper over the composable parts, for
 * the common case of a flat list of label + panel pairs:
 *
 *   <Tabs
 *     data={[
 *       { value: "overview", label: "Overview", content: <Overview /> },
 *       { value: "activity", label: "Activity", content: <Activity /> },
 *     ]}
 *   />
 *
 * Generic over `const data`, so an item's `value` narrows `onChange`. The
 * first item is selected by default when neither `value` nor `defaultValue`
 * is given — the low-level `Root` part has no `data` to default from, so this
 * only happens here. Drop to `Tabs.Root` / `Tabs.List` / `Tabs.Trigger` /
 * `Tabs.Content` for anything the flat array can't express (custom trigger
 * content, interleaved non-tab elements, …).
 */
/** One tab: a trigger label and its panel content. */
export type TabsItem = {
    value: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    /** `data-testid` on the trigger; the matching content panel gets
     *  `` `${testId}-panel` ``. Defaults to `` `tab-${value}` `` / `` `tab-${value}-panel` ``
     *  when omitted. Ark's own `data-value={value}` is also always present on the
     *  trigger as a complementary, zero-config selector. */
    testId?: string;
};
/** The `data` array `Tabs` is generic over. */
export type TabsData = ReadonlyArray<TabsItem>;
/** Extract the value-string union from a `TabsData` shape, for a typed `onChange`. */
export type TabsValue<Data extends TabsData> = Data[number]["value"];
export type TabsProps<Data extends TabsData = TabsData> = Omit<TabsRootProps, "children" | "onValueChange"> & {
    /** Tabs, in order. Each needs its own `content`. */
    data: Data;
    /** Tray + trigger + indicator treatment, mirroring `Button`/`SegmentGroup`. */
    variant?: TabsVariant;
    /** Trigger size. */
    size?: Size;
    /** Fires with the selected value (narrowed to the data value union). */
    onChange?: (value: TabsValue<Data>) => void;
};
/**
 * The public `Tabs` export — callable for the data-driven form, with the
 * composable parts attached (like `Menu`). `<Tabs data={…}>` and
 * `<Tabs.Root>…</Tabs.Root>` both work from one import.
 */
export declare const Tabs: (<const Data extends TabsData>({ data, variant, size, color, value, defaultValue, onChange, ...root }: TabsProps<Data>) => import("react").JSX.Element) & {
    Root: ({ orientation, color, testId, ...rest }: TabsRootProps) => import("react").JSX.Element;
    List: ({ variant, size, className, testId, ...rest }: import("./tabs").TabsListProps) => import("react").JSX.Element;
    Trigger: ({ className, testId, ...rest }: import("./tabs").TabsTriggerProps) => import("react").JSX.Element;
    Content: ({ className, testId, ...rest }: import("./tabs").TabsContentProps) => import("react").JSX.Element;
    Indicator: ({ className, style, testId, ...rest }: import("./tabs").TabsIndicatorProps) => import("react").JSX.Element;
    Context: (props: import("@ark-ui/react").TabsContextProps) => ReactNode;
};
//# sourceMappingURL=tabs-data.d.ts.map