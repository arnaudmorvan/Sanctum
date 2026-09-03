import { Combobox as Ark } from "@ark-ui/react/combobox";
import { type ComponentProps, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { Color } from "../../lib/colors";
import type { ItemRenderState } from "../../lib/select-data";
import type { WithTestId } from "../../lib/test-id";
import { type InputSize, type InputVariant } from "../input/input";
export type ComboboxRootProps<T extends Ark.CollectionItem = Ark.CollectionItem> = Omit<Ark.RootProps<T>, "color" | "className"> & WithTestId & {
    /** Control + option sizing. Flows to the parts via context. */
    size?: InputSize;
    /** Control shell treatment. */
    variant?: InputVariant;
    /** Focus-ring accent for the control. */
    color?: Color;
    className?: string;
};
export type ComboboxControlProps = ComponentPropsWithoutRef<typeof Ark.Control> & WithTestId & {
    /** Inline-start adornment (icon, label). */
    startSlot?: ReactNode;
    /** Inline-end adornment — rendered before the composed Trigger / ClearTrigger. */
    endSlot?: ReactNode;
};
export type ComboboxItemProps = Omit<ComponentPropsWithoutRef<typeof Ark.Item>, "children"> & WithTestId & {
    /**
     * Option content. A plain node renders as the label (the kit adds the check
     * indicator); a function takes over the whole row, receiving the item's live
     * state so it can draw its own affordance.
     */
    children?: ReactNode | ((state: ItemRenderState) => ReactNode);
};
export type ComboboxGroupProps = ComponentPropsWithoutRef<typeof Ark.ItemGroup> & {
    /** Group heading rendered above the options. */
    label?: ReactNode;
};
/**
 * Composable parts namespace (Ark-style). `Context` is Ark's render-prop access
 * to the live machine api (e.g. to map over the filtered collection).
 */
export declare const Combobox: {
    Root: <T extends unknown = any>({ size, variant, color, positioning, className, children, testId, ...rest }: ComboboxRootProps<T>) => import("react").JSX.Element;
    Control: ({ startSlot, endSlot, className, children, testId, ...rest }: ComboboxControlProps) => import("react").JSX.Element;
    Input: ({ className, testId, ...rest }: ComponentProps<typeof Ark.Input> & WithTestId) => import("react").JSX.Element;
    Trigger: ({ className, children, ...rest }: ComponentPropsWithoutRef<typeof Ark.Trigger>) => import("react").JSX.Element;
    ClearTrigger: ({ className, children, ...rest }: ComponentPropsWithoutRef<typeof Ark.ClearTrigger>) => import("react").JSX.Element;
    Content: ({ className, children, withPaddingTop, ...rest }: ComponentPropsWithoutRef<typeof Ark.Content> & {
        withPaddingTop?: boolean;
    }) => import("react").JSX.Element;
    Panel: ({ className, children, withPaddingTop, ...rest }: ComponentPropsWithoutRef<typeof Ark.Content> & {
        withPaddingTop?: boolean;
    }) => import("react").JSX.Element;
    Item: ({ className, children, testId, ...rest }: ComboboxItemProps) => import("react").JSX.Element;
    Group: ({ label, className, children, ...rest }: ComboboxGroupProps) => import("react").JSX.Element;
    Empty: ({ className, ...rest }: ComponentPropsWithoutRef<typeof Ark.Empty>) => import("react").JSX.Element;
    Context: <T extends unknown>(props: Ark.ContextProps<T>) => ReactNode;
};
//# sourceMappingURL=combobox.d.ts.map