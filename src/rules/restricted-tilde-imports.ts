import path from "path"
import stylelint, { utils } from "stylelint"
import { namespace } from "../utils/namespace"
import { getLayerAndModuleName } from "../utils/helix"
//import resolve from "../utils/resolve"

const ruleToCheckAgainst = "restricted-tilde-imports"
export const ruleName = namespace(ruleToCheckAgainst)

export const messages = utils.ruleMessages(ruleName, {
  useRelativeImports({ importPath, moduleName}) {
    return `Unexpected path "${importPath}", use relative import paths within the same module (${moduleName}).`
  },
  useTildeImports({ importPath, importLayerName, currentLayerName}) {
    return `Unexpected path "${importPath}", use tilde (~/${importLayerName}) import paths when it's from a different layer than ${currentLayerName}.`
  }
})

function resolve(importPath: string, basePath: string, currentFileFolder: string): string {
  if (importPath.startsWith("~/")) {
    return path.join(basePath, importPath.substring(2));
  }

  return path.join(currentFileFolder, importPath);
}

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

      // const absoluteImportFile = resolve(ruleName, result, atRule, importPath, absoluteCurrentFile)
      const absoluteImportFile = resolve(importPath, absoluteBasePath, path.dirname(absoluteCurrentFile))

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportFile, absoluteBasePath)
      if (!importLayerName || !importModuleName) return


      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {

        if (importPath.startsWith("~/")) {
          stylelint.utils.report({
            ruleName,
            result,
            node: atRule,
            message: messages.useRelativeImports({ importPath, moduleName: currentModuleName })
          })
        }

        return
      }

      if (!importPath.startsWith("~/")) {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message: messages.useTildeImports({ importPath, importLayerName, currentLayerName })
        })
      }
    }

    root.walkAtRules(checkForImportStatement);
  }
}