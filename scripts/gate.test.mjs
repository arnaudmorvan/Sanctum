/** `node --test scripts/` — the gate in front of the flows, driven with no network. */
import assert from "node:assert/strict"
import { test } from "node:test"
import { isProtected, makeGate, signInUrl, tokenOf, wantsHtml } from "./gate.mjs"

const req = ({ cookie = "", accept = "", url = "/p/demo/" } = {}) => ({
  headers: { cookie, accept },
  url,
})

const res = () => {
  const r = { code: 0, headers: {}, body: "" }
  r.writeHead = (code, headers) => {
    r.code = code
    r.headers = headers
  }
  r.end = (body) => {
    r.body = body ?? ""
  }
  return r
}

test("what is protected: the gallery list, the flows, the past versions — nothing else", () => {
  for (const p of ["/protos.json", "/p/demo/", "/p/demo/assets/index-abc.js", "/v/demo/abc1234/"])
    assert.equal(isProtected(p), true, p)
  for (const p of ["/", "/index.html", "/assets/console-abc.js", "/compare/", "/version.json",
                   "/protos.json.bak", "/protos/", "/pp/x", "/build/demo", "/preview/demo/abc1234"])
    assert.equal(isProtected(p), false, p)
})

test("the token is read from its own cookie, among the others", () => {
  assert.equal(tokenOf(req({ cookie: "a=1; ds_token=42ds_lea_abc; b=2" })), "42ds_lea_abc")
  assert.equal(tokenOf(req({ cookie: "ds_token=42ds%5Flea%5Fabc" })), "42ds_lea_abc")
  assert.equal(tokenOf(req({ cookie: "ds_tokenx=nope" })), "")
  assert.equal(tokenOf(req({ cookie: "" })), "")
  assert.equal(tokenOf({ headers: {} }), "")
})

test("a navigation is sent to the sign-in with its path; a fetch gets a 401", async () => {
  const gate = makeGate({ verify: async () => false })
  const nav = res()
  assert.equal(await gate(req({ accept: "text/html,*/*", url: "/p/demo/?bare#/list" }), nav, "/p/demo/"), true)
  assert.equal(nav.code, 302)
  assert.equal(nav.headers.location, "/?next=%2Fp%2Fdemo%2F%3Fbare%23%2Flist")
  assert.equal(nav.headers["cache-control"], "no-store")

  const api = res()
  assert.equal(await gate(req({ accept: "application/json", url: "/protos.json" }), api, "/protos.json"), true)
  assert.equal(api.code, 401)
  assert.match(api.body, /sign in/)

  assert.equal(wantsHtml(req({ accept: "text/html" })), true)
  assert.equal(wantsHtml(req({ accept: "*/*" })), false)
  assert.equal(signInUrl({ url: "/v/demo/abc1234/" }), "/?next=%2Fv%2Fdemo%2Fabc1234%2F")
})

test("a token the MCP server accepts passes, and is not re-asked on every asset", async () => {
  let asked = 0
  let clock = 1_000_000
  const gate = makeGate({
    verify: async (t) => {
      asked += 1
      return t === "42ds_lea_ok"
    },
    now: () => clock,
  })
  const good = req({ cookie: "ds_token=42ds_lea_ok", accept: "text/html" })
  assert.equal(await gate(good, res(), "/p/demo/"), false, "passes to the static server")
  assert.equal(await gate(good, res(), "/p/demo/assets/index-abc.js"), false)
  assert.equal(await gate(good, res(), "/protos.json"), false)
  assert.equal(asked, 1, "one round trip for the page and its assets")

  clock += 61_000
  assert.equal(await gate(good, res(), "/p/demo/"), false)
  assert.equal(asked, 2, "re-checked after a minute: a revocation bites then")

  const bad = req({ cookie: "ds_token=42ds_gone_x", accept: "text/html" })
  const r1 = res()
  assert.equal(await gate(bad, r1, "/p/demo/"), true)
  assert.equal(r1.code, 302)
  await gate(bad, res(), "/p/demo/assets/x.js")
  assert.equal(asked, 3, "a refusal is cached too, briefly")

  assert.equal(await gate(req({ accept: "text/html" }), res(), "/"), false, "the console is open")
})

test("an unreachable MCP server is a 503, never a pass", async () => {
  const gate = makeGate({ verify: async () => { throw new Error("ECONNREFUSED") } })
  const r = res()
  assert.equal(await gate(req({ cookie: "ds_token=42ds_lea_ok", accept: "text/html" }), r, "/p/demo/"), true)
  assert.equal(r.code, 503)
  assert.match(r.body, /cannot verify/)
})
