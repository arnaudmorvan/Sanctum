/** The 42 logomark, exported from the Figma library (`Logomark`, component
 *  14573:187141, key 45953d55adb…) on 2026-09-05.
 *
 *  The four `fill="white"` of the original export were switched to `currentColor`:
 *  the logo then follows the color of its container (the sidebar already sets it)
 *  and stays correct if the theme flips. Inline rather than an `<img>`: 500 bytes,
 *  one request fewer, and it becomes colorable.
 *
 *  The standalone file exists too, for whatever cannot take JSX (favicon, share
 *  image): `/brand/logo-42.svg`. */
export const Logo42 = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 70 48"
    role="img"
    aria-label="42"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 35.3789H25.4679V48H38.1768V25.1925H12.7591L38.1768 0H25.4679L0 25.1925V35.3789Z" />
    <path d="M43.6523 12.6211L56.3612 0H43.6523V12.6211Z" />
    <path d="M56.3612 12.6211L43.6523 25.1925V37.764H56.3612V25.1925L69.1203 12.6211V0H56.3612V12.6211Z" />
    <path d="M69.1194 25.1928L56.3604 37.7643H69.1194V25.1928Z" />
  </svg>
)
