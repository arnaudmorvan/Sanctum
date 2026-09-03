/**
 * The single class-merging utility for the entire UI kit.
 *
 * Combines:
 *   - clsx — conditional class composition (objects, arrays, falsy filtering)
 *   - tailwind-merge — last-wins conflict resolution for Tailwind utility classes
 *
 * Consumers should never reach for raw template literals or hand-rolled
 * concatenation; route every dynamic class through `cn` for predictable
 * override behavior.
 */
import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
//# sourceMappingURL=cn.d.ts.map