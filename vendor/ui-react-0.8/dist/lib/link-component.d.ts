import { type ElementType, type ReactNode } from "react";
export type LinkComponentProviderProps = {
    /** Substituted for a plain `<a>` wherever a consuming component renders a
     *  link, so navigation stays client-side. */
    component: ElementType;
    children?: ReactNode;
};
/** Wrap the app once: `<LinkComponentProvider component={Link}><App/></LinkComponentProvider>`. */
export declare const LinkComponentProvider: ({ component, children }: LinkComponentProviderProps) => import("react").JSX.Element;
/** `override` (a per-instance `linkComponent` prop) wins; else the provider's
 *  component; else `undefined` — the caller falls back to its own default tag. */
export declare const useLinkComponent: (override?: ElementType) => ElementType | undefined;
//# sourceMappingURL=link-component.d.ts.map