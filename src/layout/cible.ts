/**
 * La CIBLE d'un retour : ce que le spectateur montre, décrit par plusieurs preuves.
 *
 * Mécanique reprise du widget designBrain (`packages/widget/src/lib/anchor.ts`), avec ce que
 * ce projet-ci a en plus : `data-42`. Un parcours Sanctum sait, pour chaque élément, s'il
 * vient d'un composant `@42/ui-react` ou s'il a été écrit à la main (le plugin Babel le pose
 * à la compilation). Une cible porte donc l'information qui décide **qui doit corriger** :
 * un padding trop serré sur une `Card` du kit est une tâche kit, le même sur une `div` de
 * mise en page est une tâche parcours. Aucun autre outil de retour ne peut le dire.
 *
 * POURQUOI PLUSIEURS PREUVES. Un sélecteur CSS est précis et fragile : la classe change à la
 * republication et le retour désigne le vide. Un nom accessible est grossier et robuste. On
 * garde les deux, plus le chemin sémantique, plus le rectangle — et celui qui traite le
 * retour recoupe. Plusieurs preuves faibles valent mieux qu'une preuve unique qu'on croit forte.
 *
 * CE QUE ÇA N'EST PAS. Ni une capture d'écran (le parcours est en ligne, on peut l'ouvrir),
 * ni un fragment de HTML (le code est dans le repo, pas derrière une authentification) : les
 * deux raisons qui les rendent indispensables chez designBrain n'existent pas ici.
 */

/** Le marqueur que porte notre propre outillage — jamais ciblable. */
export const MARQUE_UI = "data-sanctum-ui"

export interface Cible {
  type: "element" | "zone"
  /** `kit:Card`, `dom:div`, ou "" si l'élément ne vient pas du parcours (chrome, texte nu). */
  origine: string
  nom: string
  role: string
  tag: string
  chemin: string
  selecteur: string
  /** Coordonnées viewport, comme tout le reste : [x, y, w, h]. */
  rect: [number, number, number, number]
  /** Présent seulement pour une zone tracée à la main. */
  region?: { x: number; y: number; w: number; h: number; scrollX: number; scrollY: number }
}

export interface Zone {
  x: number
  y: number
  w: number
  h: number
  scrollX: number
  scrollY: number
}

export const estANous = (el: Element | null): boolean =>
  !!el && !!el.closest?.(`[${MARQUE_UI}]`)

/** Le nom que quelqu'un donnerait à l'élément à l'oral. */
export const nomAccessible = (el: Element): string => {
  const aria = el.getAttribute("aria-label")
  if (aria?.trim()) return aria.trim().slice(0, 80)
  const par = el.getAttribute("aria-labelledby")
  if (par) {
    const cible = document.getElementById(par)
    if (cible?.textContent?.trim()) return cible.textContent.trim().replace(/\s+/g, " ").slice(0, 80)
  }
  const alt = el.getAttribute("alt") ?? el.getAttribute("title")
  if (alt?.trim()) return alt.trim().slice(0, 80)
  const texte = (el.textContent ?? "").replace(/\s+/g, " ").trim()
  return texte.slice(0, 80)
}

const ROLES: Record<string, string> = {
  a: "lien", button: "bouton", nav: "navigation", header: "en-tête", footer: "pied",
  main: "contenu", aside: "complément", section: "section", article: "carte", img: "image",
  h1: "titre", h2: "titre", h3: "titre", h4: "titre", h5: "titre", h6: "titre",
  input: "champ", select: "liste", textarea: "zone de texte", ul: "liste", ol: "liste", li: "élément",
}

export const roleDe = (el: Element): string => {
  const explicite = el.getAttribute("role")
  if (explicite) return explicite.toLowerCase()
  return ROLES[el.tagName.toLowerCase()] ?? el.tagName.toLowerCase()
}

/** L'origine posée par `scripts/babel-origine.mjs` — vide si l'élément n'est pas du parcours. */
export const origineDe = (el: Element): string =>
  (el as HTMLElement).dataset?.["42"] ?? ""

/** La plus proche origine en remontant : le texte nu d'une `Card` appartient à la `Card`. */
export const origineProche = (el: Element): string => {
  let n: Element | null = el
  while (n && n !== document.body) {
    const o = origineDe(n)
    if (o) return o
    n = n.parentElement
  }
  return ""
}

/**
 * Le fil d'Ariane CLIQUABLE — la réponse au problème « je voulais viser la carte, j'ai visé
 * son titre ». Chaque maillon est un ancêtre réel : cliquer dessus re-vise cet élément.
 * On s'arrête au conteneur de l'écran : au-delà, c'est le squelette, qui n'est pas en revue.
 */
export const filDAriane = (el: Element, max = 5): { el: Element; libelle: string }[] => {
  const court = (x: Element): string => {
    const o = origineDe(x)
    if (o) return o.split(":")[1] ?? o
    const nom = nomAccessible(x)
    if (nom) return nom.length > 16 ? `${nom.slice(0, 15)}…` : nom
    return x.tagName.toLowerCase()
  }
  const fil = [{ el, libelle: court(el) }]
  let n: Element | null = el.parentElement
  while (n && n !== document.body && n !== document.documentElement && fil.length < max) {
    if (!estANous(n)) fil.unshift({ el: n, libelle: court(n) })
    n = n.parentElement
  }
  return fil
}

/** Chemin lisible, sans `nth-child` : il doit survivre à une republication. */
export const cheminSemantique = (el: Element): string => {
  const maillons: string[] = []
  let n: Element | null = el.parentElement
  while (n && n !== document.documentElement) {
    const o = origineDe(n)
    const tag = n.tagName.toLowerCase()
    if (o) {
      maillons.unshift(o.startsWith("kit:") ? o.slice(4) : tag)
    } else if (["section", "aside", "nav", "main", "article", "header", "footer"].includes(tag)) {
      const titre = n.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim().slice(0, 40)
      maillons.unshift(titre ? `${tag} « ${titre} »` : tag)
    }
    n = n.parentElement
  }
  const nom = nomAccessible(el).slice(0, 40)
  maillons.push(nom ? `${roleDe(el)} « ${nom} »` : roleDe(el))
  return maillons.join(" › ")
}

/** Sélecteur best-effort : id d'abord, sinon un chemin court et borné. */
export const selecteurDe = (el: Element): string => {
  const echap = (v: string) => (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(v) : v)
  const id = el.getAttribute("id")
  if (id && document.querySelectorAll(`#${echap(id)}`).length === 1) return `#${echap(id)}`

  const parts: string[] = []
  let n: Element | null = el
  let profondeur = 0
  while (n && n !== document.body && profondeur < 4) {
    let p = n.tagName.toLowerCase()
    const cls = (n.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 2)
    if (cls.length) p += cls.map((c) => `.${echap(c)}`).join("")
    const parent = n.parentElement
    if (parent) {
      const memeTag = [...parent.children].filter((c) => c.tagName === n?.tagName)
      if (memeTag.length > 1) p += `:nth-child(${[...parent.children].indexOf(n) + 1})`
    }
    parts.unshift(p)
    n = n.parentElement
    profondeur++
  }
  return parts.join(" > ")
}

const rectDe = (el: Element): [number, number, number, number] => {
  const r = el.getBoundingClientRect()
  return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)]
}

export const decrireElement = (el: Element): Cible => ({
  type: "element",
  origine: origineProche(el),
  nom: nomAccessible(el),
  role: roleDe(el),
  tag: el.tagName.toLowerCase(),
  chemin: cheminSemantique(el),
  selecteur: selecteurDe(el),
  rect: rectDe(el),
})

export const decrireZone = (zone: Zone, porteur: Element): Cible => ({
  ...decrireElement(porteur),
  type: "zone",
  // Le nom porte le GESTE, pas l'élément : dire « section » ferait croire que le retour
  // vise la section entière alors que le spectateur a entouré un coin.
  nom: `Zone ${zone.w}×${zone.h} dans ${origineProche(porteur).split(":")[1] || porteur.tagName.toLowerCase()}`,
  role: "region",
  rect: [zone.x, zone.y, zone.w, zone.h],
  region: zone,
})

/**
 * L'élément sur lequel accrocher une zone : le plus profond qui la CONTIENT entièrement.
 *
 * On sonde par points plutôt qu'en parcourant l'arbre — `elementsFromPoint` fait le travail
 * du navigateur (transformations, couches, empilement) en cinq appels. Le préfixe commun aux
 * piles retournées est la chaîne d'ancêtres partagée ; son dernier élément est le contenant
 * le plus profond. Une zone tracée dans une marge ne recouvre parfois rien : le contenant,
 * lui, existe toujours — au pire la racine de l'écran, ce qui est une réponse honnête.
 */
export const elementPorteur = (zone: Zone, racine: Element): Element => {
  const m = 2
  const points: [number, number][] = [
    [zone.x + m, zone.y + m],
    [zone.x + zone.w - m, zone.y + m],
    [zone.x + m, zone.y + zone.h - m],
    [zone.x + zone.w - m, zone.y + zone.h - m],
    [zone.x + zone.w / 2, zone.y + zone.h / 2],
  ]
  const piles: Element[][] = []
  for (const [px, py] of points) {
    if (px < 0 || py < 0 || px > window.innerWidth || py > window.innerHeight) continue
    const pile = document.elementsFromPoint(px, py).filter((el) => !estANous(el))
    if (pile.length) piles.push(pile.reverse())
  }
  if (!piles.length) return racine

  let commun: Element = piles[0][0] ?? racine
  for (let i = 0; ; i++) {
    const ref = piles[0][i]
    if (!ref || !piles.every((p) => p[i] === ref)) break
    commun = ref
  }

  let el: Element | null = commun
  while (el && el !== document.body) {
    const r = el.getBoundingClientRect()
    if (r.left <= zone.x + 1 && r.top <= zone.y + 1 &&
        r.right >= zone.x + zone.w - 1 && r.bottom >= zone.y + zone.h - 1) {
      return el
    }
    el = el.parentElement
  }
  return racine
}
