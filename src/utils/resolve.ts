import path from "path"
import { ModuleCache } from "./ModuleCache"
import resolveNode from "resolve"
import stylelint from "stylelint"
import debug from "debug"

const ERROR_NAME = 'StylelintScssHelixStructure'
const fileExistsCache = new ModuleCache()
const log = debug(`${ERROR_NAME}:resolve`)

function fileResolver(source, file, config = undefined) {
  log("Resolving:", source, "from:", file)
  
  if (resolveNode.isCore(source)) {
    log("Resolved to core")
    return { found: true, path: null }
  }

  try {
    const resolvedPath = resolveNode.sync(source, opts(file, config))
    log("Resolved to:", resolvedPath)
    return { found: true, path: resolvedPath }
  } catch (err) {
    console.log(ERROR_NAME, "Resolve threw error:", err)
    return { found: false }
  }
}

function opts(file, config) {
  return {
    // more closely matches Node (#333)
    // plus 'mjs' for native modules! (#939)
    extensions: [".scss", ".mjs", ".js", ".json"],
    ...config,
    // path.resolve will handle paths relative to CWD
    basedir: path.dirname(path.resolve(file)),
    packageFilter: function packageFilter(pkg) {
      if (pkg["jsnext:main"]) {
        pkg["main"] = pkg["jsnext:main"]
      }
      return pkg
    }
  }
}


export function relative(modulePath, sourceFile) {
  const resolve = fullResolve(modulePath, sourceFile)
  return resolve.path
}

function fullResolve(modulePath, sourceFile) {
  // check if this is a bonus core module
  const coreSet = new Set()
  if (coreSet.has(modulePath)) {
    return { found: true, path: null }
  }

  const sourceDir = path.dirname(sourceFile)
  const cacheKey = sourceDir + modulePath
  const cacheSettings = ModuleCache.getSettings()

  const cachedPath = fileExistsCache.get(cacheKey, cacheSettings)
  if (cachedPath) {
    return { found: true, path: cachedPath }
  }

  const resolved = fileResolver(modulePath, sourceFile)
  if (resolved) {
    fileExistsCache.set(cacheKey, resolved.path)
    return resolved
  }
  
  return { found: false }
}






const erroredContexts = new Set()

export default function resolve(ruleName, result, atRule, relativePath, fromFile) {

  const messages = stylelint.utils.ruleMessages(ruleName, {
    resolveError({ relativePath, fromFile }) {
      return `Unable to resolve path "${relativePath}" from file ${fromFile}.`
    }
  })

  try {
    
    return relative(relativePath, fromFile)

  } catch (err) {
    console.log(err);
    return;

    const message = {
      ruleName,
      result,
      node: atRule,
      message: messages.resolveError({ relativePath, fromFile })
    }

    if (!erroredContexts.has(message)) {
      // The `err.stack` string starts with `err.name` followed by colon and `err.message`.
      // We're filtering out the default `err.name` because it adds little value to the message.
      let errMessage = err.message
      if (err.name !== ERROR_NAME && err.stack) {
        errMessage = err.stack.replace(/^Error: /, '')
      }
      
      stylelint.utils.report(message)
      erroredContexts.add(message)
    }
  }
}