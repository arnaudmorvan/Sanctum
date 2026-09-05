/**
 * Tague l'ORIGINE de chaque élément JSX d'un parcours, à la compilation.
 *
 * Pourquoi à la compilation et pas dans le navigateur : une fois rendu, un composant du
 * kit et une `div` écrite à la main sont deux `div`. Rien dans le DOM ne dit d'où elles
 * viennent — les primitives du kit (`Text`, `Title`, `Card`) rendent des éléments nus,
 * sans `data-scope` d'Ark. Seul le code source sait que `<Card>` vient d'un import
 * `@42/ui-react/card` et que `<div className="flex...">` ne vient de nulle part.
 *
 * Ce que le plugin pose, sur les fichiers de `src/proto/` UNIQUEMENT :
 *   data-42="kit:Card"        — l'élément JSX est un composant importé du kit
 *   data-42="kit:Card.Content"— idem, sous-composant
 *   data-42="dom:div"         — un élément HTML écrit à la main
 *
 * Ce qu'il ne tague PAS, exprès :
 *   • les composants LOCAUX du parcours (`<Section>`, `<Case>`) — l'attribut leur
 *     arriverait en prop et se perdrait ; ce sont leurs éléments internes qui comptent ;
 *   • le squelette (`src/layout/`, `src/app.tsx`) — le chrome est fourni à tous les
 *     parcours, il ne dit rien de la qualité d'intégration de CELUI-CI.
 *
 * ⚠️ Un composant du kit qui ne propagerait pas `...rest` sur son élément racine
 * avalerait l'attribut : il serait alors sous-compté. Le panneau le dit.
 */
export default function origine({ types: t }) {
  return {
    name: "42-origine",
    visitor: {
      Program(path, state) {
        const f = state.filename || ""
        state.actif = f.includes("/src/proto/") || f.includes("\\src\\proto\\")
        if (!state.actif) return
        // Les identifiants importés depuis @42/ui-react — c'est ça, « venir du kit ».
        state.kit = new Set()
        for (const node of path.node.body) {
          if (node.type !== "ImportDeclaration") continue
          if (!String(node.source.value).startsWith("@42/ui-react")) continue
          for (const s of node.specifiers) {
            if (s.local?.name) state.kit.add(s.local.name)
          }
        }
      },

      JSXOpeningElement(path, state) {
        if (!state.actif || !state.kit) return
        const nom = path.node.name
        let valeur = null

        if (nom.type === "JSXIdentifier") {
          if (/^[a-z]/.test(nom.name)) valeur = `dom:${nom.name}`
          else if (state.kit.has(nom.name)) valeur = `kit:${nom.name}`
        } else if (nom.type === "JSXMemberExpression") {
          let racine = nom.object
          while (racine.type === "JSXMemberExpression") racine = racine.object
          if (racine.type === "JSXIdentifier" && state.kit.has(racine.name)) {
            valeur = `kit:${racine.name}.${nom.property.name}`
          }
        }
        if (!valeur) return

        const dejaPose = path.node.attributes.some(
          (a) => a.type === "JSXAttribute" && a.name?.name === "data-42",
        )
        if (dejaPose) return

        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-42"), t.stringLiteral(valeur)),
        )
      },
    },
  }
}
