import path from "path"
import stylelint, { Plugin } from "stylelint"
import { namespace } from "../utils/namespace"
import { getLayerAndModuleName } from "../utils/helix"
import { resolve, getAbsolutePath } from "../utils/path-fixer"

const ruleToCheckAgainst = "restricted-imports"
export const ruleName = namespace(ruleToCheckAgainst)

export const messages = stylelint.utils.ruleMessages(ruleName, {
  noUnresolvedImports({ importPath }) {
    return `Could not resolve path '${importPath}'.`
  },
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

interface RuleOptions {
  basePath?: string
  alias?: {[key: string]: string}
}

const plugin: Plugin = (enabled: any, options: RuleOptions) => {
  if (!enabled) {
    return
  }

  return (root, result) => {
    options = options || {}

    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)

    function checkForImportStatement(atRule) {
      if (atRule.name !== "import") return

      const importPath = atRule.params.replace(/'|"/g, "")
      const absoluteCurrentFile = atRule.source.input.file
      if (!absoluteCurrentFile) return
      
      const absoluteCurrentPath = path.dirname(absoluteCurrentFile)
      const absoluteImportFile = resolve(absoluteBasePath, absoluteCurrentPath, options.alias, importPath)

      if (!absoluteImportFile) {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.noUnresolvedImports({ importPath })
        })
      }

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

    root.walkAtRules(checkForImportStatement)
  }
}

export default plugin