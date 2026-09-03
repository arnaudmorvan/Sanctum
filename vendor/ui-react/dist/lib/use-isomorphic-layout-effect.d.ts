import { useEffect } from "react";
/**
 * `useLayoutEffect` warns when it runs during actual server rendering (a
 * harmless no-op there — effects never run during SSR at all), since Client
 * Components in frameworks like Next.js's App Router still execute once on
 * the server to produce the initial HTML. Swapping to `useEffect` for that
 * one pass silences the warning with no behavior change; on the client this
 * stays `useLayoutEffect`, preserving its "flushes before the browser
 * paints" guarantee.
 */
export declare const useIsomorphicLayoutEffect: typeof useEffect;
//# sourceMappingURL=use-isomorphic-layout-effect.d.ts.map