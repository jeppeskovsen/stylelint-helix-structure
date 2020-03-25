import path from "path"
import stylelint, { Plugin } from "stylelint"
import { namespace } from "../utils/namespace"
import { getLayerAndModuleName } from "../utils/helix"
import { relativeToTilde, tildeToRelative, getAbsolutePath } from "../utils/path-fixer"

const ruleToCheckAgainst = "restricted-tilde-imports"
export const ruleName = namespace(ruleToCheckAgainst)

export const messages = stylelint.utils.ruleMessages(ruleName, {
  useRelativeImports({ importPath, moduleName}) {
    return `Unexpected path "${importPath}", use relative import paths within the same module (${moduleName}).`
  },
  useTildeImports({ importPath, importLayerName, currentLayerName}) {
    return `Unexpected path "${importPath}", use tilde (~/${importLayerName}) import paths when it's from a different layer than ${currentLayerName}.`
  }
})

const plugin: Plugin = (enabled: any, options: any, context: any = null) => {
  if (!enabled) {
    return
  }

  const shouldFix = context.fix && (!options || options.disableFix !== true);

  return (root, result) => {
    options = options || {}

    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)

    function complain(node, message, fixValue: string): void {
      if (shouldFix) {
        node.params = `"${fixValue}"`
        return
      }

      stylelint.utils.report({
        ruleName,
        result,
        node,
        message
      })
    }

    function checkForImportStatement(atRule) {
      if (atRule.name !== "import") return

      const importPath = atRule.params.replace(/'|"/g, "")
      const absoluteCurrentFile = atRule.source.input.file
      if (!absoluteCurrentFile) return

      const absoluteCurrentPath = path.dirname(absoluteCurrentFile)
      const absoluteImportFile = getAbsolutePath(absoluteBasePath, absoluteCurrentPath, importPath)

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportFile, absoluteBasePath)
      if (!importLayerName || !importModuleName) return


      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {

        if (importPath.startsWith("~/")) {
          complain(atRule, messages.useRelativeImports({ importPath, moduleName: currentModuleName }), tildeToRelative(absoluteBasePath, absoluteCurrentPath, importPath))
        }

        return
      }

      if (!importPath.startsWith("~/")) {
        complain(atRule, messages.useTildeImports({ importPath, importLayerName, currentLayerName }), relativeToTilde(absoluteBasePath, absoluteCurrentPath, importPath))
      }
    }

    root.walkAtRules(checkForImportStatement);
  }
}

export default plugin