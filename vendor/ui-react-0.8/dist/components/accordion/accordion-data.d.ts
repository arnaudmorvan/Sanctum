import type { ReactNode } from "react";
import { type AccordionRootProps } from "./accordion";
/**
 * Data-driven Accordion — the convenience wrapper over the composable parts,
 * for the common case of a flat list of label + panel pairs:
 *
 *   <Accordion
 *     data={[
 *       { value: "billing", label: "Billing", content: <Billing /> },
 *       { value: "shipping", label: "Shipping", content: <Shipping /> },
 *     ]}
 *   />
 *
 * Drop to `Accordion.Root` / `Accordion.Item` / `Accordion.ItemTrigger` /
 * `Accordion.ItemContent` for anything the flat array can't express (custom
 * trigger content, interleaved non-item elements, …).
 */
/** One section: a trigger label and its panel content. */
export type AccordionItem = {
    value: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
    /** Leading icon on the trigger, before the label. */
    icon?: ReactNode;
    /** `data-testid` on the trigger; the matching content panel gets
     *  `` `${testId}-content` ``. Defaults to `` `accordion-${value}` `` /
     *  `` `accordion-${value}-content` `` when omitted. */
    testId?: string;
};
/** The `data` array `Accordion` is generic over. */
export type AccordionData = ReadonlyArray<AccordionItem>;
export type AccordionProps<Data extends AccordionData = AccordionData> = Omit<AccordionRootProps, "children"> & {
    /** Sections, in order. Each needs its own `content`. */
    data: Data;
};
/**
 * The public `Accordion` export — callable for the data-driven form, with the
 * composable parts attached (like `Tabs`/`Menu`). `<Accordion data={…}>` and
 * `<Accordion.Root>…</Accordion.Root>` both work from one import.
 */
export declare const Accordion: (<const Data extends AccordionData>({ data, ...root }: AccordionProps<Data>) => import("react").JSX.Element) & {
    Root: ({ variant, size, radius, chevronPosition, chevron, order, orientation, onChange, className, testId, ...rest }: AccordionRootProps) => import("react").JSX.Element;
    Item: ({ className, testId, ...rest }: import("./accordion").AccordionItemProps) => import("react").JSX.Element;
    ItemTrigger: ({ icon, children, className, testId, ...rest }: import("./accordion").AccordionItemTriggerProps) => import("react").JSX.Element;
    ItemContent: ({ children, className, classNames, testId, ...rest }: import("./accordion").AccordionItemContentProps) => import("react").JSX.Element;
    ItemIndicator: ({ className, testId, ...rest }: import("./accordion").AccordionItemIndicatorProps) => import("react").JSX.Element;
    ItemContext: (props: import("@ark-ui/react").AccordionItemContextProps) => ReactNode;
};
//# sourceMappingURL=accordion-data.d.ts.map