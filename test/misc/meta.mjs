import assert from "assert"
import path from "path"
import ma1 from "../fixture/meta/a.mjs"
import ma2 from "../fixture/meta/a.mjs?a#a"
import mb1 from "../fixture/meta/b.mjs"
import mb2 from "../fixture/meta/b.mjs?b#b"

const isWin = process.platform === "win32"

const __filename = import.meta.url.slice(isWin ? 8 : 7)
const __dirname = path.dirname(__filename)

const fileProtocol = "file:" + (isWin ? "///" : "//")
const reBackSlash = /\\/g

const metaPath = path.resolve(__dirname, "../fixture/meta")
const maPath = path.resolve(metaPath, "a.mjs")
const mbPath = path.resolve(metaPath, "b.mjs")
const maURL = getURLFromFilePath(maPath)
const mbURL = getURLFromFilePath(mbPath)

function getURLFromFilePath(filePath) {
  return fileProtocol + filePath.replace(reBackSlash, "/")
}

export default () => {
  const defs = [ma1, ma2, mb1, mb2]
  defs.forEach((def) => assert.strictEqual(Object.getPrototypeOf(def), null))

  assert.deepEqual(ma1, { url: maURL })
  assert.deepEqual(ma2, { url: maURL + "?a#a" })

  assert.deepEqual(mb1, { url: mbURL })
  assert.deepEqual(mb2, { url: mbURL + "?b#b" })
}