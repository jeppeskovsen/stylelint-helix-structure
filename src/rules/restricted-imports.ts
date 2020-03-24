import path from "path"
import stylelint, { utils } from "stylelint"
import { namespace } from "../utils/namespace"
import { getLayerAndModuleName } from "../utils/helix"
import resolve from "../utils/resolve"

const ruleToCheckAgainst = "restricted-imports"
export const ruleName = namespace(ruleToCheckAgainst)

export const messages = utils.ruleMessages(ruleName, {
  featureIntoFeature({ importPath }) {
    return `Unexpected path '${importPath}'. Cannot import Feature into another Feature.`
  },
  projectIntoFeature({ importPath }) {
    return `Unexpected path '${importPath}'. Cannot import Project into a Feature.`
  },
  featureIntoFoundation({ importPath }) {
    return `Unexpected path '${importPath}'. Cannot import Feature into Foundation.`
  },
  projectIntoFoundation({ importPath }) {
    return `Unexpected path '${importPath}'. Cannot import Project into Foundation.`
  },
  projectIntoProject({ importPath }) {
    return `Unexpected path '${importPath}'. Cannot import Project into another Project.`
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
          message: messages.featureIntoFeature({ importPath })
        })
      }

      if (currentLayerName === "feature" && importLayerName === "project") {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.projectIntoFeature({ importPath })
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "feature") {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.featureIntoFoundation({ importPath })
        })
      }

      if (currentLayerName === "foundation" && importLayerName === "project") {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.projectIntoFoundation({ importPath })
        })
      }

      if (currentLayerName === "project" && importLayerName === "project" && currentModuleName !== importModuleName) {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.projectIntoProject({ importPath })
        })
      }
    }

    root.walkAtRules(checkForImportStatement);
  }
}