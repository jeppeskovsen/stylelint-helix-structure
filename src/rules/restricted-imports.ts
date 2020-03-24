import path from "path"
import stylelint, { utils } from "stylelint"
import { namespace } from "../utils/namespace"
import { getLayerAndModuleName } from "../utils/helix"
import resolve from "../utils/resolve"

const ruleToCheckAgainst = "restricted-imports"
export const ruleName = namespace(ruleToCheckAgainst)

export const messages = utils.ruleMessages(ruleName, {
  featureIntoFeature({ importPath, currentLayerName, importLayerName }) {
    return `Unexpected path '${importPath}'. Cannot import ${currentLayerName} into a another ${importLayerName}.`
  },
  projectIntoFeature({ importPath, importLayerName, currentLayerName }) {
    return `Unexpected path '${importPath}'. Cannot import ${importLayerName} into a ${currentLayerName}.`
  },
  featureOrProjectIntoFoundation({ importPath, importLayerName, currentLayerName}) {
    return `Unexpected path '${importPath}'. Cannot import ${importLayerName} into ${currentLayerName}.`
  }
})



export default function (enabled, options) {
  if (!enabled) {
    return
  }

  return (root, result) => {
    options = options || {}

    const basePath = options.basePath || process.cwd()
    const absoluteBasePath = path.resolve(basePath)

    function checkForImportStatement(atRule) {
      if (atRule.name !== "import") return

      const importPath = atRule.params.replace(/'|"/g, "")
      const absoluteCurrentFile = atRule.source.input.file
      if (!absoluteCurrentFile) return

      const absoluteImportFile = resolve(ruleName, result, atRule, importPath, absoluteCurrentFile)

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportFile, absoluteBasePath)
      if (!importLayerName || !importModuleName) return

      if (currentLayerName === "feature" && importLayerName === "feature" && currentModuleName !== importModuleName) {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.featureIntoFeature({ importPath, currentLayerName, importLayerName })
        })
      }

      if (currentLayerName === "feature" && importLayerName === "project") {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.projectIntoFeature({ importPath, currentLayerName, importLayerName })
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "feature" || importLayerName === "project") {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.featureOrProjectIntoFoundation({ importPath, currentLayerName, importLayerName })
        })
      }
    }

    root.walkAtRules(checkForImportStatement);
  }
}