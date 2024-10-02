import path from "node:path"
import stylelint, { type Rule } from "stylelint"
import { getLayerAndModuleName } from "../utils/helix"
import { relativeToTilde, tildeToRelative, resolve } from "../utils/path-fixer"
import { namespace } from "utils/namespace"

export const ruleName = "restricted-tilde-imports"

type MessageData = {
  importPath?: string
  moduleName?: string
  importLayerName?: string
  currentLayerName?: string
}

const messagesObject = {
  useRelativeImports({ importPath, moduleName }: MessageData) {
    return `Unexpected path "${importPath}", use relative import paths within the same module (${moduleName}).`
  },
  useTildeImports({ importPath, importLayerName, currentLayerName}: MessageData) {
    return `Unexpected path "${importPath}", use tilde (~/${importLayerName}) import paths when it's from a different layer than ${currentLayerName}.`
  }
}

export const messages = stylelint.utils.ruleMessages<any, typeof messagesObject>(ruleName, messagesObject)

const meta = {
  url: "https://github.com/jeppeskovsen/stylelint-scss-helix-structure/blob/master/README.md"
}

type RuleOptions = {
  basePath?: string
  ignoreFix?: boolean
  alias?: Record<string, string>
}

const ruleFunction: Rule = (enabled: boolean, options: RuleOptions, context: any = null) => {
  let shouldFix = context.fix && (!options || options.ignoreFix !== true)

  return (root, result) => {
    if (!enabled) {
      return
    }
    
    options = options || {}

    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const alias = options.alias || { "~": "./" }
    const absoluteBasePath = path.resolve(basePath)

    root.walkAtRules((atRule: any) => {
      if (atRule.name !== "import") {
        return
      }

      const importPath = atRule.params.replace(/'|"/g, "")
      const absoluteCurrentFile = atRule.source.input.file
      if (!absoluteCurrentFile) return

      const absoluteCurrentPath = path.dirname(absoluteCurrentFile)
      const absoluteImportFile = resolve(absoluteBasePath, absoluteCurrentPath, alias, importPath).path

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) return

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportFile, absoluteBasePath)
      if (!importLayerName || !importModuleName) return

      function complain(message: string, fixValue: string): void {
        if (shouldFix) {
          shouldFix = resolve(absoluteBasePath, absoluteCurrentPath, alias, fixValue).found

          if (shouldFix) {
            atRule.params = `"${fixValue}"`
            return
          }
        }
  
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          message
        })
      }
      
      if (currentLayerName === importLayerName && currentModuleName === importModuleName) {
        
        if (importPath.startsWith("~/")) {
          complain(messages.useRelativeImports({ importPath, moduleName: currentModuleName }), tildeToRelative(absoluteBasePath, absoluteCurrentPath, importPath))
        }
        
        return
      }
      
      if (!importPath.startsWith("~/")) {
        complain(messages.useTildeImports({ importPath, importLayerName, currentLayerName }), relativeToTilde(absoluteBasePath, absoluteCurrentPath, importPath))
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages as any
ruleFunction.meta = meta

export default stylelint.createPlugin(namespace(ruleName), ruleFunction)