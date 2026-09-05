/** Le logomark 42, exporté de la librairie Figma (`Logomark`, composant
 *  14573:187141, clé 45953d55adb…) le 2026-09-05.
 *
 *  Les quatre `fill="white"` de l'export d'origine sont passés en `currentColor` :
 *  le logo suit alors la couleur de son conteneur (la sidebar la pose déjà) et
 *  reste juste si le thème bascule. Inline plutôt qu'un `<img>` : 500 octets, une
 *  requête en moins, et il devient colorable.
 *
 *  Le fichier autonome existe aussi, pour ce qui ne peut pas prendre du JSX
 *  (favicon, image de partage) : `/brand/logo-42.svg`. */
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
