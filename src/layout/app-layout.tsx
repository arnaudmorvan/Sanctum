import type { ReactNode } from "react"

/** The frame shared by every flow: a surface that lets the canvas show through, and nothing
 *  more. The screen's content comes from the flow; this frame decides no layout at all. */
export const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="h-full overflow-auto">
    <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
  </div>
)
