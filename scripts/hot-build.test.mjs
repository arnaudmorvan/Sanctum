/**
 * The directory swap, and the overlayfs trap that broke it for a week.
 *
 * Eight failures across five reports (2026-09-08 → 2026-09-14): `EXDEV: cross-device link
 * not permitted` on two paths inside the SAME directory. The cause is the container, not
 * the paths — `dist/` is baked by the CI build, so a deployed flow's directory sits in the
 * image's lower overlayfs layer, and a lower-layer DIRECTORY cannot be renamed. Every flow
 * hit it on its first hot build after a deploy; a brand-new slug never did.
 */
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test } from "node:test"
import { __swapIn as swapIn } from "./hot-build.mjs"

const scratch = () => fs.mkdtempSync(path.join(os.tmpdir(), "swapin-"))
const seed = (dir, name, body) => {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, name), body)
  return dir
}
const read = (dir, name) => fs.readFileSync(path.join(dir, name), "utf8")

test("the happy path swaps the new build in and leaves nothing behind", () => {
  const root = scratch()
  const served = seed(path.join(root, "p", "lms"), "index.html", "old")
  const tmp = seed(path.join(root, ".build", "lms-1"), "index.html", "new")
  swapIn(served, tmp)
  assert.equal(read(served, "index.html"), "new")
  assert.deepEqual(
    fs.readdirSync(path.join(root, "p")),
    ["lms"],
    "no .old-* directory may survive the swap",
  )
  assert.ok(!fs.existsSync(tmp), "the temp build is consumed, not copied")
})

test("a first publication has nothing to rename away", () => {
  const root = scratch()
  const served = path.join(root, "p", "fresh")
  const tmp = seed(path.join(root, ".build", "fresh-1"), "index.html", "new")
  swapIn(served, tmp)
  assert.equal(read(served, "index.html"), "new")
})

test("EXDEV on the served directory falls back instead of failing the build", () => {
  const root = scratch()
  const served = seed(path.join(root, "p", "lms"), "index.html", "old")
  const tmp = seed(path.join(root, ".build", "lms-1"), "index.html", "new")

  const real = fs.renameSync
  const seen = []
  fs.renameSync = (from, to) => {
    seen.push(from)
    // Only the copy-up of the LOWER-layer directory is refused; moving the fresh
    // build into place is what the container has always allowed.
    if (from === served) {
      const e = new Error(`EXDEV: cross-device link not permitted, rename '${from}' -> '${to}'`)
      e.code = "EXDEV"
      throw e
    }
    return real(from, to)
  }
  try {
    swapIn(served, tmp)
  } finally {
    fs.renameSync = real
  }
  assert.equal(read(served, "index.html"), "new", "the new build is served")
  assert.deepEqual(seen, [served, tmp], "the rename is attempted before the fallback")
  assert.deepEqual(fs.readdirSync(path.join(root, "p")), ["lms"])
})

test("any other rename failure still surfaces — the fallback is EXDEV only", () => {
  const root = scratch()
  const served = seed(path.join(root, "p", "lms"), "index.html", "old")
  const tmp = seed(path.join(root, ".build", "lms-1"), "index.html", "new")

  const real = fs.renameSync
  fs.renameSync = () => {
    const e = new Error("EACCES: permission denied")
    e.code = "EACCES"
    throw e
  }
  try {
    assert.throws(() => swapIn(served, tmp), /EACCES/)
  } finally {
    fs.renameSync = real
  }
  assert.equal(read(served, "index.html"), "old", "a refused swap leaves the old build up")
})
