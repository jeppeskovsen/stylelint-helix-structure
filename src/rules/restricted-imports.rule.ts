import path from "node:path"
import stylelint, { type Rule } from "stylelint"
import { getLayerAndModuleName } from "../utils/helix.js"
import { resolve } from '../utils/path-fixer.js'
import { namespace } from "../utils/namespace.js"

const shortName = "restricted-imports"
export const ruleName = namespace(shortName)

type MessageData = {
  importPath?: string
  absolutePath?: string
}

const messagesObject = {
  featureIntoFeature({ importPath }: MessageData) {
    return `Unexpected path '${importPath}'. Cannot import Feature into another Feature.`
  },
  projectIntoFeature({ importPath }: MessageData) {
    return `Unexpected path '${importPath}'. Cannot import Project into a Feature.`
  },
  featureIntoFoundation({ importPath }: MessageData) {
    return `Unexpected path '${importPath}'. Cannot import Feature into Foundation.`
  },
  projectIntoFoundation({ importPath }: MessageData) {
    return `Unexpected path '${importPath}'. Cannot import Project into Foundation.`
  },
  projectIntoProject({ importPath }: MessageData) {
    return `Unexpected path '${importPath}'. Cannot import Project into another Project.`
  }
}

export const messages = stylelint.utils.ruleMessages<any, typeof messagesObject>(ruleName, messagesObject)

const meta = {
  url: "https://github.com/jeppeskovsen/stylelint-scss-helix-structure/blob/master/README.md"
}

type RuleOptions = {
  basePath?: string
  alias?: Record<string, string>
}

const ruleFunction: Rule = (enabled: boolean, options: RuleOptions, context) => {
  return (root, result) => {
    if (!enabled) {
      return
    }

    // const validOptions = validateOptions(result, ruleName, {
    //   actual: primary,
    //   possible: [true]
    // })

    // if (!validOptions) {
    //   return
    // }

    options = options || {}

    const basePath = options.basePath || path.join(process.cwd(), "./src")
    const absoluteBasePath = path.resolve(basePath)

    root.walkAtRules("import", atRule => {
      
      const complain = (message: string) => {
        stylelint.utils.report({
          ruleName,
          result,
          node: atRule,
          index: 0,
          endIndex: atRule.params.length,
          message
        })
      }

      const importPath = atRule.params.replace(/'|"/g, "")
      const absoluteCurrentFile = atRule.source?.input.file
      if (!absoluteCurrentFile) {
        return
      }
      
      const absoluteCurrentPath = path.dirname(absoluteCurrentFile)
      const { path: absoluteImportFile, found } = resolve(absoluteBasePath, absoluteCurrentPath, options.alias, importPath)
      if (!found) {
        return
      }

      const [currentLayerName, currentModuleName] = getLayerAndModuleName(absoluteCurrentFile, absoluteBasePath)
      if (!currentLayerName || !currentModuleName) {
        return
      }

      const [importLayerName, importModuleName] = getLayerAndModuleName(absoluteImportFile, absoluteBasePath)
      if (!importLayerName || !importModuleName) {
        return
      }

      if (currentLayerName === "feature" && importLayerName === "feature" && currentModuleName !== importModuleName) {
        complain(messages.featureIntoFeature({ importPath }))
      }

      if (currentLayerName === "feature" && importLayerName === "project") {
        complain(messages.projectIntoFeature({ importPath }))
      }

      if (currentLayerName === "foundation" && importLayerName === "feature") {
        complain(messages.featureIntoFoundation({ importPath }))
      }

      if (currentLayerName === "foundation" && importLayerName === "project") {
        complain(messages.projectIntoFoundation({ importPath }))
      }

      if (currentLayerName === "project" && importLayerName === "project" && currentModuleName !== importModuleName) {
        complain(messages.projectIntoProject({ importPath }))
      }
    })
  }
}

ruleFunction.ruleName = ruleName
ruleFunction.messages = messages as any
ruleFunction.meta = meta

export default stylelint.createPlugin(ruleName, ruleFunction)