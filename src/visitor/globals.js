import Visitor from "../visitor.js"

import assign from "../util/assign.js"
import getShadowed from "../parse/get-shadowed.js"
import isIdentifer from "../parse/is-identifier.js"
import shared from "../shared.js"

function init() {
  const globalLookup = {
    __proto__: null,
    Reflect: true,
    console: true
  }

  const shadowedMap = new Map

  class GlobalsVisitor extends Visitor {
    reset(options) {
      this.changed = false
      this.globals = assign({ __proto__: null }, globalLookup)
      this.magicString = null
      this.possibleIndexes = null
      this.runtimeName = null

      if (options) {
        this.magicString = options.magicString
        this.possibleIndexes = options.possibleIndexes
        this.runtimeName = options.runtimeName
      }
    }

    visitIdentifier(path) {
      const node = path.getValue()
      const { name } = node

      if (! Reflect.has(this.globals, name)) {
        return
      }

      const parent = path.getParentNode()
      const { type } = parent

      if ((type === "UnaryExpression" &&
           parent.operator === "typeof") ||
          ! isIdentifer(node, parent) ||
          getShadowed(path, name, shadowedMap)) {
        return
      }

      this.changed = true

      let code = this.runtimeName + ".g."
      let pos = node.start

      if (type === "Property" &&
          parent.shorthand) {
        code = ":" + code + name
        pos = node.end
      }

      this.magicString.prependLeft(pos, code)
    }
  }

  return new GlobalsVisitor
}

export default shared.inited
  ? shared.module.visitorGlobals
  : shared.module.visitorGlobals = init()
