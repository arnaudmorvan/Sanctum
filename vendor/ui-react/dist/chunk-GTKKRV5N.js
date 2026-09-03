import { createContext, useContext } from 'react';
import { jsx } from 'react/jsx-runtime';

// src/lib/link-component.tsx
var LinkComponentContext = createContext(void 0);
var LinkComponentProvider = ({ component, children }) => /* @__PURE__ */ jsx(LinkComponentContext.Provider, { value: component, children });
var useLinkComponent = (override) => {
  const provided = useContext(LinkComponentContext);
  return override ?? provided;
};

export { LinkComponentProvider, useLinkComponent };
