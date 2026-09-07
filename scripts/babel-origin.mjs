/**
 * Tags the ORIGIN of every JSX element of a flow, at compile time.
 *
 * Why at compile time and not in the browser: once rendered, a kit component and a
 * hand-written `div` are two `div`s. Nothing in the DOM says where they come from — the
 * kit's primitives (`Text`, `Title`, `Card`) render bare elements, without Ark's
 * `data-scope`. Only the source code knows that `<Card>` comes from an
 * `@42/ui-react/card` import and that `<div className="flex...">` comes from nowhere.
 *
 * What the plugin stamps, on the files of `src/proto/` ONLY:
 *   data-42="kit:Card"        — the JSX element is a component imported from the kit
 *   data-42="kit:Card.Content"— same, sub-component
 *   data-42="dom:div"         — an HTML element written by hand
 *
 * What it deliberately does NOT tag:
 *   • the flow's LOCAL components (`<Section>`, `<Cell>`) — the attribute would reach them
 *     as a prop and be lost; it is their inner elements that count;
 *   • the skeleton (`src/layout/`, `src/app.tsx`) — the chrome is provided to every flow,
 *     it says nothing about how well THIS one is integrated.
 *
 * ⚠️ A kit component that did not forward `...rest` onto its root element would swallow the
 * attribute: it would then be undercounted. The panel says so.
 */
export default function origin({ types: t }) {
  return {
    name: "42-origin",
    visitor: {
      Program(path, state) {
        const f = state.filename || ""
        state.active = f.includes("/src/proto/") || f.includes("\\src\\proto\\")
        if (!state.active) return
        // The identifiers imported from @42/ui-react — that is what "coming from the kit"
        // means.
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
        if (!state.active || !state.kit) return
        const name = path.node.name
        let value = null

        if (name.type === "JSXIdentifier") {
          if (/^[a-z]/.test(name.name)) value = `dom:${name.name}`
          else if (state.kit.has(name.name)) value = `kit:${name.name}`
        } else if (name.type === "JSXMemberExpression") {
          let root = name.object
          while (root.type === "JSXMemberExpression") root = root.object
          if (root.type === "JSXIdentifier" && state.kit.has(root.name)) {
            value = `kit:${root.name}.${name.property.name}`
          }
        }
        if (!value) return

        const alreadySet = path.node.attributes.some(
          (a) => a.type === "JSXAttribute" && a.name?.name === "data-42",
        )
        if (alreadySet) return

        path.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-42"), t.stringLiteral(value)),
        )
      },
    },
  }
}
