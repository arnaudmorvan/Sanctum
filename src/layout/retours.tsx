import { useEffect, useState } from "react"
import type { Cible } from "./cible"
import { MARQUE_UI } from "./cible"
import { Ciblage, CibleChoisie } from "./ciblage"
import { decrireElement } from "./cible"

/** Le widget « Retour » : la bouche par laquelle un spectateur du parcours parle au système.
 *
 *  Rien à installer — c'est un bouton de la barre du bas, compilé dans l'app comme le reste
 *  du squelette. Le panneau demande DEUX choses : la nature du retour et le texte. Le
 *  contexte (slug du parcours, écran affiché, auteur) s'attache tout seul.
 *
 *  Deux natures, deux destinations côté serveur (`retours_api.py` du MCP) :
 *   • « ce parcours »  → la file `context/retours-parcours/<slug>.md`, comptée par le
 *     panneau d'accueil du MCP et traitée par le geste « Traiter les retours » ;
 *   • « une règle »    → un report `context/reports/`, qui suit la consolidation normale
 *     des foundations. Le widget est une bouche de plus du pipeline existant.
 *
 *  Depuis le 2026-09-06, un retour peut porter une CIBLE : l'élément désigné ou la zone
 *  entourée. Elle voyage avec plusieurs preuves (origine kit/main, nom, rôle, chemin,
 *  sélecteur, rectangle) — voir `cible.ts`. Ce que ça change pour qui traite le retour :
 *  « c'est trop serré » devient « le padding de cette `Card` du kit est trop serré », donc
 *  une tâche kit, ou « la div de mise en page qui l'entoure », donc une tâche parcours.
 *
 *  Fail-closed : sans `VITE_RETOURS_KEY` posée au build, le bouton N'EXISTE PAS — le même
 *  défaut sûr que la route serveur sans `RETOURS_KEY`. La clé embarquée n'est pas un
 *  secret (elle est lisible dans le bundle) : elle arrête le spam de passage, les vraies
 *  bornes (taille, natures closes, chemins calculés serveur) sont côté serveur. */

const CLE = (import.meta.env.VITE_RETOURS_KEY as string | undefined) ?? ""
const SLUG = (import.meta.env.VITE_PROTO_SLUG as string | undefined) ?? ""
const URL_MCP =
  (import.meta.env.VITE_RETOURS_URL as string | undefined) ??
  "https://mcp-42-production.up.railway.app"

const TEXTE_MAX = 2000 // la borne serveur — refuser ici évite un aller-retour pour rien

type Etat = "saisie" | "envoi" | "merci" | "erreur"

const NATURES = [
  {
    cle: "parcours",
    label: "Ce parcours",
    aide: "Une évolution ou un problème de CE parcours : un écran, un enchaînement, une donnée.",
  },
  {
    cle: "regle",
    label: "Une règle du système",
    aide: "Une règle que le design system devrait connaître — elle partira en consolidation.",
  },
] as const

export const Retours = ({ ecran }: { ecran?: string }) => {
  const [ouvert, setOuvert] = useState(false)
  const [nature, setNature] = useState<(typeof NATURES)[number]["cle"]>("parcours")
  const [texte, setTexte] = useState("")
  const [auteur, setAuteur] = useState("")
  const [etat, setEtat] = useState<Etat>("saisie")
  const [erreur, setErreur] = useState("")
  const [cible, setCible] = useState<Cible | null>(null)
  const [elementCible, setElementCible] = useState<Element | null>(null)
  const [mode, setMode] = useState<"element" | "zone" | null>(null)

  // L'auteur se demande UNE fois par navigateur : un retour anonyme est un retour qu'on ne
  // peut pas aller requestionner.
  useEffect(() => {
    try {
      setAuteur(localStorage.getItem("retours-auteur") ?? "")
    } catch {
      /* stockage indisponible : le champ reste vide, le dépôt marche quand même */
    }
  }, [])

  if (!CLE || !SLUG) return null

  const envoyer = async () => {
    setEtat("envoi")
    setErreur("")
    try {
      localStorage.setItem("retours-auteur", auteur)
    } catch {
      /* même tolérance qu'à la lecture */
    }
    try {
      const r = await fetch(`${URL_MCP}/retours/deposer.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Retours-Key": CLE },
        body: JSON.stringify({ nature, texte, slug: SLUG, ecran: ecran ?? "", auteur, cible }),
      })
      if (!r.ok) {
        const corps = (await r.json().catch(() => null)) as { error?: string } | null
        throw new Error(corps?.error ?? `HTTP ${r.status}`)
      }
      setEtat("merci")
      setTexte("")
      setCible(null)
      setElementCible(null)
    } catch (e) {
      setEtat("erreur")
      setErreur(e instanceof Error ? e.message : String(e))
    }
  }

  const fermer = () => {
    setOuvert(false)
    setEtat("saisie")
    setErreur("")
    setMode(null)
    setCible(null)
    setElementCible(null)
  }

  const viser = (el: Element) => {
    setElementCible(el)
    setCible(decrireElement(el))
  }

  const pretAEnvoyer = texte.trim().length >= 10 && texte.length <= TEXTE_MAX

  return (
    <>
      {mode && (
        <Ciblage
          mode={mode}
          onAnnuler={() => setMode(null)}
          onCible={(c) => {
            setCible(c)
            // En mode zone, l'élément porteur n'est pas ce qu'on a montré : le fil
            // d'Ariane n'aurait pas de sens, on ne le propose donc pas.
            setElementCible(c.type === "element" ? document.querySelector(c.selecteur) : null)
            setMode(null)
          }}
        />
      )}
      <button
        type="button"
        onClick={() => (ouvert ? fermer() : setOuvert(true))}
        aria-expanded={ouvert}
        className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
          ouvert
            ? "bg-white/10 font-semibold text-white"
            : "text-gray-dark-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        Retour
      </button>

      {ouvert && (
        <div
          {...{ [MARQUE_UI]: "" }}
          className="fixed inset-x-0 bottom-11 z-50 max-h-[60vh] overflow-y-auto border-gray-dark-800 border-t bg-gray-dark-950/98 px-4 py-4 backdrop-blur"
          role="dialog"
          aria-label="Déposer un retour"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {etat === "merci" ? (
              <div className="flex flex-col items-start gap-2">
                <span className="font-semibold text-sm text-white">Merci, c'est déposé.</span>
                <p className="text-gray-dark-400 text-xs leading-relaxed">
                  {nature === "parcours"
                    ? "Le retour est dans la file de ce parcours — il sera lu au prochain passage dessus."
                    : "La règle est partie en report : elle sera relue et consolidée avec les autres."}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEtat("saisie")}
                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-white text-xs hover:bg-white/15"
                  >
                    Déposer un autre retour
                  </button>
                  <button
                    type="button"
                    onClick={fermer}
                    className="rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm text-white">Déposer un retour</span>
                  <span className="text-gray-dark-500 text-xs">
                    {ecran ? `Écran : ${ecran}` : `Parcours : ${SLUG}`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Nature du retour">
                  {NATURES.map((n) => {
                    const on = nature === n.cle
                    return (
                      <button
                        key={n.cle}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setNature(n.cle)}
                        className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                          on
                            ? "border-white/30 bg-white/10 font-semibold text-white"
                            : "border-gray-dark-800 text-gray-dark-400 hover:text-white"
                        }`}
                      >
                        {n.label}
                      </button>
                    )
                  })}
                </div>
                <p className="text-gray-dark-500 text-xs">
                  {NATURES.find((n) => n.cle === nature)?.aide}
                </p>

                {cible ? (
                  <CibleChoisie
                    cible={cible}
                    element={elementCible}
                    onRevoir={viser}
                    onEffacer={() => {
                      setCible(null)
                      setElementCible(null)
                    }}
                  />
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-dark-500 text-xs">Montrer où :</span>
                    <button
                      type="button"
                      onClick={() => setMode("element")}
                      className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
                    >
                      Désigner un élément
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("zone")}
                      className="rounded-md border border-gray-dark-800 px-2.5 py-1.5 text-gray-dark-300 text-xs hover:border-white/30 hover:text-white"
                    >
                      Entourer une zone
                    </button>
                    <span className="text-gray-dark-600 text-[11px]">facultatif</span>
                  </div>
                )}

                <textarea
                  value={texte}
                  onChange={(e) => setTexte(e.target.value)}
                  maxLength={TEXTE_MAX}
                  rows={4}
                  placeholder={
                    nature === "parcours"
                      ? "Ce qui devrait changer sur ce parcours, et où…"
                      : "La règle, et ce qui vous la fait dire…"
                  }
                  className="w-full resize-y rounded-md border border-gray-dark-800 bg-white/2 px-3 py-2 text-sm text-white placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={auteur}
                    onChange={(e) => setAuteur(e.target.value)}
                    maxLength={60}
                    placeholder="Votre prénom"
                    className="w-40 rounded-md border border-gray-dark-800 bg-white/2 px-3 py-1.5 text-white text-xs placeholder:text-gray-dark-500 focus:border-white/30 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={!pretAEnvoyer || etat === "envoi"}
                    onClick={envoyer}
                    className="rounded-md bg-white/10 px-3 py-1.5 font-semibold text-white text-xs hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {etat === "envoi" ? "Envoi…" : "Envoyer"}
                  </button>
                  <button
                    type="button"
                    onClick={fermer}
                    className="rounded-md px-2.5 py-1.5 text-gray-dark-400 text-xs hover:text-white"
                  >
                    Annuler
                  </button>
                  {etat === "erreur" && (
                    <span className="text-pink-400 text-xs">Dépôt impossible : {erreur}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
