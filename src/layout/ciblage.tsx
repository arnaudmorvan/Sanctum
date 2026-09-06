import { useCallback, useEffect, useRef, useState } from "react"
import {
  type Cible,
  decrireElement,
  decrireZone,
  elementPorteur,
  estANous,
  filDAriane,
  MARQUE_UI,
  origineProche,
  type Zone,
} from "./cible"

/** La couche de désignation : montrer CE dont on parle avant d'en parler.
 *
 *  Deux gestes, parce qu'il y a deux natures de retour :
 *   • **Désigner** — le retour porte sur quelque chose qui existe (« ce bouton », « cette
 *     carte »). Le survol met l'élément en évidence et dit ce qu'il est ; le clic le fige.
 *   • **Entourer** — le retour ne porte sur rien d'existant (« il manque une respiration
 *     ici », « cette bande est trop chargée »). Sans ce mode, ces retours-là s'accrochent au
 *     premier `div` qui traîne sous le curseur et envoient corriger un élément qui n'a rien
 *     demandé. La zone est accrochée au plus profond élément qui la contient : le rectangle
 *     dit ce qu'on a montré, l'ancre dit où ça tombe dans l'écran.
 *
 *  Le fil d'Ariane sous le curseur règle le problème récurrent du pointage : on voulait viser
 *  la carte, on a visé son titre. Chaque maillon est un ancêtre réel et se clique.
 *
 *  Tout est dessiné dans une couche `fixed` marquée `data-sanctum-ui`, que la désignation
 *  s'interdit à elle-même — sinon on ciblerait son propre surlignage. */

const MIN = 10
const DEFAUT_L = 200
const DEFAUT_H = 120

type Mode = "element" | "zone"

export const Ciblage = ({
  mode,
  onCible,
  onAnnuler,
}: {
  mode: Mode
  onCible: (c: Cible) => void
  onAnnuler: () => void
}) => {
  const [survol, setSurvol] = useState<Element | null>(null)
  const [trace, setTrace] = useState<Zone | null>(null)
  const depart = useRef<{ x: number; y: number } | null>(null)
  const couche = useRef<HTMLDivElement>(null)

  // Échap sort de la désignation, dans les deux modes. `capture` : on passe avant l'écran,
  // qui pourrait avoir sa propre gestion (un Modal du kit, par exemple).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      e.preventDefault()
      e.stopPropagation()
      onAnnuler()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [onAnnuler])

  // Mode élément : on lit ce qu'il y a SOUS la couche, puisqu'elle intercepte le pointeur.
  const sousLePointeur = useCallback((x: number, y: number): Element | null => {
    for (const el of document.elementsFromPoint(x, y)) {
      if (!estANous(el)) return el
    }
    return null
  }, [])

  const onMove = (e: React.PointerEvent) => {
    if (mode === "element") {
      setSurvol(sousLePointeur(e.clientX, e.clientY))
      return
    }
    if (!depart.current) return
    const d = depart.current
    setTrace({
      x: Math.round(Math.min(d.x, e.clientX)),
      y: Math.round(Math.min(d.y, e.clientY)),
      w: Math.round(Math.abs(e.clientX - d.x)),
      h: Math.round(Math.abs(e.clientY - d.y)),
      scrollX: Math.round(window.scrollX),
      scrollY: Math.round(window.scrollY),
    })
  }

  const onDown = (e: React.PointerEvent) => {
    if (mode !== "zone" || e.button !== 0) return
    e.preventDefault()
    depart.current = { x: e.clientX, y: e.clientY }
    couche.current?.setPointerCapture(e.pointerId)
  }

  const onUp = (e: React.PointerEvent) => {
    if (mode === "element") {
      const el = sousLePointeur(e.clientX, e.clientY)
      if (el) onCible(decrireElement(el))
      return
    }
    const d = depart.current
    if (!d) return
    depart.current = null
    const w = Math.abs(e.clientX - d.x)
    const h = Math.abs(e.clientY - d.y)
    // Un clic sec au lieu d'un glissé : une boîte par défaut, ramenée dans la fenêtre.
    // Sans ce cas, on obtient une zone de zéro pixel et on croit que l'outil ne marche pas.
    const zone: Zone =
      w >= MIN && h >= MIN
        ? {
            x: Math.round(Math.min(d.x, e.clientX)),
            y: Math.round(Math.min(d.y, e.clientY)),
            w: Math.round(w),
            h: Math.round(h),
            scrollX: Math.round(window.scrollX),
            scrollY: Math.round(window.scrollY),
          }
        : {
            x: Math.round(Math.max(0, Math.min(e.clientX - DEFAUT_L / 2, window.innerWidth - DEFAUT_L - 4))),
            y: Math.round(Math.max(0, Math.min(e.clientY - DEFAUT_H / 2, window.innerHeight - DEFAUT_H - 4))),
            w: DEFAUT_L,
            h: DEFAUT_H,
            scrollX: Math.round(window.scrollX),
            scrollY: Math.round(window.scrollY),
          }
    setTrace(zone)
    onCible(decrireZone(zone, elementPorteur(zone, document.body)))
  }

  const boite = survol?.getBoundingClientRect()

  return (
    <div
      ref={couche}
      {...{ [MARQUE_UI]: "" }}
      className="fixed inset-0 z-[60]"
      style={{ cursor: mode === "zone" ? "crosshair" : "default" }}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      {/* Mode élément : le cadre suit le survol, l'étiquette dit CE QUE C'EST. */}
      {mode === "element" && boite && boite.width > 0 && (
        <>
          <div
            className="pointer-events-none absolute rounded-sm border-2 border-pink-400 bg-pink-400/10"
            style={{ left: boite.left, top: boite.top, width: boite.width, height: boite.height }}
          />
          <Etiquette el={survol as Element} boite={boite} />
        </>
      )}

      {/* Mode zone : le rectangle en cours de tracé. */}
      {mode === "zone" && trace && (
        <div
          className="pointer-events-none absolute rounded-sm border-2 border-pink-400 border-dashed bg-pink-400/10"
          style={{ left: trace.x, top: trace.y, width: trace.w, height: trace.h }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
        <span className="rounded-md bg-gray-dark-950/95 px-3 py-1.5 text-gray-dark-200 text-xs shadow-lg">
          {mode === "element"
            ? "Cliquez l'élément qui porte le retour"
            : "Tracez la zone concernée"}{" "}
          <span className="text-gray-dark-500">· Échap pour annuler</span>
        </span>
      </div>
    </div>
  )
}

/** L'étiquette de survol : le nom du composant du kit, ou l'aveu qu'il n'y en a pas. */
const Etiquette = ({ el, boite }: { el: Element; boite: DOMRect }) => {
  const origine = origineProche(el)
  const [type, nom] = origine ? origine.split(":") : ["", ""]
  const enHaut = boite.top > 34
  return (
    <span
      className="pointer-events-none absolute flex items-center gap-2 rounded-md bg-gray-dark-950/95 px-2 py-1 font-mono text-[11px] shadow-lg"
      style={{ left: boite.left, top: enHaut ? boite.top - 28 : boite.bottom + 6 }}
    >
      <span className={type === "kit" ? "text-green-400" : "text-pink-400"}>
        {type === "kit" ? `@42/ui-react · ${nom}` : type === "dom" ? `écrit à la main · ${nom}` : el.tagName.toLowerCase()}
      </span>
    </span>
  )
}

/** Le rappel de ce qu'on a désigné, avec le fil d'Ariane pour corriger la visée. */
export const CibleChoisie = ({
  cible,
  element,
  onRevoir,
  onEffacer,
}: {
  cible: Cible
  element: Element | null
  onRevoir: (el: Element) => void
  onEffacer: () => void
}) => {
  const fil = element ? filDAriane(element) : []
  const [type, nom] = cible.origine ? cible.origine.split(":") : ["", ""]
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-dark-500 text-xs">Retour sur</span>
        <span
          className={`font-mono text-xs ${type === "kit" ? "text-green-400" : "text-pink-400"}`}
        >
          {cible.type === "zone"
            ? cible.nom
            : type === "kit"
              ? `${nom} (kit)`
              : `${cible.tag} (écrit à la main)`}
        </span>
        {cible.nom && cible.type === "element" && (
          <span className="truncate text-gray-dark-300 text-xs">« {cible.nom.slice(0, 48)} »</span>
        )}
        <button
          type="button"
          onClick={onEffacer}
          className="ms-auto rounded px-1.5 py-0.5 text-gray-dark-500 text-xs hover:text-white"
        >
          Retirer
        </button>
      </div>
      {fil.length > 1 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-gray-dark-600 text-[11px]">Viser plutôt :</span>
          {fil.slice(0, -1).map((m) => (
            <button
              key={`${m.libelle}-${fil.indexOf(m)}`}
              type="button"
              onClick={() => onRevoir(m.el)}
              className="rounded px-1.5 py-0.5 font-mono text-[11px] text-gray-dark-400 hover:bg-white/5 hover:text-white"
            >
              {m.libelle}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
