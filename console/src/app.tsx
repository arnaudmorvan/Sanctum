import { ActionIcon } from "@42/ui-react/action-icon"
import { AmbientBackground } from "@42/ui-react/ambient-background"
import { AppShell } from "@42/ui-react/app-shell"
import { NavLink } from "@42/ui-react/nav-link"
import { Spinner } from "@42/ui-react/spinner"
import { Text } from "@42/ui-react/text"
import { Title } from "@42/ui-react/title"
import {
  Activity,
  BookOpen,
  KeyRound,
  LayoutGrid,
  ListChecks,
  LogOut,
  Menu as MenuIcon,
  ShieldCheck,
  Users,
} from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { Logo42 } from "../../src/layout/logo-42"
import { TYPO } from "../../src/typo"
import { Connexion } from "./connexion"
import {
  ecrireCle,
  ErreurAcces,
  lireCle,
  lireProtos,
  lireVersion,
  type Resume,
  type Version,
  verifierCle,
} from "./mcp"
import { Notifications } from "./notifier"
import { VueAcces } from "./vues/acces"
import { CORPUS, type CorpusCle, corpusDe, VueContexte } from "./vues/contexte"
import { VueObservabilite } from "./vues/observabilite"
import { VueProtos } from "./vues/protos"
import { VueQualite } from "./vues/qualite"
import { VueSessions } from "./vues/sessions"

type Statut = "verification" | "dehors" | "dedans"

/** Les sections de la console. UNE navigation — la sidebar — et rien d'autre : la version
 *  précédente empilait trois chemins vers le même endroit (les compteurs de l'en-tête, les
 *  onglets, puis la rangée de corpus dans Contexte). Ici la sidebar porte tout, corpus et
 *  comptes compris, et l'URL (`#/contexte/skills`) dit où l'on est. */
type Section = {
  v: string
  label: string
  icon: ReactNode
  /** Cette section lit le serveur MCP : sans clé, elle montre l'écran de connexion. */
  cleRequise: boolean
  sous: string
}

const SECTIONS: Section[] = [
  { v: "protos", label: "Prototypes", icon: <LayoutGrid size={16} />, cleRequise: false, sous: "Les parcours cliquables déposés par les PO. Ouverts à qui a l'URL." },
  { v: "contexte", label: "Contexte", icon: <BookOpen size={16} />, cleRequise: true, sous: "Ce que le serveur sert aux agents : le catalogue, les règles, les skills, la spec produit." },
  { v: "observabilite", label: "Observabilité", icon: <Activity size={16} />, cleRequise: true, sous: "L'usage du serveur MCP : appels, outils, clients, latence." },
  { v: "sessions", label: "Sessions", icon: <Users size={16} />, cleRequise: true, sous: "Chaque conversation qui a parlé au serveur, et sa friction." },
  { v: "qualite", label: "Qualité", icon: <ListChecks size={16} />, cleRequise: true, sous: "La courbe des générations : ce que le gate a mesuré, report après report." },
  { v: "acces", label: "Accès", icon: <ShieldCheck size={16} />, cleRequise: true, sous: "Qui a le droit d'écrire, et sous quel régime." },
]

/** Le hash est l'état de navigation : `#/contexte/skills`. Un rechargement, un lien
 *  partagé, un « ← Tous les protos » depuis un parcours retombent tous au bon endroit. */
const lireRoute = (): { section: string; param?: string } => {
  const [section, param] = window.location.hash.replace(/^#\/?/, "").split("/")
  return { section: section || "protos", param: param || undefined }
}

const Compte = ({ n }: { n?: number }) => (
  <span className={`${TYPO.machine()} text-gray-dark-400 text-xs`}>{n ?? "—"}</span>
)

export const App = () => {
  const [cle, setCle] = useState(lireCle())
  // On part de `verification` s'il y a une clé en mémoire : elle a pu être révoquée depuis.
  // La vérification ne bloque pas la page — elle ne ferme que les sections qui lisent le
  // serveur, le temps de l'aller-retour.
  const [statut, setStatut] = useState<Statut>(lireCle() ? "verification" : "dehors")
  const [resume, setResume] = useState<Resume | null>(null)
  const [erreur, setErreur] = useState("")
  const [route, setRoute] = useState(lireRoute)
  const [nbProtos, setNbProtos] = useState<number | undefined>(undefined)
  const [version, setVersion] = useState<Version | null>(null)

  useEffect(() => {
    const onHash = () => setRoute(lireRoute())
    window.addEventListener("hashchange", onHash)
    if (!window.location.hash) window.location.hash = "#/protos"
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  // Même origine, aucune clé : le nombre de parcours et le tampon du build sont des
  // fichiers écrits par le build. Ils n'ont pas à attendre la connexion.
  useEffect(() => {
    lireProtos<unknown[]>()
      .then((l) => setNbProtos(l.length))
      .catch(() => setNbProtos(undefined))
    lireVersion()
      .then(setVersion)
      .catch(() => setVersion(null))
  }, [])

  const entrer = (candidate: string) => {
    setErreur("")
    setStatut("verification")
    verifierCle(candidate)
      .then((r) => {
        ecrireCle(candidate)
        setCle(candidate)
        setResume(r)
        setStatut("dedans")
      })
      .catch((e: Error) => {
        setErreur(
          e instanceof ErreurAcces
            ? "Cette clé n'est pas celle du serveur. C'est la variable DASHBOARD_KEY, pas son nom."
            : e.message,
        )
        setStatut("dehors")
      })
  }

  // Vérification au chargement quand une clé est déjà mémorisée.
  useEffect(() => {
    if (statut === "verification" && !resume && cle) entrer(cle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortir = () => {
    ecrireCle("")
    setCle("")
    setResume(null)
    setErreur("")
    setStatut("dehors")
  }

  const dedans = statut === "dedans"
  const section = SECTIONS.find((s) => s.v === route.section) ?? SECTIONS[0]
  const corpus = corpusDe(route.param).cle as CorpusCle

  // Le groupe Contexte s'ouvre quand on y entre (par lien, par URL, par le pied de page) et
  // reste repliable à la main ensuite. `defaultOpen` ne suffirait pas : il ne joue qu'au
  // premier rendu, pas quand on arrive dans la section depuis une autre.
  const [contexteOuvert, setContexteOuvert] = useState(section.v === "contexte")
  useEffect(() => {
    if (section.v === "contexte") setContexteOuvert(true)
  }, [section.v])

  const vue = (): ReactNode => {
    switch (section.v) {
      case "protos":
        return <VueProtos dedans={dedans} depot={version?.depot} />
      case "contexte":
        return <VueContexte cle={cle} corpus={corpus} />
      case "observabilite":
        return <VueObservabilite cle={cle} />
      case "sessions":
        return <VueSessions cle={cle} />
      case "qualite":
        return <VueQualite cle={cle} />
      case "acces":
        return <VueAcces cle={cle} />
      default:
        return null
    }
  }

  // L'écran de connexion prend la place de la section demandée : il occupe le champ de
  // vision là où il manque quelque chose, sans confisquer le reste de la console.
  const contenu = (): ReactNode => {
    if (!section.cleRequise || dedans) return vue()
    if (statut === "verification")
      return (
        <div className="flex items-center gap-2 py-8">
          <Spinner size="sm" />
          <Text c="secondary">Vérification de la clé…</Text>
        </div>
      )
    return <Connexion onValider={entrer} erreur={erreur} occupe={false} />
  }

  const lien = (section: string, param?: string) => ({
    linkComponent: "a" as const,
    linkOptions: { href: param ? `#/${section}/${param}` : `#/${section}` },
  })

  const comptes: Partial<Record<CorpusCle, number | undefined>> = {
    composants: resume?.composants,
    foundations: resume?.foundations,
    skills: resume?.skills,
    produit: resume?.produit,
    reports: resume?.reports,
  }

  return (
    <AppShell className="bg-transparent">
      <AppShell.Sidebar size="sm">
        <AppShell.SidebarHeader className="gap-3 px-4">
          <Logo42 className="h-6 w-auto shrink-0" />
          <span className={`${TYPO.nav} text-gray-dark-400 text-xs`}>Console</span>
        </AppShell.SidebarHeader>

        <AppShell.SidebarBody className="flex flex-col gap-1">
          {SECTIONS.map((s) =>
            s.v === "contexte" ? (
              // Les corpus sont des SOUS-ENTRÉES, avec leur compte : ce que les compteurs de
              // l'en-tête montraient sans permettre d'y aller, et que la rangée de boutons de
              // la vue répétait. Les comptes n'existent qu'avec la clé.
              <NavLink
                key={s.v}
                label={s.label}
                icon={s.icon}
                current={section.v === s.v}
                open={contexteOuvert}
                onOpenChange={setContexteOuvert}
                classNames={{ row: TYPO.nav }}
                {...lien(s.v)}
              >
                {CORPUS.map((c) => (
                  <NavLink
                    key={c.cle}
                    label={c.label}
                    current={section.v === "contexte" && corpus === c.cle}
                    suffix={dedans ? <Compte n={comptes[c.cle]} /> : undefined}
                    {...lien("contexte", c.cle)}
                  />
                ))}
              </NavLink>
            ) : (
              <NavLink
                key={s.v}
                label={s.label}
                icon={s.icon}
                current={section.v === s.v}
                suffix={s.v === "protos" ? <Compte n={nbProtos} /> : undefined}
                classNames={{ row: TYPO.nav }}
                {...lien(s.v)}
              />
            ),
          )}
        </AppShell.SidebarBody>

        <AppShell.SidebarFooter className="flex flex-col gap-2 border-white/10 border-t">
          {dedans ? (
            <NavLink
              label="Se déconnecter"
              icon={<LogOut size={16} />}
              linkComponent="button"
              linkOptions={{ type: "button", onClick: sortir }}
            />
          ) : (
            <NavLink
              label="Clé de lecture"
              icon={<KeyRound size={16} />}
              suffix={
                statut === "verification" ? <Spinner size="xs" /> : undefined
              }
              // Une section fermée : l'écran de connexion s'affiche à sa place.
              {...lien("contexte")}
            />
          )}
          {/* Le tampon du build, en pied : « quel commit est servi ? » ne doit pas demander
              un curl. C'est ce qui trahit un Redeploy Railway qui a rejoué un vieux snapshot. */}
          {version ? (
            <Text c="muted" size="xs" className="px-2.5">
              Déployé{" "}
              {version.depot && version.commit ? (
                <a
                  href={`${version.depot.url}/commit/${version.commit}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono underline-offset-2 hover:underline"
                >
                  {version.commit.slice(0, 7)}
                </a>
              ) : (
                <span className="font-mono">{version.commit?.slice(0, 7) ?? "—"}</span>
              )}
              {" · "}
              <span className="font-mono">{version.construit_le.slice(0, 10)}</span>
            </Text>
          ) : null}
        </AppShell.SidebarFooter>
      </AppShell.Sidebar>

      <AppShell.Main>
        <AmbientBackground />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
          <header className="flex items-start gap-3">
            {/* N'existe qu'en dessous du point de rupture : la sidebar y devient un tiroir. */}
            <AppShell.SidebarTrigger asChild>
              <ActionIcon variant="subtle" size="md" aria-label="Ouvrir la navigation">
                <MenuIcon size={18} />
              </ActionIcon>
            </AppShell.SidebarTrigger>
            <div className="flex flex-col gap-1">
              <Title order={1} size="2xl" className={TYPO.texte()}>
                {section.v === "contexte" ? corpusDe(corpus).label : section.label}
              </Title>
              <Text c="secondary">{section.sous}</Text>
            </div>
          </header>
          {contenu()}
        </div>
      </AppShell.Main>

      <Notifications />
    </AppShell>
  )
}
