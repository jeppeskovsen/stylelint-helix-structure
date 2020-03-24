
const Module = require('module')
const path = require('path')

const hashObject = require('./hash').hashObject;

import { ModuleCache } from "./ModuleCache"




var resolveNode = require('resolve')

function resolver(source, file, config) {
  console.log('Resolving:', source, 'from:', file)
  var resolvedPath

  if (resolveNode.isCore(source)) {
    console.log('resolved to core')
    return { found: true, path: null }
  }

  try {
    resolvedPath = resolveNode.sync(source, opts(file, config))
    console.log('Resolved to:', resolvedPath)
    return { found: true, path: resolvedPath }
  } catch (err) {
    console.log('resolve threw error:', err)
    return { found: false }
  }
}

function opts(file, config) {
  return Object.assign({
      // more closely matches Node (#333)
      // plus 'mjs' for native modules! (#939)
      extensions: ['.mjs', '.js', '.json'],
    },
    config,
    {
      // path.resolve will handle paths relative to CWD
      basedir: path.dirname(path.resolve(file)),
      packageFilter: packageFilter,

    })
}

function packageFilter(pkg) {
  if (pkg['jsnext:main']) {
    pkg['main'] = pkg['jsnext:main']
  }
  return pkg
}





const ERROR_NAME = 'StylelintScssHelixStructure'

const fileExistsCache = new ModuleCache()

// Polyfill Node's `Module.createRequireFromPath` if not present (added in Node v10.12.0)
// Use `Module.createRequire` if available (added in Node v12.2.0)
const createRequire = Module.createRequire || Module.createRequireFromPath || function (filename) {
  const mod = new Module(filename, null)
  mod.filename = filename
  mod.paths = Module._nodeModulePaths(path.dirname(filename))

  mod._compile(`module.exports = require;`, filename)

  return mod.exports
}

function tryRequire(target, sourceFile) {
  let resolved
  try {
    // Check if the target exists
    if (sourceFile != null) {
      try {
        resolved = createRequire(path.resolve(sourceFile)).resolve(target)
      } catch (e) {
        resolved = require.resolve(target)
      }
    } else {
      resolved = require.resolve(target)
    }
  } catch(e) {
    // If the target does not exist then just return undefined
    return undefined
  }

  // If the target exists then return the loaded module
  return require(resolved)
}



export function relative(modulePath, sourceFile, settings) {
  const resolve = fullResolve(modulePath, sourceFile, settings)
  return resolve.path
}

function fullResolve(modulePath, sourceFile, settings) {
  // check if this is a bonus core module
  const coreSet = new Set(settings['import/core-modules'])
  if (coreSet.has(modulePath)) return { found: true, path: null }

  const sourceDir = path.dirname(sourceFile)
      , cacheKey = sourceDir + hashObject(settings).digest('hex') + modulePath

  const cacheSettings = ModuleCache.getSettings(settings)

  const cachedPath = fileExistsCache.get(cacheKey, cacheSettings)
  if (cachedPath !== undefined) return { found: true, path: cachedPath }

  function cache(resolvedPath) {
    fileExistsCache.set(cacheKey, resolvedPath)
  }

  function withResolver(config = null) {
    return resolver(modulePath, sourceFile, config)
  }

  const resolved = withResolver()
  // else, counts
  cache(resolved.path)
  return resolved || { found: false }
}

const erroredContexts = new Set()


function resolve(p, atRule) {
  try {
    return relative( p
                   , atRule.source.input.file
                   , {} //context.settings
                   )
  } catch (err) {
    if (!erroredContexts.has(atRule.source.input.file)) {
      // The `err.stack` string starts with `err.name` followed by colon and `err.message`.
      // We're filtering out the default `err.name` because it adds little value to the message.
      let errMessage = err.message
      if (err.name !== ERROR_NAME && err.stack) {
        errMessage = err.stack.replace(/^Error: /, '')
      }
      // context.report({
      //   message: `Resolve error: ${errMessage}`,
      //   loc: { line: 1, column: 0 },
      // })
      // erroredContexts.add(context)
    }
  }
}
resolve.relative = relative
export default resolve
